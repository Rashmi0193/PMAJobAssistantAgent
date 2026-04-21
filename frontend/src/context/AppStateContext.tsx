"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from "react";
import { api } from "@/services/api";

export type Seniority = "Junior" | "Mid" | "Senior";
export type Tone = "Direct" | "Warm" | "Confident";

export type Profile = {
  name: string;
  email: string;
  targetRole: string;
  yearsExperience: number;
  seniority: Seniority;
  tone: Tone;
  skills: string[];
  interests: string[];
  desiredJobTypes: Array<"Full-time" | "Internship" | "Contract">;
  workMode: "Remote" | "Hybrid" | "Onsite" | "Open";
  locationPreference: "US" | "Worldwide" | "Specific";
  preferredLocations: string[];
  salaryMinUsd?: number;
  salaryMaxUsd?: number;
  links: { linkedin?: string; github?: string; portfolio?: string };
  workHistory: Array<{
    company: string;
    title: string;
    dates: string;
    highlights: string;
  }>;
};

export type TaskStatus = "Queued" | "Running" | "NeedsReview" | "Done" | "Failed";
export type TaskType = "Autofill" | "ResumeScore" | "TailoredAnswer";

export type ApplicationStatus =
  | "Not Submitted"
  | "Submitted"
  | "Initial Response"
  | "Interview Requested"
  | "Rejected"
  | "Rejected After Interview"
  | "Onsite/Video Interview Requested"
  | "Offer"
  | "Accepted"
  | "Withdrawn";

export type Application = {
  id: string;
  company: string;
  role: string;
  url?: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type AgentTask = {
  id: string;
  type: TaskType;
  status: TaskStatus;
  title: string;
  steps: Array<{ label: string; status: "todo" | "doing" | "done" }>;
  createdAt: string;
  updatedAt: string;
};

export type ResumeAnalysis = {
  score: number;
  strengths: string[];
  gaps: string[];
  tips: string[];
};

export type GeneratedAnswer = {
  question: string;
  text: string;
  status: "Draft" | "Approved" | "Rejected";
};

export type Feedback = {
  id: string;
  kind: "ResumeTip" | "GeneratedAnswer";
  rating: "up" | "down";
  note?: string;
  createdAt: string;
};

type AppState = {
  profile: Profile;
  job: { title: string; company: string; description: string; url?: string };
  tasks: AgentTask[];
  resumeAnalysis?: ResumeAnalysis;
  generatedAnswer?: GeneratedAnswer;
  feedback: Feedback[];
  applications: Application[];
  toast?: { message: string };
};

type Action =
  | { type: "state/replace"; state: Partial<AppState> }
  | { type: "profile/patch"; patch: Partial<Profile> }
  | { type: "profile/save" }
  | { type: "job/set"; job: AppState["job"] }
  | { type: "task/add"; task: AgentTask }
  | { type: "task/patch"; id: string; patch: Partial<AgentTask> }
  | { type: "resume/set"; analysis?: ResumeAnalysis }
  | { type: "answer/set"; answer?: GeneratedAnswer }
  | { type: "feedback/add"; item: Feedback }
  | { type: "applications/add"; application: Application }
  | { type: "applications/patch"; id: string; patch: Partial<Application> }
  | { type: "toast/set"; message?: string };

const DEFAULT_PROFILE: Profile = {
  name: "",
  email: "",
  targetRole: "Frontend Engineer",
  yearsExperience: 3,
  seniority: "Mid",
  tone: "Warm",
  skills: ["React", "TypeScript", "Next.js"],
  interests: ["Startups", "Product teams"],
  desiredJobTypes: ["Full-time"],
  workMode: "Open",
  locationPreference: "US",
  preferredLocations: ["SF Bay Area", "Remote (US)"],
  salaryMinUsd: 120000,
  salaryMaxUsd: 180000,
  links: {},
  workHistory: [
    {
      company: "ExampleCo",
      title: "Frontend Engineer",
      dates: "2023 - Present",
      highlights: "Built and shipped UI features; improved performance; collaborated with design."
    }
  ]
};

const DEFAULT_JOB: AppState["job"] = {
  title: "Frontend Engineer",
  company: "Acme",
  description:
    "We’re looking for a Frontend Engineer with React/Next.js, accessibility best practices, and strong collaboration skills."
};

const STORAGE_KEY = "job_assistant_state_v1";

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

const DEFAULT_STATE: AppState = {
  profile: DEFAULT_PROFILE,
  job: DEFAULT_JOB,
  tasks: [],
  feedback: [],
  applications: []
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "state/replace": {
      const incoming = action.state ?? {};
      return {
        ...DEFAULT_STATE,
        ...incoming,
        profile: { ...DEFAULT_PROFILE, ...(incoming.profile ?? {}) },
        job: { ...DEFAULT_JOB, ...(incoming.job ?? {}) },
        tasks: incoming.tasks ?? [],
        feedback: incoming.feedback ?? [],
        applications: incoming.applications ?? [],
        toast: undefined
      };
    }
    case "profile/patch":
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case "job/set":
      return { ...state, job: action.job };
    case "task/add":
      return { ...state, tasks: [action.task, ...state.tasks] };
    case "task/patch":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t))
      };
    case "resume/set":
      return { ...state, resumeAnalysis: action.analysis };
    case "answer/set":
      return { ...state, generatedAnswer: action.answer };
    case "feedback/add":
      return { ...state, feedback: [action.item, ...state.feedback] };
    case "applications/add":
      return { ...state, applications: [action.application, ...state.applications] };
    case "applications/patch":
      return {
        ...state,
        applications: state.applications.map((a) => (a.id === action.id ? { ...a, ...action.patch } : a))
      };
    case "toast/set":
      return action.message ? { ...state, toast: { message: action.message } } : { ...state, toast: undefined };
    case "profile/save":
      return state;
    default:
      return state;
  }
}

type AppActions = {
  patchProfile: (patch: Partial<Profile>) => void;
  setJob: (job: AppState["job"]) => void;
  scrapeJobFromUrl: (url: string) => Promise<void>;
  saveProfile: () => Promise<void>;
  runResumeScore: (resumeText: string) => Promise<void>;
  runTailoredAnswer: (question: string) => Promise<void>;
  runAutofill: (input: { site: string; fields: Array<{ key: string; label: string; value: string }> }) => Promise<void>;
  addApplication: (input: Omit<Application, "id" | "createdAt" | "updatedAt">) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  approveAnswer: () => void;
  rejectAnswer: () => void;
  submitFeedback: (input: { kind: Feedback["kind"]; rating: Feedback["rating"]; note?: string }) => void;
  notify: (message: string) => void;
  clearToast: () => void;
};

const AppStateContext = createContext<{ state: AppState; actions: AppActions } | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const hasLoadedStorageRef = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AppState>;
      dispatch({ type: "state/replace", state: parsed });
    } catch {
      // ignore bad storage
    } finally {
      hasLoadedStorageRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasLoadedStorageRef.current) return;
    const { toast, ...persistable } = state;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      // ignore quota/private mode
    }
  }, [state]);

  const actions: AppActions = useMemo(
    () => ({
      patchProfile: (patch) => dispatch({ type: "profile/patch", patch }),
      setJob: (job) => {
        dispatch({ type: "job/set", job });
        dispatch({ type: "toast/set", message: "Job context saved." });
        window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 1100);
      },
      scrapeJobFromUrl: async (url) => {
        dispatch({ type: "toast/set", message: "Scraping job posting…" });
        try {
          const job = await api.scrapeJobPosting({ url });
          dispatch({ type: "job/set", job });
          dispatch({ type: "toast/set", message: "Job details loaded from URL (mock)." });
          window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 1200);
        } catch {
          dispatch({ type: "toast/set", message: "Failed to scrape job posting (mock)." });
        }
      },
      saveProfile: async () => {
        dispatch({ type: "toast/set", message: "Saving profile locally…" });
        try {
          await api.saveProfile(state.profile);
          dispatch({ type: "profile/save" });
          dispatch({ type: "toast/set", message: "Profile saved (synced)." });
          window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 1200);
        } catch {
          dispatch({ type: "profile/save" });
          dispatch({ type: "toast/set", message: "Saved locally (sync skipped)." });
          window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 1400);
        }
      },
      runResumeScore: async (resumeText) => {
        const taskId = newId("task");
        dispatch({
          type: "task/add",
          task: {
            id: taskId,
            type: "ResumeScore",
            status: "Running",
            title: "Resume score",
            steps: [
              { label: "Extract role requirements", status: "doing" },
              { label: "Match against profile + resume", status: "todo" },
              { label: "Generate improvement tips", status: "todo" }
            ],
            createdAt: nowIso(),
            updatedAt: nowIso()
          }
        });
        try {
          const analysis = await api.analyzeResume({
            profile: state.profile,
            job: state.job,
            resumeText
          });
          dispatch({
            type: "task/patch",
            id: taskId,
            patch: {
              status: "NeedsReview",
              steps: [
                { label: "Extract role requirements", status: "done" },
                { label: "Match against profile + resume", status: "done" },
                { label: "Generate improvement tips", status: "done" }
              ],
              updatedAt: nowIso()
            }
          });
          dispatch({ type: "resume/set", analysis });
        } catch {
          dispatch({
            type: "task/patch",
            id: taskId,
            patch: { status: "Failed", updatedAt: nowIso() }
          });
        }
      },
      runTailoredAnswer: async (question) => {
        const taskId = newId("task");
        dispatch({
          type: "task/add",
          task: {
            id: taskId,
            type: "TailoredAnswer",
            status: "Running",
            title: "Tailored answer",
            steps: [
              { label: "Understand the question", status: "doing" },
              { label: "Draft an answer", status: "todo" },
              { label: "Wait for your approval", status: "todo" }
            ],
            createdAt: nowIso(),
            updatedAt: nowIso()
          }
        });
        try {
          const answer = await api.generateTailoredAnswer({
            profile: state.profile,
            job: state.job,
            question
          });
          dispatch({
            type: "task/patch",
            id: taskId,
            patch: {
              status: "NeedsReview",
              steps: [
                { label: "Understand the question", status: "done" },
                { label: "Draft an answer", status: "done" },
                { label: "Wait for your approval", status: "done" }
              ],
              updatedAt: nowIso()
            }
          });
          dispatch({ type: "answer/set", answer });
        } catch {
          dispatch({
            type: "task/patch",
            id: taskId,
            patch: { status: "Failed", updatedAt: nowIso() }
          });
        }
      },
      runAutofill: async (input) => {
        const taskId = newId("task");
        dispatch({
          type: "task/add",
          task: {
            id: taskId,
            type: "Autofill",
            status: "Running",
            title: `Autofill (${input.site})`,
            steps: [
              { label: "Detect form fields", status: "doing" },
              { label: "Preview values", status: "todo" },
              { label: "Fill after approval", status: "todo" }
            ],
            createdAt: nowIso(),
            updatedAt: nowIso()
          }
        });
        try {
          await api.simulateAutofill(input);
          dispatch({
            type: "task/patch",
            id: taskId,
            patch: {
              status: "NeedsReview",
              steps: [
                { label: "Detect form fields", status: "done" },
                { label: "Preview values", status: "done" },
                { label: "Fill after approval", status: "done" }
              ],
              updatedAt: nowIso()
            }
          });
          dispatch({ type: "toast/set", message: "Autofill ready for approval (simulated)." });
          window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 1400);
        } catch {
          dispatch({
            type: "task/patch",
            id: taskId,
            patch: { status: "Failed", updatedAt: nowIso() }
          });
        }
      },
      addApplication: (input) => {
        const application: Application = {
          id: newId("app"),
          ...input,
          createdAt: nowIso(),
          updatedAt: nowIso()
        };
        dispatch({ type: "applications/add", application });
        dispatch({ type: "toast/set", message: "Application added." });
        window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 1100);
      },
      updateApplication: (id, patch) => {
        dispatch({ type: "applications/patch", id, patch: { ...patch, updatedAt: nowIso() } });
        dispatch({ type: "toast/set", message: "Application updated." });
        window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 900);
      },
      approveAnswer: () => {
        if (!state.generatedAnswer) return;
        dispatch({
          type: "answer/set",
          answer: { ...state.generatedAnswer, status: "Approved" }
        });
      },
      rejectAnswer: () => {
        if (!state.generatedAnswer) return;
        dispatch({
          type: "answer/set",
          answer: { ...state.generatedAnswer, status: "Rejected" }
        });
      },
      submitFeedback: ({ kind, rating, note }) => {
        dispatch({
          type: "feedback/add",
          item: {
            id: newId("fb"),
            kind,
            rating,
            note,
            createdAt: nowIso()
          }
        });
        dispatch({ type: "toast/set", message: "Feedback saved. Thanks!" });
        window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 1200);
      },
      notify: (message) => {
        dispatch({ type: "toast/set", message });
        window.setTimeout(() => dispatch({ type: "toast/set", message: undefined }), 1200);
      },
      clearToast: () => dispatch({ type: "toast/set", message: undefined })
    }),
    [state.generatedAnswer, state.job, state.profile]
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
      {state.toast ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 18,
            padding: "10px 12px",
            borderRadius: 999,
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            backdropFilter: "blur(10px)",
            boxShadow: "var(--shadow)",
            color: "var(--text)"
          }}
        >
          {state.toast.message}
        </div>
      ) : null}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
