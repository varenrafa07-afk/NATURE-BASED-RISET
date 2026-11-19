import { useState, useEffect, useCallback } from 'react';
import { Edit, FileText, Images, Video, CheckCircle, AlertCircle, Loader2, Trash2, Link as LinkIcon, Plus, Download, ArrowLeft, X } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { THEMES, RESEARCH_SECTIONS } from '@/lib/types';
import type { Project, PhotoItem, VideoItem } from '@/lib/types';
import { getFileIcon } from '@/lib/utils';
import type { PageId } from './Navbar';

interface EditProjectProps {
  projectId: string;
  onNavigate: (page: PageId) => void;
  onDone: () => void;
}

type Tab = 'info' | 'content' | 'files' | 'photos' | 'videos';

export default function EditProject({ projectId, onNavigate, onDone }: EditProjectProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tab, setTab] = useState<Tab>('info');

  const [title, setTitle] = useState('');
  const [groupName, setGroupName] = useState('');
  const [className, setClassName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [members, setMembers] = useState('');
  const [teacher, setTeacher] = useState('');
  const [theme, setTheme] = useState<string>(THEMES[0].value);
  const [customTheme, setCustomTheme] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState('');
  const [background, setBackground] = useState('');
  const [question, setQuestion] = useState('');
  const [objectives, setObjectives] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [benefits, setBenefits] = useState('');
  const [theoryBasis, setTheoryBasis] = useState('');
  const [literatureReview, setLiteratureReview] = useState('');
  const [researchTimePlace, setResearchTimePlace] = useState('');
  const [toolsMaterials, setToolsMaterials] = useState('');
  const [researchProcedure, setResearchProcedure] = useState('');
  const [dataProcessing, setDataProcessing] = useState('');
  const [budget, setBudget] = useState('');
  const [schedule, setSchedule] = useState('');
  const [referencesList, setReferencesList] = useState('');
  const [method, setMethod] = useState('');
  const [results, setResults] = useState('');
  const [conclusion, setConclusion] = useState('');

  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [newCover, setNewCover] = useState<File | null>(null);

  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [existingFileName, setExistingFileName] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);

  const [existingPhotos, setExistingPhotos] = useState<PhotoItem[]>([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoDate, setNewPhotoDate] = useState('');
  const [newPhotoLocation, setNewPhotoLocation] = useState('');

  const [existingVideos, setExistingVideos] = useState<VideoItem[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [newVideoMode, setNewVideoMode] = useState<'file' | 'link'>('link');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newVideoLink, setNewVideoLink] = useState('');

  const [lightbox, setLightbox] = useState<string | null>(null);

  const contentSetters: Record<string, (v: string) => void> = {
    background: setBackground,
    question: setQuestion,
    objectives: setObjectives,
    hypothesis: setHypothesis,
    benefits: setBenefits,
    theory_basis: setTheoryBasis,
    literature_review: setLiteratureReview,
    research_time_place: setResearchTimePlace,
    tools_materials: setToolsMaterials,
    research_procedure: setResearchProcedure,
    data_processing: setDataProcessing,
    budget: setBudget,
    schedule: setSchedule,
    references_list: setReferencesList,
  };
  const contentValues: Record<string, string> = {
    background,
    question,
    objectives,
    hypothesis,
    benefits,
    theory_basis: theoryBasis,
    literature_review: literatureReview,
    research_time_place: researchTimePlace,
    tools_materials: toolsMaterials,
    research_procedure: researchProcedure,
    data_processing: dataProcessing,
    budget,
    schedule,
    references_list: referencesList,
  };

  const loadProject = useCallback(async () => {
    const { data, error } = await supabase
      .from('nbr_projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();
    if (error || !data) {
      setError('Gagal memuat data proyek.');
      setLoading(false);
      return;
    }
    const p = data as Project;
    setTitle(p.title);
    setGroupName(p.group_name);
    setClassName(p.class_name);
    setLeaderName(p.leader_name);
    setMembers(p.members);
    setTeacher(p.teacher);
    setTheme(p.theme);
    if (!THEMES.some((t) => t.value === p.theme)) {
      setCustomTheme(p.theme);
      setTheme('Tema Lainnya');
    }
    setYear(p.year);
    setSummary(p.summary);
    setBackground(p.background);
    setQuestion(p.question);
    setObjectives(p.objectives);
    setHypothesis(p.hypothesis ?? '');
    setBenefits(p.benefits ?? '');
    setTheoryBasis(p.theory_basis ?? '');
    setLiteratureReview(p.literature_review ?? '');
    setResearchTimePlace(p.research_time_place ?? '');
    setToolsMaterials(p.tools_materials ?? '');
    setResearchProcedure(p.research_procedure ?? '');
    setDataProcessing(p.data_processing ?? '');
    setBudget(p.budget ?? '');
    setSchedule(p.schedule ?? '');
    setReferencesList(p.references_list ?? '');
    setMethod(p.method);
    setResults(p.results);
    setConclusion(p.conclusion);
    setExistingCover(p.cover_url);
    setExistingFileUrl(p.research_file_url);
    setExistingFileName(p.research_file_name);
    setExistingPhotos(p.photos || []);
    setExistingVideos(p.videos || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewPhotoSelect = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setNewPhotoFiles((prev) => [...prev, ...arr]);
    setNewPhotoPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingVideo = (index: number) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewVideo = () => {
    if (newVideoMode === 'link' && newVideoLink) {
      setExistingVideos((prev) => [...prev, {
        url: newVideoLink, title: newVideoTitle, description: newVideoDesc,
        type: 'link', groupName, className,
      }]);
      setNewVideoTitle(''); setNewVideoDesc(''); setNewVideoLink('');
    } else if (newVideoMode === 'file' && newVideoFile) {
      setNewPhotoFiles((prev) => prev);
      setExistingVideos((prev) => [...prev, {
        url: '__pending_upload__', title: newVideoTitle, description: newVideoDesc,
        type: 'file', groupName, className,
      }]);
      setNewVideoFile(null); setNewVideoTitle(''); setNewVideoDesc('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      let coverUrl = existingCover;
      if (newCover) {
        coverUrl = await uploadFile(newCover, 'covers');
      }

      let researchFileUrl = existingFileUrl;
      let researchFileName = existingFileName;
      if (removeFile) {
        researchFileUrl = null;
        researchFileName = null;
      }
      if (newFile) {
        researchFileUrl = await uploadFile(newFile, 'documents');
        researchFileName = newFile.name;
      }

      const photos = [...existingPhotos];
      for (let i = 0; i < newPhotoFiles.length; i++) {
        const url = await uploadFile(newPhotoFiles[i], 'photos');
        photos.push({
          url,
          title: newPhotoTitle || `Foto Kegiatan ${existingPhotos.length + i + 1}`,
          date: newPhotoDate || new Date().toISOString().slice(0, 10),
          location: newPhotoLocation,
        });
      }

      const videos: VideoItem[] = [];
      for (const v of existingVideos) {
        if (v.url === '__pending_upload__' && newVideoFile) {
          const url = await uploadFile(newVideoFile, 'videos');
          videos.push({ ...v, url });
        } else if (v.url !== '__pending_upload__') {
          videos.push(v);
        }
      }

      const finalTheme = theme === 'Tema Lainnya' ? customTheme.trim() : theme;
      if (theme === 'Tema Lainnya' && !finalTheme) {
        setError('Silakan tuliskan tema penelitian Anda.');
        setSaving(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('nbr_projects')
        .update({
          title, group_name: groupName, class_name: className,
          leader_name: leaderName, members, teacher, theme: finalTheme, year,
          summary, background, question, objectives,
          hypothesis, benefits,
          theory_basis: theoryBasis, literature_review: literatureReview,
          research_time_place: researchTimePlace, tools_materials: toolsMaterials,
          research_procedure: researchProcedure, data_processing: dataProcessing,
          budget, schedule, references_list: referencesList,
          method, results, conclusion,
          cover_url: coverUrl,
          research_file_url: researchFileUrl,
          research_file_name: researchFileName,
          photos, videos,
        })
        .eq('id', projectId);

      if (updateError) throw updateError;
      setSuccess(true);
    } catch (e) {
      console.error(e);
      setError('Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Perubahan Tersimpan!</h2>
          <p className="text-gray-600 mb-6">Proyek Anda telah berhasil diperbarui.</p>
          <button onClick={onDone} className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors">
            Lihat Proyek
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Edit }[] = [
    { id: 'info', label: 'Identitas', icon: Edit },
    { id: 'content', label: 'Isi Penelitian', icon: FileText },
    { id: 'files', label: 'File', icon: FileText },
    { id: 'photos', label: 'Foto', icon: Images },
    { id: 'videos', label: 'Video', icon: Video },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Foto" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onDone} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Detail Proyek
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Proyek</h1>
              <p className="text-gray-600 text-sm">Edit semua data proyek kelompok Anda</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  active ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-100'
                }`}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {tab === 'info' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Kelompok</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Judul Penelitian" required>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Nama Kelompok" required>
                  <input value={groupName} onChange={(e) => setGroupName(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Kelas" required>
                  <input value={className} onChange={(e) => setClassName(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Nama Ketua Kelompok" required>
                  <input value={leaderName} onChange={(e) => setLeaderName(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Nama Anggota Kelompok">
                  <textarea value={members} onChange={(e) => setMembers(e.target.value)} className={inputClass} rows={2} />
                </Field>
                <Field label="Nama Guru Pembimbing" required>
                  <input value={teacher} onChange={(e) => setTeacher(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Tema Penelitian" required>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)} className={inputClass}>
                    {THEMES.map((t) => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
                  </select>
                </Field>
                {theme === 'Tema Lainnya' && (
                  <Field label="Tuliskan Tema Penelitian" required>
                    <input
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                      className={inputClass}
                      placeholder="Tema penelitian kelompok Anda"
                    />
                  </Field>
                )}
                <Field label="Tahun Kegiatan">
                  <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())} className={inputClass} />
                </Field>
              </div>
            </div>
          )}

          {tab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Isi Penelitian</h2>
              <Field label="Ringkasan Penelitian" required>
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass} rows={2} />
              </Field>
              {RESEARCH_SECTIONS.map((s) => (
                <div key={s.key}>
                  {s.bab && (
                    <div className="mt-6 mb-2">
                      <p className="text-base font-bold text-green-800 border-b-2 border-green-600 pb-1">{s.bab}</p>
                    </div>
                  )}
                  <Field label={s.sub ? `${s.sub}  ${s.label}` : s.label}>
                    <textarea
                      value={contentValues[s.key] ?? ''}
                      onChange={(e) => contentSetters[s.key]?.(e.target.value)}
                      className={inputClass}
                      rows={3}
                    />
                  </Field>
                </div>
              ))}
            </div>
          )}

          {tab === 'files' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">File Penelitian & Cover</h2>

              {/* Cover */}
              <Field label="Foto Cover Proyek">
                {existingCover && !newCover && (
                  <div className="mb-3 relative inline-block">
                    <img src={existingCover} alt="Cover" className="w-40 h-40 object-cover rounded-xl border border-gray-200" />
                    <button onClick={() => setExistingCover(null)}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {newCover && <p className="mb-2 text-sm text-green-600 flex items-center gap-1.5"><Images className="w-4 h-4" /> {newCover.name}</p>}
                <input type="file" accept="image/*" onChange={(e) => setNewCover(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" />
              </Field>

              {/* Research file */}
              <Field label="File Penelitian">
                {existingFileUrl && !removeFile && (
                  <div className="mb-3 flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                    <span className="text-2xl">{getFileIcon(existingFileName)}</span>
                    <span className="text-sm text-gray-700 truncate flex-1">{existingFileName || 'File penelitian'}</span>
                    <a href={existingFileUrl} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200">
                      <Download className="w-4 h-4" />
                    </a>
                    <button onClick={() => setRemoveFile(true)}
                      className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {removeFile && <p className="mb-2 text-sm text-red-500">File akan dihapus saat disimpan</p>}
                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" />
                {newFile && <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5"><FileText className="w-4 h-4" /> {newFile.name}</p>}
              </Field>
            </div>
          )}

          {tab === 'photos' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Foto Kegiatan</h2>

              {existingPhotos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Foto yang sudah ada (klik untuk hapus):</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                    {existingPhotos.map((photo, i) => (
                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover cursor-pointer" onClick={() => setLightbox(photo.url)} />
                        <button onClick={() => removeExistingPhoto(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Tambah foto baru:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <input value={newPhotoTitle} onChange={(e) => setNewPhotoTitle(e.target.value)} className={inputClass} placeholder="Keterangan foto" />
                  <input type="date" value={newPhotoDate} onChange={(e) => setNewPhotoDate(e.target.value)} className={inputClass} />
                  <input value={newPhotoLocation} onChange={(e) => setNewPhotoLocation(e.target.value)} className={inputClass} placeholder="Lokasi" />
                </div>
                <input type="file" accept="image/*" multiple onChange={(e) => handleNewPhotoSelect(e.target.files)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" />
                {newPhotoPreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
                    {newPhotoPreviews.map((src, i) => (
                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={src} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                        <button onClick={() => removeNewPhoto(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">{newPhotoFiles.length} foto baru dipilih</p>
              </div>
            </div>
          )}

          {tab === 'videos' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Video Kegiatan</h2>

              {existingVideos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Video yang sudah ada:</p>
                  <div className="space-y-2 mb-4">
                    {existingVideos.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <Video className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{v.title}</p>
                          <p className="text-xs text-gray-400 truncate">{v.url}</p>
                        </div>
                        <button onClick={() => removeExistingVideo(i)}
                          className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Tambah video baru:</p>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setNewVideoMode('link')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${newVideoMode === 'link' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <LinkIcon className="w-4 h-4" /> Link
                  </button>
                  <button onClick={() => setNewVideoMode('file')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${newVideoMode === 'file' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Video className="w-4 h-4" /> Upload
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} className={inputClass} placeholder="Judul video" />
                  <input value={newVideoDesc} onChange={(e) => setNewVideoDesc(e.target.value)} className={inputClass} placeholder="Deskripsi" />
                </div>
                {newVideoMode === 'link' ? (
                  <input value={newVideoLink} onChange={(e) => setNewVideoLink(e.target.value)} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
                ) : (
                  <input type="file" accept="video/*" onChange={(e) => setNewVideoFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" />
                )}
                <button onClick={addNewVideo}
                  className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-medium text-sm transition-colors">
                  <Plus className="w-4 h-4" /> Tambah Video
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save bar */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={onDone}
            className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">
            Batal
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm shadow-lg shadow-green-600/30 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm bg-white';
