import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { X, Save } from 'lucide-react';
import { CommitteeDto, Coordination, Student, Teacher, Administrative } from '../types';

interface CreateCommitteeFormProps {
  committee: Partial<CommitteeDto & { coordinatorId?: string }>;
  coordinations: Coordination[];
  students: Student[];
  teachers: Teacher[];
  administratives: Administrative[];
  lockDateHour: boolean;
  pendingCoordinationName: string | null;
  onCommitteeChange: (updates: Partial<CommitteeDto & { coordinatorId?: string }>) => void;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export const CreateCommitteeForm: React.FC<CreateCommitteeFormProps> = ({
  committee,
  coordinations,
  students,
  teachers,
  administratives,
  lockDateHour,
  pendingCoordinationName,
  onCommitteeChange,
  onSubmit,
  onClose,
  isSubmitting = false,
}) => {
  // When the form is locked (opened from calendar) we render plain text for date/time
  // and avoid keeping any focusable or input elements in the DOM to prevent native pickers.
  const handleStudentToggle = (studentId: string) => {
    const currentStudents = committee.studentsIds || [];
    const newStudents = currentStudents.includes(studentId)
      ? currentStudents.filter(id => id !== studentId)
      : [...currentStudents, studentId];
    onCommitteeChange({ studentsIds: newStudents });
  };

  const handleTeacherToggle = (teacherId: string) => {
    const currentTeachers = committee.teachersIds || [];
    const newTeachers = currentTeachers.includes(teacherId)
      ? currentTeachers.filter(id => id !== teacherId)
      : [...currentTeachers, teacherId];
    onCommitteeChange({ teachersIds: newTeachers });
  };

  const handleAdministrativeToggle = (adminId: string) => {
    const currentAdmins = committee.administrativesIds || [];
    const newAdmins = currentAdmins.includes(adminId)
      ? currentAdmins.filter(id => id !== adminId)
      : [...currentAdmins, adminId];
    onCommitteeChange({ administrativesIds: newAdmins });
  };

  // Modal-level capture handler: prevents pointer/focus events from reaching native inputs
  const onModalCapture = (e: React.SyntheticEvent) => {
    if (!lockDateHour) return;
    const native = (e.nativeEvent as unknown) as Event;
    const tgt = native.target as HTMLElement | null;
    if (!tgt) return;
    // if an input (date/time) or any element with a data-date-target attribute is targeted, block it
    const tag = tgt.tagName;
    const type = (tgt as HTMLInputElement).type || '';
    if (tag === 'INPUT' && (type === 'date' || type === 'time')) {
      native.stopPropagation();
      native.preventDefault();
      try { (tgt as HTMLElement).blur && (tgt as HTMLElement).blur(); } catch { }
    }
    if (tgt.closest && tgt.closest('[data-date-target]')) {
      native.stopPropagation();
      native.preventDefault();
      try { (tgt as HTMLElement).blur && (tgt as HTMLElement).blur(); } catch { }
    }
  };

  const shouldLockDate = !!lockDateHour || !!(committee as any).date;
  const shouldLockHour = !!lockDateHour || !!(committee as any).hour;

  // As a last-resort defensive measure (works reliably on Chrome): temporarily disable all native
  // date/time inputs in the document while the modal is locked. We remember previous disabled
  // values to restore them on cleanup.
  React.useEffect(() => {
    if (!lockDateHour) return;
    const inputs = Array.from(document.querySelectorAll('input[type="date"], input[type="time"]')) as HTMLInputElement[];
    const prev: { el: HTMLInputElement; wasDisabled: boolean }[] = inputs.map(i => ({ el: i, wasDisabled: i.disabled }));
    inputs.forEach(i => { i.disabled = true; i.setAttribute('data-disabled-by-modal', 'true'); });
    return () => {
      prev.forEach(({ el, wasDisabled }) => {
        try {
          el.disabled = wasDisabled;
          el.removeAttribute('data-disabled-by-modal');
        } catch { }
      });
    };
  }, [lockDateHour]);

  // Extra global capture: intercept almost any pointer/touch/mouse/click before the browser opens
  // a native picker. Uses composedPath and stopImmediatePropagation for stronger effect on Chrome.
  React.useEffect(() => {
    if (!lockDateHour) return;
    const handler = (ev: Event) => {
      try {
        const path = (ev as any).composedPath ? (ev as any).composedPath() : (ev as any).path || [];
        for (const node of path) {
          if (!node || !(node instanceof Element)) continue;
          if (node.matches && (node.matches('input[type="date"]') || node.matches('input[type="time"]') || node.hasAttribute('data-date-target'))) {
            ev.stopImmediatePropagation?.();
            ev.stopPropagation?.();
            ev.preventDefault?.();
            try { (node as HTMLElement).blur?.(); } catch { }
            break;
          }
        }
      } catch (e) { }
    };

    document.addEventListener('pointerdown', handler, true);
    document.addEventListener('touchstart', handler, true);
    document.addEventListener('mousedown', handler, true);
    document.addEventListener('click', handler, true);

    return () => {
      document.removeEventListener('pointerdown', handler, true);
      document.removeEventListener('touchstart', handler, true);
      document.removeEventListener('mousedown', handler, true);
      document.removeEventListener('click', handler, true);
    };
  }, [lockDateHour]);

  return (
    <div onPointerDownCapture={onModalCapture} onFocusCapture={onModalCapture} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Crear Nuevo Comité</h2>
            <Button variant="ghost" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </CardHeader>

        {/* when locked we intentionally show non-interactive date/time below */}

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-6"
          >
            {/* Coordinación */}
            <div>
              <label className="block text-sm font-medium mb-2">Coordinación *</label>
              <select
                value={(committee as any).coordinationId || ''}
                onChange={(e) => onCommitteeChange({ coordinationId: e.target.value } as any)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 dark:focus:ring-blue-400 focus:border-primary dark:focus:border-blue-500"
                required
              >
                <option value="">Seleccionar coordinación</option>
                {coordinations.map((coord) => (
                  <option key={coord.id} value={coord.id}>
                    {coord.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FECHA */}
              <div
                className="relative"
                onFocusCapture={(e) => { if (lockDateHour) { const active = document.activeElement as HTMLElement | null; if (active) { active.blur(); } e.stopPropagation(); e.preventDefault(); } }}
              >
                <div className="block text-sm font-medium mb-2">Fecha {lockDateHour && '(desde calendario)'}</div>
                <div>
                  {shouldLockDate ? (
                    /* Plain, inert text-only element. No roles/aria/tabindex to avoid any browser control behavior. */
                    <div data-date-target="true" className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 select-none cursor-not-allowed">
                      {(committee as any).date || '—'}
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={(committee as any).date || ''}
                      onChange={(e) => onCommitteeChange({ date: e.target.value } as any)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 dark:focus:ring-blue-400 focus:border-primary dark:focus:border-blue-500"
                    />
                  )}
                </div>
                {shouldLockDate && (
                  <div
                    className="absolute inset-0 z-50"
                    onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  />
                )}
              </div>

              {/* HORA */}
              <div
                className="relative"
                onFocusCapture={(e) => { if (lockDateHour) { const active = document.activeElement as HTMLElement | null; if (active) { active.blur(); } e.stopPropagation(); e.preventDefault(); } }}
              >
                <div className="block text-sm font-medium mb-2">Hora {lockDateHour && '(desde calendario)'}</div>
                <div>
                  {shouldLockHour ? (
                    /* Plain, inert text-only element. */
                    <div data-date-target="true" className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 select-none cursor-not-allowed">
                      {(committee as any).hour || '—'}
                    </div>
                  ) : (
                    <input
                      type="time"
                      value={(committee as any).hour || ''}
                      onChange={(e) => onCommitteeChange({ hour: e.target.value } as any)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 dark:focus:ring-blue-400 focus:border-primary dark:focus:border-blue-500"
                    />
                  )}
                </div>
                {shouldLockHour && (
                  <div
                    className="absolute inset-0 z-50"
                    onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  />
                )}
              </div>
            </div>

            {/* Estado */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(committee as any).isActive || false}
                  onChange={(e) => onCommitteeChange({ isActive: e.target.checked } as any)}
                  className="rounded"
                />
                <span className="text-sm">Activo</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={(committee as any).isCurrent || false}
                  onChange={(e) => onCommitteeChange({ isCurrent: e.target.checked } as any)}
                  className="rounded"
                />
                <span className="text-sm">Actual</span>
              </label>
            </div>

            {/* Estudiantes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Aprendices ({((committee as any).studentsIds || []).length} seleccionados)
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                {students.length === 0 ? (
                  <div className="text-gray-500 text-sm">No hay aprendices disponibles</div>
                ) : (
                  <div className="space-y-1">
                    {students.map((student) => (
                      <label key={student.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={((committee as any).studentsIds || []).includes(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {student.name}
                          {student.hasNovelties && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                              Con novedades
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Docentes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructores ({((committee as any).teachersIds || []).length} seleccionados)
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                {teachers.length === 0 ? (
                  <div className="text-gray-500 text-sm">No hay instructores disponibles</div>
                ) : (
                  <div className="space-y-1">
                    {teachers.map((teacher) => (
                      <label key={teacher.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={((committee as any).teachersIds || []).includes(teacher.id)}
                          onChange={() => handleTeacherToggle(teacher.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{teacher.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Administrativos */}
            {administratives.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Administrativos ({((committee as any).administrativesIds || []).length} seleccionados)
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                  <div className="space-y-1">
                    {administratives.map((admin) => (
                      <label key={admin.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={((committee as any).administrativesIds || []).includes(admin.id)}
                          onChange={() => handleAdministrativeToggle(admin.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{admin.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button
                type="submit"
                disabled={isSubmitting || !((committee as any).coordinationId)}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                {isSubmitting ? 'Creando...' : 'Crear Comité'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
