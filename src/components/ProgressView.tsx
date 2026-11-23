import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Download,
  Plus,
  RotateCcw,
  Trash2,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { ProgressLogEntry, StudyTopic } from '../types/study';
import { formatIndonesianDate } from '../utils/dateUtils';

interface ProgressViewProps {
  topics: StudyTopic[];
  progressLogs: ProgressLogEntry[];
  onOpenCheckIn: (preselectedTopicId?: string) => void;
  onDeleteLog: (logId: string) => void;
  onOpenTopic: (topicId: string) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onResetData: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  topics,
  progressLogs,
  onOpenCheckIn,
  onDeleteLog,
  onOpenTopic,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const [selectedChartTopic, setSelectedChartTopic] = useState<string>('ALL');
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const avgScore = useMemo(() => {
    if (topics.length === 0) return 0;
    return Math.round(
      topics.reduce((sum, t) => sum + t.comprehensionScore, 0) / topics.length
    );
  }, [topics]);

  const masteredCount = topics.filter((t) => t.status === 'Sudah Dipelajari').length;

  // Build chart data points ordered chronologically
  const chartPoints = useMemo(() => {
    if (selectedChartTopic === 'ALL') {
      const weekMap = new Map<string, { scores: number[]; latestDate: string }>();
      const sortedLogs = [...progressLogs].sort((a, b) => a.date.localeCompare(b.date));
      sortedLogs.forEach((log) => {
        const current = weekMap.get(log.weekLabel) || {
          scores: [],
          latestDate: log.date,
        };
        current.scores.push(log.understandingScore);
        if (log.date > current.latestDate) current.latestDate = log.date;
        weekMap.set(log.weekLabel, current);
      });
      return Array.from(weekMap.entries()).map(([label, data]) => ({
        label,
        date: data.latestDate,
        score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        count: data.scores.length,
      }));
    }

    return progressLogs
      .filter((l) => l.topicId === selectedChartTopic)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((l) => ({
        label: l.weekLabel,
        date: l.date,
        score: l.understandingScore,
        count: 1,
      }));
  }, [progressLogs, selectedChartTopic]);

  const sortedHistory = useMemo(
    () =>
      [...progressLogs]
        .filter((l) =>
          selectedChartTopic === 'ALL' ? true : l.topicId === selectedChartTopic
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [progressLogs, selectedChartTopic]
  );

  // SVG chart coordinates
  const svgW = 680;
  const svgH = 220;
  const padL = 44;
  const padR = 24;
  const padT = 20;
  const padB = 34;
  const innerW = svgW - padL - padR;
  const innerH = svgH - padT - padB;

  const coords = chartPoints.map((pt, idx) => {
    const x =
      chartPoints.length <= 1
        ? padL + innerW / 2
        : padL + (idx / (chartPoints.length - 1)) * innerW;
    const y = padT + ((100 - pt.score) / 100) * innerH;
    return { ...pt, x, y };
  });

  const linePath =
    coords.length > 0
      ? coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
      : '';

  const areaPath =
    coords.length > 1
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padT + innerH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padT + innerH).toFixed(1)} Z`
      : '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Pelacakan Progres Pemahaman Berkala
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            <span>Rata-rata penguasaan: <strong className="tabular-nums text-slate-900 dark:text-slate-100">{avgScore}%</strong></span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="tabular-nums">{masteredCount} dari {topics.length} materi tuntas</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="tabular-nums">{progressLogs.length} catatan evaluasi</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenCheckIn(selectedChartTopic !== 'ALL' ? selectedChartTopic : undefined)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Catat Check-in Pemahaman</span>
        </button>
      </div>

      {/* Periodic Trend Chart Panel */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Grafik Perkembangan Pemahaman Per Pekan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arahkan kursor atau sentuh titik grafik untuk melihat detail evaluasi
            </p>
          </div>

          <select
            value={selectedChartTopic}
            onChange={(e) => {
              setSelectedChartTopic(e.target.value);
              setHoveredPointIdx(null);
            }}
            aria-label="Filter grafik berdasarkan materi"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="ALL">Semua Materi (Rata-Rata Pekan)</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {String(t.order).padStart(2, '0')}. {t.shortTitle}
              </option>
            ))}
          </select>
        </div>

        {coords.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <TrendingUp className="mx-auto h-7 w-7 text-slate-400" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Belum ada catatan evaluasi untuk pilihan materi ini
            </p>
            <button
              type="button"
              onClick={() =>
                onOpenCheckIn(selectedChartTopic !== 'ALL' ? selectedChartTopic : undefined)
              }
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Catat Check-in Pertama</span>
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <div className="relative w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="h-56 w-full min-w-[460px]"
                role="img"
                aria-label="Grafik tren skor pemahaman materi secara berkala"
              >
                <defs>
                  <linearGradient id="progressAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines (0, 25, 50, 75, 100) */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = padT + ((100 - val) / 100) * innerH;
                  return (
                    <g key={val}>
                      <line
                        x1={padL}
                        x2={svgW - padR}
                        y1={y}
                        y2={y}
                        stroke="currentColor"
                        className="text-slate-200 dark:text-slate-800"
                        strokeDasharray={val === 0 ? undefined : '3 3'}
                        strokeWidth={1}
                      />
                      <text
                        x={padL - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-slate-400 font-mono text-[10px]"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Area & Trend Line */}
                {areaPath && <path d={areaPath} fill="url(#progressAreaGrad)" />}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#1D4ED8"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points & X-axis labels */}
                {coords.map((pt, idx) => {
                  const isHovered = hoveredPointIdx === idx;
                  return (
                    <g key={`${pt.label}-${idx}`}>
                      <text
                        x={pt.x}
                        y={svgH - 10}
                        textAnchor="middle"
                        className="fill-slate-500 text-[11px] font-medium dark:fill-slate-400"
                      >
                        {pt.label}
                      </text>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6.5 : 4.5}
                        fill="#1D4ED8"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredPointIdx(idx)}
                        onMouseLeave={() => setHoveredPointIdx(null)}
                        onClick={() => setHoveredPointIdx(idx)}
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 11}
                        textAnchor="middle"
                        className="fill-slate-800 font-mono text-[11px] font-semibold dark:fill-slate-200"
                      >
                        {pt.score}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {hoveredPointIdx !== null && coords[hoveredPointIdx] && (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {coords[hoveredPointIdx].label}
                </span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span className="font-mono font-semibold tabular-nums text-blue-700 dark:text-blue-400">
                  Skor {coords[hoveredPointIdx].score}%
                </span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Evaluasi terakhir {formatIndonesianDate(coords[hoveredPointIdx].date)}</span>
              </p>
            )}
          </div>
        )}
      </section>

      {/* Topic-by-Topic Mastery Table */}
      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            Penguasaan Tiap Materi Informatika
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pantau materi yang sudah tuntas maupun yang masih perlu diulang
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="px-6 py-3">Materi</th>
                <th className="px-4 py-3">Status Belajar</th>
                <th className="px-4 py-3">Terakhir Ditinjau</th>
                <th className="px-4 py-3 text-right">Pemahaman</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {topics.map((topic) => (
                <tr
                  key={topic.id}
                  className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                >
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {String(topic.order).padStart(2, '0')}. {topic.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {topic.category} · Checklist {topic.checkedChecklistIndices.length}/{topic.checklist.length}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-medium">
                    <span
                      className={
                        topic.status === 'Sudah Dipelajari'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : topic.status === 'Sedang Dipelajari'
                            ? 'text-blue-700 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400'
                      }
                    >
                      {topic.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-slate-600 dark:text-slate-400">
                    {topic.lastReviewedAt ? formatIndonesianDate(topic.lastReviewedAt) : 'Belum ditinjau'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center justify-end gap-2.5">
                      <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 sm:block dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            topic.comprehensionScore >= 80
                              ? 'bg-emerald-600'
                              : topic.comprehensionScore >= 60
                                ? 'bg-blue-700'
                                : 'bg-amber-600'
                          }`}
                          style={{ width: `${topic.comprehensionScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100">
                        {topic.comprehensionScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenTopic(topic.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 whitespace-nowrap hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Tinjau</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCheckIn(topic.id)}
                        className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-950"
                      >
                        Check-in
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Check-In & Quiz History */}
      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Riwayat Evaluasi Berkala
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Catatan hasil kuis dan refleksi check-in pemahaman dari waktu ke waktu
            </p>
          </div>
          <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {sortedHistory.length} entri
          </span>
        </div>

        {sortedHistory.length === 0 ? (
          <p className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            Belum ada riwayat evaluasi untuk materi ini.
          </p>
        ) : (
          <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
            {sortedHistory.map((log) => (
              <div
                key={log.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {log.weekLabel}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {formatIndonesianDate(log.date)}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="font-medium text-blue-700 dark:text-blue-400">
                      {log.source}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="tabular-nums text-slate-600 dark:text-slate-300">
                      Kepercayaan diri {log.selfRating}/5
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {log.topicTitle}
                  </p>
                  {log.reflectionNote && (
                    <p className="max-w-[70ch] text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {log.reflectionNote}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 sm:shrink-0">
                  <span className="font-mono text-base font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {log.understandingScore}%
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteLog(log.id)}
                    aria-label={`Hapus catatan ${log.topicTitle}`}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Local Data Portability & Reset */}
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
            Cadangkan & Kelola Data Belajar
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Seluruh jadwal, tugas, catatan materi, dan progres tersimpan otomatis di peramban ini. Unduh cadangan JSON jika ingin memindahkan ke perangkat lain.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onExportData}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Ekspor JSON</span>
          </button>

          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Impor JSON</span>
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImportData(file);
                  e.target.value = '';
                }
              }}
            />
          </label>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 dark:border-red-900/70 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Awal</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setConfirmReset(false);
                }}
                className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800"
              >
                Ya, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
