import { Leaf, Microscope, Upload, Images, Info, ArrowRight, Mountain, Droplets, Trees, FlaskConical } from 'lucide-react';
import type { PageId } from './Navbar';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

const heroImage = 'https://images.pexels.com/photos/9871907/pexels-photo-9871907.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const studentImage = '/WhatsApp_Image_2026-09-10_at_14.05.08_(1).jpeg';

const features = [
  { icon: Microscope, title: 'Penelitian Ilmiah', desc: 'Siswa melakukan observasi dan penelitian langsung di alam dengan metode ilmiah.' },
  { icon: Droplets, title: 'Eksplorasi Alam', desc: 'Mengenal lingkungan, hutan, sungai, dan keanekaragaman hayati secara langsung.' },
  { icon: FlaskConical, title: 'Design For Change', desc: 'Menemukan solusi dan menghasilkan inovasi untuk lingkungan yang lebih baik.' },
  { icon: Trees, title: 'Arsip Digital', desc: 'Dokumentasi karya siswa tersimpan permanen sebagai arsip digital sekolah.' },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hutan dan sungai"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 via-green-900/60 to-green-950/80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white py-24">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/95 backdrop-blur-md mb-6 shadow-2xl border border-white/30 p-2">
            <img
              src="/logo_sma.png"
              alt="Logo SMA Negeri 10 Purworejo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            NATURE BASED RESEARCH
          </h1>
          <p className="text-lg sm:text-xl text-green-100 font-medium mb-3 max-w-3xl mx-auto">
            Kokurikuler Berbasis Penelitian dan Pemanfaatan Lingkungan Alam
          </p>
          <p className="text-base sm:text-lg text-green-200/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Kegiatan penelitian yang berfokus pada studi, pengamatan, dan pemanfaatan lingkungan alam serta interaksi manusia dengan alam dengan framework FIDS (feel, imagine, do, dan share)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('projects')}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold shadow-lg shadow-green-500/30 transition-all hover:scale-105"
            >
              <Microscope className="w-5 h-5" />
              Lihat Proyek Penelitian
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-semibold border border-white/20 transition-all hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              Upload Proyek Kelompok
            </button>
            <button
              onClick={() => onNavigate('gallery')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-semibold border border-white/20 transition-all hover:scale-105"
            >
              <Images className="w-5 h-5" />
              Galeri Kegiatan
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-semibold border border-white/20 transition-all hover:scale-105"
            >
              <Info className="w-5 h-5" />
              Tentang NBR
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-3">
              Mengenal NBR
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Penelitian Alam untuk Siswa
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              NBR adalah kegiatan kokurikuler yang mengajak siswa meneliti, mengeksplorasi, dan menjaga lingkungan sekitar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-green-500/30">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image + text section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={studentImage}
              alt="Ibu guru mengajak penelitian"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-green-600 text-white rounded-2xl p-6 shadow-xl hidden sm:block">
              <Mountain className="w-8 h-8 mb-2" />
              <p className="text-sm font-semibold">Belajar dari Alam</p>
            </div>
          </div>

          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-3">
              Design For Change (DFC)
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dari Observasi menjadi Inovasi
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Siswa diajak untuk mengamati lingkungan sekitar, merumuskan masalah,
              merancang penelitian, dan menemukan solusi yang nyata untuk alam.
              Setiap karya didokumentasikan dalam arsip digital sekolah.
            </p>
            <div className="space-y-3">
              {['Observasi langsung di alam', 'Penelitian dengan metode ilmiah', 'Dokumentasi digital permanen', 'Publikasi karya kelompok'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('upload')}
              className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/30 transition-all"
            >
              <Upload className="w-5 h-5" />
              Mulai Upload Proyek
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
