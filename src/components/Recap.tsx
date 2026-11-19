import { useState, useEffect, useCallback } from 'react';
import { BarChart3, FileText, Images, Video, Users, GraduationCap, Layers, Loader2, Download, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { getThemeMeta } from '@/lib/types';

export default function Recap() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nbr_projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
    } else if (data) {
      setProjects(data as Project[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalProjects = projects.length;
  const totalGroups = new Set(projects.map((p) => p.group_name)).size;
  const totalClasses = new Set(projects.map((p) => p.class_name)).size;
  const totalPhotos = projects.reduce((sum, p) => sum + p.photos.length, 0);
  const totalVideos = projects.reduce((sum, p) => sum + p.videos.length, 0);
  const totalFiles = projects.filter((p) => p.research_file_url).length;

  const stats = [
    { label: 'Total Proyek', value: totalProjects, icon: BarChart3, color: 'from-green-500 to-emerald-600' },
    { label: 'Jumlah Kelompok', value: totalGroups, icon: Users, color: 'from-blue-500 to-cyan-600' },
    { label: 'Kelas Berpartisipasi', value: totalClasses, icon: GraduationCap, color: 'from-amber-500 to-orange-600' },
    { label: 'File Penelitian', value: totalFiles, icon: FileText, color: 'from-teal-500 to-green-600' },
    { label: 'Foto Kegiatan', value: totalPhotos, icon: Images, color: 'from-emerald-500 to-teal-600' },
    { label: 'Video Kegiatan', value: totalVideos, icon: Video, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rekapitulasi Proyek</h1>
              <p className="text-gray-600 text-sm">Statistik dan data seluruh proyek penelitian</p>
            </div>
          </div>
        </div>

        {/* Stats dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada proyek yang diunggah</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-green-50 text-green-800 text-left">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">No</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Judul Penelitian</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Kelompok</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Kelas</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Tema</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Guru Pembimbing</th>
                    <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">File</th>
                    <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Foto</th>
                    <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Video</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((p, i) => {
                    const themeMeta = getThemeMeta(p.theme);
                    return (
                      <tr key={p.id} className="hover:bg-green-50/50 transition-colors">
                        <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{p.title}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.group_name}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.class_name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                            {themeMeta.emoji} {p.theme}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.teacher}</td>
                        <td className="px-4 py-3 text-center">
                          {p.research_file_url ? (
                            <a href={p.research_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600" title={p.research_file_name || 'File'}>
                              <Download className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600 font-medium">{p.photos.length}</td>
                        <td className="px-4 py-3 text-center text-gray-600 font-medium">{p.videos.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
