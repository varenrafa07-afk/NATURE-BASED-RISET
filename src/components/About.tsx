import { Leaf, Microscope, Mountain, Droplets, Trees, FlaskConical, GraduationCap, BookOpen, Target, Recycle } from 'lucide-react';

const values = [
  { icon: Microscope, title: 'Penelitian Ilmiah', desc: 'Menerapkan metode ilmiah dalam setiap kegiatan penelitian alam.' },
  { icon: Mountain, title: 'Eksplorasi Alam', desc: 'Mengenal lingkungan sekitar melalui observasi langsung di alam.' },
  { icon: FlaskConical, title: 'Design For Change', desc: 'Menemukan masalah, merancang solusi, dan menghasilkan inovasi.' },
  { icon: Recycle, title: 'Peduli Lingkungan', desc: 'Membangun kesadaran untuk menjaga dan melestarikan lingkungan.' },
];

const themes = [
  { emoji: '🌱', label: 'Lingkungan' },
  { emoji: '🌳', label: 'Keanekaragaman Hayati' },
  { emoji: '💧', label: 'Air dan Sungai' },
  { emoji: '🌾', label: 'Pertanian' },
  { emoji: '🌿', label: 'Tumbuhan' },
  { emoji: '🐾', label: 'Hewan' },
  { emoji: '♻️', label: 'Pengelolaan Sampah' },
  { emoji: '🌍', label: 'Perubahan Lingkungan' },
  { emoji: '🌦️', label: 'Cuaca dan Iklim' },
  { emoji: '🔎', label: 'Tema Lainnya' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 shadow-xl mb-6">
            <Leaf className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Tentang Nature Based Research
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kokurikuler Berbasis Penelitian dan Eksplorasi Alam
          </p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Apa itu NBR?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>Nature Based Research (NBR)</strong> adalah kegiatan kokurikuler yang mengajak siswa
            untuk melakukan penelitian dan eksplorasi berbasis lingkungan dan alam. Melalui program ini,
            siswa belajar mengamati lingkungan sekitar, merumuskan masalah, merancang penelitian,
            dan menemukan solusi yang nyata untuk lingkungan.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Dengan pendekatan <strong>Design For Change (DFC)</strong>, siswa diajak untuk merasakan,
            membayangkan, melakukan, dan berbagi perubahan positif bagi alam sekitar mereka.
            Setiap karya penelitian didokumentasikan dalam arsip digital sekolah ini.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* DFC Steps */}
        <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-6 sm:p-8 mb-8 text-white">
          <h2 className="text-xl font-bold mb-6">Tahapan Design For Change (DFC)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Feel', desc: 'Merasakan dan mengamati masalah di lingkungan', icon: Leaf },
              { step: '2', title: 'Imagine', desc: 'Membayangkan solusi yang mungkin dilakukan', icon: Target },
              { step: '3', title: 'Do', desc: 'Melakukan aksi nyata untuk perubahan', icon: FlaskConical },
              { step: '4', title: 'Share', desc: 'Berbagi hasil dan inspirasi dengan orang lain', icon: BookOpen },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                      {s.step}
                    </span>
                    <Icon className="w-5 h-5 text-green-200" />
                  </div>
                  <h3 className="font-bold mb-1">{s.title}</h3>
                  <p className="text-sm text-green-100">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Themes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tema Penelitian</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {themes.map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
                <span className="text-xl">{t.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tujuan Aplikasi</h2>
          <div className="space-y-3">
            {[
              'Menjadi pusat dokumentasi digital kegiatan kokurikuler berbasis penelitian alam.',
              'Mengumpulkan dan menyimpan hasil karya setiap kelompok secara permanen.',
              'Memudahkan siswa dan guru untuk berbagi hasil penelitian tanpa perlu login.',
              'Menjadi arsip digital sekolah yang dapat diakses kapan saja.',
              'Mendorong siswa untuk peduli dan aktif dalam menjaga lingkungan.',
            ].map((goal, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-green-600" />
                </div>
                <p className="text-gray-600">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
