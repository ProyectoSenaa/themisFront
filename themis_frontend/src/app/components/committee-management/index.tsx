"use client"

import React, { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';

// Hooks
import { useCommitteeManagement } from './hooks/useCommitteeManagement';

// Components
import { Navigation } from './components/Navigation';
import { ToastAlert } from './components/ToastAlert';
import { Dashboard } from './components/Dashboard';
import { Calendar } from './components/Calendar';
import { CommitteeList } from './components/CommitteeList';
import { CreateCommitteeForm } from './components/CreateCommitteeForm';

// Types
import {
  CalendarEvent,
  CommitteeDto,
  CommitteeStats,
  Coordination,
  Student,
  Teacher,
  Administrative
} from './types';

// Utils
import {
  parseExcelFile,
  downloadTemplate,
  normalizeString,
  normalizeBase64
} from './utils';

// GraphQL (You'll need to import these from your actual GraphQL files)
import {
  ALL_COORDINATION,
  ALL_NOVELTIES,
  ALL_COMMITTEE_EVENTS,
  ALL_COMMITTEES,
  ADD_COMMITTEE_EVENT,
  ADD_COMMITTEE_EVENTS_BULK,
  ASSIGN_COMMITTEE_TO_EVENTS,
  UPDATE_COMMITTEE_EVENT,
  UPLOAD_FINAL_MINUTE,
  FINALIZE_COMMITTEE_EVENT,
  GENERATE_MINUTE_DOCX,
  GENERATE_MINUTE_DOCX_URL,
  MINUTE_FILE_BASE64,
} from '@/graphqlServices/queries';

import CommitteeResponses from './CommitteeResponses';

export default function CommitteeManagement() {
  const {
    // State
    currentView,
    showCreateForm,
    newCommittee,
    calendarEvents,
    currentDate,
    selectedDateEvents,
    selectedEventIds,
    alert,
    mensaje,
    mensajeTipo,
    isProcessing,
    uploadStatus,
    errorMessages,
    isDragging,
    downloadingId,
    cameFromCalendar,
    lockDateHour,
    pendingCoordinationName,
    selectedCommittee,
    studentDecisions,
    searchQuery,
    currentPage,
    itemsPerPage,

    // Setters
    setCurrentView,
    setShowCreateForm,
    setCalendarEvents,
    setSelectedDateEvents,
    setSelectedEventIds,
    setMensaje,
    setMensajeTipo,
    setIsProcessing,
    setUploadStatus,
    setErrorMessages,
    setIsDragging,
    setDownloadingId,
    setPendingCoordinationName,
    setSelectedCommittee,
    setStudentDecisions,
    setSearchQuery,
    setCurrentPage,

    // Handlers
    navigateMonth,
    handleOpenEmptyForm,
    closeCommitteeModal,
    showAlert,
    clearAlert,
    updateCommittee,
  } = useCommitteeManagement();

  const responsesHelpersRef = React.useRef<any>(null);

  // GraphQL Queries (You'll need to uncomment and import the actual queries)
  const { data: coordinationData } = useQuery(ALL_COORDINATION, {
    variables: { page: 0, size: 100, state: true },
  });
  const { data: noveltiesData } = useQuery(ALL_NOVELTIES, {
    variables: { page: 0, size: 100 },
  });
  const { data: committeeEventsData, refetch: refetchCommitteeEvents } = useQuery(ALL_COMMITTEE_EVENTS, {
    variables: { page: 0, size: 100 },
  });
  const { data: committeesData, refetch: refetchCommittees } = useQuery(ALL_COMMITTEES, {
    variables: { page: 0, size: 200 },
  });

  // Temporary mock data - replace with actual GraphQL data
  // Remove these lines when using actual GraphQL queries above

  // GraphQL Mutations (You'll need to uncomment and import the actual mutations)
  // const [addCommitteeMutation] = useMutation(ADD_COMMITTEE);
  // const [addCommitteeEventMutation] = useMutation(ADD_COMMITTEE_EVENT);
  const [addCommitteeEventsBulkMutation] = useMutation(ADD_COMMITTEE_EVENTS_BULK);
  // const [assignCommitteeToEventsMutation] = useMutation(ASSIGN_COMMITTEE_TO_EVENTS);

  // Derived data
  const coordinations: Coordination[] = React.useMemo(() =>
    coordinationData?.allCoordination?.data?.map((c: any) => ({ id: c.id, name: c.name })) || [],
    [coordinationData]
  );

  const studentsWithCommitteeNovelty: Student[] =
    noveltiesData?.allNovelties?.data
      ?.filter((n: any) => n.noveltyStatus?.name === "En Comité")
      ?.map((n: any) => ({
        id: n.student?.id,
        name: n.student?.person?.name + " " + n.student?.person?.lastname,
        hasNovelties: true,
      })) || [];

  const teachers: Teacher[] =
    coordinationData?.allCoordination?.data?.flatMap((c: any) =>
      (c.teachers || []).map((t: any) => ({
        id: t.id,
        name: t.collaborator?.person?.name + " " + t.collaborator?.person?.lastname,
      })),
    ) || [];

  const administratives: Administrative[] = [];
  // Raw events from backend (used to enrich committees)
  const allRawEvents = committeeEventsData?.allCommitteeEvents?.data || [];

  const committees = committeesData?.allCommittees?.data || [];
  // Map events to committees when backend doesn't include committee.committeeEvents
  const committeesWithEvents = committees.map((c: any) => {
    const hasEvents = Array.isArray(c.committeeEvents) && c.committeeEvents.length > 0;
    if (hasEvents) return c;
    const matched = (allRawEvents || []).filter((ev: any) => String(ev.committee?.id) === String(c.id));
    return { ...c, committeeEvents: matched };
  });

  const filteredCommittees = committeesWithEvents.filter((committee: any) => {
    if (!searchQuery.trim()) return true;
    return committee.coordination?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredCommittees.length / itemsPerPage);
  const paginatedCommittees = filteredCommittees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Statistics
  const eventsWithCommittee = allRawEvents.filter((e: any) => e?.committee && e?.committee?.id);
  const stats: CommitteeStats = {
    totalEventos: eventsWithCommittee.length || 0,
    pendientes: eventsWithCommittee.filter((e: any) => !e?.finishedAt).length || 0,
    finalizados: eventsWithCommittee.filter((e: any) => !!e?.finishedAt).length || 0,
    coordinaciones: new Set(eventsWithCommittee.map((e: any) => e.coordinationName || e?.committee?.coordination?.name)).size || 0,
  };

  // Effect to resolve coordination name when data arrives
  useEffect(() => {
    if (pendingCoordinationName && !newCommittee.coordinationId && coordinations.length > 0) {
      const target = normalizeString(pendingCoordinationName);
      const found = coordinations.find(c => normalizeString(c.name || '') === target);
      if (found) {
        updateCommittee({ coordinationId: found.id });
        setPendingCoordinationName(null);
      }
    }
  }, [pendingCoordinationName, newCommittee.coordinationId, coordinations, updateCommittee, setPendingCoordinationName]);

  // Effect to clear alert after showing it
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert, clearAlert]);

  // Effect to convert committee events to calendar format
  useEffect(() => {
    if (committeeEventsData?.allCommitteeEvents?.data) {
      const backendEvents = committeeEventsData.allCommitteeEvents.data;
      const calendarEventsFromBackend: CalendarEvent[] = backendEvents.map((event: any) => ({
        id: `backend-${event.id}`,
        title: `${event.session} - ${event.coordinationName}`,
        date: event.date,
        time: event.hour,
        hour: event.hour,
        session: event.session,
        coordinationName: event.coordinationName,
        coordinationId: event?.committee?.coordination?.id || undefined,
        isAvailable: !(event?.committee && event?.committee?.id),
      }));
      setCalendarEvents(calendarEventsFromBackend);
    }
  }, [committeeEventsData, setCalendarEvents]);

  // File processing
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadStatus("idle");
    setErrorMessages([]);

    try {
      const { calendarSlots, errors } = await parseExcelFile(file);

      if (errors.length > 0) {
        setErrorMessages(errors);
        setUploadStatus("error");
      } else {
        // Convert calendar events to CommitteeEventDto format for backend
        const committeeEventsDto = calendarSlots.map((slot) => {
          const formattedDate = slot.date.toString().trim();
          const formattedHour = (slot.hour || '').toString().trim();
          const hourWithSeconds = formattedHour.includes(':') && formattedHour.split(':').length === 2
            ? `${formattedHour}:00`
            : formattedHour;

          return {
            date: formattedDate,
            hour: hourWithSeconds,
            session: (slot.session || '').toString().trim(),
            coordinationName: (slot.coordinationName || '').toString().trim(),
          };
        });

        // Here you would call your bulk mutation
        const { data } = await addCommitteeEventsBulkMutation({
          variables: { input: committeeEventsDto },
        });

        await refetchCommitteeEvents();
        await refetchCommittees();

        setUploadStatus("success");
        setMensaje(`Se cargaron ${calendarSlots.length} eventos de comité exitosamente`);
        setMensajeTipo("success");
      }
    } catch (error: any) {
      setUploadStatus("error");
      const errorMessage = error?.message || "Error al procesar el archivo";
      setErrorMessages([errorMessage]);
      setMensaje("Error al procesar y guardar los eventos");
      setMensajeTipo("error");
    } finally {
      setIsProcessing(false);
    }
  }, [setIsProcessing, setUploadStatus, setErrorMessages, setMensaje, setMensajeTipo]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setUploadStatus("error");
      setErrorMessages(["Por favor selecciona un archivo Excel válido (.xlsx o .xls)"]);
      return;
    }
    await processFile(file);
  };

  // Calendar event handlers
  const openCreateFormWithEvent = (event: CalendarEvent) => {
    let coordinationId = event.coordinationId;

    if (!coordinationId && event.coordinationName) {
      const coordExact = coordinations.find((c) => c.name === event.coordinationName);
      coordinationId = coordExact?.id;
    }

    if (!coordinationId && event.coordinationName) {
      const target = normalizeString(event.coordinationName);
      const coordNorm = coordinations.find(c => normalizeString(c.name || '') === target);
      coordinationId = coordNorm?.id;
    }

    updateCommittee({
      coordinationId: coordinationId || newCommittee.coordinationId || "",
      date: event.date,
      hour: event.hour || event.time || "",
    });

    if (!coordinationId && event.coordinationName) {
      setPendingCoordinationName(event.coordinationName);
    } else {
      setPendingCoordinationName(null);
    }

    setShowCreateForm(true);
    if (event.id) {
      const cleanId = event.id.replace(/^backend-/, '');
      setSelectedEventIds([cleanId]);
    }
  };

  // Committee creation
  const handleCreateCommittee = async () => {
    if (!newCommittee.coordinationId) {
      showAlert('Por favor selecciona una coordinación', 'error');
      return;
    }

    try {
      // Here you would call your create committee mutation
      // const { data } = await addCommitteeMutation({
      //   variables: { input: newCommittee }
      // });

      showAlert('Comité creado exitosamente', 'success');
      setShowCreateForm(false);
      updateCommittee({
        coordinationId: '',
        studentsIds: [],
        teachersIds: [],
        administrativesIds: [],
        isCurrent: false,
        isActive: true,
        committeeEvents: [],
      });
      setSelectedEventIds([]);
      setTimeout(() => setCurrentView("committees"), 1000);
    } catch (error: any) {
      showAlert(`Error al crear comité: ${error?.message || 'Error desconocido'}`, 'error');
    }
  };

  // Download minute
  // GraphQL lazy queries to generate/download minutes
  const [runGenerateMinuteDocx] = useLazyQuery(GENERATE_MINUTE_DOCX, { fetchPolicy: 'no-cache' });
  const [runGenerateMinuteDocxUrl] = useLazyQuery(GENERATE_MINUTE_DOCX_URL, { fetchPolicy: 'no-cache' });
  const [runMinuteFileBase64] = useLazyQuery(MINUTE_FILE_BASE64, { fetchPolicy: 'no-cache' });

  // Child component handles responding novelties; keep other mutations here as needed

  const downloadMinuteForEvent = async (committeeEventId: string) => {
    const fileName = `acta-comite-${committeeEventId}.docx`;
    const triggerDownload = (href: string, name = fileName) => {
      const a = document.createElement('a');
      a.href = href;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 0);
    };

    const downloadFromUrl = async (url: string) => {
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 0);
        return;
      } catch (e) {
        try {
          const res = await window.fetch(url, { credentials: 'include' });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          triggerDownload(objUrl);
          setTimeout(() => URL.revokeObjectURL(objUrl), 10000);
          return;
        } catch {
          window.open(url, '_blank');
        }
      }
    };

    try {
      setDownloadingId(committeeEventId);
      const cleanIdStr = String(committeeEventId).replace(/^backend-/, '').replace(/^evt-/, '');
      const idVar: any = cleanIdStr;
      console.debug('[MINUTE][REQ] committeeEventId=', committeeEventId, 'cleanIdStr=', cleanIdStr, 'idVar=', idVar);

      // 1) Intento principal: generateMinuteDocx
      const { data } = await runGenerateMinuteDocx({ variables: { committeeEventId: idVar } });
      const payload: string | undefined = data?.generateMinuteDocx;
      console.debug('[MINUTE][RESP] generateMinuteDocx type=', typeof payload, 'len=', payload?.length);
      if (payload && typeof payload === 'string' && payload.length > 0) {
        if (/^https?:\/\//i.test(payload)) {
          console.debug('[MINUTE][RESP] Detected URL payload');
          await downloadFromUrl(payload);
          setMensaje('Acta descargada correctamente');
          setMensajeTipo('success');
          return;
        }
        if (/^data:/i.test(payload)) {
          console.debug('[MINUTE][RESP] Detected data URL payload');
          triggerDownload(payload);
          setMensaje('Acta descargada correctamente');
          setMensajeTipo('success');
          return;
        }

        if (/\.docx$/i.test(payload) && !/[,;]/.test(payload)) {
          console.debug('[MINUTE][RESP] Detected filename payload, fetching base64 via minuteFileBase64');
          const fileResp = await runMinuteFileBase64({ variables: { filename: payload } });
          const fileB64: string | undefined = fileResp?.data?.minuteFileBase64;
          if (fileB64 && typeof fileB64 === 'string' && fileB64.length > 0) {
            try {
              const normalizeBase64 = (s: string) => {
                let b = s.trim();
                const idx = b.indexOf('base64,');
                if (idx >= 0) b = b.substring(idx + 'base64,'.length);
                b = b.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/').replace(/[^A-Za-z0-9+/=]/g, '');
                const pad = b.length % 4;
                if (pad > 0) b = b + '='.repeat(4 - pad);
                return b;
              };
              const base64 = normalizeBase64(fileB64);
              const byteCharacters = atob(base64);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
              const objUrl = URL.createObjectURL(blob);
              triggerDownload(objUrl, payload);
              setTimeout(() => URL.revokeObjectURL(objUrl), 10000);
              setMensaje('Acta descargada correctamente');
              setMensajeTipo('success');
              return;
            } catch (e) {
              console.debug('[MINUTE][FILENAME] Error decodificando base64 de minuteFileBase64, usando data URL');
              const mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              const dataUrl = `data:${mime};base64,${fileB64}`;
              triggerDownload(dataUrl, payload);
              setMensaje('Acta descargada correctamente');
              setMensajeTipo('success');
              return;
            }
          }
        }

        // c1) Base64 crudo
        try {
          console.debug('[MINUTE][RESP] Detected base64 payload, decoding...');
          const normalizeBase64 = (s: string) => {
            let b = s.trim();
            const idx = b.indexOf('base64,');
            if (idx >= 0) b = b.substring(idx + 'base64,'.length);
            b = b.replace(/\s+/g, '');
            b = b.replace(/-/g, '+').replace(/_/g, '/');
            b = b.replace(/[^A-Za-z0-9+/=]/g, '');
            const pad = b.length % 4;
            if (pad > 0) b = b + '='.repeat(4 - pad);
            return b;
          };
          const base64 = normalizeBase64(payload);
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const objUrl = URL.createObjectURL(blob);
          triggerDownload(objUrl);
          setTimeout(() => URL.revokeObjectURL(objUrl), 10000);
          setMensaje('Acta descargada correctamente');
          setMensajeTipo('success');
          return;
        } catch (e) {
          console.debug('[MINUTE][BASE64] Error decodificando base64, usando data URL como fallback');
          const mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          const dataUrl = `data:${mime};base64,${payload}`;
          triggerDownload(dataUrl);
          setMensaje('Acta descargada correctamente');
          setMensajeTipo('success');
          return;
        }
      }

      // 2) Fallback: generateMinuteDocxUrl
      const urlResp = await runGenerateMinuteDocxUrl({ variables: { committeeEventId: idVar } });
      const urlStr: string | undefined = urlResp?.data?.generateMinuteDocxUrl;
      console.debug('[MINUTE][RESP] generateMinuteDocxUrl type=', typeof urlStr, 'len=', urlStr?.length, 'value=', urlStr);
      if (urlStr && typeof urlStr === 'string' && urlStr.length > 0) {
        await downloadFromUrl(urlStr);
        setMensaje('Acta descargada correctamente');
        setMensajeTipo('success');
        return;
      }

      setMensaje('No se pudo generar el acta.');
      setMensajeTipo('error');
    } catch (err) {
      console.error('[MINUTE][ERROR] Descarga de acta fallida:', err);
      setMensaje('Error al generar el acta.');
      setMensajeTipo('error');
    } finally {
      setDownloadingId(null);
    }
  };

  const generatePDF = async (committee: CommitteeDto) => {
    // Implement PDF generation logic here
    await downloadMinuteForEvent(committee.id);
  };

  // Robust download handler: accepts either an event or a committee and resolves event id
  const handleDownloadMinute = async (item: any) => {
    // If item looks like an event
    const eventId = item?.id && item.date ? item.id : (item?.committeeEvents?.[0]?.id || item?.id);
    if (!eventId) {
      setMensaje('No se encontró ID de evento para descargar');
      setMensajeTipo('error');
      return;
    }
    setDownloadingId(eventId);
    try {
      await downloadMinuteForEvent(eventId);
    } catch (err) {
      setMensaje('Error al descargar el acta');
      setMensajeTipo('error');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 dark:text-white">
      {alert.message && (
        <ToastAlert
          message={alert.message}
          type={alert.type}
          duration={3000}
          onClose={clearAlert}
        />
      )}

      <div className="max-w-7xl mx-auto dark:text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Gestión de Comités
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Administra y gestiona los comités de evaluación y seguimiento.
          </p>
        </div>

        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
          onCreateCommittee={handleOpenEmptyForm}
        />

        {mensaje && (
          <ToastAlert
            message={mensaje}
            type={mensajeTipo}
            duration={5000}
            onClose={() => setMensaje(null)}
          />
        )}

        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <Dashboard
            stats={stats}
            onFileUpload={handleFileUpload}
            onDownloadTemplate={downloadTemplate}
            isProcessing={isProcessing}
            uploadStatus={uploadStatus}
            errorMessages={errorMessages}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        )}

        {/* Calendar View */}
        {currentView === "calendar" && (
          <Calendar
            currentDate={currentDate}
            calendarEvents={calendarEvents}
            selectedDateEvents={selectedDateEvents}
            onNavigateMonth={navigateMonth}
            onSelectEvent={openCreateFormWithEvent}
            onSelectMultipleEvents={setSelectedDateEvents}
            onCloseEventModal={() => setSelectedDateEvents(null)}
          />
        )}

        {/* Committees View */}
        {currentView === "committees" && (
          <CommitteeList
            committees={paginatedCommittees}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onViewCommittee={(c: any) => setSelectedCommittee({ committee: c, event: null })}
            onDownloadMinute={handleDownloadMinute}
            downloadingId={downloadingId}
          />
        )}

        {/* Create Committee Form Modal */}
        {showCreateForm && (
          <CreateCommitteeForm
            committee={newCommittee}
            coordinations={coordinations}
            students={studentsWithCommitteeNovelty}
            teachers={teachers}
            administratives={administratives}
            lockDateHour={lockDateHour}
            pendingCoordinationName={pendingCoordinationName}
            onCommitteeChange={updateCommittee}
            onSubmit={handleCreateCommittee}
            onClose={() => setShowCreateForm(false)}
          />
        )}

        {/* Committee Details Modal */}
        {selectedCommittee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white dark:bg-gray-950 rounded-lg p-6 max-w-4xl w-full">
              <button
                onClick={closeCommitteeModal}
                aria-label="Cerrar"
                className="absolute right-3 top-3 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="text-lg">×</span>
              </button>
              <div className="">
                <h3 className="text-2xl font-semibold mb-2">Detalles del Comité</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300">Información completa del comité seleccionado</p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="flex flex-col items-start md:col-span-2">
                  <div className="mb-3">
                    <div className="text-sm font-medium text-muted-foreground">Coordinación</div>
                    <div className="font-semibold text-lg">{selectedCommittee.committee?.coordination?.name || selectedCommittee.committee?.coordinationName || 'Sin coordinación'}</div>
                  </div>
                  <div className="mb-3 w-full">
                    <div className="text-sm font-medium text-muted-foreground">Coordinador</div>
                    <div className="font-semibold text-lg">{selectedCommittee.committee?.coordinatorName || '—'}</div>
                    {/* Show next event date under the coordinator if available */}
                    {((selectedCommittee.event?.date || selectedCommittee.committee?.committeeEvents?.[0]?.date)) && (
                      <>
                        <div className="text-sm text-muted-foreground mt-1">
                          Fecha de la sesión: <span className="font-medium text-gray-700 dark:text-white">
                            {String(selectedCommittee.event?.date || selectedCommittee.committee?.committeeEvents?.[0]?.date)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Hora de la sesión: <span className="font-medium text-gray-700 dark:text-white">
                            {selectedCommittee.event?.hour || selectedCommittee.committee?.committeeEvents?.[0]?.hour || '—'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <div className="mb-3">
                    <div className="text-sm font-medium text-muted-foreground">Estado</div>
                    <div className="flex items-center gap-3 mt-2">
                      {selectedCommittee.committee?.isActive ? <span className="text-green-700 dark:text-blue-400 font-semibold">Activo</span> : <span className="text-red-600 font-semibold">Inactivo</span>}
                      {selectedCommittee.committee?.isCurrent && <span className="text-sm px-2 py-0.5 bg-primary/10 rounded">Actual</span>}
                    </div>
                  </div>

                  <div className="mb-3 w-full">
                    <div className="text-base font-medium text-muted-foreground">Eventos asociados</div>
                    <div className="mt-2 space-y-2 w-full max-h-64 overflow-auto whitespace-normal break-words">
                      {(selectedCommittee.committee?.committeeEvents || []).map((ev: any) => (
                        <div key={ev.id} className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                          <div className="text-sm text-muted-foreground dark:text-gray-300">Sesión: <span className="font-medium text-gray-700 dark:text-white">{ev.session}</span>{ev.coordinationName ? <span className="text-muted-foreground dark:text-gray-300"> • {ev.coordinationName}</span> : null}</div>
                        </div>
                      ))}
                      {(selectedCommittee.committee?.committeeEvents || []).length === 0 && (
                        <div className="text-sm text-muted-foreground">No hay eventos asociados</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Move Participants to full-width block below the grid so it sits at the bottom and uses optimal space */}
              <div className="mt-6 w-full">
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-4">
                  <div className="text-base font-medium text-muted-foreground dark:text-gray-200">Participantes</div>
                  <div className="mt-3 text-sm w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Instructores</div>
                        <div className="font-medium break-words whitespace-normal">{(selectedCommittee.committee?.teachers || []).map((t: any) => t?.collaborator?.person?.name ? `${t.collaborator.person.name} ${t.collaborator.person.lastname || ''}` : t.name).join(', ') || 'Ninguno'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Administrativos</div>
                        <div className="font-medium break-words whitespace-normal">{(selectedCommittee.committee?.administratives || []).map((a: any) => a?.name || a?.id).join(', ') || 'Ninguno'}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground">Aprendices</div>
                      <div className="mt-2 max-h-96 overflow-auto">
                        <CommitteeResponses
                          committeeId={String(selectedCommittee.committee?.id || '')}
                          eventId={String((selectedCommittee.event?.id || selectedCommittee.committee?.committeeEvents?.[0]?.id) || '')}
                          students={(selectedCommittee.committee?.students || []) as any[]}
                          novelties={noveltiesData?.allNovelties?.data || []}
                          onSent={async () => { try { await refetchCommitteeEvents(); setStudentDecisions({}); } catch { } }}
                          onExpose={(helpers: any) => { responsesHelpersRef.current = helpers; }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* removed footer Cerrar button; modal has a top-right close (×) */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white border rounded"
                  onClick={() => {
                    // Clear both child decisions and parent/shared decisions
                    try {
                      responsesHelpersRef.current?.clearDecisions?.();
                    } catch { }
                    try { setStudentDecisions({}); } catch { }
                  }}
                >Limpiar</button>
                <button
                  className="px-4 py-2 bg-[#398f0d] dark:bg-blue-600 text-white rounded"
                  onClick={async () => {
                    try {
                      const helper = responsesHelpersRef.current;
                      if (!helper || typeof helper.sendResponses !== 'function') {
                        setMensaje('No hay respuestas para enviar');
                        setMensajeTipo('warning');
                        return;
                      }
                      const result = await helper.sendResponses();
                      if (result?.ok) {
                        setMensaje('Respuestas enviadas correctamente');
                        setMensajeTipo('success');
                        try { await refetchCommitteeEvents(); } catch { }
                        try { setStudentDecisions({}); } catch { }
                        closeCommitteeModal();
                      } else {
                        setMensaje(result?.message || 'Error al enviar respuestas');
                        setMensajeTipo('error');
                      }
                    } catch (e: any) {
                      setMensaje(e?.message || 'Error al enviar respuestas');
                      setMensajeTipo('error');
                    }
                  }}
                >Enviar respuestas</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}