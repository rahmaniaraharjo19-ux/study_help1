import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  DayOfWeek,
  ScheduleItem,
  StudentProfile,
  StudyTopic,
  TaskItem,
  TaskPriority,
  TaskStatus,
} from '../types/study';
import { DAYS_OF_WEEK, toLocalIsoDate } from '../utils/dateUtils';

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

/* ---------------- Task Modal ---------------- */
interface TaskModalProps {
  initialTask?: TaskItem | null;
  defaultSubject?: string;
  defaultTopicId?: string;
  subjects: string[];
  topics: StudyTopic[];
  onSave: (data: Omit<TaskItem, 'id' | 'createdAt'>, existingId?: string) => void;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  initialTask,
  defaultSubject,
  defaultTopicId,
  subjects,
  topics,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [subject, setSubject] = useState(
    initialTask?.subject || defaultSubject || subjects[0] || 'Informatika'
  );
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate || toLocalIsoDate(new Date())
  );
  const [dueTime, setDueTime] = useState(initialTask?.dueTime || '20:00');
  const [priority, setPriority] = useState<TaskPriority>(
    initialTask?.priority || 'Sedang'
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialTask?.status || 'Belum Dikerjakan'
  );
  const [linkedTopicId, setLinkedTopicId] = useState(
    initialTask?.linkedTopicId || defaultTopicId || ''
  );
  const [description, setDescription] = useState(initialTask?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    onSave(
      {
        title: title.trim(),
        subject: subject.trim() || 'Informatika',
        dueDate,
        dueTime: dueTime || undefined,
        priority,
        status,
        description: description.trim(),
        linkedTopicId: linkedTopicId || undefined,
      },
      initialTask?.id
    );
  };

  return (
    <ModalShell
      title={initialTask ? 'Ubah Tugas Sekolah' : 'Tambah Tugas Sekolah'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Judul Tugas
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Latihan Soal IPO & Diagram CPU"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mata Pelajaran
            </label>
            <input
              type="text"
              list="gm-subjects-list"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <datalist id="gm-subjects-list">
              {subjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Prioritas
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tanggal Tenggat
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Jam Pengumpulan
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="Belum Dikerjakan">Belum Dikerjakan</option>
              <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Hubungkan ke Materi (Opsional)
            </label>
            <select
              value={linkedTopicId}
              onChange={(e) => setLinkedTopicId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">Tidak ada</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.shortTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Catatan / Detail Tugas
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Instruksi guru, halaman buku, atau link referensi..."
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {initialTask ? 'Simpan Perubahan' : 'Simpan Tugas'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/* ---------------- Schedule Modal ---------------- */
interface ScheduleModalProps {
  initialItem?: ScheduleItem | null;
  topics: StudyTopic[];
  onSave: (data: Omit<ScheduleItem, 'id'>, existingId?: string) => void;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  initialItem,
  topics,
  onSave,
  onClose,
}) => {
  const [day, setDay] = useState<DayOfWeek>(initialItem?.day || 'Senin');
  const [startTime, setStartTime] = useState(initialItem?.startTime || '07:30');
  const [endTime, setEndTime] = useState(initialItem?.endTime || '08:50');
  const [subject, setSubject] = useState(initialItem?.subject || '');
  const [teacher, setTeacher] = useState(initialItem?.teacher || '');
  const [room, setRoom] = useState(initialItem?.room || 'Ruang 8B');
  const [linkedTopicId, setLinkedTopicId] = useState(initialItem?.linkedTopicId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    onSave(
      {
        day,
        startTime,
        endTime,
        subject: subject.trim(),
        teacher: teacher.trim() || 'Guru Mata Pelajaran',
        room: room.trim() || 'Ruang Kelas',
        linkedTopicId: linkedTopicId || undefined,
      },
      initialItem?.id
    );
  };

  return (
    <ModalShell
      title={initialItem ? 'Ubah Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Hari
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as DayOfWeek)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Jam Mulai
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Jam Selesai
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Mata Pelajaran
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Contoh: Informatika, Matematika, IPA..."
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Guru Pengampu
            </label>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Contoh: Pak Ardiansyah, S.Kom."
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ruang Kelas / Lab
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Contoh: Lab Komputer 1"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tautkan Materi Belajar (Opsional)
          </label>
          <select
            value={linkedTopicId}
            onChange={(e) => setLinkedTopicId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="">Tidak dihubungkan</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {String(t.order).padStart(2, '0')}. {t.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {initialItem ? 'Simpan Jadwal' : 'Tambah ke Jadwal'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/* ---------------- Periodic Check-in Modal ---------------- */
interface CheckInModalProps {
  topics: StudyTopic[];
  defaultTopicId?: string;
  onSave: (entry: {
    topicId: string;
    weekLabel: string;
    date: string;
    understandingScore: number;
    selfRating: number;
    reflectionNote: string;
  }) => void;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  topics,
  defaultTopicId,
  onSave,
  onClose,
}) => {
  const initialTopic =
    topics.find((t) => t.id === defaultTopicId) || topics[0];

  const [topicId, setTopicId] = useState(initialTopic?.id || '');
  const [weekLabel, setWeekLabel] = useState('Pekan 5');
  const [date, setDate] = useState(toLocalIsoDate(new Date()));
  const [understandingScore, setUnderstandingScore] = useState(
    initialTopic?.comprehensionScore ?? 75
  );
  const [selfRating, setSelfRating] = useState(4);
  const [reflectionNote, setReflectionNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId) return;
    onSave({
      topicId,
      weekLabel: weekLabel.trim() || 'Pekan Baru',
      date,
      understandingScore,
      selfRating,
      reflectionNote: reflectionNote.trim(),
    });
  };

  return (
    <ModalShell title="Catat Check-in Pemahaman Berkala" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Materi yang Dievaluasi
          </label>
          <select
            value={topicId}
            onChange={(e) => {
              const id = e.target.value;
              setTopicId(id);
              const found = topics.find((t) => t.id === id);
              if (found) setUnderstandingScore(found.comprehensionScore);
            }}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {String(t.order).padStart(2, '0')}. {t.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Label Periode / Pekan
            </label>
            <input
              type="text"
              required
              value={weekLabel}
              onChange={(e) => setWeekLabel(e.target.value)}
              placeholder="Contoh: Pekan 5"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tanggal Evaluasi
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="understanding-slider"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Tingkat Pemahaman Materi
            </label>
            <span className="font-mono text-sm font-bold tabular-nums text-blue-700 dark:text-blue-400">
              {understandingScore}%
            </span>
          </div>
          <input
            id="understanding-slider"
            type="range"
            min={0}
            max={100}
            step={5}
            value={understandingScore}
            onChange={(e) => setUnderstandingScore(Number(e.target.value))}
            className="mt-2 w-full accent-blue-700"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>0% (Baru mulai)</span>
            <span>50% (Cukup paham)</span>
            <span>100% (Sangat menguasai)</span>
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Rasa Percaya Diri Saat Ini (Skala 1–5)
          </span>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setSelfRating(rating)}
                className={`rounded-lg border py-2 font-mono text-xs font-bold transition-colors ${
                  selfRating === rating
                    ? 'border-blue-700 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {rating} / 5
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Catatan Refleksi & Target Belajar Berikutnya
          </label>
          <textarea
            rows={3}
            value={reflectionNote}
            onChange={(e) => setReflectionNote(e.target.value)}
            placeholder="Apa yang sudah dipahami dengan baik dan bagian mana yang perlu diulang?"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Simpan Evaluasi
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/* ---------------- Custom Topic Modal ---------------- */
interface CustomTopicModalProps {
  onSave: (data: {
    title: string;
    category: string;
    overview: string;
    summaryPoints: string[];
  }) => void;
  onClose: () => void;
}

export const CustomTopicModal: React.FC<CustomTopicModalProps> = ({
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Catatan Tambahan');
  const [overview, setOverview] = useState('');
  const [pointsText, setPointsText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const summaryPoints = pointsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({
      title: title.trim(),
      category: category.trim() || 'Catatan Tambahan',
      overview: overview.trim() || 'Ringkasan materi belajar siswa.',
      summaryPoints:
        summaryPoints.length > 0
          ? summaryPoints
          : ['Catat poin-poin utama materi pada tab Catatan Saya.'],
    });
  };

  return (
    <ModalShell title="Tambah Rangkuman Materi Baru" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Judul Materi
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Algoritma & Flowchart Dasar"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Kategori / Mata Pelajaran
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Deskripsi Singkat
          </label>
          <input
            type="text"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Tujuan belajar topik ini..."
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Poin-Poin Ringkasan (satu poin per baris)
          </label>
          <textarea
            rows={4}
            value={pointsText}
            onChange={(e) => setPointsText(e.target.value)}
            placeholder={"Poin pertama...\nPoin kedua...\nPoin ketiga..."}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Tambahkan Materi
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/* ---------------- Profile Modal ---------------- */
interface ProfileModalProps {
  profile: StudentProfile;
  onSave: (profile: StudentProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [grade, setGrade] = useState(profile.grade);
  const [school, setSchool] = useState(profile.school);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || 'Siswa Global Mandiri',
      grade: grade.trim() || 'Kelas 8',
      school: school.trim() || 'SMP Global Mandiri',
    });
  };

  return (
    <ModalShell title="Ubah Profil Siswa" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Nama Lengkap / Panggilan
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Kelas
          </label>
          <input
            type="text"
            required
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Contoh: Kelas 8B"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Sekolah
          </label>
          <input
            type="text"
            required
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Simpan Profil
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
