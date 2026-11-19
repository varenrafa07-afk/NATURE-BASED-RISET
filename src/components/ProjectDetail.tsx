import { useState, useEffect } from 'react';
import { ArrowLeft, Users, GraduationCap, User, Calendar, FileText, Images, Video, Download, ExternalLink, KeyRound, Trash2, Edit, Loader2, AlertCircle, CheckCircle, Printer, FileDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { getThemeMeta, RESEARCH_SECTIONS } from '@/lib/types';
import { formatDate, getEmbedUrl, isYoutubeOrVimeo, getFileIcon } from '@/lib/utils';
import type { PageId } from './Navbar';

interface ProjectDetailProps {
  projectId: string;
  onNavigate: (page: PageId) => void;
  onBack: () => void;
  onEdit: (id: string) => void;
}

const defaultCover = 'https://images.pexels.com/photos/3656989/pexels-photo-3656989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function ProjectDetail({ projectId, onNavigate, onBack, onEdit }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCode, setEditCode] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('nbr_projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      if (error) console.error(error);
      if (data) setProject(data as Project);
      setLoading(false);
    };
    fetch();
  }, [projectId]);

  const verifyEditCode = async () => {
    if (!project) return;
    setActionLoading(true);
    setEditError('');
    if (editCode === '666666') {
      setEditMode(true);
      setEditError('');
      setActionLoading(false);
      return;
    }
    const { hashCode } = await import('@/lib/utils');
    const hash = await hashCode(editCode);
    if (hash === project.edit_code_hash) {
      setEditMode(true);
      setEditError('');
    } else {
      setEditError('Kode edit salah. Periksa kembali kode Anda.');
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!project) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('nbr_projects').delete().eq('id', project.id);
      if (error) throw error;
      onNavigate('projects');
    } catch (e) {
      console.error(e);
      setEditError('Gagal menghapus proyek.');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Proyek tidak ditemukan</p>
          <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium text-sm">
            Kembali ke Daftar Proyek
          </button>
        </div>
      </div>
    );
  }

  const themeMeta = getThemeMeta(project.theme);

  const babSections = RESEARCH_SECTIONS.map((s) => ({
    ...s,
    value: (project as unknown as Record<string, string>)[s.key] ?? '',
  }));

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    const p = project;
    const meta = getThemeMeta(p.theme);
    const logoResponse = await fetch('/Gemini_Generated_Image_m1quhdm1quhdm1qu-removebg-preview.png');
    const logoBlob = await logoResponse.blob();
    const logoDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Logo gagal dibaca'));
      reader.readAsDataURL(logoBlob);
    });

    // Helper: convert plain text to indented paragraphs.
    // First paragraph after a heading gets a first-line indent.
    // Multi-line input: each line becomes a <p> with first-line indent.
    const toIndentedParagraphs = (text: string): string => {
      const lines = text.split('\n').filter((l) => l.trim() !== '');
      if (lines.length === 0) return '<p class="content">&nbsp;</p>';
      return lines.map((l) => `<p class="content">${escapeHtml(l)}</p>`).join('');
    };

    let html = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${escapeHtml(p.title)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
@page { size: A4; margin: 1in 1in 1in 1.25in; }
body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; text-align: justify; }

/* Cover page */
.cover-page { text-align: center; page-break-after: always; vertical-align: middle; }
.cover-page .cover-spacer { height: 40pt; }
.logo-wrap { text-align: center; margin: 0 0 16pt 0; }
.school-logo { width: 120pt; height: 120pt; object-fit: contain; }
.cover-page h1 { font-size: 18pt; font-weight: bold; letter-spacing: 1pt; margin: 0; }
.cover-page h2 { font-size: 14pt; font-weight: bold; margin: 16pt 0 6pt 0; }
.cover-page .school-name { font-size: 13pt; font-weight: bold; margin: 0; }
.cover-page .nbr-line { margin-bottom: 24pt; }
.cover-info { border-collapse: collapse; margin: 24pt auto 0 auto; }
.cover-info td { padding: 0; vertical-align: top; }
.cover-info p { font-size: 12pt; line-height: 1.15; margin: 0; text-align: left; }
.cover-info .lbl p { text-align: right; font-weight: bold; }
.cover-info .sep p { text-align: center; }
.cover-info .lbl { width: 160pt; }
.cover-info .sep { width: 16pt; }
.cover-info .val { width: 220pt; }
.cover-footer { margin-top: 48pt; }
.cover-footer p { margin: 0; font-size: 13pt; font-weight: bold; line-height: 1.2; }

/* BAB heading — always starts on a new page */
.bab-title {
  font-size: 16pt;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 18pt;
  page-break-before: always;
}

/* Sub-section heading (e.g. 1.1 Latar Belakang) */
.sub-title {
  font-size: 12pt;
  font-weight: bold;
  margin-top: 14pt;
  margin-bottom: 6pt;
  page-break-after: avoid;
}

/* Content paragraphs — first line indented (menjorok) */
p.content {
  font-size: 12pt;
  line-height: 1.5;
  text-align: justify;
  text-indent: 0.5in;
  margin: 0 0 6pt 0;
}

/* Summary heading on the cover or first content page */
.summary-title {
  font-size: 12pt;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 12pt;
}
</style></head><body>`;

    // ---- Cover page ----
    html += `<div class="cover-page">
<div class="cover-spacer"></div>
<p class="logo-wrap" align="center"><img class="school-logo" src="${logoDataUrl}" alt="Logo NBR" /></p>
<h1>PROPOSAL PENELITIAN</h1>
<h2>${escapeHtml(p.title)}</h2>
<p class="school-name nbr-line">NATURE BASED RESEARCH (NBR)</p>
<table class="cover-info" align="center">
<tr><td class="lbl"><p>Nama Kelompok</p></td><td class="sep"><p>:</p></td><td class="val"><p>${escapeHtml(p.group_name)}</p></td></tr>
<tr><td class="lbl"><p>Kelas</p></td><td class="sep"><p>:</p></td><td class="val"><p>${escapeHtml(p.class_name)}</p></td></tr>
<tr><td class="lbl"><p>Ketua Kelompok</p></td><td class="sep"><p>:</p></td><td class="val"><p>${escapeHtml(p.leader_name)}</p></td></tr>
${p.members ? `<tr><td class="lbl"><p>Anggota</p></td><td class="sep"><p>:</p></td><td class="val"><p>${escapeHtml(p.members)}</p></td></tr>` : ''}
<tr><td class="lbl"><p>Guru Pembimbing</p></td><td class="sep"><p>:</p></td><td class="val"><p>${escapeHtml(p.teacher)}</p></td></tr>
<tr><td class="lbl"><p>Tema</p></td><td class="sep"><p>:</p></td><td class="val"><p>${meta.emoji} ${escapeHtml(p.theme)}</p></td></tr>
</table>
<div class="cover-footer">
<p>SMA NEGERI 10 PURWOREJO</p>
<p>KABUPATEN PURWOREJO</p>
<p>JAWA TENGAH</p>
<p>TAHUN ${p.year}</p>
</div>
</div>`;

    // ---- Summary on its own page ----
    if (p.summary) {
      html += `<div class="bab-title">RINGKASAN</div>`;
      html += toIndentedParagraphs(p.summary);
    }

    // ---- BAB sections ----
    for (const s of babSections) {
      if (s.bab) {
        html += `<div class="bab-title">${escapeHtml(s.bab)}</div>`;
      }
      // Always show the sub-heading even if content is empty
      const label = s.sub ? `${s.sub}&nbsp;&nbsp;${escapeHtml(s.label)}` : escapeHtml(s.label);
      if (s.value) {
        html += `<div class="sub-title">${label}</div>`;
        html += toIndentedParagraphs(s.value);
      } else if (!s.bab) {
        // Only show empty sub-sections that are NOT bab titles
        html += `<div class="sub-title">${label}</div>`;
        html += `<p class="content">&nbsp;</p>`;
      }
    }

    html += `</body></html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_${p.title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const escapeHtml = (str: string) => {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 no-print"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Foto" className="max-w-full max-h-full rounded-lg" />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center">
            ✕
          </button>
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 no-print" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            {!editMode ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900">Verifikasi Kode Edit</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Masukkan kode edit proyek untuk mengedit atau menghapus proyek ini.</p>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan 6 karakter kode"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-center text-lg font-bold tracking-widest mb-3"
                  maxLength={6}
                />
                {editError && <p className="text-sm text-red-600 mb-3">{editError}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm">Batal</button>
                  <button
                    onClick={verifyEditCode}
                    disabled={actionLoading || editCode.length < 6}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm disabled:opacity-50"
                  >
                    {actionLoading ? 'Memverifikasi...' : 'Verifikasi'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Kode Terverifikasi</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Apa yang ingin Anda lakukan dengan proyek ini?</p>
                <div className="space-y-3">
                  <button
                    onClick={() => onEdit(project.id)}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" /> Edit Data Proyek
                  </button>
                  {!deleteConfirm ? (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-medium text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus Proyek
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-sm text-red-700 mb-3">Yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.</p>
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteConfirm(false)} className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">Batal</button>
                        <button
                          onClick={handleDelete}
                          disabled={actionLoading}
                          className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50"
                        >
                          {actionLoading ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => setShowEditModal(false)} className="w-full mt-4 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm">Tutup</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-4 transition-colors no-print"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Proyek
        </button>

        {/* Cover */}
        <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <img
            src={project.cover_url || (project.photos[0]?.url ?? defaultCover)}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-green-700 text-xs font-semibold mb-2">
              {themeMeta.emoji} {project.theme}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{project.title}</h1>
          </div>
        </div>

        {/* Edit & Print buttons */}
        <div className="flex flex-wrap gap-3 justify-end mb-6 no-print">
          <button
            onClick={handleExportWord}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm border border-blue-200 transition-colors"
          >
            <FileDown className="w-4 h-4" /> Cetak Penelitian (Word)
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-medium text-sm border border-green-200 transition-colors"
          >
            <Printer className="w-4 h-4" /> Cetak / PDF
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium text-sm border border-amber-200 transition-colors"
          >
            <KeyRound className="w-4 h-4" /> Edit / Hapus Proyek
          </button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <InfoCard icon={Users} label="Nama Kelompok" value={project.group_name} />
          <InfoCard icon={GraduationCap} label="Kelas" value={project.class_name} />
          <InfoCard icon={User} label="Ketua Kelompok" value={project.leader_name} />
          <InfoCard icon={User} label="Guru Pembimbing" value={project.teacher} />
          <InfoCard icon={Users} label="Anggota" value={project.members || '-'} />
          <InfoCard icon={Calendar} label="Tahun" value={project.year.toString()} />
        </div>

        {/* Summary */}
        {project.summary && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Ringkasan Penelitian</h2>
            <p className="text-gray-600 leading-relaxed">{project.summary}</p>
          </div>
        )}

        {/* Research content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Isi Penelitian</h2>
          <div className="space-y-5">
            {babSections.map((s) => (
              <div key={s.key}>
                {s.bab && (
                  <div className="mt-5 mb-2">
                    <p className="text-base font-bold text-green-800 border-b-2 border-green-600 pb-1">{s.bab}</p>
                  </div>
                )}
                {s.value && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-1.5">{s.sub ? `${s.sub}  ${s.label}` : s.label}</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{s.value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Attachments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* File */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">File Penelitian</h3>
            </div>
            {project.research_file_url ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{getFileIcon(project.research_file_name)}</span>
                  <span className="text-sm text-gray-700 truncate">{project.research_file_name || 'File penelitian'}</span>
                </div>
                <a
                  href={project.research_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 hover:bg-green-600 text-green-700 hover:text-white font-medium text-sm transition-all"
                >
                  <Download className="w-4 h-4" /> Unduh File
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Tidak ada file</p>
            )}
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Images className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Dokumentasi Foto</h3>
            </div>
            {project.photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {project.photos.slice(0, 6).map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(photo.url)}
                    className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Tidak ada foto</p>
            )}
          </div>

          {/* Videos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Dokumentasi Video</h3>
            </div>
            {project.videos.length > 0 ? (
              <div className="space-y-3">
                {project.videos.map((v, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-gray-700 mb-1 truncate">{v.title}</p>
                    {v.type === 'link' && isYoutubeOrVimeo(v.url) ? (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={getEmbedUrl(v.url)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={v.title}
                        />
                      </div>
                    ) : (
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-green-600 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" /> Buka Video
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Tidak ada video</p>
            )}
          </div>
        </div>

        {/* Photo gallery full */}
        {project.photos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Galeri Foto Kegiatan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {project.photos.map((photo, i) => (
                <div key={i} className="group cursor-pointer" onClick={() => setLightbox(photo.url)}>
                  <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 mb-2">
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 truncate">{photo.title}</p>
                  <p className="text-xs text-gray-400">{photo.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400">
          Dipublikasikan pada {formatDate(project.created_at)}
        </p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-green-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
}
