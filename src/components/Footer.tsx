import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 text-white mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Leaf className="w-7 h-7 text-green-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-wide">NATURE BASED RESEARCH</h3>
                <p className="text-sm text-green-300">Kokurikuler Berbasis Penelitian Alam</p>
              </div>
            </div>
            <p className="text-sm text-green-200 leading-relaxed">
              Meneliti Alam, Menemukan Solusi, Menghasilkan Inovasi dengan Design For Change (DFC).
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-green-300 uppercase tracking-wider mb-4">
              Menu
            </h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>Beranda</li>
              <li>Daftar Proyek Penelitian</li>
              <li>Upload Proyek Kelompok</li>
              <li>Galeri Kegiatan</li>
              <li>Rekapitulasi Proyek</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-green-300 uppercase tracking-wider mb-4">
              Tentang NBR
            </h4>
            <p className="text-sm text-green-100 leading-relaxed">
              Platform dokumentasi digital kegiatan kokurikuler berbasis penelitian alam.
              Arsip digital karya siswa untuk lingkungan yang lebih baik.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-green-300">
          <p>&copy; {new Date().getFullYear()} Nature Based Research (NBR). Arsip Digital Sekolah.</p>
        </div>
      </div>
    </footer>
  );
}
