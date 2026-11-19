import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Microscope, Users, GraduationCap, Calendar, User, ArrowRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { getThemeMeta } from '@/lib/types';
import type { PageId } from './Navbar';

interface ProjectsProps {
  onNavigate: (page: PageId) => void;
  onSelectProject: (id: string) => void;
}

const defaultCover = 'https://images.pexels.com/photos/3656989/pexels-photo-3656989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function Projects({ onNavigate, onSelectProject }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterTheme, setFilterTheme] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nbr_projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch error', error);
    } else if (data) {
      setProjects(data as Project[]);
      const uniqueClasses = [...new Set(data.map((p) => p.class_name))].sort();
      const uniqueYears = [...new Set(data.map((p) => p.year))].sort((a, b) => b - a);
      setClasses(uniqueClasses);
      setYears(uniqueYears);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.group_name.toLowerCase().includes(q) ||
      p.class_name.toLowerCase().includes(q) ||
      p.leader_name.toLowerCase().includes(q) ||
      p.members.toLowerCase().includes(q) ||
      p.teacher.toLowerCase().includes(q) ||
      p.theme.toLowerCase().includes(q);
    const matchClass = !filterClass || p.class_name === filterClass;
    const matchTheme = !filterTheme || p.theme === filterTheme;
    const matchYear = !filterYear || p.year.toString() === filterYear;
    return matchSearch && matchClass && matchTheme && matchYear;
  });

  const themes = [...new Set(projects.map((p) => p.theme))];

  const clearFilters = () => {
    setFilterClass('');
    setFilterTheme('');
    setFilterYear('');
    setSearch('');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Daftar Proyek Penelitian</h1>
              <p className="text-gray-600 text-sm">Seluruh proyek penelitian kelompok siswa</p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari proyek berdasarkan judul, kelompok, kelas, siswa, atau guru..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm bg-white"
              >
                <option value="">Semua Kelas</option>
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={filterTheme}
                onChange={(e) => setFilterTheme(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm bg-white"
              >
                <option value="">Semua Tema</option>
                {themes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm bg-white"
              >
                <option value="">Semua Tahun</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {(search || filterClass || filterTheme || filterYear) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors w-fit"
              >
                <X className="w-4 h-4" />
                Hapus filter
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Belum ada proyek yang ditemukan</p>
            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors"
            >
              Upload Proyek Pertama
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> proyek
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => {
                const themeMeta = getThemeMeta(p.theme);
                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={p.cover_url || (p.photos[0]?.url ?? defaultCover)}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-green-700">
                        {themeMeta.emoji} {p.theme}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.summary}</p>

                      <div className="space-y-1.5 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="truncate">{p.group_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{p.class_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="truncate">{p.teacher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{p.year}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectProject(p.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 hover:bg-green-600 text-green-700 hover:text-white font-semibold text-sm transition-all group/btn"
                      >
                        Lihat Detail
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
