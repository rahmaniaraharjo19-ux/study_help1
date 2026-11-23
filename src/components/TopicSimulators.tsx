import React, { useState } from 'react';
import { ArrowRight, Cpu, GitBranch, Globe, HardDrive, Keyboard, Monitor, RotateCcw } from 'lucide-react';

const IPO_DIAGRAM_SRC = '/src/assets/images/informatics_ipo_diagram_1795407812910.jpg';

interface Scenario {
  id: string;
  label: string;
  steps: {
    stage: 'Input' | 'Process' | 'Output' | 'Storage';
    device: string;
    detail: string;
  }[];
}

const IPO_SCENARIOS: Scenario[] = [
  {
    id: 'absensi',
    label: 'Scan Kartu Pelajar di Sekolah',
    steps: [
      {
        stage: 'Input',
        device: 'Barcode / RFID Scanner',
        detail: 'Memindai ID siswa dari kartu pelajar menjadi sinyal data digital.',
      },
      {
        stage: 'Process',
        device: 'CPU (CU & ALU) + RAM',
        detail: 'Mencocokkan ID siswa dengan daftar kelas di memori kerja dan mencatat waktu hadir.',
      },
      {
        stage: 'Output',
        device: 'Monitor & Buzzer',
        detail: 'Menampilkan nama siswa dan status "Hadir Tepat Waktu" beserta bunyi konfirmasi.',
      },
      {
        stage: 'Storage',
        device: 'SSD Server Sekolah',
        detail: 'Menyimpan rekap kehadiran secara permanen agar tetap aman saat komputer dimatikan.',
      },
    ],
  },
  {
    id: 'dokumen',
    label: 'Mengetik Rangkuman Tugas',
    steps: [
      {
        stage: 'Input',
        device: 'Keyboard & Mouse',
        detail: 'Mengubah ketukan tombol huruf dan klik menu menjadi kode karakter biner.',
      },
      {
        stage: 'Process',
        device: 'CPU + RAM',
        detail: 'Mengolah tata letak paragraf, memeriksa ejaan, dan menahan dokumen sementara di RAM.',
      },
      {
        stage: 'Output',
        device: 'Layar Monitor / Printer',
        detail: 'Menampilkan huruf secara langsung di layar atau mencetaknya ke kertas.',
      },
      {
        stage: 'Storage',
        device: 'SSD Laptop',
        detail: 'Ketika menekan Ctrl+S, file rangkuman ditulis permanen ke penyimpanan SSD.',
      },
    ],
  },
  {
    id: 'nilai',
    label: 'Menghitung Rata-Rata Nilai Kuis',
    steps: [
      {
        stage: 'Input',
        device: 'Mouse / Layar Sentuh',
        detail: 'Mengirimkan pilihan jawaban A, B, C, atau D dari siswa ke aplikasi.',
      },
      {
        stage: 'Process',
        device: 'ALU di dalam CPU',
        detail: 'Membandingkan jawaban siswa dengan kunci jawaban lalu menghitung skor persentase.',
      },
      {
        stage: 'Output',
        device: 'Monitor',
        detail: 'Menampilkan skor akhir (misal 100%) beserta penjelasan setiap soal.',
      },
      {
        stage: 'Storage',
        device: 'LocalStorage / Database',
        detail: 'Menyimpan riwayat skor kuis ke log progres pemahaman pekan ini.',
      },
    ],
  },
];

export const ComputerSystemSimulator: React.FC = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  const scenario = IPO_SCENARIOS[scenarioIdx];
  const current = scenario.steps[activeStep];

  const iconForStage = (stage: string) => {
    switch (stage) {
      case 'Input':
        return <Keyboard className="h-4 w-4" aria-hidden="true" />;
      case 'Process':
        return <Cpu className="h-4 w-4" aria-hidden="true" />;
      case 'Output':
        return <Monitor className="h-4 w-4" aria-hidden="true" />;
      default:
        return <HardDrive className="h-4 w-4" aria-hidden="true" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Simulasi Alur Input – Proses – Output – Storage
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pilih studi kasus lalu telusuri setiap tahap kerja sistem komputer
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {IPO_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                setScenarioIdx(idx);
                setActiveStep(0);
              }}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                idx === scenarioIdx
                  ? 'bg-blue-700 text-white dark:bg-blue-600'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-900 lg:col-span-5 dark:border-slate-800">
          {!imgFailed ? (
            <img
              src={IPO_DIAGRAM_SRC}
              alt="Diagram arsitektur Input Proses Output pada sistem komputer"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-48 w-full object-cover lg:h-full"
            />
          ) : (
            <div className="flex h-48 flex-col items-center justify-center p-4 text-center text-slate-300 lg:h-full">
              <Cpu className="h-8 w-8 text-sky-400" aria-hidden="true" />
              <p className="mt-2 text-xs font-medium">Arsitektur Sistem Komputer (IPO)</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {scenario.steps.map((st, idx) => {
              const selected = idx === activeStep;
              return (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                    selected
                      ? 'border-blue-700 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {iconForStage(st.stage)}
                  <span>
                    {idx + 1}. {st.stage}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
              Tahap {activeStep + 1} dari 4 · {current.stage}
            </p>
            <h4 className="mt-1 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Perangkat: {current.device}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              {current.detail}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(0)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ulangi dari Input</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev + 1) % scenario.steps.length)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <span>{activeStep < 3 ? 'Langkah Berikutnya' : 'Kembali ke Awal'}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PIPELINE_STEPS = [
  {
    id: 'commit',
    title: '1. Commit Lokal',
    tool: 'Git',
    command: 'git commit -m "Tambah fitur pengingat tugas"',
    summary:
      'Menyimpan rekaman perubahan kode secara rapi dengan pesan yang menjelaskan apa yang diperbarui.',
  },
  {
    id: 'branch',
    title: '2. Push ke Branch GitHub',
    tool: 'GitHub',
    command: 'git push origin fitur-pengingat',
    summary:
      'Mengirimkan perubahan ke repositori daring di branch terpisah agar kode utama (main) tetap aman.',
  },
  {
    id: 'pr',
    title: '3. Pull Request & Preview',
    tool: 'GitHub + Vercel',
    command: 'Pull Request #12 · Preview URL dibuat otomatis',
    summary:
      'Mengajukan penggabungan kode. Vercel otomatis membuat tautan pratinjau unik untuk diuji sebelum rilis.',
  },
  {
    id: 'deploy',
    title: '4. Auto-Build & Production',
    tool: 'Vercel',
    command: 'npm run build -> Live di *.vercel.app',
    summary:
      'Setelah di-merge ke main, Vercel membangun aplikasi menjadi berkas produksi cepat dan aktif secara daring.',
  },
];

export const GitHubVercelSimulator: React.FC = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const current = PIPELINE_STEPS[stepIdx];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Alur Publikasi Proyek: GitHub menuju Vercel
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Klik tiap tahap untuk melihat bagaimana kode di laptop berubah menjadi situs web aktif
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStepIdx((prev) => (prev + 1) % PIPELINE_STEPS.length)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-blue-800 dark:bg-blue-600"
        >
          <span>Simulasikan Tahap Berikutnya</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-4">
        {PIPELINE_STEPS.map((st, idx) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setStepIdx(idx)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
              idx === stepIdx
                ? 'border-blue-700 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {idx < 3 ? (
              <GitBranch className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{st.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Platform: {current.tool}
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 px-3 py-2 font-mono text-xs text-sky-300">
          {current.command}
        </pre>
        <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
          {current.summary}
        </p>
      </div>
    </div>
  );
};
