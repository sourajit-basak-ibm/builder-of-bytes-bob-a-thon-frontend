import axios from 'axios';
import type {
  CandidateCreateRequest,
  CandidateResponse,
  ProjectRequest,
  ProjectResponse,
  StaffingRequestCreateRequest,
  StaffingRequestResponse,
  MatchResponse,
  InterviewScheduleRequest,
  InterviewCompleteRequest,
  InterviewResponse,
  ShortlistDecisionRequest,
  ShortlistDecisionResponse,
  FaceToFaceMeetingRequest,
  FaceToFaceMeetingCompleteRequest,
  FaceToFaceMeetingResponse,
  OnboardingInitiateRequest,
  OnboardingProgressRequest,
  OnboardingWorkflowResponse,
  NotificationResponse,
  HealthResponse,
} from '@/types/api';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health Check
export const healthCheck = async (): Promise<HealthResponse> => {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
};

// Candidates
export const listCandidates = async (): Promise<CandidateResponse[]> => {
  const { data } = await api.get<CandidateResponse[]>('/candidates');
  return data;
};

export const createCandidate = async (
  request: CandidateCreateRequest
): Promise<CandidateResponse> => {
  const { data } = await api.post<CandidateResponse>('/candidates', request);
  return data;
};

// Projects
export const listProjects = async (): Promise<ProjectResponse[]> => {
  const { data } = await api.get<ProjectResponse[]>('/projects');
  return data;
};

export const createProject = async (
  request: ProjectRequest
): Promise<ProjectResponse> => {
  const { data } = await api.post<ProjectResponse>('/projects', request);
  return data;
};

// Staffing Requests
export const listStaffingRequests = async (): Promise<StaffingRequestResponse[]> => {
  const { data } = await api.get<StaffingRequestResponse[]>('/staffing-requests');
  return data;
};

export const createStaffingRequest = async (
  request: StaffingRequestCreateRequest
): Promise<StaffingRequestResponse> => {
  const { data } = await api.post<StaffingRequestResponse>(
    '/staffing-requests',
    request
  );
  return data;
};

export const matchCandidates = async (
  staffingRequestId: string
): Promise<MatchResponse[]> => {
  const { data } = await api.get<MatchResponse[]>(
    `/staffing-requests/${staffingRequestId}/matches`
  );
  return data;
};

// Interviews
export const listInterviews = async (): Promise<InterviewResponse[]> => {
  const { data } = await api.get<InterviewResponse[]>('/interviews');
  return data;
};

export const scheduleInterview = async (
  request: InterviewScheduleRequest
): Promise<InterviewResponse> => {
  const { data } = await api.post<InterviewResponse>('/interviews', request);
  return data;
};

export const completeInterview = async (
  id: string,
  request: InterviewCompleteRequest
): Promise<InterviewResponse> => {
  const { data } = await api.patch<InterviewResponse>(
    `/interviews/${id}/complete`,
    request
  );
  return data;
};

// Shortlist Decisions
export const listDecisions = async (): Promise<ShortlistDecisionResponse[]> => {
  const { data } = await api.get<ShortlistDecisionResponse[]>('/shortlist-decisions');
  return data;
};

export const createDecision = async (
  request: ShortlistDecisionRequest
): Promise<ShortlistDecisionResponse> => {
  const { data } = await api.post<ShortlistDecisionResponse>(
    '/shortlist-decisions',
    request
  );
  return data;
};

// Face-to-Face Meetings
export const listMeetings = async (): Promise<FaceToFaceMeetingResponse[]> => {
  const { data } = await api.get<FaceToFaceMeetingResponse[]>('/meetings');
  return data;
};

export const scheduleMeeting = async (
  request: FaceToFaceMeetingRequest
): Promise<FaceToFaceMeetingResponse> => {
  const { data } = await api.post<FaceToFaceMeetingResponse>('/meetings', request);
  return data;
};

export const completeMeeting = async (
  id: string,
  request: FaceToFaceMeetingCompleteRequest
): Promise<FaceToFaceMeetingResponse> => {
  const { data } = await api.patch<FaceToFaceMeetingResponse>(
    `/meetings/${id}/complete`,
    request
  );
  return data;
};

// Onboarding
export const listOnboardings = async (): Promise<OnboardingWorkflowResponse[]> => {
  const { data } = await api.get<OnboardingWorkflowResponse[]>('/onboardings');
  return data;
};

export const initiateOnboarding = async (
  request: OnboardingInitiateRequest
): Promise<OnboardingWorkflowResponse> => {
  const { data } = await api.post<OnboardingWorkflowResponse>(
    '/onboardings',
    request
  );
  return data;
};

export const updateOnboarding = async (
  id: string,
  request: OnboardingProgressRequest
): Promise<OnboardingWorkflowResponse> => {
  const { data } = await api.patch<OnboardingWorkflowResponse>(
    `/onboardings/${id}/progress`,
    request
  );
  return data;
};

// Notifications
export const listNotifications = async (): Promise<NotificationResponse[]> => {
  const { data } = await api.get<NotificationResponse[]>('/notifications');
  return data;
};

export default api;

// Made with Bob
