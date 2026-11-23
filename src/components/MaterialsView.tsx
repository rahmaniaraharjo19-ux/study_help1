import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  Plus,
  RotateCcw,
  Save,
  TrendingUp,
} from 'lucide-react';
import { StudyTopic, TaskItem, TopicStatus } from '../types/study';
import { formatIndonesianDate } from '../utils/dateUtils';
import { ComputerSystemSimulator, GitHubVercelSimulator } from './TopicSimulators';

interface MaterialsViewProps {
  topics: StudyTopic[];
  tasks: TaskItem[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onUpdateTopicStatus: (topicId: string, status: TopicStatus) => void;
  onToggleChecklist: (topicId: string, checklistIndex: number) => void;
  onSaveNotes: (topicId: string, notes: string) => void;
  onRecordQuizResult: (topicId: string, score: number) => void;
  onOpenPeriodicCheckIn: (topicId: string) => void;
  onOpenNewTopic: () => void;
}

type MaterialSubTab = 'ringkasan' | 'catatan' | 'kuis';
type TopicFilter = 'Semua' | TopicStatus;

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  topics,
  tasks,
  selectedTopicId,
  onSelectTopic,
  onUpdateTopicStatus,
  onToggleChecklist,
  onSaveNotes,
  onRecordQuizResult,
  onOpenPeriodicCheckIn,
  onOpenNewTopic,
}) => {
  const [filter, setFilter] = useState<TopicFilter>('Semua');
  const [subTab, setSubTab] = useState<MaterialSubTab>('ringkasan');

  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  const [notesDraft, setNotesDraft] = useState(activeTopic?.studentNotes || '');
  const [notesSavedMsg, setNotesSavedMsg] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizLogged, setQuizLogged] = useState(false);

  useEffect(() => {
    if (activeTopic) {
      setNotesDraft(activeTopic.studentNotes);
      setNotesSavedMsg(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizLogged(false);
    }
  }, [activeTopic?.id]);

  const filteredTopics = topics.filter((t) =>
    filter === 'Semua' ? true : t.status === filter
  );

  const handleSaveNotes = () => {
    if (!activeTopic) return;
    onSaveNotes(activeTopic.id, notesDraft);
    setNotesSavedMsg(true);
    setTimeout(() => setNotesSavedMsg(false), 2500);
  };

  const relatedTasks = activeTopic
    ? tasks.filter((tk) => tk.linkedTopicId === activeTopic.id)
    : [];

  const quizQuestions = activeTopic?.quiz || [];
  const allAnswered =
    quizQuestions.length > 0 &&
    quizQuestions.every((q) => quizAnswers[q.id] !== undefined);
  const correctCount = quizQuestions.filter(
    (q) => quizAnswers[q.id] === q.correctIndex
  ).length;
  const computedQuizScore =
    quizQuestions.length > 0
      ? Math.round((correctCount / quizQuestions.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Rangkuman Materi & Latihan Pemahaman
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Pelajari inti materi Informatika, simpan catatan pribadimu, dan uji pemahaman lewat kuis singkat.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewTopic}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Tambah Materi Sendiri</span>
        </button>
      </div>

      {/* Two-Zone Educational Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Navigation Rail: Topic List */}
        <aside className="space-y-3 lg:col-span-4">
          <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80">
            {(['Semua', 'Belum Dipelajari', 'Sedang Dipelajari', 'Sudah Dipelajari'] as TopicFilter[]).map(
              (f) => {
                const label =
                  f === 'Semua'
                    ? 'Semua'
                    : f === 'Belum Dipelajari'
                      ? 'Belum'
                      : f === 'Sedang Dipelajari'
                        ? 'Sedang'
                        : 'Selesai';
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      filter === f
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>

          <div className="divide-y divide-slate-200/80 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {filteredTopics.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Tidak ada materi pada filter ini.
              </p>
            ) : (
              filteredTopics.map((topic) => {
                const isSelected = activeTopic?.id === topic.id;
                const statusColor =
                  topic.status === 'Sudah Dipelajari'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : topic.status === 'Sedang Dipelajari'
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400';

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => onSelectTopic(topic.id)}
                    className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/35'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="pt-0.5 font-mono text-xs font-semibold tabular-nums text-slate-400">
                      {String(topic.order).padStart(2, '0')}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          isSelected
                            ? 'text-blue-800 dark:text-blue-300'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {topic.title}
                      </p>
                      <p className="mt-1 text-xs">
                        <span className={`font-medium ${statusColor}`}>{topic.status}</span>
                        <span aria-hidden="true" className="mx-1.5 text-slate-400">·</span>
                        <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          {topic.comprehensionScore}%
                        </span>
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Main Stage: Active Study Topic */}
        {activeTopic && (
          <div className="space-y-6 lg:col-span-8">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              {/* Topic Header */}
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>Modul {String(activeTopic.order).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="mx-2">·</span>
                    <span>{activeTopic.category}</span>
                    <span aria-hidden="true" className="mx-2">·</span>
                    <span className="tabular-nums">Estimasi {activeTopic.estimatedMinutes} menit</span>
                    {activeTopic.lastReviewedAt && (
                      <>
                        <span aria-hidden="true" className="mx-2">·</span>
                        <span>Terakhir ditinjau {formatIndonesianDate(activeTopic.lastReviewedAt)}</span>
                      </>
                    )}
                  </p>

                  <span className="font-mono text-sm font-bold tabular-nums text-blue-700 dark:text-blue-400">
                    Pemahaman: {activeTopic.comprehensionScore}%
                  </span>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1.5">
                    <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl text-balance dark:text-slate-50">
                      {activeTopic.title}
                    </h2>
                    <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {activeTopic.overview}
                    </p>
                  </div>
                </div>

                {/* Status & Sub-Tab Controls */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setSubTab('ringkasan')}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        subTab === 'ringkasan'
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }`}
                    >
                      Ringkasan & Konsep
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubTab('catatan')}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        subTab === 'catatan'
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }`}
                    >
                      Catatan Saya & Checklist
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubTab('kuis')}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        subTab === 'kuis'
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                      }`}
                    >
                      Kuis Pemahaman ({quizQuestions.length})
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={activeTopic.status}
                      onChange={(e) =>
                        onUpdateTopicStatus(activeTopic.id, e.target.value as TopicStatus)
                      }
                      aria-label="Status belajar materi"
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      <option value="Belum Dipelajari">Belum Dipelajari</option>
                      <option value="Sedang Dipelajari">Sedang Dipelajari</option>
                      <option value="Sudah Dipelajari">Sudah Dipelajari</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onOpenPeriodicCheckIn(activeTopic.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 whitespace-nowrap shrink-0 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-950"
                    >
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Catat Progres</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-tab 1: Summary & Key Concepts */}
              {subTab === 'ringkasan' && (
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                      Poin Inti Materi
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {activeTopic.summaryPoints.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                        >
                          <span className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-blue-700 dark:text-blue-400">
                            {String(i + 1).padStart(2, '0')}.
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Concept Explorers for IPO and GitHub/Vercel */}
                  {activeTopic.id === 'computer-system' && <ComputerSystemSimulator />}
                  {activeTopic.id === 'github-vercel' && <GitHubVercelSimulator />}

                  {activeTopic.keyConcepts.length > 0 && (
                    <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                      <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                        Konsep Kunci & Contoh Penerapan
                      </h3>
                      <div className="mt-4 divide-y divide-slate-200/80 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                        {activeTopic.keyConcepts.map((kc) => (
                          <div key={kc.id} className="p-4 sm:p-5">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {kc.title}
                            </h4>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                              {kc.detail}
                            </p>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                Contoh nyata:{' '}
                              </span>
                              {kc.example}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedTasks.length > 0 && (
                    <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
                      <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Tugas Terkait Materi Ini
                      </h3>
                      <div className="mt-2.5 divide-y divide-slate-200/80 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                        {relatedTasks.map((tk) => (
                          <div
                            key={tk.id}
                            className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {tk.title}
                            </span>
                            <span className="shrink-0 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                              {tk.status} · {formatIndonesianDate(tk.dueDate)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Student Personal Notes & Comprehension Checklist */}
              {subTab === 'catatan' && (
                <div className="mt-6 space-y-6">
                  {/* Checklist */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                        Checklist Pemahaman Konsep
                      </h3>
                      <span className="font-mono text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-400">
                        {activeTopic.checkedChecklistIndices.length} / {activeTopic.checklist.length} dikuasai
                      </span>
                    </div>

                    <div className="mt-3 divide-y divide-slate-200/80 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                      {activeTopic.checklist.map((item, idx) => {
                        const checked = activeTopic.checkedChecklistIndices.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onToggleChecklist(activeTopic.id, idx)}
                            className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <span
                              className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${
                                checked
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
                              }`}
                            >
                              {checked && <Check className="h-3 w-3" aria-hidden="true" />}
                            </span>
                            <span
                              className={`text-sm ${
                                checked
                                  ? 'text-slate-900 font-medium dark:text-slate-100'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal Student Summary Notes */}
                  <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                          <Edit3 className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                          <span>Rangkuman Pribadi Saya</span>
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          Tulis catatan dengan bahasamu sendiri agar mudah diingat saat ulangan
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        <Save className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Simpan Catatan</span>
                      </button>
                    </div>

                    <textarea
                      rows={6}
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder="Tulis rangkuman materi, hal yang masih membingungkan, atau contoh soal penting di sini..."
                      className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
                    />

                    {notesSavedMsg && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Rangkuman pribadi berhasil disimpan.</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Mini Comprehension Quiz */}
              {subTab === 'kuis' && (
                <div className="mt-6 space-y-6">
                  {quizQuestions.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Materi tambahan ini belum memiliki soal kuis.
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Gunakan tombol "Catat Progres" untuk mencatat pemahamanmu secara mandiri.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                            Uji Pemahaman Singkat
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Jawab seluruh pertanyaan lalu simpan hasilnya ke pelacakan progres berkala
                          </p>
                        </div>

                        {quizSubmitted && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                              setQuizLogged(false);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Ulangi Kuis</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-5">
                        {quizQuestions.map((q, qIdx) => {
                          const chosen = quizAnswers[q.id];
                          return (
                            <div
                              key={q.id}
                              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50"
                            >
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {qIdx + 1}. {q.question}
                              </p>

                              <div className="mt-3 space-y-2">
                                {q.options.map((opt, oIdx) => {
                                  const isPicked = chosen === oIdx;
                                  const isRight = q.correctIndex === oIdx;

                                  let optionStyle =
                                    'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';
                                  if (!quizSubmitted && isPicked) {
                                    optionStyle =
                                      'border-blue-700 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-200';
                                  } else if (quizSubmitted && isRight) {
                                    optionStyle =
                                      'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200';
                                  } else if (quizSubmitted && isPicked && !isRight) {
                                    optionStyle =
                                      'border-red-600 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-950/50 dark:text-red-200';
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      disabled={quizSubmitted}
                                      onClick={() =>
                                        setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                                      }
                                      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-xs sm:text-sm transition-colors ${optionStyle}`}
                                    >
                                      <span>{opt}</span>
                                      {quizSubmitted && isRight && (
                                        <span className="shrink-0 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                          Benar
                                        </span>
                                      )}
                                      {quizSubmitted && isPicked && !isRight && (
                                        <span className="shrink-0 text-xs font-semibold text-red-700 dark:text-red-400">
                                          Kurang tepat
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {quizSubmitted && (
                                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                                    Penjelasan:{' '}
                                  </span>
                                  {q.explanation}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {!quizSubmitted ? (
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            disabled={!allAnswered}
                            onClick={() => setQuizSubmitted(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                          >
                            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                            <span>Periksa Jawaban</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950">
                          <div>
                            <p className="font-display text-base font-bold tabular-nums text-slate-900 dark:text-slate-100">
                              Skor Kuis: {computedQuizScore}% ({correctCount} dari {quizQuestions.length} benar)
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Simpan skor ini agar riwayat pemahaman berkala kamu otomatis diperbarui.
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={quizLogged}
                            onClick={() => {
                              onRecordQuizResult(activeTopic.id, computedQuizScore);
                              setQuizLogged(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-emerald-800 disabled:cursor-default disabled:bg-emerald-600/80 dark:bg-emerald-600"
                          >
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            <span>
                              {quizLogged
                                ? 'Tersimpan di Progres Berkala'
                                : 'Simpan ke Progres Berkala'}
                            </span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
