"use client"

import React from 'react';
import { useMutation } from '@apollo/client';
import {
  RESPOND_NOVELTIES_FROM_COMMITTEE,
  FINALIZE_COMMITTEE_EVENT,
} from '@/graphqlServices/queries';

/**
 * CommitteeResponses
 * - Standalone component that implements the per-apprentice approve/reject/observation UI
 * - Self-contained: uses its own mutations and internal state shape compatible with the project's hook
 * - Not imported or wired anywhere by default. To use: import and render inside the committee modal and pass `students`, `novelties`, and `onClose` props.
 *
 * Props:
 * - committeeId: string
 * - eventId?: string
 * - students: Array<any>
 * - novelties: Array<any>
 * - onSent?: () => void
 */

type Props = {
  committeeId: string;
  eventId?: string;
  students: any[];
  novelties: any[];
  onSent?: () => void;
  onExpose?: (helpers: { getDecisions: () => Record<string, StudentDecision>; sendResponses: () => Promise<any>; clearDecisions: () => void; }) => void;
};

type StudentDecision = { approved: boolean | null; observation?: string; showObs?: boolean };

export default function CommitteeResponses({ committeeId, eventId, students, novelties, onSent, onExpose }: Props) {
  const [respondNoveltiesMutation] = useMutation(RESPOND_NOVELTIES_FROM_COMMITTEE);
  const [finalizeMutation] = useMutation(FINALIZE_COMMITTEE_EVENT);

  const [decisions, setDecisions] = React.useState<Record<string, StudentDecision>>({});

  React.useEffect(() => {
  // no-op
  }, [novelties, students]);

  // build a lookup map from studentId/personId -> array of novelty type names
  const noveltyMap = React.useMemo(() => {
    const m: Record<string, string[]> = {};
    try {
      (novelties || []).forEach((n: any) => {
        const sid = String(n.student?.id || n.student?.person?.id || '');
        const label = n?.noveltyType?.nameNovelty || '';
        if (!sid) return;
        if (!label) return;
        if (!m[sid]) m[sid] = [label];
        else if (!m[sid].includes(label)) m[sid].push(label);
      });
    } catch (e) {}
    return m;
  }, [novelties]);

  // Build a richer index for novelties to locate noveltyId and current status
  const noveltyIndex = React.useMemo(() => {
    const byId: Record<string, any> = {};
    const byPersonId: Record<string, any> = {};
    const byName: Record<string, any[]> = {};
    try {
      (novelties || []).forEach((n: any) => {
        if (!n) return;
        const nid = n.id ? String(n.id) : undefined;
        const sId = n.student?.id ? String(n.student.id) : undefined;
        const pId = n.student?.person?.id ? String(n.student.person.id) : undefined;
        const pName = (n.student?.person?.name || '').toString().trim().toLowerCase();
        if (nid) byId[nid] = n;
        if (sId) byId[sId] = n;
        if (sId) byPersonId[sId] = n;
        if (pId) byPersonId[pId] = n;
        if (pName) {
          if (!byName[pName]) byName[pName] = [n];
          else byName[pName].push(n);
        }
      });
    } catch (e) {}
    return { byId, byPersonId, byName };
  }, [novelties]);

  const toggleApprove = (sid: string, value: boolean) => setDecisions(prev => ({ ...prev, [sid]: { ...(prev[sid] || { approved: null, observation: '', showObs: false }), approved: value } }));
  const toggleShowObs = (sid: string) => setDecisions(prev => ({ ...prev, [sid]: { ...(prev[sid] || { approved: null, observation: '', showObs: false }), showObs: !((prev[sid] || {}).showObs) } }));
  const setObservation = (sid: string, text: string) => setDecisions(prev => ({ ...prev, [sid]: { ...(prev[sid] || { approved: null, observation: '', showObs: false }), observation: text } }));

  const sendResponses = async () => {
    const entries = Object.entries(decisions);

    const payload = entries
      .filter(([, d]: any) => d.approved !== null || (d.observation || '').trim().length > 0)
      .map(([sid, d]: any) => {
        // locate novelty using multiple strategies: student id, person id, name
        let noveltyId: number | undefined = undefined;
        let found: any = undefined;
        try {
          // try to locate the student object from provided students list to access name/person
          const studentObj = (students || []).find((st: any) => String(st.id || st.student?.id || st.person?.id || '') === String(sid));
          const sPersonId = String(sid || '');
          // try direct lookups
          found = noveltyIndex.byPersonId[sPersonId] || noveltyIndex.byId[sPersonId];
          // try by student/person name
          if (!found) {
            const sName = String((studentObj?.person?.name || studentObj?.name || '')).trim().toLowerCase();
            if (sName && noveltyIndex.byName[sName] && noveltyIndex.byName[sName].length > 0) found = noveltyIndex.byName[sName][0];
          }
          if (found && found.id) noveltyId = Number(found.id);
        } catch (e) {}

        // Map decision boolean to server 'name' string; if absent, fall back to the novelty's current status name or 'En Comité'
        let name = d.approved === true ? 'Aprobada' : (d.approved === false ? 'Denegada' : undefined);
        if (!name) {
          name = found?.noveltyStatus?.name || 'En Comité';
        }

        const item: any = {
          studentId: Number(sid),
          ...(noveltyId ? { noveltyId } : {}),
          name,
        };
        const obs = (d.observation || '').trim();
        if (obs) item.observation = obs;

        if (!noveltyId) {
          // debug aid: warn when we couldn't resolve noveltyId for a student
          // The console will show this in the browser devtools when the modal is used.
          // eslint-disable-next-line no-console
          const studentObj = (students || []).find((st: any) => String(st.id || st.student?.id || st.person?.id || '') === String(sid));
          console.warn('[CommitteeResponses] no noveltyId found for student', sid, 'name:', studentObj?.person?.name || studentObj?.name);
        }

        return item;
      });

    if (payload.length === 0) return { ok: false, message: 'Sin decisiones' };

    // validate committeeId to avoid Number('') -> 0 being sent
    const parsedCommitteeId = Number(committeeId);
    if (!committeeId || Number.isNaN(parsedCommitteeId) || parsedCommitteeId === 0) {
      return { ok: false, message: 'No se encontró el ID del comité (committeeId inválido)' };
    }

    try {
      const { data } = await respondNoveltiesMutation({ variables: { committeeId: parsedCommitteeId, responses: payload } });
      const resp = data?.respondNoveltiesFromCommittee;
      const ok = !!resp && (String(resp.code) === '200' || resp.id != null);

      if (ok) {
        const hasObservations = payload.some((p: any) => p.observation && p.observation.length > 0);
        if (hasObservations && eventId) {
          try { await finalizeMutation({ variables: { id: String(eventId) } }); } catch {}
        }
        setDecisions({});
        if (onSent) onSent();
        return { ok: true };
      }
      return { ok: false, message: resp?.message || 'Error al enviar respuestas' };
    } catch (e: any) {
      return { ok: false, message: e?.message || 'Error al enviar respuestas' };
    }
  };
  const getDecisions = () => decisions;
  const clearDecisions = () => setDecisions({});

  React.useEffect(() => {
    // expose helper functions to parent; re-run when decisions change so parent gets up-to-date sendResponses
    if (typeof (onExpose) === 'function') {
      onExpose({ getDecisions, sendResponses, clearDecisions });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisions]);

  return (
    <div className="space-y-3">
      {students.map((s: any) => {
        const sid = String(s.id || s.student?.id || s.person?.id || '');
        const decision = decisions[sid] || { approved: null, observation: '', showObs: false };
  // try direct lookup by student id or person id
        const sPersonId = String(s.person?.id || '');
        let labels = noveltyMap[sid] || noveltyMap[sPersonId] || [];
        // fallback: try to find a matching novelty by student/person id or by name (case-insensitive)
        if (labels.length === 0) {
          const found = (novelties || []).find((n: any) => {
            try {
              const nSid = String(n.student?.id || '');
              const nPersonSid = String(n.student?.person?.id || '');
              const nPersonName = String((n.student?.person?.name || '')).toLowerCase();
              const sName = String((s.person?.name || s.name || '')).toLowerCase();
              return nSid === sid || nPersonSid === sid || nPersonSid === sPersonId || nSid === sPersonId || (nPersonName && sName && nPersonName === sName);
            } catch (e) { return false; }
          });
          if (found && found?.noveltyType?.nameNovelty) labels = [found.noveltyType.nameNovelty];
        }
        const noveltyLabel = labels.length > 0 ? labels.join(', ') : 'Sin tipo';
  return (
          <div key={sid} className="border rounded p-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {s.person?.name ? `${s.person.name} ${s.person.lastname || ''}` : s.name}
                  {noveltyLabel && noveltyLabel !== 'Sin tipo' ? ` (${noveltyLabel})` : ''}
                </div>
                <div className="text-xs text-muted-foreground" />
                {/* debug removed */}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-2 py-1 rounded ${decision.approved === true ? 'bg-[#398f0d] dark:bg-blue-600 text-white' : 'border'}`}
                  onClick={() => toggleApprove(sid, true)}
                >✓</button>
                <button
                  className={`px-2 py-1 rounded ${decision.approved === false ? 'bg-red-600 dark:bg-blue-600 text-white' : 'border'}`}
                  onClick={() => toggleApprove(sid, false)}
                >✕</button>
                <button
                  className={`px-2 py-1 rounded ${decision.showObs ? 'bg-[#398f0d] dark:bg-blue-600 text-white' : 'border'}`}
                  onClick={() => toggleShowObs(sid)}
                >✎</button>
              </div>
            </div>
            {decision.showObs && (
              <div className="mt-2">
                <textarea className="w-full border rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white" rows={2} value={decision.observation || ''} onChange={(e) => setObservation(sid, e.target.value)} />
              </div>
            )}
          </div>
        );
      })}

  {/* Buttons are intentionally removed; modal will expose global actions */}
    </div>
  );
}
