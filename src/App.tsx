import { useEffect, useMemo, useState } from 'react';
import { MaterialsView } from './components/MaterialsView';
import {
  CheckInModal,
  CustomTopicModal,
  ProfileModal,
  ScheduleModal,
  TaskModal,
} from './components/Modals';
import { Navbar } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { ProgressView } from './components/ProgressView';
import { ScheduleView } from './components/ScheduleView';
import { TasksView } from './components/TasksView';
import { createInitialAppData } from './data/initialData';
import {
  AppData,
  NavTab,
  ScheduleItem,
  StudentProfile,
  TaskItem,
  TaskStatus,
  TopicStatus,
} from './types/study';
import { toLocalIsoDate } from './utils/dateUtils';

const STORAGE_KEY = 'gm_studyhub_data_v1';

function loadStoredData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialAppData();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed || !Array.isArray(parsed.topics) || !Array.isArray(parsed.schedule)) {
      return createInitialAppData();
    }
    return parsed;
  } catch {
    return createInitialAppData();
  }
}

export default function App() {
  const [data, setData] = useState<AppData>(loadStoredData);
  const [activeTab, setActiveTab] = useState<NavTab>('ringkasan');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    () => loadStoredData().topics[0]?.id || 'dampak-sosial'
  );
  const [noticeText, setNoticeText] = useState<string | null>(null);

  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskDefaultSubject, setTaskDefaultSubject] = useState<string | undefined>();
  const [taskDefaultTopicId, setTaskDefaultTopicId] = useState<string | undefined>();

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);

  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkInTopicId, setCheckInTopicId] = useState<string | undefined>();

  const [customTopicModalOpen, setCustomTopicModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage quota errors
    }
  }, [data]);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (data.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [data.theme]);

  const showNotice = (msg: string) => {
    setNoticeText(msg);
    setTimeout(() => {
      setNoticeText((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const uniqueSubjects = useMemo(() => {
    const set = new Set<string>([
      'Informatika',
      ...data.schedule.map((s) => s.subject),
      ...data.tasks.map((t) => t.subject),
    ]);
    return Array.from(set).sort();
  }, [data.schedule, data.tasks]);

  // Handlers
  const handleToggleTheme = () => {
    setData((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const handleOpenTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('materi');
  };

  const handleOpenNewTask = (subject?: string, linkedTopicId?: string) => {
    setEditingTask(null);
    setTaskDefaultSubject(subject);
    setTaskDefaultTopicId(linkedTopicId);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (
    payload: Omit<TaskItem, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === existingId ? { ...t, ...payload } : t
        ),
      }));
      showNotice('Tugas berhasil diperbarui.');
    } else {
      const newTask: TaskItem = {
        ...payload,
        id: `tsk-${Date.now()}`,
        createdAt: toLocalIsoDate(new Date()),
      };
      setData((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
      }));
      showNotice('Tugas baru ditambahkan ke daftar pengingat.');
    }
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleChangeTaskStatus = (taskId: string, status: TaskStatus) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
  };

  const handleToggleTaskDone = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === 'Selesai' ? 'Belum Dikerjakan' : 'Selesai',
            }
          : t
      ),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    showNotice('Tugas dihapus.');
  };

  const handleSaveSchedule = (
    payload: Omit<ScheduleItem, 'id'>,
    existingId?: string
  ) => {
    if (existingId) {
      setData((prev) => ({
        ...prev,
        schedule: prev.schedule.map((s) =>
          s.id === existingId ? { ...s, ...payload } : s
        ),
      }));
      showNotice('Jadwal pelajaran diperbarui.');
    } else {
      const newItem: ScheduleItem = {
        ...payload,
        id: `sch-${Date.now()}`,
      };
      setData((prev) => ({
        ...prev,
        schedule: [...prev.schedule, newItem],
      }));
      showNotice('Pelajaran ditambahkan ke jadwal.');
    }
    setScheduleModalOpen(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (id: string) => {
    setData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((s) => s.id !== id),
    }));
    showNotice('Slot jadwal dihapus.');
  };

  const handleUpdateTopicStatus = (topicId: string, status: TopicStatus) => {
    setData((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === topicId
          ? { ...t, status, lastReviewedAt: toLocalIsoDate(new Date()) }
          : t
      ),
    }));
  };

  const handleToggleChecklist = (topicId: string, idx: number) => {
    setData((prev) => ({
      ...prev,
      topics: prev.topics.map((t) => {
        if (t.id !== topicId) return t;
        const exists = t.checkedChecklistIndices.includes(idx);
        const nextIndices = exists
          ? t.checkedChecklistIndices.filter((i) => i !== idx)
          : [...t.checkedChecklistIndices, idx];
        return {
          ...t,
          checkedChecklistIndices: nextIndices,
          lastReviewedAt: toLocalIsoDate(new Date()),
        };
      }),
    }));
  };

  const handleSaveNotes = (topicId: string, notes: string) => {
    setData((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              studentNotes: notes,
              lastReviewedAt: toLocalIsoDate(new Date()),
            }
          : t
      ),
    }));
  };

  const handleRecordQuizResult = (topicId: string, score: number) => {
    const todayIso = toLocalIsoDate(new Date());
    const topic = data.topics.find((t) => t.id === topicId);
    if (!topic) return;

    const existingWeeks = new Set(data.progressLogs.map((l) => l.weekLabel));
    const weekLabel = `Pekan ${Math.max(4, existingWeeks.size + 1)}`;

    setData((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              comprehensionScore: score,
              status: score >= 80 ? 'Sudah Dipelajari' : 'Sedang Dipelajari',
              lastReviewedAt: todayIso,
            }
          : t
      ),
      progressLogs: [
        ...prev.progressLogs,
        {
          id: `log-${Date.now()}`,
          date: todayIso,
          weekLabel,
          topicId,
          topicTitle: topic.title,
          understandingScore: score,
          selfRating: score >= 85 ? 5 : score >= 70 ? 4 : 3,
          reflectionNote: `Menyelesaikan kuis pemahaman dengan skor ${score}%.`,
          source: 'Kuis',
        },
      ],
    }));
    showNotice(`Skor kuis (${score}%) tercatat ke progres berkala.`);
  };

  const handleSaveCheckIn = (entry: {
    topicId: string;
    weekLabel: string;
    date: string;
    understandingScore: number;
    selfRating: number;
    reflectionNote: string;
  }) => {
    const topic = data.topics.find((t) => t.id === entry.topicId);
    if (!topic) return;

    setData((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === entry.topicId
          ? {
              ...t,
              comprehensionScore: entry.understandingScore,
              status:
                entry.understandingScore >= 80
                  ? 'Sudah Dipelajari'
                  : 'Sedang Dipelajari',
              lastReviewedAt: entry.date,
            }
          : t
      ),
      progressLogs: [
        ...prev.progressLogs,
        {
          id: `log-${Date.now()}`,
          date: entry.date,
          weekLabel: entry.weekLabel,
          topicId: entry.topicId,
          topicTitle: topic.title,
          understandingScore: entry.understandingScore,
          selfRating: entry.selfRating,
          reflectionNote: entry.reflectionNote,
          source: 'Check-in Mandiri',
        },
      ],
    }));
    setCheckInModalOpen(false);
    showNotice('Check-in pemahaman berkala berhasil disimpan.');
  };

  const handleDeleteLog = (logId: string) => {
    setData((prev) => ({
      ...prev,
      progressLogs: prev.progressLogs.filter((l) => l.id !== logId),
    }));
  };

  const handleAddCustomTopic = (payload: {
    title: string;
    category: string;
    overview: string;
    summaryPoints: string[];
  }) => {
    const newId = `custom-${Date.now()}`;
    const newOrder = data.topics.length + 1;
    setData((prev) => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          id: newId,
          order: newOrder,
          title: payload.title,
          shortTitle: payload.title.slice(0, 22),
          category: payload.category,
          estimatedMinutes: 20,
          status: 'Sedang Dipelajari',
          overview: payload.overview,
          summaryPoints: payload.summaryPoints,
          keyConcepts: [],
          checklist: [
            'Membaca poin inti materi',
            'Menulis rangkuman dengan bahasa sendiri',
          ],
          checkedChecklistIndices: [],
          studentNotes: '',
          comprehensionScore: 50,
          lastReviewedAt: toLocalIsoDate(new Date()),
          quiz: [],
          isCustom: true,
        },
      ],
    }));
    setSelectedTopicId(newId);
    setCustomTopicModalOpen(false);
    showNotice('Materi baru ditambahkan.');
  };

  const handleSaveProfile = (profile: StudentProfile) => {
    setData((prev) => ({ ...prev, profile }));
    setProfileModalOpen(false);
    showNotice('Profil siswa diperbarui.');
  };

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenda-belajar-global-mandiri-${toLocalIsoDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Cadangan data JSON berhasil diunduh.');
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppData;
        if (parsed && Array.isArray(parsed.topics) && Array.isArray(parsed.schedule)) {
          setData(parsed);
          showNotice('Data belajar berhasil dipulihkan dari file JSON.');
        } else {
          showNotice('Format file JSON tidak sesuai.');
        }
      } catch {
        showNotice('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    const fresh = createInitialAppData();
    setData(fresh);
    setSelectedTopicId(fresh.topics[0].id);
    showNotice('Data dikembalikan ke jadwal dan materi awal.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewTask={() => handleOpenNewTask()}
      />

      {noticeText && (
        <div
          role="status"
          aria-live="polite"
          className="border-b border-blue-200 bg-blue-50 px-4 py-2 text-center text-xs font-medium text-blue-900 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-200"
        >
          {noticeText}
        </div>
      )}

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {activeTab === 'ringkasan' && (
          <OverviewView
            profile={data.profile}
            theme={data.theme}
            onToggleTheme={handleToggleTheme}
            onEditProfile={() => setProfileModalOpen(true)}
            schedule={data.schedule}
            tasks={data.tasks}
            topics={data.topics}
            progressLogs={data.progressLogs}
            onNavigate={setActiveTab}
            onOpenTopic={handleOpenTopic}
            onToggleTaskDone={handleToggleTaskDone}
            onOpenNewTaskForSubject={handleOpenNewTask}
          />
        )}

        {activeTab === 'jadwal' && (
          <ScheduleView
            schedule={data.schedule}
            topics={data.topics}
            tasks={data.tasks}
            onAddSchedule={() => {
              setEditingSchedule(null);
              setScheduleModalOpen(true);
            }}
            onEditSchedule={(item) => {
              setEditingSchedule(item);
              setScheduleModalOpen(true);
            }}
            onDeleteSchedule={handleDeleteSchedule}
            onOpenTopic={handleOpenTopic}
            onAddTaskForSubject={handleOpenNewTask}
          />
        )}

        {activeTab === 'tugas' && (
          <TasksView
            tasks={data.tasks}
            topics={data.topics}
            onAddTask={() => handleOpenNewTask()}
            onEditTask={(task) => {
              setEditingTask(task);
              setTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onChangeStatus={handleChangeTaskStatus}
            onOpenTopic={handleOpenTopic}
          />
        )}

        {activeTab === 'materi' && (
          <MaterialsView
            topics={data.topics}
            tasks={data.tasks}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onUpdateTopicStatus={handleUpdateTopicStatus}
            onToggleChecklist={handleToggleChecklist}
            onSaveNotes={handleSaveNotes}
            onRecordQuizResult={handleRecordQuizResult}
            onOpenPeriodicCheckIn={(topicId) => {
              setCheckInTopicId(topicId);
              setCheckInModalOpen(true);
            }}
            onOpenNewTopic={() => setCustomTopicModalOpen(true)}
          />
        )}

        {activeTab === 'progres' && (
          <ProgressView
            topics={data.topics}
            progressLogs={data.progressLogs}
            onOpenCheckIn={(topicId) => {
              setCheckInTopicId(topicId);
              setCheckInModalOpen(true);
            }}
            onDeleteLog={handleDeleteLog}
            onOpenTopic={handleOpenTopic}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetData={handleResetData}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 lg:px-8 dark:text-slate-400">
          <p>
            Agenda Belajar {data.profile.school} · {data.profile.grade}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('jadwal')}
              className="hover:text-slate-900 dark:hover:text-slate-200"
            >
              Jadwal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tugas')}
              className="hover:text-slate-900 dark:hover:text-slate-200"
            >
              Tugas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('materi')}
              className="hover:text-slate-900 dark:hover:text-slate-200"
            >
              Rangkuman Materi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('progres')}
              className="hover:text-slate-900 dark:hover:text-slate-200"
            >
              Pelacakan Progres
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {taskModalOpen && (
        <TaskModal
          initialTask={editingTask}
          defaultSubject={taskDefaultSubject}
          defaultTopicId={taskDefaultTopicId}
          subjects={uniqueSubjects}
          topics={data.topics}
          onSave={handleSaveTask}
          onClose={() => {
            setTaskModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {scheduleModalOpen && (
        <ScheduleModal
          initialItem={editingSchedule}
          topics={data.topics}
          onSave={handleSaveSchedule}
          onClose={() => {
            setScheduleModalOpen(false);
            setEditingSchedule(null);
          }}
        />
      )}

      {checkInModalOpen && (
        <CheckInModal
          topics={data.topics}
          defaultTopicId={checkInTopicId}
          onSave={handleSaveCheckIn}
          onClose={() => setCheckInModalOpen(false)}
        />
      )}

      {customTopicModalOpen && (
        <CustomTopicModal
          onSave={handleAddCustomTopic}
          onClose={() => setCustomTopicModalOpen(false)}
        />
      )}

      {profileModalOpen && (
        <ProfileModal
          profile={data.profile}
          onSave={handleSaveProfile}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </div>
  );
}
