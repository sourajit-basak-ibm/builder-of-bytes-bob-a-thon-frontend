import { create } from 'zustand';
import type {
  CandidateResponse,
  ProjectResponse,
  StaffingRequestResponse,
  InterviewResponse,
  FaceToFaceMeetingResponse,
  OnboardingWorkflowResponse,
  NotificationResponse,
} from '@/types/api';

interface AppState {
  // Data
  candidates: CandidateResponse[];
  projects: ProjectResponse[];
  staffingRequests: StaffingRequestResponse[];
  interviews: InterviewResponse[];
  meetings: FaceToFaceMeetingResponse[];
  onboardings: OnboardingWorkflowResponse[];
  notifications: NotificationResponse[];

  // Loading states
  loading: {
    candidates: boolean;
    projects: boolean;
    staffingRequests: boolean;
    interviews: boolean;
    meetings: boolean;
    onboardings: boolean;
    notifications: boolean;
  };

  // Actions
  setCandidates: (candidates: CandidateResponse[]) => void;
  addCandidate: (candidate: CandidateResponse) => void;
  setProjects: (projects: ProjectResponse[]) => void;
  addProject: (project: ProjectResponse) => void;
  setStaffingRequests: (requests: StaffingRequestResponse[]) => void;
  addStaffingRequest: (request: StaffingRequestResponse) => void;
  setInterviews: (interviews: InterviewResponse[]) => void;
  addInterview: (interview: InterviewResponse) => void;
  updateInterview: (id: string, interview: InterviewResponse) => void;
  setMeetings: (meetings: FaceToFaceMeetingResponse[]) => void;
  addMeeting: (meeting: FaceToFaceMeetingResponse) => void;
  updateMeeting: (id: string, meeting: FaceToFaceMeetingResponse) => void;
  setOnboardings: (onboardings: OnboardingWorkflowResponse[]) => void;
  addOnboarding: (onboarding: OnboardingWorkflowResponse) => void;
  updateOnboarding: (id: string, onboarding: OnboardingWorkflowResponse) => void;
  setNotifications: (notifications: NotificationResponse[]) => void;
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  candidates: [],
  projects: [],
  staffingRequests: [],
  interviews: [],
  meetings: [],
  onboardings: [],
  notifications: [],

  loading: {
    candidates: false,
    projects: false,
    staffingRequests: false,
    interviews: false,
    meetings: false,
    onboardings: false,
    notifications: false,
  },

  // Actions
  setCandidates: (candidates) => set({ candidates }),
  addCandidate: (candidate) =>
    set((state) => ({ candidates: [...state.candidates, candidate] })),

  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),

  setStaffingRequests: (staffingRequests) => set({ staffingRequests }),
  addStaffingRequest: (request) =>
    set((state) => ({
      staffingRequests: [...state.staffingRequests, request],
    })),

  setInterviews: (interviews) => set({ interviews }),
  addInterview: (interview) =>
    set((state) => ({ interviews: [...state.interviews, interview] })),
  updateInterview: (id, interview) =>
    set((state) => ({
      interviews: state.interviews.map((i) => (i.id === id ? interview : i)),
    })),

  setMeetings: (meetings) => set({ meetings }),
  addMeeting: (meeting) =>
    set((state) => ({ meetings: [...state.meetings, meeting] })),
  updateMeeting: (id, meeting) =>
    set((state) => ({
      meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
    })),

  setOnboardings: (onboardings) => set({ onboardings }),
  addOnboarding: (onboarding) =>
    set((state) => ({ onboardings: [...state.onboardings, onboarding] })),
  updateOnboarding: (id, onboarding) =>
    set((state) => ({
      onboardings: state.onboardings.map((o) => (o.id === id ? onboarding : o)),
    })),

  setNotifications: (notifications) => set({ notifications }),

  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),
}));

// Made with Bob
