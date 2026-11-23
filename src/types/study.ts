export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';

export type NavTab = 'ringkasan' | 'jadwal' | 'tugas' | 'materi' | 'progres';

export type TaskPriority = 'Tinggi' | 'Sedang' | 'Rendah';

export type TaskStatus = 'Belum Dikerjakan' | 'Sedang Dikerjakan' | 'Selesai';

export type TopicStatus = 'Belum Dipelajari' | 'Sedang Dipelajari' | 'Sudah Dipelajari';

export interface ScheduleItem {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  subject: string;
  teacher: string;
  room: string;
  linkedTopicId?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: TaskPriority;
  status: TaskStatus;
  description: string;
  linkedTopicId?: string;
  createdAt: string;
}

export interface KeyConcept {
  id: string;
  title: string;
  detail: string;
  example: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyTopic {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  category: string;
  estimatedMinutes: number;
  status: TopicStatus;
  overview: string;
  summaryPoints: string[];
  keyConcepts: KeyConcept[];
  checklist: string[];
  checkedChecklistIndices: number[];
  studentNotes: string;
  comprehensionScore: number; // 0 - 100
  lastReviewedAt: string | null; // YYYY-MM-DD
  quiz: QuizQuestion[];
  isCustom?: boolean;
}

export interface ProgressLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weekLabel: string; // e.g., "Pekan 1"
  topicId: string;
  topicTitle: string;
  understandingScore: number; // 0 - 100
  selfRating: number; // 1 - 5
  reflectionNote: string;
  source: 'Kuis' | 'Check-in Mandiri';
}

export interface StudentProfile {
  name: string;
  school: string;
  grade: string;
}

export interface AppData {
  profile: StudentProfile;
  theme: 'light' | 'dark';
  schedule: ScheduleItem[];
  tasks: TaskItem[];
  topics: StudyTopic[];
  progressLogs: ProgressLogEntry[];
}
