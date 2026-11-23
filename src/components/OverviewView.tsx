import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock,
  Moon,
  Plus,
  Sun,
  TrendingUp,
} from 'lucide-react';
import {
  NavTab,
  ProgressLogEntry,
  ScheduleItem,
  StudentProfile,
  StudyTopic,
  TaskItem,
} from '../types/study';
import {
  formatFullTodayIndonesian,
  formatIndonesianDate,
  getCurrentMinutesOfDay,
  getDeadlineMeta,
  getTodayDayOfWeek,
  isWeekend,
  parseTimeToMinutes,
} from '../utils/dateUtils';

interface OverviewViewProps {
  profile: StudentProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onEditProfile: () => void;
  schedule: ScheduleItem[];
  tasks: TaskItem[];
  topics: StudyTopic[];
  progressLogs: ProgressLogEntry[];
  onNavigate: (tab: NavTab) => void;
  onOpenTopic: (topicId: string) => void;
  onToggleTaskDone: (taskId: string) => void;
  onOpenNewTaskForSubject: (subject: string, linkedTopicId?: string) => void;
}

const HERO_IMAGE_SRC = '/src/assets/images/study_workspace_hero_1795407813058.jpg';

export const OverviewView: React.FC<OverviewViewProps> = ({
  profile,
  theme,
  onToggleTheme,
  onEditProfile,
  schedule,
  tasks,
  topics,
  progressLogs,
  onNavigate,
  onOpenTopic,
  onToggleTaskDone,
  onOpenNewTaskForSubject,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const now = new Date();
  const activeDay = getTodayDayOfWeek(now);
  const weekendNotice = isWeekend(now);
  const currentMins = getCurrentMinutesOfDay(now);

  const todaySchedule = schedule
    .filter((item) => item.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const pendingTasks = tasks
    .filter((t) => t.status !== 'Selesai')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const urgentTasks = pendingTasks.filter((t) => {
    const meta = getDeadlineMeta(t.dueDate, false);
    return meta.daysDiff <= 1;
  });

  const masteredCount = topics.filter((t) => t.status === 'Sudah Dipelajari').length;
  const averageComprehension =
    topics.length > 0
      ? Math.round(topics.reduce((acc, t) => acc + t.comprehensionScore, 0) / topics.length)
      : 0;

  // Group progress logs by weekLabel for a clean trend preview
  const weeklyTrend = React.useMemo(() => {
    const map = new Map<string, number[]>();
    progressLogs.forEach((log) => {
      const list = map.get(log.weekLabel) || [];
      list.push(log.understandingScore);
      map.set(log.weekLabel, list);
    });
    return Array.from(map.entries()).map(([weekLabel, scores]) => ({
      weekLabel,
      avg: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
    }));
  }, [progressLogs]);

  return (
    <div className="space-y-8">
      {/* Hero Workspace Header (2-Column Balanced Split) */}
      <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{profile.school}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>{profile.grade}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span className="tabular-nums">{formatFullTodayIndonesian(now)}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap shrink-0 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  Ubah Profil
                </button>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Terang</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Gelap</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance dark:text-slate-50">
                Selamat belajar, {profile.name}
              </h1>
              <p className="max-w-[62ch] text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                Pantau jadwal pelajaran harian, selesaikan tugas sebelum tenggat waktu, tinjau rangkuman materi Informatika, dan ukur perkembangan pemahamanmu setiap pekan.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onNavigate('materi')}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Buka Rangkuman Materi</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('progres')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              <span>Catat Progres Pekan Ini</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          {!heroImgFailed ? (
            <img
              src={HERO_IMAGE_SRC}
              alt="Meja belajar siswa modern dengan laptop jadwal dan buku catatan Informatika"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="h-56 w-full object-cover lg:h-full"
            />
          ) : (
            <div className="flex h-56 w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-slate-100 to-slate-200 p-6 text-center lg:h-full dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <BookOpen className="h-10 w-10 text-blue-700 dark:text-blue-400" aria-hidden="true" />
              <p className="mt-3 font-display text-sm font-semibold text-slate-800 dark:text-slate-200">
                Ruang Belajar Terstruktur
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Jadwal, tugas, dan catatan Informatika dalam satu tempat
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4-Column KPI Strip */}
      <section
        aria-label="Ringkasan statistik belajar"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pelajaran {weekendNotice ? 'Senin' : activeDay}
          </p>
          <p className="mt-2 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
            {todaySchedule.length} Sesi
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {todaySchedule[0] ? `Mulai ${todaySchedule[0].startTime}` : 'Belum ada jadwal'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Tugas Aktif
          </p>
          <p className="mt-2 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
            {pendingTasks.length} Tugas
          </p>
          <p className="mt-1 text-xs font-medium tabular-nums text-amber-700 dark:text-amber-400">
            {urgentTasks.length > 0
              ? `${urgentTasks.length} tenggat hari ini/besok`
              : 'Tidak ada tenggat mendesak'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Materi Selesai Dipelajari
          </p>
          <p className="mt-2 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
            {masteredCount} / {topics.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Kurikulum Informatika
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Rata-Rata Pemahaman
          </p>
          <p className="mt-2 font-display text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
            {averageComprehension}%
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums dark:text-slate-400">
            {progressLogs.length} catatan evaluasi berkala
          </p>
        </div>
      </section>

      {/* Urgent Reminder Strip (only shown if there are urgent tasks) */}
      {urgentTasks.length > 0 && (
        <section
          aria-label="Pengingat tugas mendesak"
          className="flex flex-col gap-3 rounded-xl border border-amber-300/80 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-800/70 dark:bg-amber-950/30"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Pengingat Tugas Prioritas ({urgentTasks.length} tugas mendekati batas waktu)
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                {urgentTasks.map((t) => `${t.title} (${t.subject})`).join(' · ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tugas')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3.5 py-2 text-xs font-semibold text-amber-900 whitespace-nowrap shrink-0 transition-colors hover:bg-amber-100 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-slate-800"
          >
            <span>Lihat Semua Tugas</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </section>
      )}

      {/* Main Two-Column Integrated Workspace */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Today's Schedule */}
        <div className="rounded-xl border border-slate-200 bg-white lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                Jadwal Pelajaran {weekendNotice ? 'Hari Senin (Pratinjau)' : `Hari ${activeDay}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Terhubung langsung dengan rangkuman materi dan pengingat tugas
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('jadwal')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>Jadwal Lengkap</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarClock className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                Belum ada mata pelajaran untuk hari ini
              </p>
              <button
                type="button"
                onClick={() => onNavigate('jadwal')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Atur Jadwal</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {todaySchedule.map((item) => {
                const startM = parseTimeToMinutes(item.startTime);
                const endM = parseTimeToMinutes(item.endTime);
                const isOngoing = !weekendNotice && currentMins >= startM && currentMins <= endM;
                const linkedTopic = item.linkedTopicId
                  ? topics.find((tp) => tp.id === item.linkedTopicId)
                  : undefined;
                const subjectTaskCount = pendingTasks.filter(
                  (tk) => tk.subject.toLowerCase() === item.subject.toLowerCase()
                ).length;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                      isOngoing ? 'bg-blue-50/50 dark:bg-blue-950/25' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-24 shrink-0 pt-0.5 font-mono text-xs font-medium tabular-nums text-slate-600 dark:text-slate-400">
                        {item.startTime} – {item.endTime}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.subject}
                          </h3>
                          {isOngoing && (
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                              · Sedang Berlangsung
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <span>{item.teacher}</span>
                          <span aria-hidden="true" className="mx-1.5">·</span>
                          <span>{item.room}</span>
                          {subjectTaskCount > 0 && (
                            <>
                              <span aria-hidden="true" className="mx-1.5">·</span>
                              <span className="font-medium text-amber-700 tabular-nums dark:text-amber-400">
                                {subjectTaskCount} tugas aktif
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:shrink-0">
                      {linkedTopic && (
                        <button
                          type="button"
                          onClick={() => onOpenTopic(linkedTopic.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-700 whitespace-nowrap shrink-0 transition-colors hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                        >
                          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{linkedTopic.shortTitle}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenNewTaskForSubject(item.subject, item.linkedTopicId)}
                        title={`Tambah tugas untuk ${item.subject}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Tugas</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Upcoming Assignments & Weekly Comprehension Snapshot */}
        <div className="space-y-6 lg:col-span-5">
          {/* Task Reminders */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Pengingat Tugas Terdekat
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Centang tugas yang sudah diselesaikan
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('tugas')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span>Semua</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                  Semua tugas telah selesai
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Gunakan waktu luang untuk meninjau rangkuman materi Informatika.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {pendingTasks.slice(0, 4).map((task) => {
                  const deadline = getDeadlineMeta(task.dueDate, false);
                  const urgencyColor =
                    deadline.urgency === 'overdue' || deadline.urgency === 'today'
                      ? 'text-red-700 dark:text-red-400'
                      : deadline.urgency === 'tomorrow' || deadline.urgency === 'soon'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-slate-500 dark:text-slate-400';

                  return (
                    <div key={task.id} className="flex items-start gap-3 px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => onToggleTaskDone(task.id)}
                        aria-label={`Tandai tugas "${task.title}" selesai`}
                        className="mt-0.5 text-slate-400 transition-colors hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400"
                      >
                        <Circle className="h-4.5 w-4.5" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {task.title}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {task.subject}
                          </span>
                          <span aria-hidden="true" className="text-slate-400">·</span>
                          <span className={`inline-flex items-center gap-1 font-medium tabular-nums ${urgencyColor}`}>
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <span>{deadline.label} ({formatIndonesianDate(task.dueDate)})</span>
                          </span>
                          <span aria-hidden="true" className="text-slate-400">·</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            Prioritas {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Periodic Comprehension Snapshot */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                  Tren Pemahaman Berkala
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Perkembangan skor pemahaman per pekan
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('progres')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span>Detail Progres</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {weeklyTrend.length === 0 ? (
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Belum ada log evaluasi berkala. Mulai dengan menyelesaikan kuis atau check-in mandiri.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {weeklyTrend.map((point) => (
                  <div key={point.weekLabel} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {point.weekLabel}
                      </span>
                      <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        {point.avg}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-700 transition-all duration-300 dark:bg-blue-500"
                        style={{ width: `${point.avg}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
