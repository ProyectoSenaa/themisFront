import { useState, useCallback } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { 
  CommitteeDto, 
  CalendarEvent, 
  ViewType, 
  AlertState, 
  UploadStatus,
  StudentDecision,
  SelectedCommitteeState,
  BookingPayload,
  CommitteeStats
} from '../types';


export const useCommitteeManagement = () => {
 
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
 
  const [newCommittee, setNewCommittee] = useState<Partial<CommitteeDto & { coordinatorId?: string }>>({
    coordinationId: "",
    studentsIds: [],
    teachersIds: [],
    administrativesIds: [],
    coordinatorId: "",
    isCurrent: false,
    isActive: true,
    date: undefined,
    hour: undefined,
    committeeEvents: [],
  });

  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[] | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  // UI state
  const [alert, setAlert] = useState<AlertState>({ message: '', type: '' });
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mensajeTipo, setMensajeTipo] = useState<"success" | "error" | "warning" | "info">("info");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Form state
  const [cameFromCalendar, setCameFromCalendar] = useState(false);
  const [lockDateHour, setLockDateHour] = useState(false);
  const [pendingCoordinationName, setPendingCoordinationName] = useState<string | null>(null);
  const [selectedCommittee, setSelectedCommittee] = useState<SelectedCommitteeState>(null);
  const [studentDecisions, setStudentDecisions] = useState<Record<string, StudentDecision>>({});

  // Booking state
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [dayToBook, setDayToBook] = useState<string | null>(null);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingPayload, setBookingPayload] = useState<BookingPayload>({});

  // Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Upload state
  const [uploadingMinute, setUploadingMinute] = useState(false);
  const [uploadMinuteError, setUploadMinuteError] = useState<string | null>(null);
  const [uploadMinuteSuccess, setUploadMinuteSuccess] = useState<string | null>(null);

  // Navigation handlers
  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  // Form handlers
  const handleOpenEmptyForm = useCallback(() => {
    setCameFromCalendar(false);
    setLockDateHour(false);
    setSelectedEventIds([]);
    setNewCommittee({
      coordinationId: "",
      studentsIds: [],
      teachersIds: [],
      administrativesIds: [],
      coordinatorId: "",
      isCurrent: false,
      isActive: true,
      date: undefined,
      hour: undefined,
      committeeEvents: [],
    });
    setShowCreateForm(true);
  }, []);

  const closeCommitteeModal = useCallback(() => {
    setSelectedCommittee(null);
  }, []);

  // Alert handlers
  const showAlert = useCallback((message: string, type: AlertState['type']) => {
    setAlert({ message, type });
  }, []);

  const clearAlert = useCallback(() => {
    setAlert({ message: '', type: '' });
  }, []);

  // Update committee
  const updateCommittee = useCallback((updates: Partial<typeof newCommittee>) => {
    setNewCommittee(prev => ({ ...prev, ...updates }));
  }, []);

  return {
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
    showHoursModal,
    dayToBook,
    availableHours,
    showBookingForm,
    bookingPayload,
    searchQuery,
    filterOption,
    currentPage,
    itemsPerPage,
    uploadingMinute,
    uploadMinuteError,
    uploadMinuteSuccess,

    // Setters
    setCurrentView,
    setShowCreateForm,
    setNewCommittee,
    setCalendarEvents,
    setCurrentDate,
    setSelectedDateEvents,
    setSelectedEventIds,
    setAlert,
    setMensaje,
    setMensajeTipo,
    setIsProcessing,
    setUploadStatus,
    setErrorMessages,
    setIsDragging,
    setDownloadingId,
    setCameFromCalendar,
    setLockDateHour,
    setPendingCoordinationName,
    setSelectedCommittee,
    setStudentDecisions,
    setShowHoursModal,
    setDayToBook,
    setAvailableHours,
    setShowBookingForm,
    setBookingPayload,
    setSearchQuery,
    setFilterOption,
    setCurrentPage,
    setUploadingMinute,
    setUploadMinuteError,
    setUploadMinuteSuccess,

    // Handlers
    navigateMonth,
    handleOpenEmptyForm,
    closeCommitteeModal,
    showAlert,
    clearAlert,
    updateCommittee,
  };
};
