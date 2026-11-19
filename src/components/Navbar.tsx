import { useState, useEffect } from 'react';
import { Leaf, Home, Microscope, Upload, Images, Video, BarChart3, Info, Menu, X } from 'lucide-react';

export type PageId =
  | 'home'
  | 'projects'
  | 'upload'
  | 'gallery'
  | 'videos'
  | 'recap'
  | 'about';

interface NavbarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
}

const menuItems: { id: PageId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'projects', label: 'Daftar Proyek', icon: Microscope },
  { id: 'upload', label: 'Upload Proyek', icon: Upload },
  { id: 'gallery', label: 'Galeri Foto', icon: Images },
  { id: 'videos', label: 'Galeri Video', icon: Video },
  { id: 'recap', label: 'Rekapitulasi', icon: BarChart3 },
  { id: 'about', label: 'Tentang NBR', icon: Info },
];

export default function Navbar({ current, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-green-900/5'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md shadow-green-600/30 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-green-800 leading-tight tracking-wide">
                NATURE BASED RESEARCH
              </span>
              <span className="block text-xs font-semibold text-emerald-600 leading-tight tracking-widest">
                SMANDASA
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-green-50"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
