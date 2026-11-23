import React, { useState } from 'react';
import { BookOpen, Edit3, Plus, Trash2 } from 'lucide-react';
import { DayOfWeek, ScheduleItem, StudyTopic, TaskItem } from '../types/study';
import { DAYS_OF_WEEK, getTodayDayOfWeek } from '../utils/dateUtils';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  topics: StudyTopic[];
  tasks: TaskItem[];
  onAddSchedule: () => void;
  onEditSchedule: (item: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  onOpenTopic: (topicId: string) => void;
  onAddTaskForSubject: (subject: string, linkedTopicId?: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  topics,
  tasks,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onOpenTopic,
  onAddTaskForSubject,
}) => {
  const [viewMode, setViewMode] = useState<'harian' | 'pekan'>('harian');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayDayOfWeek());

  const pendingTasks = tasks.filter((t) => t.status !== 'Selesai');

  const dayItems = schedule
    .filter((item) => item.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Jadwal Pelajaran SMP Global Mandiri
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Atur jadwal mingguan dan akses langsung materi atau tugas tiap mata pelajaran.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Mode Switch */}
          <div
            role="group"
            aria-label="Mode tampilan jadwal"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80"
          >
            <button
              type="button"
              onClick={() => setViewMode('harian')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                viewMode === 'harian'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Per Hari
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pekan')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                viewMode === 'pekan'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Semua Pekan
            </button>
          </div>

          <button
            type="button"
            onClick={onAddSchedule}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Tambah Pelajaran</span>
          </button>
        </div>
      </div>

      {viewMode === 'harian' ? (
        <div className="space-y-4">
          {/* Day Picker Tabs */}
          <div
            role="tablist"
            aria-label="Pilih hari"
            className="flex items-center gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80"
          >
            {DAYS_OF_WEEK.map((day) => {
              const count = schedule.filter((s) => s.day === day).length;
              const active = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 rounded-md px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  <span>{day}</span>
                  <span className="ml-1.5 font-mono text-[11px] font-normal tabular-nums text-slate-400">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Daily Timetable List */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {dayItems.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Belum ada pelajaran pada hari {selectedDay}.
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Tambahkan jadwal pelajaran agar pengingat tugas dan materi tetap terorganisir.
                </p>
                <button
                  type="button"
                  onClick={onAddSchedule}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Tambah Pelajaran</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {dayItems.map((item, idx) => {
                  const linkedTopic = item.linkedTopicId
                    ? topics.find((t) => t.id === item.linkedTopicId)
                    : undefined;
                  const subjectTasks = pendingTasks.filter(
                    (t) => t.subject.toLowerCase() === item.subject.toLowerCase()
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 pt-0.5 font-mono text-xs font-semibold tabular-nums text-slate-400">
                          {String(idx + 1).padStart(2, '0')}.
                        </div>
                        <div className="w-28 shrink-0 pt-0.5 font-mono text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                          {item.startTime} – {item.endTime}
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {item.subject}
                          </h2>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            <span>{item.teacher}</span>
                            <span aria-hidden="true" className="mx-1.5">·</span>
                            <span>{item.room}</span>
                            {subjectTasks.length > 0 && (
                              <>
                                <span aria-hidden="true" className="mx-1.5">·</span>
                                <span className="font-medium text-amber-700 tabular-nums dark:text-amber-400">
                                  {subjectTasks.length} tugas belum selesai
                                </span>
                              </>
                            )}
                          </p>
                          {linkedTopic && (
                            <p className="mt-1.5 text-xs text-blue-700 dark:text-blue-400">
                              Materi terhubung: {linkedTopic.title} ({linkedTopic.comprehensionScore}% dipahami)
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                        {linkedTopic && (
                          <button
                            type="button"
                            onClick={() => onOpenTopic(linkedTopic.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-700 whitespace-nowrap shrink-0 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                          >
                            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Buka Materi</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onAddTaskForSubject(item.subject, item.linkedTopicId)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Tugas</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditSchedule(item)}
                          aria-label={`Ubah jadwal ${item.subject}`}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSchedule(item.id)}
                          aria-label={`Hapus jadwal ${item.subject}`}
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
      ) : (
        /* Weekly 5-Column Overview Grid */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {DAYS_OF_WEEK.map((day) => {
            const items = schedule
              .filter((s) => s.day === day)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day}
                className="flex flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                  <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                    {day}
                  </h2>
                  <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {items.length} sesi
                  </span>
                </div>

                <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                  {items.length === 0 ? (
                    <p className="p-4 text-xs text-slate-500 dark:text-slate-400">
                      Kosong
                    </p>
                  ) : (
                    items.map((item) => {
                      const linkedTopic = item.linkedTopicId
                        ? topics.find((t) => t.id === item.linkedTopicId)
                        : undefined;
                      return (
                        <div key={item.id} className="space-y-1.5 p-3.5">
                          <p className="font-mono text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
                            {item.startTime}–{item.endTime} · {item.room}
                          </p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.subject}
                          </p>
                          <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                            {item.teacher}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            {linkedTopic && (
                              <button
                                type="button"
                                onClick={() => onOpenTopic(linkedTopic.id)}
                                className="text-xs font-medium text-blue-700 hover:underline dark:text-blue-400"
                              >
                                Materi: {linkedTopic.shortTitle}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onEditSchedule(item)}
                              className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                            >
                              Ubah
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
