export interface PhotoItem {
  url: string;
  title: string;
  date: string;
  location: string;
}

export interface VideoItem {
  url: string;
  title: string;
  description: string;
  type: 'file' | 'link';
  groupName: string;
  className: string;
}

export interface Project {
  id: string;
  title: string;
  group_name: string;
  class_name: string;
  leader_name: string;
  members: string;
  teacher: string;
  theme: string;
  summary: string;
  background: string;
  question: string;
  objectives: string;
  hypothesis: string;
  benefits: string;
  theory_basis: string;
  literature_review: string;
  research_time_place: string;
  tools_materials: string;
  research_procedure: string;
  data_processing: string;
  budget: string;
  schedule: string;
  references_list: string;
  method: string;
  results: string;
  conclusion: string;
  year: number;
  cover_url: string | null;
  research_file_url: string | null;
  research_file_name: string | null;
  edit_code_hash: string;
  photos: PhotoItem[];
  videos: VideoItem[];
  created_at: string;
}

export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'edit_code_hash'> & {
  edit_code_hash: string;
};

export const THEMES = [
  { value: 'Lingkungan', label: 'Lingkungan', emoji: '🌱' },
  { value: 'Keanekaragaman Hayati', label: 'Keanekaragaman Hayati', emoji: '🌳' },
  { value: 'Air dan Sungai', label: 'Air dan Sungai', emoji: '💧' },
  { value: 'Pertanian', label: 'Pertanian', emoji: '🌾' },
  { value: 'Tumbuhan', label: 'Tumbuhan', emoji: '🌿' },
  { value: 'Hewan', label: 'Hewan', emoji: '🐾' },
  { value: 'Pengelolaan Sampah', label: 'Pengelolaan Sampah', emoji: '♻️' },
  { value: 'Perubahan Lingkungan', label: 'Perubahan Lingkungan', emoji: '🌍' },
  { value: 'Cuaca dan Iklim', label: 'Cuaca dan Iklim', emoji: '🌦️' },
  { value: 'Tema Lainnya', label: 'Tema Lainnya', emoji: '🔎' },
] as const;

export function getThemeMeta(theme: string) {
  return THEMES.find((t) => t.value === theme) ?? { value: theme, label: theme, emoji: '🔎' };
}

// Research content sections matching the Word template
export interface ResearchSection {
  key: string;
  label: string;
  bab?: string;
  sub?: string;
}

export const RESEARCH_SECTIONS: ResearchSection[] = [
  { key: 'background', label: 'Latar Belakang', bab: 'BAB 1. PENDAHULUAN', sub: '1.1' },
  { key: 'question', label: 'Rumusan Masalah', sub: '1.2' },
  { key: 'objectives', label: 'Tujuan Penelitian', sub: '1.3' },
  { key: 'hypothesis', label: 'Hipotesis (jika ada)', sub: '1.4' },
  { key: 'benefits', label: 'Manfaat Penelitian', sub: '1.5' },
  { key: 'theory_basis', label: 'Landasan Teori', bab: 'BAB 2. TINJAUAN PUSTAKA', sub: '2.1' },
  { key: 'literature_review', label: 'Studi Pustaka', sub: '2.2' },
  { key: 'research_time_place', label: 'Waktu dan Tempat Penelitian', bab: 'BAB 3. METODE PENELITIAN', sub: '3.1' },
  { key: 'tools_materials', label: 'Alat dan Bahan', sub: '3.2' },
  { key: 'research_procedure', label: 'Rancangan dan Prosedur Penelitian', sub: '3.3' },
  { key: 'data_processing', label: 'Rancangan Pengolahan Data', sub: '3.4' },
  { key: 'budget', label: 'Rancangan Anggaran Biaya Penelitian', bab: 'BAB 4. RANCANGAN ANGGARAN BIAYA DAN JADWAL KEGIATAN', sub: '4.1' },
  { key: 'schedule', label: 'Jadwal Penelitian', sub: '4.2' },
  { key: 'references_list', label: 'Daftar Pustaka', bab: 'DAFTAR PUSTAKA' },
];
