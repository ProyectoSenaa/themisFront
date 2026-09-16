export interface CommitteeDto {
  id: string;
  coordinationId: string;
  studentsIds: string[];
  teachersIds: string[];
  administrativesIds: string[];
  isCurrent: boolean;
  isActive: boolean;
  committeeEvents: CommitteeEventDto[];
  date?: string;
  hour?: string;
}

export interface CommitteeEventDto {
  id: string;
  date: string;
  hour: string;
  session: string;
  coordinationName: string;
  committee: CommitteeDto;
  minutes: MinuteDto[];
}

export interface MinuteDto {
  id: string;
  fileContent: string;
  committeeEvent: CommitteeEventDto;
}

export interface Administrative {
  id: string;
  name?: string;
}

export interface Coordination {
  id: string;
  name?: string;
}

export interface Student {
  id: string;
  name?: string;
  hasNovelties?: boolean;
}

export interface Teacher {
  id: string;
  name?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  committee?: CommitteeDto;
  hour?: string;
  session?: string;
  coordinationName?: string;
  coordinationId?: string;
  isAvailable?: boolean;
}

export type SelectedCommitteeState = { 
  committee: any | null; 
  event: any | null; 
} | null;

export type StudentDecision = { 
  approved: boolean | null; 
  observation?: string; 
  showObs?: boolean; 
};

export type ViewType = "calendar" | "committees" | "dashboard";

export type AlertType = "success" | "error" | "warning" | "info";

export type UploadStatus = "idle" | "success" | "error";

export interface AlertState {
  message: string;
  type: AlertType | '';
}

export interface BookingPayload extends Partial<CommitteeEventDto> {
  title?: string;
}

export interface CommitteeStats {
  totalEventos: number;
  pendientes: number;
  finalizados: number;
  coordinaciones: number;
}
