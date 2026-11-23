import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Edit3,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { StudyTopic, TaskItem, TaskStatus } from '../types/study';
import { formatIndonesianDate, getDeadlineMeta } from '../utils/dateUtils';

interface TasksViewProps {
  tasks: TaskItem[];
  topics: StudyTopic[];
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
  onOpenTopic: (topicId: string) => void;
}

type StatusFilter = 'Aktif' | 'Semua' | TaskStatus;

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  topics,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onChangeStatus,
  onOpenTopic,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Aktif');
  const [subjectFilter, setSubjectFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(tasks.map((t) => t.subject))).sort();
    return ['Semua', ...unique];
  }, [tasks]);

  const counts = useMemo(() => {
    const active = tasks.filter((t) => t.status !== 'Selesai').length;
    const done = tasks.filter((t) => t.status === 'Selesai').length;
    const urgent = tasks.filter(
      (t) => t.status !== 'Selesai' && getDeadlineMeta(t.dueDate, false).daysDiff <= 1
    ).length;
    return { active, done, urgent, total: tasks.length };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (statusFilter === 'Aktif' && t.status === 'Selesai') return false;
        if (
          statusFilter !== 'Aktif' &&
          statusFilter !== 'Semua' &&
          t.status !== statusFilter
        ) {
          return false;
        }
        if (subjectFilter !== 'Semua' && t.subject !== subjectFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            t.title.toLowerCase().includes(q) ||
            t.subject.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.status === 'Selesai' && b.status !== 'Selesai') return 1;
        if (a.status !== 'Selesai' && b.status === 'Selesai') return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks, statusFilter, subjectFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Pengingat Tugas Sekolah
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            <span>{counts.active} tugas aktif</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="tabular-nums">{counts.urgent} mendekati tenggat</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="tabular-nums">{counts.done} selesai</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        {/* Status Segmented Tabs */}
        <div
          role="group"
          aria-label="Filter status tugas"
          className="flex items-center gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80"
        >
          {(['Aktif', 'Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai', 'Semua'] as StatusFilter[]).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  statusFilter === tab
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:w-56">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau mapel..."
              aria-label="Cari tugas"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            aria-label="Filter mata pelajaran"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj === 'Semua' ? 'Semua Mapel' : subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {filteredTasks.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              Tidak ada tugas yang cocok dengan filter saat ini
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Coba ubah filter status atau tambahkan pengingat tugas baru.
            </p>
            <button
              type="button"
              onClick={onAddTask}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'Selesai';
              const deadline = getDeadlineMeta(task.dueDate, isDone);
              const linkedTopic = task.linkedTopicId
                ? topics.find((t) => t.id === task.linkedTopicId)
                : undefined;

              const deadlineTone =
                deadline.urgency === 'overdue'
                  ? 'text-red-700 dark:text-red-400'
                  : deadline.urgency === 'today'
                    ? 'text-red-700 dark:text-red-400'
                    : deadline.urgency === 'tomorrow' || deadline.urgency === 'soon'
                      ? 'text-amber-700 dark:text-amber-400'
                      : deadline.urgency === 'done'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-slate-400';

              return (
                <div
                  key={task.id}
                  className={`flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-start sm:justify-between ${
                    isDone ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        onChangeStatus(task.id, isDone ? 'Belum Dikerjakan' : 'Selesai')
                      }
                      aria-label={
                        isDone
                          ? `Buka kembali tugas "${task.title}"`
                          : `Tandai tugas "${task.title}" selesai`
                      }
                      className={`mt-0.5 shrink-0 transition-colors ${
                        isDone
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 hover:text-blue-700 dark:text-slate-500 dark:hover:text-blue-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1.5">
                      <h2
                        className={`text-sm font-semibold sm:text-base ${
                          isDone
                            ? 'line-through text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {task.subject}
                        </span>
                        <span aria-hidden="true" className="text-slate-400">·</span>
                        <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${deadlineTone}`}>
                          {deadline.urgency === 'overdue' || deadline.urgency === 'today' ? (
                            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          <span>
                            {deadline.label} · {formatIndonesianDate(task.dueDate)}
                            {task.dueTime ? ` (${task.dueTime})` : ''}
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-slate-400">·</span>
                        <span
                          className={`font-medium ${
                            task.priority === 'Tinggi'
                              ? 'text-red-700 dark:text-red-400'
                              : task.priority === 'Sedang'
                                ? 'text-amber-700 dark:text-amber-400'
                                : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Prioritas {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="max-w-[70ch] text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {task.description}
                        </p>
                      )}

                      {linkedTopic && (
                        <button
                          type="button"
                          onClick={() => onOpenTopic(linkedTopic.id)}
                          className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-blue-700 hover:underline dark:text-blue-400"
                        >
                          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Lihat rangkuman: {linkedTopic.title}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Action Controls */}
                  <div className="flex items-center gap-2 pl-8 sm:pl-0 sm:shrink-0">
                    <select
                      value={task.status}
                      onChange={(e) => onChangeStatus(task.id, e.target.value as TaskStatus)}
                      aria-label={`Ubah status tugas ${task.title}`}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                      <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                      <option value="Selesai">Selesai</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      aria-label={`Edit tugas ${task.title}`}
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      aria-label={`Hapus tugas ${task.title}`}
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
