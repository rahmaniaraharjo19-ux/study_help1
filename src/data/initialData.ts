import { AppData } from '../types/study';
import { addDaysIso } from '../utils/dateUtils';

export function createInitialAppData(): AppData {
  const today = new Date();

  return {
    profile: {
      name: 'Siswa Global Mandiri',
      school: 'SMP Global Mandiri',
      grade: 'Kelas 8B',
    },
    theme: 'light',
    schedule: [
      // Senin
      {
        id: 'sch-sen-1',
        day: 'Senin',
        startTime: '07:30',
        endTime: '08:50',
        subject: 'Informatika',
        teacher: 'Pak Ardiansyah, S.Kom.',
        room: 'Lab Komputer 1',
        linkedTopicId: 'computer-system',
      },
      {
        id: 'sch-sen-2',
        day: 'Senin',
        startTime: '09:10',
        endTime: '10:30',
        subject: 'Matematika',
        teacher: 'Bu Ratna Dewi, S.Pd.',
        room: 'Ruang 8B',
      },
      {
        id: 'sch-sen-3',
        day: 'Senin',
        startTime: '10:45',
        endTime: '12:05',
        subject: 'Bahasa Indonesia',
        teacher: 'Bu Lestari, M.Pd.',
        room: 'Ruang 8B',
      },
      {
        id: 'sch-sen-4',
        day: 'Senin',
        startTime: '13:00',
        endTime: '14:20',
        subject: 'IPA Terpadu',
        teacher: 'Pak Hendra Wijaya, S.Si.',
        room: 'Lab IPA',
      },

      // Selasa
      {
        id: 'sch-sel-1',
        day: 'Selasa',
        startTime: '07:30',
        endTime: '08:50',
        subject: 'Bahasa Inggris',
        teacher: 'Ms. Nadira, S.Pd.',
        room: 'Ruang 8B',
      },
      {
        id: 'sch-sel-2',
        day: 'Selasa',
        startTime: '09:10',
        endTime: '10:30',
        subject: 'Informatika',
        teacher: 'Pak Ardiansyah, S.Kom.',
        room: 'Lab Komputer 1',
        linkedTopicId: 'perlindungan-data',
      },
      {
        id: 'sch-sel-3',
        day: 'Selasa',
        startTime: '10:45',
        endTime: '12:05',
        subject: 'PPKn',
        teacher: 'Pak Bagus Santoso, S.Pd.',
        room: 'Ruang 8B',
      },
      {
        id: 'sch-sel-4',
        day: 'Selasa',
        startTime: '13:00',
        endTime: '14:20',
        subject: 'IPS Terpadu',
        teacher: 'Bu Maya Sari, S.E.',
        room: 'Ruang 8B',
      },

      // Rabu
      {
        id: 'sch-rab-1',
        day: 'Rabu',
        startTime: '07:30',
        endTime: '08:50',
        subject: 'Matematika',
        teacher: 'Bu Ratna Dewi, S.Pd.',
        room: 'Ruang 8B',
      },
      {
        id: 'sch-rab-2',
        day: 'Rabu',
        startTime: '09:10',
        endTime: '10:30',
        subject: 'PJOK',
        teacher: 'Pak Dimas Pratama, S.Or.',
        room: 'Lapangan Utama',
      },
      {
        id: 'sch-rab-3',
        day: 'Rabu',
        startTime: '10:45',
        endTime: '12:05',
        subject: 'Informatika',
        teacher: 'Pak Ardiansyah, S.Kom.',
        room: 'Lab Komputer 2',
        linkedTopicId: 'vibe-coding',
      },
      {
        id: 'sch-rab-4',
        day: 'Rabu',
        startTime: '13:00',
        endTime: '14:20',
        subject: 'Seni Budaya',
        teacher: 'Bu Rina Kartika, S.Sn.',
        room: 'Studio Seni',
      },

      // Kamis
      {
        id: 'sch-kam-1',
        day: 'Kamis',
        startTime: '07:30',
        endTime: '08:50',
        subject: 'IPA Terpadu',
        teacher: 'Pak Hendra Wijaya, S.Si.',
        room: 'Lab IPA',
      },
      {
        id: 'sch-kam-2',
        day: 'Kamis',
        startTime: '09:10',
        endTime: '10:30',
        subject: 'Bahasa Inggris',
        teacher: 'Ms. Nadira, S.Pd.',
        room: 'Ruang 8B',
      },
      {
        id: 'sch-kam-3',
        day: 'Kamis',
        startTime: '10:45',
        endTime: '12:05',
        subject: 'Informatika',
        teacher: 'Pak Ardiansyah, S.Kom.',
        room: 'Lab Komputer 1',
        linkedTopicId: 'google-ai-studio',
      },
      {
        id: 'sch-kam-4',
        day: 'Kamis',
        startTime: '13:00',
        endTime: '14:20',
        subject: 'Pendidikan Agama',
        teacher: 'Pak Fauzan, S.Ag.',
        room: 'Ruang 8B',
      },

      // Jumat
      {
        id: 'sch-jum-1',
        day: 'Jumat',
        startTime: '07:30',
        endTime: '08:50',
        subject: 'Bahasa Indonesia',
        teacher: 'Bu Lestari, M.Pd.',
        room: 'Ruang 8B',
      },
      {
        id: 'sch-jum-2',
        day: 'Jumat',
        startTime: '09:10',
        endTime: '10:30',
        subject: 'Informatika',
        teacher: 'Pak Ardiansyah, S.Kom.',
        room: 'Lab Komputer 1',
        linkedTopicId: 'github-vercel',
      },
      {
        id: 'sch-jum-3',
        day: 'Jumat',
        startTime: '10:45',
        endTime: '11:45',
        subject: 'IPS Terpadu',
        teacher: 'Bu Maya Sari, S.E.',
        room: 'Ruang 8B',
      },
    ],

    tasks: [
      {
        id: 'tsk-1',
        title: 'Buat Diagram Alur Input-Proses-Output Komputer Sekolah',
        subject: 'Informatika',
        dueDate: addDaysIso(today, 0),
        dueTime: '20:00',
        priority: 'Tinggi',
        status: 'Sedang Dikerjakan',
        description:
          'Gambarkan alur Input (scanner/keyboard), Proses (CPU: CU & ALU + RAM), Output (monitor/printer), dan Storage pada studi kasus sistem absensi siswa.',
        linkedTopicId: 'computer-system',
        createdAt: addDaysIso(today, -3),
      },
      {
        id: 'tsk-2',
        title: 'Audit Pengaturan Privasi & Keamanan Akun (2FA)',
        subject: 'Informatika',
        dueDate: addDaysIso(today, 1),
        dueTime: '16:00',
        priority: 'Tinggi',
        status: 'Belum Dikerjakan',
        description:
          'Susun laporan singkat mengenai 5 langkah perlindungan data pribadi dan cara mengecek jejak digital pasif di peramban.',
        linkedTopicId: 'perlindungan-data',
        createdAt: addDaysIso(today, -2),
      },
      {
        id: 'tsk-3',
        title: 'Latihan Soal Sistem Persamaan Linear Dua Variabel',
        subject: 'Matematika',
        dueDate: addDaysIso(today, 2),
        dueTime: '07:30',
        priority: 'Sedang',
        status: 'Belum Dikerjakan',
        description: 'Kerjakan halaman 74 nomor 1–10 menggunakan metode substitusi dan eliminasi.',
        createdAt: addDaysIso(today, -1),
      },
      {
        id: 'tsk-4',
        title: 'Rancang System Instruction di Google AI Studio',
        subject: 'Informatika',
        dueDate: addDaysIso(today, 3),
        dueTime: '17:00',
        priority: 'Sedang',
        status: 'Belum Dikerjakan',
        description:
          'Buat prompt terstruktur untuk asisten belajar IPA dengan batasan bahasa yang ramah siswa SMP, lalu catat hasil uji cobanya.',
        linkedTopicId: 'google-ai-studio',
        createdAt: addDaysIso(today, -1),
      },
      {
        id: 'tsk-5',
        title: 'Push Proyek Web Mini ke GitHub & Deploy via Vercel',
        subject: 'Informatika',
        dueDate: addDaysIso(today, 5),
        dueTime: '21:00',
        priority: 'Rendah',
        status: 'Belum Dikerjakan',
        description:
          'Lakukan commit perubahan terbaru ke repositori GitHub, hubungkan ke Vercel, dan catat URL preview yang dihasilkan.',
        linkedTopicId: 'github-vercel',
        createdAt: addDaysIso(today, 0),
      },
      {
        id: 'tsk-6',
        title: 'Ringkasan Artikel Dampak Sosial Media di Sekolah',
        subject: 'Informatika',
        dueDate: addDaysIso(today, -2),
        dueTime: '15:00',
        priority: 'Sedang',
        status: 'Selesai',
        description:
          'Analisis 3 dampak positif dan 3 tantangan negatif penggunaan teknologi digital bagi pelajar SMP.',
        linkedTopicId: 'dampak-sosial',
        createdAt: addDaysIso(today, -6),
      },
    ],

    topics: [
      {
        id: 'dampak-sosial',
        order: 1,
        title: 'Dampak Sosial Informatika',
        shortTitle: 'Dampak Sosial',
        category: 'Literasi & Etika Digital',
        estimatedMinutes: 25,
        status: 'Sudah Dipelajari',
        overview:
          'Memahami bagaimana teknologi informasi dan komunikasi mengubah cara manusia belajar, bekerja, berkomunikasi, serta menimbang peluang dan risikonya di masyarakat.',
        summaryPoints: [
          'Informatika mempercepat akses pengetahuan, kolaborasi jarak jauh, dan efisiensi pekerjaan sehari-hari.',
          'Tantangan sosial meliputi kesenjangan digital (digital divide), penyebaran hoaks/misinformasi, dan kecanduan gawai.',
          'Otomatisasi dan kecerdasan buatan mengubah jenis pekerjaan masa depan sehingga dibutuhkan literasi digital dan berpikir kritis.',
          'Siswa perlu menyeimbangkan waktu layar (screen time) dan memverifikasi kebenaran informasi sebelum membagikannya.',
        ],
        keyConcepts: [
          {
            id: 'ds-1',
            title: 'Transformasi Kolaborasi & Pembelajaran',
            detail:
              'Platform belajar daring, dokumen kolaboratif, dan perpustakaan digital memudahkan siswa berdiskusi dan berkarya tanpa batas ruang.',
            example: 'Mengerjakan presentasi kelompok IPA bersama secara bersamaan melalui dokumen cloud.',
          },
          {
            id: 'ds-2',
            title: 'Kesenjangan Digital (Digital Divide)',
            detail:
              'Perbedaan akses terhadap perangkat, jaringan internet cepat, dan keterampilan teknologi antarwilayah atau kelompok masyarakat.',
            example: 'Perbedaan kecepatan belajar saat daerah tertentu belum memiliki jaringan internet yang stabil.',
          },
          {
            id: 'ds-3',
            title: 'Literasi Informasi & Anti-Hoaks',
            detail:
              'Kemampuan memeriksa sumber berita, tanggal terbit, dan bukti pendukung sebelum mempercayai atau meneruskan pesan.',
            example: 'Mengecek situs resmi sekolah atau kementerian sebelum membagikan pengumuman berantai di grup chat.',
          },
        ],
        checklist: [
          'Dapat menjelaskan minimal 3 dampak positif informatika bagi pendidikan',
          'Memahami arti kesenjangan digital dan cara menguranginya',
          'Mampu membedakan informasi valid dan hoaks sebelum menyebarkan',
          'Menerapkan manajemen waktu layar yang sehat setiap hari',
        ],
        checkedChecklistIndices: [0, 1, 2, 3],
        studentNotes:
          'Poin penting dari kelas Pak Ardiansyah: Teknologi bersifat netral, dampaknya bergantung pada cara kita menggunakannya. Selalu cek sumber berita (Saring sebelum Sharing).',
        comprehensionScore: 92,
        lastReviewedAt: addDaysIso(today, -3),
        quiz: [
          {
            id: 'q-ds-1',
            question: 'Manakah yang merupakan contoh dampak negatif informatika yang perlu diwaspadai pelajar?',
            options: [
              'Kolaborasi tugas kelompok lebih cepat lewat dokumen daring',
              'Mudah mengakses materi pembelajaran dari mana saja',
              'Penyebaran informasi palsu (hoaks) dan berkurangnya fokus belajar akibat gawai',
              'Kemudahan mencari referensi buku elektronik',
            ],
            correctIndex: 2,
            explanation:
              'Hoaks dan distraksi gawai berlebih merupakan dampak negatif yang harus diatasi dengan literasi informasi dan pengaturan waktu.',
          },
          {
            id: 'q-ds-2',
            question: 'Istilah untuk ketimpangan akses perangkat komputer dan internet antarwilayah disebut...',
            options: [
              'Digital Footprint',
              'Digital Divide (Kesenjangan Digital)',
              'Cloud Computing',
              'Cyberbullying',
            ],
            correctIndex: 1,
            explanation:
              'Digital Divide adalah kesenjangan antara masyarakat yang memiliki akses dan kemampuan digital dengan yang belum memilikinya.',
          },
          {
            id: 'q-ds-3',
            question: 'Langkah paling tepat ketika menerima pesan berantai berhadiah di grup chat adalah...',
            options: [
              'Langsung meneruskan ke semua teman agar tidak ketinggalan',
              'Mengklik tautan lalu memasukkan data pribadi',
              'Memverifikasi sumber resmi terlebih dahulu dan tidak menyebarkannya jika meragukan',
              'Menyimpan gambarnya saja tanpa dicek',
            ],
            correctIndex: 2,
            explanation:
              'Prinsip "Saring sebelum Sharing" melindungi diri dan orang lain dari penipuan serta misinformasi.',
          },
        ],
      },
      {
        id: 'computer-system',
        order: 2,
        title: 'Computer System (Input Proses Output)',
        shortTitle: 'Computer System (IPO)',
        category: 'Sistem Komputer',
        estimatedMinutes: 30,
        status: 'Sedang Dipelajari',
        overview:
          'Mempelajari bagaimana perangkat keras (hardware), perangkat lunak (software), dan pengguna (brainware) bekerja bersama dalam siklus Input – Process – Output – Storage.',
        summaryPoints: [
          'Sistem komputer terdiri atas 3 elemen utama: Hardware (fisik), Software (program/instruksi), dan Brainware (pengguna).',
          'Siklus IPO: Perangkat Input memasukkan data -> CPU memproses data dibantu RAM -> Perangkat Output menampilkan hasil -> Storage menyimpan data permanen.',
          'Di dalam CPU terdapat ALU (Arithmetic Logic Unit) untuk hitung & logika, serta CU (Control Unit) untuk mengatur lalu lintas instruksi.',
          'RAM bersifat sementara (volatile) saat program berjalan, sedangkan SSD/HDD bersifat permanen (non-volatile).',
        ],
        keyConcepts: [
          {
            id: 'cs-1',
            title: 'Input (Masukan)',
            detail:
              'Perangkat yang menangkap data atau perintah dari dunia nyata dan mengubahnya menjadi sinyal digital biner (0 dan 1).',
            example: 'Keyboard, mouse, mikrofon, kamera web, pemindai (scanner), layar sentuh.',
          },
          {
            id: 'cs-2',
            title: 'Process (Pemrosesan)',
            detail:
              'CPU (Central Processing Unit) mengeksekusi instruksi menggunakan Control Unit (CU) dan Arithmetic Logic Unit (ALU), dibantu memori kerja RAM.',
            example: 'Menghitung nilai rata-rata rapor di aplikasi spreadsheet atau merender grafis game.',
          },
          {
            id: 'cs-3',
            title: 'Output & Storage (Keluaran & Penyimpanan)',
            detail:
              'Perangkat Output menyajikan hasil olahan kepada pengguna, sementara Storage menyimpan file agar tetap aman meski listrik padam.',
            example: 'Monitor, speaker, printer (Output); SSD NVMe, flashdisk (Storage).',
          },
        ],
        checklist: [
          'Mampu membedakan Hardware, Software, dan Brainware',
          'Memahami fungsi CU dan ALU di dalam CPU',
          'Bisa mengelompokkan contoh perangkat Input, Output, dan Storage',
          'Memahami perbedaan sifat RAM (sementara) dan SSD (permanen)',
        ],
        checkedChecklistIndices: [0, 1, 2],
        studentNotes:
          'Ingat rumus cepat: Input = masukin data, CPU = otak (CU pengatur, ALU penghitung), RAM = meja kerja sementara, SSD = lemari arsip permanen, Output = hasil yang bisa dilihat/didengar.',
        comprehensionScore: 80,
        lastReviewedAt: addDaysIso(today, -1),
        quiz: [
          {
            id: 'q-cs-1',
            question: 'Bagian di dalam CPU yang bertugas melakukan perhitungan matematika dan perbandingan logika adalah...',
            options: ['Control Unit (CU)', 'Arithmetic Logic Unit (ALU)', 'Random Access Memory (RAM)', 'Power Supply'],
            correctIndex: 1,
            explanation:
              'ALU (Arithmetic Logic Unit) menangani operasi aritmetika dan logika, sedangkan CU mengatur jalannya instruksi.',
          },
          {
            id: 'q-cs-2',
            question: 'Manakah kelompok perangkat yang seluruhnya merupakan perangkat Input?',
            options: [
              'Monitor, Printer, Speaker',
              'Keyboard, Mouse, Mikrofon',
              'CPU, RAM, SSD',
              'Proyektor, Scanner, Headset',
            ],
            correctIndex: 1,
            explanation:
              'Keyboard, mouse, dan mikrofon memasukkan data (teks, posisi kursor, suara) ke dalam komputer.',
          },
          {
            id: 'q-cs-3',
            question: 'Mengapa file tugas yang belum disimpan bisa hilang ketika komputer tiba-tiba mati listrik?',
            options: [
              'Karena data tersebut masih berada di RAM yang bersifat volatile (sementara)',
              'Karena monitor mereset piksel layar',
              'Karena keyboard tidak memiliki baterai',
              'Karena CPU menghapus semua file di SSD secara otomatis',
            ],
            correctIndex: 0,
            explanation:
              'RAM membutuhkan daya listrik untuk mempertahankan data; data baru aman jika sudah disimpan ke Storage (SSD/HDD).',
          },
        ],
      },
      {
        id: 'perlindungan-data',
        order: 3,
        title: 'Perlindungan Data Pribadi dan Jejak Digital',
        shortTitle: 'Data Pribadi & Jejak Digital',
        category: 'Keamanan Siber',
        estimatedMinutes: 25,
        status: 'Sedang Dipelajari',
        overview:
          'Memahami pentingnya menjaga kerahasiaan data pribadi di ruang digital serta menyadari bahwa setiap aktivitas internet meninggalkan jejak digital.',
        summaryPoints: [
          'Data pribadi terbagi menjadi Data Umum (nama, jenis kelamin, alamat email) dan Data Spesifik/Sensitif (NIK, data kesehatan, biometrik, keuangan).',
          'Jejak Digital Aktif adalah data yang sengaja kita unggah (postingan, komentar), sedangkan Jejak Digital Pasif terekam otomatis (riwayat pencarian, cookie, lokasi IP).',
          'Lindungi akun dengan kata sandi unik yang panjang, Two-Factor Authentication (2FA), dan membatasi izin aplikasi yang tidak perlu.',
          'Di Indonesia, perlindungan hak atas data pribadi diatur dalam UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).',
        ],
        keyConcepts: [
          {
            id: 'pd-1',
            title: 'Data Umum vs Data Spesifik',
            detail:
              'Data spesifik memiliki risiko kerugian lebih tinggi jika bocor sehingga wajib dijaga sangat ketat dan tidak boleh difoto/diunggah ke publik.',
            example: 'Jangan pernah mengunggah foto kartu identitas, nomor telepon pribadi, atau alamat rumah di profil publik.',
          },
          {
            id: 'pd-2',
            title: 'Jejak Digital Aktif & Pasif',
            detail:
              'Semua unggahan maupun riwayat klik di internet dapat bertahan sangat lama dan memengaruhi reputasi kita di masa depan.',
            example: 'Aktif: mengunggah foto kegiatan OSIS. Pasif: situs belanja merekam produk yang sering kamu lihat lewat cookie.',
          },
          {
            id: 'pd-3',
            title: 'Autentikasi Dua Faktor (2FA)',
            detail:
              'Lapisan keamanan tambahan selain kata sandi, berupa kode OTP atau aplikasi autentikator, agar peretas tidak mudah masuk.',
            example: 'Mengaktifkan verifikasi 2 langkah pada akun Google belajar sekolah.',
          },
        ],
        checklist: [
          'Dapat membedakan data pribadi umum dan spesifik',
          'Memahami perbedaan jejak digital aktif dan pasif',
          'Sudah menerapkan kata sandi kuat dan tidak membagikan OTP ke siapa pun',
          'Mampu mengecek izin lokasi/kamera pada aplikasi ponsel',
        ],
        checkedChecklistIndices: [0, 1],
        studentNotes:
          'Tugas Selasa: periksa ulang pengaturan privasi akun belajar dan aktifkan 2FA. Ingat: kode OTP bersifat rahasia mutlak!',
        comprehensionScore: 72,
        lastReviewedAt: addDaysIso(today, -2),
        quiz: [
          {
            id: 'q-pd-1',
            question: 'Manakah contoh jejak digital PASIF saat menggunakan internet?',
            options: [
              'Mengunggah foto tugas di media sosial',
              'Menulis komentar di video pembelajaran',
              'Situs web mencatat alamat IP dan riwayat pencarian melalui cookie',
              'Mengirim email tugas kepada guru',
            ],
            correctIndex: 2,
            explanation:
              'Jejak digital pasif terekam secara otomatis oleh sistem tanpa kita unggah secara langsung.',
          },
          {
            id: 'q-pd-2',
            question: 'Mengapa penggunaan 2FA (Two-Factor Authentication) sangat disarankan?',
            options: [
              'Agar koneksi Wi-Fi menjadi lebih cepat',
              'Memberikan lapisan verifikasi kedua jika kata sandi berhasil ditebak atau bocor',
              'Menghapus seluruh jejak digital secara otomatis',
              'Membuat ukuran file foto menjadi lebih kecil',
            ],
            correctIndex: 1,
            explanation:
              '2FA meminta bukti kedua (seperti kode autentikator/OTP) sehingga akun tetap terlindungi meski password bocor.',
          },
          {
            id: 'q-pd-3',
            question: 'Tindakan paling aman jika ada orang tidak dikenal meminta kode OTP yang masuk ke SMS kamu adalah...',
            options: [
              'Memberikannya jika dia mengaku petugas bank atau admin sekolah',
              'Mengabaikan, menolak memberikan OTP, dan segera mengganti kata sandi akun terkait',
              'Mengunggah tangkapan layar OTP ke media sosial',
              'Membalas pesan dengan tanggal lahir',
            ],
            correctIndex: 1,
            explanation:
              'Kode OTP tidak boleh dibagikan kepada siapa pun, termasuk pihak yang mengaku petugas resmi.',
          },
        ],
      },
      {
        id: 'kewarganegaraan-digital',
        order: 4,
        title: 'Kewarganegaraan Digital dan Perundungan Siber',
        shortTitle: 'Kewarganegaraan Digital',
        category: 'Literasi & Etika Digital',
        estimatedMinutes: 25,
        status: 'Sedang Dipelajari',
        overview:
          'Menjadi warga digital yang beretika, bertanggung jawab, menghargai hak cipta, serta mampu mencegah dan menanggapi perundungan siber (cyberbullying).',
        summaryPoints: [
          'Kewarganegaraan digital menuntut perilaku aman, etis, dan penuh empati saat berinteraksi di dunia maya (netiket).',
          'Perundungan siber (cyberbullying) meliputi penghinaan (flaming), pelecehan berulang (harassment), pengucilan sengaja (exclusion), dan penyebaran rahasia/aib (outing).',
          'Gunakan prinsip T.H.I.N.K. sebelum berkomentar: True (Benar), Helpful (Bermanfaat), Inspiring (Menginspirasi), Necessary (Perlu), Kind (Santun).',
          'Jika mengalami atau menyaksikan cyberbullying: jangan membalas dengan amarah, simpan bukti tangkapan layar, blokir/laporkan akun, dan hubungi orang tua atau guru BK.',
        ],
        keyConcepts: [
          {
            id: 'kd-1',
            title: 'Netiket (Etika Berinternet)',
            detail:
              'Aturan sopan santun komunikasi daring seperti menghargai pendapat orang lain, tidak menulis dengan huruf kapital penuh (berteriak), dan mencantumkan sumber karya.',
            example: 'Menyapa guru dengan bahasa sopan saat mengirim pesan pertanyaan tugas.',
          },
          {
            id: 'kd-2',
            title: 'Mengenali Bentuk Cyberbullying',
            detail:
              'Perilaku agresif yang disengaja dan berulang melalui media digital untuk menyakiti, mempermalukan, atau mengucilkan seseorang.',
            example: 'Mengedit foto teman menjadi meme ejekan lalu menyebarkannya di grup kelas.',
          },
          {
            id: 'kd-3',
            title: 'Protokol Menghadapi Perundungan Siber',
            detail:
              'Langkah terstruktur: Stop & Jangan Membalas -> Simpan Bukti (Screenshot) -> Blokir & Laporkan -> Ceritakan kepada Orang Dewasa Tepercaya (Orang Tua/Guru).',
            example: 'Melaporkan komentar kasar di platform sekolah serta menyertakan tangkapan layar kepada wali kelas.',
          },
        ],
        checklist: [
          'Memahami 5 poin filter komunikasi T.H.I.N.K.',
          'Mampu mengenali bentuk cyberbullying (flaming, outing, exclusion)',
          'Mengetahui cara mendokumentasikan bukti dan melapor saat terjadi perundungan',
          'Menghargai hak cipta dengan mencantumkan sumber gambar/tulisan',
        ],
        checkedChecklistIndices: [0, 1],
        studentNotes:
          'Ingat: menjadi saksi yang diam (bystander) bisa membuat perundungan berlanjut. Jadilah upstander yang mendukung teman dan melapor ke guru.',
        comprehensionScore: 76,
        lastReviewedAt: addDaysIso(today, -4),
        quiz: [
          {
            id: 'q-kd-1',
            question: 'Tindakan menyebarkan informasi pribadi atau foto memalukan milik teman tanpa izin di media sosial disebut...',
            options: ['Outing / Doxing', 'Netiket', 'Open Source', 'Filtering'],
            correctIndex: 0,
            explanation:
              'Outing adalah bentuk cyberbullying dengan membocorkan rahasia atau gambar pribadi orang lain tanpa persetujuan.',
          },
          {
            id: 'q-kd-2',
            question: 'Huruf "K" pada prinsip T.H.I.N.K. sebelum mengunggah komentar berarti...',
            options: ['Kritis tanpa batas', 'Kind (Baik / Santun)', 'Kreatif saja', 'Kapital semua'],
            correctIndex: 1,
            explanation:
              'T.H.I.N.K. = True, Helpful, Inspiring, Necessary, Kind (santun dan tidak menyakiti).',
          },
          {
            id: 'q-kd-3',
            question: 'Apa langkah awal paling bijak saat menerima komentar perundungan di media sosial?',
            options: [
              'Membalas dengan kata-kata yang lebih kasar',
              'Menghapus akun sekolah',
              'Tidak terpancing membalas, simpan tangkapan layar sebagai bukti, blokir pelaku, dan lapor ke orang tua/guru',
              'Membagikan kembali komentar tersebut agar semua orang ikut bertengkar',
            ],
            correctIndex: 2,
            explanation:
              'Menyimpan bukti dan melapor ke pihak berwenang/guru membantu menyelesaikan masalah tanpa memperkeruh konflik.',
          },
        ],
      },
      {
        id: 'vibe-coding',
        order: 5,
        title: 'Vibe Coding',
        shortTitle: 'Vibe Coding',
        category: 'Pengembangan Aplikasi Modern',
        estimatedMinutes: 30,
        status: 'Sedang Dipelajari',
        overview:
          'Mengenal pendekatan modern membangun aplikasi perangkat lunak menggunakan bahasa alami bersama AI, dengan tetap mengutamakan kejelasan spesifikasi, pengujian, dan pemahaman alur kerja.',
        summaryPoints: [
          'Vibe Coding adalah cara membuat aplikasi dengan mendeskripsikan tujuan, fitur, dan tampilan secara jelas kepada AI, lalu menguji serta menyempurnakannya secara bertahap.',
          'Alur kerja efektif: Tentukan Masalah -> Tulis Prompt Spesifik -> Jalankan & Uji Hasil -> Beri Umpan Balik / Perbaiki (Iterasi).',
          'Siswa tetap bertanggung jawab sebagai arsitek: memeriksa apakah fitur berjalan benar, tata letak rapi, dan tidak ada bug tersembunyi.',
          'Hindari meminta "buatkan aplikasi apa saja" secara kabur; sebutkan target pengguna, data yang disimpan, serta fitur utamanya.',
        ],
        keyConcepts: [
          {
            id: 'vc-1',
            title: 'Spesifikasi Berbasis Niat (Intent-Driven Prompting)',
            detail:
              'Semakin jelas kamu menjelaskan siapa penggunanya, data apa yang dikelola, dan alur interaksinya, semakin akurat hasil kode yang dibangun.',
            example: 'Menjelaskan kebutuhan aplikasi jadwal SMP Global Mandiri lengkap dengan daftar materi dan kuis.',
          },
          {
            id: 'vc-2',
            title: 'Iterasi & Debugging Terarah',
            detail:
              'Vibe coding bukan sekali jadi; pengembang menguji setiap tombol, mengecek responsivitas di layar HP/laptop, lalu meminta perbaikan spesifik.',
            example: 'Menguji form tambah tugas dan memastikan tanggal tenggat tampil benar sebelum melanjutkan ke fitur grafik.',
          },
          {
            id: 'vc-3',
            title: 'Peran Manusia sebagai Reviewer',
            detail:
              'Pemahaman dasar HTML/CSS/Logika tetap penting agar kita tahu bagian mana yang bekerja dan dapat memverifikasi keamanan serta keakuratan aplikasi.',
            example: 'Memeriksa apakah skor kuis dihitung dengan rumus persentase yang benar.',
          },
        ],
        checklist: [
          'Memahami konsep dasar Vibe Coding sebagai kolaborasi manusia + AI',
          'Mampu menulis deskripsi fitur aplikasi yang terstruktur (pengguna, fitur, data)',
          'Terbiasa menguji aplikasi setelah setiap iterasi perubahan',
          'Menyadari pentingnya verifikasi logika & keamanan, tidak asal terima hasil',
        ],
        checkedChecklistIndices: [0, 1],
        studentNotes:
          'Tips Vibe Coding dari kelas Rabu: Pecah permintaan besar jadi bagian jelas. Selalu cek tampilan di browser dan coba klik semua tombolnya!',
        comprehensionScore: 68,
        lastReviewedAt: addDaysIso(today, -1),
        quiz: [
          {
            id: 'q-vc-1',
            question: 'Apa kunci utama agar proses Vibe Coding menghasilkan aplikasi yang sesuai harapan?',
            options: [
              'Menulis perintah sesingkat mungkin tanpa menjelaskan fitur',
              'Menjelaskan tujuan, pengguna, struktur fitur secara jelas, lalu menguji dan melakukan iterasi perbaikan',
              'Tidak perlu menguji aplikasi di browser',
              'Menghapus semua file konfigurasi proyek',
            ],
            correctIndex: 1,
            explanation:
              'Kejelasan konteks di awal diikuti pengujian dan iterasi bertahap menghasilkan aplikasi yang jauh lebih stabil.',
          },
          {
            id: 'q-vc-2',
            question: 'Mengapa pengembang tetap harus menguji aplikasi secara langsung saat melakukan Vibe Coding?',
            options: [
              'Untuk memastikan seluruh fitur berjalan sesuai kebutuhan, bebas error, dan nyaman digunakan',
              'Agar ukuran kode menjadi lebih panjang',
              'Supaya warna tema berubah acak',
              'Karena browser tidak bisa membuka file tanpa error',
            ],
            correctIndex: 0,
            explanation:
              'Pengujian memastikan logika, tampilan, dan pengalaman pengguna benar-benar berfungsi tanpa bug.',
          },
          {
            id: 'q-vc-3',
            question: 'Manakah contoh instruksi Vibe Coding yang baik untuk aplikasi pelajar?',
            options: [
              '"Buatkan web bagus"',
              '"Buatkan pengingat tugas sekolah dengan kolom nama tugas, mata pelajaran, tenggat waktu, prioritas, dan filter status selesai"',
              '"Buat kode rahasia"',
              '"Ganti semua warna menjadi gelap tanpa alasan"',
            ],
            correctIndex: 1,
            explanation:
              'Instruksi kedua menyebutkan fitur, field data, dan fungsi filter secara konkret.',
          },
        ],
      },
      {
        id: 'google-ai-studio',
        order: 6,
        title: 'Google AI Studio',
        shortTitle: 'Google AI Studio',
        category: 'Pengembangan Aplikasi Modern',
        estimatedMinutes: 30,
        status: 'Belum Dipelajari',
        overview:
          'Mengenal platform prototipe cepat dari Google untuk mencoba model Gemini, menyusun System Instructions, mengatur parameter respons, serta membangun aplikasi AI secara terstruktur.',
        summaryPoints: [
          'Google AI Studio menyediakan ruang kerja interaktif untuk menguji prompt teks, gambar, maupun audio menggunakan keluarga model Gemini.',
          'System Instructions berfungsi menetapkan peran, gaya bahasa, dan batasan tetap bagi model sebelum percakapan dimulai.',
          'Parameter seperti Temperature mengontrol tingkat kreativitas jawaban (rendah = konsisten/faktual, tinggi = lebih variatif).',
          'Melalui fitur Build / API key yang aman di sisi server, prototipe dapat dikembangkan menjadi aplikasi web nyata.',
        ],
        keyConcepts: [
          {
            id: 'ais-1',
            title: 'System Instructions',
            detail:
              'Instruksi tingkat sistem yang memandu perilaku model secara konsisten (misal: "Kamu adalah tutor Informatika SMP yang menjelaskan dengan contoh sederhana").',
            example: 'Membuat asisten latihan kuis yang selalu memberikan penjelasan langkah demi langkah tanpa langsung membocorkan kunci sebelum siswa mencoba.',
          },
          {
            id: 'ais-2',
            title: 'Prompt Engineering & Multimodal',
            detail:
              'Teknik merancang masukan (konteks, tugas, format output) termasuk memadukan teks dengan gambar diagram atau dokumen.',
            example: 'Mengunggah sketsa alur IPO lalu meminta penjelasan perbaikan alur datanya.',
          },
          {
            id: 'ais-3',
            title: 'Keamanan API Key',
            detail:
              'Kunci API rahasia tidak boleh diletakkan terbuka di kode publik; gunakan environment variables (.env) di sisi server.',
            example: 'Menyimpan GEMINI_API_KEY di panel Secrets / environment server, bukan di file publik GitHub.',
          },
        ],
        checklist: [
          'Mengenal fungsi ruang kerja Google AI Studio',
          'Mampu menulis System Instructions yang jelas dan aman',
          'Memahami fungsi parameter Temperature',
          'Mengetahui mengapa API Key tidak boleh di-commit ke repositori publik',
        ],
        checkedChecklistIndices: [],
        studentNotes: '',
        comprehensionScore: 45,
        lastReviewedAt: null,
        quiz: [
          {
            id: 'q-ais-1',
            question: 'Fungsi utama fitur "System Instructions" di Google AI Studio adalah...',
            options: [
              'Mengganti warna latar belakang browser',
              'Menetapkan peran, aturan, dan gaya respons model secara konsisten sepanjang sesi',
              'Menghapus seluruh riwayat proyek',
              'Mempercepat koneksi internet sekolah',
            ],
            correctIndex: 1,
            explanation:
              'System Instructions mengarahkan kepribadian, format, dan batasan perilaku model di seluruh percakapan.',
          },
          {
            id: 'q-ais-2',
            question: 'Jika ingin jawaban AI lebih faktual, konsisten, dan tidak terlalu mengarang, pengaturan Temperature sebaiknya...',
            options: ['Diturunkan (nilai rendah)', 'Dinaikkan maksimal', 'Dimatikan monitormu', 'Diubah menjadi teks'],
            correctIndex: 0,
            explanation:
              'Temperature rendah membuat model memilih token dengan probabilitas paling tinggi sehingga hasilnya lebih konsisten.',
          },
          {
            id: 'q-ais-3',
            question: 'Di mana seharusnya GEMINI_API_KEY disimpan ketika membuat aplikasi web?',
            options: [
              'Ditulis langsung di file README.md GitHub',
              'Disimpan pada environment variable / Secrets sisi server agar tidak bocor ke publik',
              'Dibagikan di grup chat kelas',
              'Ditempel di judul halaman HTML',
            ],
            correctIndex: 1,
            explanation:
              'Menjaga API Key di environment variable sisi server mencegah penyalahgunaan kunci oleh pihak luar.',
          },
        ],
      },
      {
        id: 'github-vercel',
        order: 7,
        title: 'GitHub dan Vercel',
        shortTitle: 'GitHub & Vercel',
        category: 'Pengembangan Aplikasi Modern',
        estimatedMinutes: 35,
        status: 'Belum Dipelajari',
        overview:
          'Memahami alur publikasi aplikasi modern dari pengelolaan versi kode di GitHub hingga proses build dan hosting otomatis ke internet menggunakan Vercel.',
        summaryPoints: [
          'GitHub adalah platform penyimpanan kode berbasis Git yang mencatat setiap riwayat perubahan (commit) dan memudahkan kolaborasi tim.',
          'Konsep penting GitHub: Repository (folder proyek), Commit (rekaman perubahan), Branch (jalur pengembangan terpisah), dan Pull Request (usulan penggabungan kode).',
          'Vercel adalah platform cloud hosting untuk aplikasi web modern yang terhubung langsung ke GitHub untuk melakukan Continuous Deployment (CD).',
          'Setiap kali kita melakukan push ke GitHub, Vercel otomatis mem-build proyek dan membuatkan Preview URL atau memperbarui situs Production.',
        ],
        keyConcepts: [
          {
            id: 'gv-1',
            title: 'Repository & Commit (GitHub)',
            detail:
              'Repository menyimpan seluruh file proyek beserta sejarah perubahannya. Setiap Commit wajib memiliki pesan singkat yang menjelaskan apa yang diubah.',
            example: 'git commit -m "Tambah fitur pengingat tugas pada jadwal Senin"',
          },
          {
            id: 'gv-2',
            title: 'Branch & Pull Request',
            detail:
              'Branch memungkinkan siswa mencoba fitur baru tanpa merusak kode utama (main). Setelah diuji, perubahan digabung lewat Pull Request.',
            example: 'Membuat branch "fitur-kuis" untuk menguji kuis Informatika sebelum digabung ke branch utama.',
          },
          {
            id: 'gv-3',
            title: 'Auto-Deploy & Preview URL (Vercel)',
            detail:
              'Menghubungkan repo GitHub ke Vercel mengotomatiskan perintah build (npm run build) dan menghasilkan alamat web HTTPS siap pakai.',
            example: 'Mengirim tautan *.vercel.app kepada guru Informatika agar aplikasi jadwal bisa langsung dibuka dari HP atau laptop.',
          },
        ],
        checklist: [
          'Memahami fungsi Repository dan Commit di GitHub',
          'Mengetahui kegunaan Branch untuk bekerja aman tanpa merusak kode utama',
          'Memahami cara Vercel membaca repo GitHub dan menjalankan build otomatis',
          'Mampu membedakan Preview Deployment dan Production Deployment',
        ],
        checkedChecklistIndices: [],
        studentNotes: '',
        comprehensionScore: 40,
        lastReviewedAt: null,
        quiz: [
          {
            id: 'q-gv-1',
            question: 'Mengapa pengembang menggunakan Branch terpisah di GitHub sebelum menggabungkan kode ke branch main?',
            options: [
              'Agar fitur baru bisa dikembangkan dan diuji tanpa merusak versi utama yang sudah stabil',
              'Supaya file proyek tidak bisa dibuka siapa pun',
              'Untuk menghapus riwayat commit lama',
              'Karena Vercel melarang penggunaan branch main',
            ],
            correctIndex: 0,
            explanation:
              'Branch mengisolasi pengembangan fitur baru sehingga kode utama tetap aman sampai fitur selesai diuji.',
          },
          {
            id: 'q-gv-2',
            question: 'Apa keuntungan utama menghubungkan repositori GitHub langsung ke Vercel?',
            options: [
              'Komputer tidak memerlukan listrik saat coding',
              'Setiap push kode terbaru ke GitHub otomatis di-build dan dipublikasikan (Continuous Deployment)',
              'GitHub otomatis menulis kode matematika',
              'File gambar berubah menjadi dokumen PDF',
            ],
            correctIndex: 1,
            explanation:
              'Integrasi GitHub + Vercel mengotomatiskan proses build dan deployment setiap ada pembaruan kode.',
          },
          {
            id: 'q-gv-3',
            question: 'Pesan commit manakah yang paling baik dan informatif untuk kolaborasi tim?',
            options: [
              '"update"',
              '"asdfg"',
              '"Perbaiki validasi tanggal tenggat pada form tambah tugas"',
              '"coba lagi"',
            ],
            correctIndex: 2,
            explanation:
              'Pesan commit yang jelas menjelaskan perubahan spesifik sehingga rekan tim mudah melacak riwayat proyek.',
          },
        ],
      },
    ],

    progressLogs: [
      {
        id: 'log-1',
        date: addDaysIso(today, -21),
        weekLabel: 'Pekan 1',
        topicId: 'dampak-sosial',
        topicTitle: 'Dampak Sosial Informatika',
        understandingScore: 68,
        selfRating: 3,
        reflectionNote: 'Sudah paham dampak positif/negatif, perlu memperdalam cara cek fakta berita.',
        source: 'Check-in Mandiri',
      },
      {
        id: 'log-2',
        date: addDaysIso(today, -14),
        weekLabel: 'Pekan 2',
        topicId: 'dampak-sosial',
        topicTitle: 'Dampak Sosial Informatika',
        understandingScore: 92,
        selfRating: 5,
        reflectionNote: 'Berhasil menyelesaikan kuis topik dan tugas ringkasan artikel dampak sosial.',
        source: 'Kuis',
      },
      {
        id: 'log-3',
        date: addDaysIso(today, -14),
        weekLabel: 'Pekan 2',
        topicId: 'computer-system',
        topicTitle: 'Computer System (Input Proses Output)',
        understandingScore: 65,
        selfRating: 3,
        reflectionNote: 'Masih sering tertukar fungsi CU dan ALU di dalam CPU.',
        source: 'Check-in Mandiri',
      },
      {
        id: 'log-4',
        date: addDaysIso(today, -7),
        weekLabel: 'Pekan 3',
        topicId: 'computer-system',
        topicTitle: 'Computer System (Input Proses Output)',
        understandingScore: 80,
        selfRating: 4,
        reflectionNote: 'Sudah lebih lancar membedakan RAM vs SSD setelah mencoba simulator IPO.',
        source: 'Kuis',
      },
      {
        id: 'log-5',
        date: addDaysIso(today, -7),
        weekLabel: 'Pekan 3',
        topicId: 'perlindungan-data',
        topicTitle: 'Perlindungan Data Pribadi dan Jejak Digital',
        understandingScore: 72,
        selfRating: 4,
        reflectionNote: 'Mengerti beda jejak digital aktif dan pasif, tinggal praktik aktivasi 2FA.',
        source: 'Check-in Mandiri',
      },
      {
        id: 'log-6',
        date: addDaysIso(today, -3),
        weekLabel: 'Pekan 4',
        topicId: 'kewarganegaraan-digital',
        topicTitle: 'Kewarganegaraan Digital dan Perundungan Siber',
        understandingScore: 76,
        selfRating: 4,
        reflectionNote: 'Paham prinsip T.H.I.N.K. dan langkah pelaporan cyberbullying.',
        source: 'Kuis',
      },
      {
        id: 'log-7',
        date: addDaysIso(today, -1),
        weekLabel: 'Pekan 4',
        topicId: 'vibe-coding',
        topicTitle: 'Vibe Coding',
        understandingScore: 68,
        selfRating: 3,
        reflectionNote: 'Mulai terbiasa menulis spesifikasi fitur yang rapi sebelum iterasi.',
        source: 'Check-in Mandiri',
      },
    ],
  };
}
