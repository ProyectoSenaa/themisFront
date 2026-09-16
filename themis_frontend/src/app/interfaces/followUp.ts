// Interfaces para Follow Up
export interface FollowUp {
  id: string;
  creationDate: string;
  caseDescription: string;
  evidenceFiles?: string;
  isActive: boolean;
  studentId: string;
  teacherId: string;
  coordinatorId?: string;
  studySheetId?: string;
  followUpTypeId: string;
  followUpStatusId: string;
  followUpFlowStatusId: string;
}

export interface FollowUpType {
  id: string;
  name: string;
  isActive: boolean;
  description: string;
}

export interface FollowUpStatus {
  id: string;
  name: string;
  description: string;
}

export interface FollowUpFlowStatus {
  id: string;
  name: string;
  description: string;
}

export interface FollowUpInput {
  caseDescription: string;
  evidenceFiles?: string;
  isActive?: boolean;
  studentId: string;
  teacherId: string;
  coordinatorId?: string;
  studySheetId?: string;
  followUpTypeId: string;
  followUpStatusId?: string;
  followUpFlowStatusId?: string;
}

export interface FollowUpUpdateInput {
  caseDescription?: string;
  evidenceFiles?: string;
  isActive?: boolean;
  studentId?: string;
  teacherId?: string;
  coordinatorId?: string;
  studySheetId?: string;
  followUpTypeId?: string;
  followUpStatusId?: string;
  followUpFlowStatusId?: string;
}

export interface FollowUpPage {
  data: FollowUp[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  code: string;
  message: string;
}

export interface FollowUpTypePage {
  data: FollowUpType[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  code: string;
  message: string;
}

export interface FollowUpStatusPage {
  data: FollowUpStatus[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  code: string;
  message: string;
}

export interface FollowUpFlowStatusPage {
  data: FollowUpFlowStatus[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  code: string;
  message: string;
}
