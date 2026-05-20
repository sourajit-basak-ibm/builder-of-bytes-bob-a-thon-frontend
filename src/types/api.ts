// API Types generated from OpenAPI specification

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum CandidateSource {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export enum CandidateStatus {
  CandidateSourced = 'CandidateSourced',
  CandidateScreening = 'CandidateScreening',
  CandidateInterviewing = 'CandidateInterviewing',
  CandidateShortlisted = 'CandidateShortlisted',
  CandidateRejected = 'CandidateRejected',
  CandidateHired = 'CandidateHired',
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
}

export enum StaffingRequestStatus {
  RequestOpen = 'RequestOpen',
  RequestInProgress = 'RequestInProgress',
  RequestFulfilled = 'RequestFulfilled',
  RequestCancelled = 'RequestCancelled',
}

export enum Urgency {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  MANAGERIAL = 'MANAGERIAL',
  HR = 'HR',
}

export enum InterviewStatus {
  InterviewScheduled = 'InterviewScheduled',
  InterviewCompleted = 'InterviewCompleted',
  InterviewCancelled = 'InterviewCancelled',
}

export enum MeetingStatus {
  MeetingScheduled = 'MeetingScheduled',
  MeetingCompleted = 'MeetingCompleted',
  MeetingCancelled = 'MeetingCancelled',
}

export enum OnboardingStatus {
  OnboardingInitiated = 'OnboardingInitiated',
  OnboardingInProgress = 'OnboardingInProgress',
  OnboardingCompleted = 'OnboardingCompleted',
}

// Skill Types
export interface SkillRequest {
  name: string;
  proficiency: ProficiencyLevel;
  minimumYearsOfExperience?: number;
  mandatory?: boolean;
}

export interface SkillResponse {
  id: string;
  name: string;
  proficiency: ProficiencyLevel;
  minimumYearsOfExperience?: number;
  mandatory?: boolean;
}

// Resume Types
export interface ResumeRequest {
  sourceName: string;
  sourceType: string;
  url: string;
  lastUpdated: string;
  summary: string;
  totalExperienceYears?: number;
}

export interface ResumeResponse {
  sourceName: string;
  sourceType: string;
  url: string;
  lastUpdated: string;
  summary: string;
  totalExperienceYears?: number;
}

// Candidate Types
export interface CandidateCreateRequest {
  name: string;
  email: string;
  phone: string;
  source: CandidateSource;
  skills: SkillRequest[];
  resume: ResumeRequest;
}

export interface CandidateResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: CandidateSource;
  status: CandidateStatus;
  skills: SkillResponse[];
  resume: ResumeResponse;
}

// Project Types
export interface ProjectRequest {
  name: string;
  technologyStack: string[];
  status: ProjectStatus;
  startDate: string;
  commitments: string;
  managerName?: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  technologyStack: string[];
  status: ProjectStatus;
  startDate: string;
  commitments: string;
  managerName?: string;
}

// Staffing Request Types
export interface StaffingRequestCreateRequest {
  projectId: string;
  numberOfPositions?: number;
  urgency: Urgency;
  skills: SkillRequest[];
}

export interface StaffingRequestResponse {
  id: string;
  projectId: string;
  numberOfPositions?: number;
  urgency: Urgency;
  status: StaffingRequestStatus;
  skills: SkillResponse[];
}

// Match Types
export interface MatchResponse {
  candidateId: string;
  candidateName: string;
  score: number;
  mandatorySkillsMatched: boolean;
  autoConsidered: boolean;
  internalPriority: boolean;
}

// Interview Types
export interface InterviewScheduleRequest {
  candidateId: string;
  staffingRequestId: string;
  scheduledAt: string;
  interviewType: InterviewType;
  panelMembers: string[];
  durationMinutes?: number;
}

export interface InterviewCompleteRequest {
  feedback: string;
  overallScore?: number;
}

export interface InterviewResponse {
  id: string;
  candidateId: string;
  staffingRequestId: string;
  scheduledAt: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  panelMembers: string[];
  durationMinutes?: number;
  teamsLink?: string;
  feedback?: string;
  overallScore?: number;
}

// Shortlist Decision Types
export interface ShortlistDecisionRequest {
  interviewId: string;
  candidateId: string;
  status: string;
  reasoning: string;
  overallScore?: number;
}

export interface ShortlistDecisionResponse {
  id: string;
  interviewId: string;
  candidateId: string;
  status: string;
  reasoning: string;
  overallScore?: number;
  notificationTriggered: boolean;
}

// Face-to-Face Meeting Types
export interface FaceToFaceMeetingRequest {
  shortListDecisionId: string;
  candidateId: string;
  projectId: string;
  location: string;
  scheduledAt: string;
  agenda: string;
}

export interface FaceToFaceMeetingCompleteRequest {
  agreementReached: boolean;
  outcome: string;
}

export interface FaceToFaceMeetingResponse {
  id: string;
  shortListDecisionId: string;
  candidateId: string;
  projectId: string;
  location: string;
  scheduledAt: string;
  agenda: string;
  status: MeetingStatus;
  agreementReached?: boolean;
  outcome?: string;
}

// Onboarding Types
export interface OnboardingInitiateRequest {
  candidateId: string;
  projectId: string;
  faceToFaceMeetingId: string;
  trainingProgramName: string;
  expectedCompletionDate: string;
}

export interface OnboardingProgressRequest {
  progress?: number;
  status: OnboardingStatus;
}

export interface OnboardingWorkflowResponse {
  id: string;
  candidateId: string;
  projectId: string;
  faceToFaceMeetingId: string;
  trainingProgramName: string;
  expectedCompletionDate: string;
  progress?: number;
  status: OnboardingStatus;
  hrNotificationSent: boolean;
}

// Notification Types
export interface NotificationResponse {
  id: string;
  recipient: string;
  message: string;
  createdAt: string;
}

// Health Types
export interface HealthResponse {
  status: string;
  application: string;
}

// Made with Bob
