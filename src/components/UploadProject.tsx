import { useState } from 'react';
import { Upload, FileText, Images, Video, CheckCircle, AlertCircle, Loader2, Trash2, Link as LinkIcon, KeyRound, Copy, Users } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { THEMES, RESEARCH_SECTIONS } from '@/lib/types';
import type { PhotoItem, VideoItem } from '@/lib/types';
import { hashCode, generateEditCode } from '@/lib/utils';
import type { PageId } from './Navbar';

interface UploadProjectProps {
  onNavigate: (page: PageId) => void;
}

type Step = 'info' | 'content' | 'files' | 'photos' | 'videos' | 'done';

export default function UploadProject({ onNavigate }: UploadProjectProps) {
  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editCode, setEditCode] = useState('');
  const [createdProjectId, setCreatedProjectId] = useState('');

  // Info fields
  const [title, setTitle] = useState('');
  const [groupName, setGroupName] = useState('');
  const [className, setClassName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [members, setMembers] = useState('');
  const [teacher, setTeacher] = useState('');
  const [theme, setTheme] = useState<string>(THEMES[0].value);
  const [customTheme, setCustomTheme] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  // Content fields
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

  // Files
  const [fileTitle, setFileTitle] = useState('');
  const [fileDesc, setFileDesc] = useState('');
  const [researchFile, setResearchFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Photos
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDate, setPhotoDate] = useState('');
  const [photoLocation, setPhotoLocation] = useState('');

  // Videos
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoMode, setVideoMode] = useState<'file' | 'link'>('link');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [videoGroup, setVideoGroup] = useState('');
  const [videoClass, setVideoClass] = useState('');

  const steps: { id: Step; label: string; icon: typeof Upload }[] = [
    { id: 'info', label: 'Info Kelompok', icon: Users },
    { id: 'content', label: 'Isi Penelitian', icon: FileText },
    { id: 'files', label: 'File Penelitian', icon: FileText },
    { id: 'photos', label: 'Foto Kegiatan', icon: Images },
    { id: 'videos', label: 'Video Kegiatan', icon: Video },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const handlePhotoSelect = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setPhotoFiles((prev) => [...prev, ...arr]);
    const previews = arr.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((prev) => [...prev, ...previews]);
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const code = generateEditCode();
      const hash = await hashCode(code);
      setEditCode(code);

      let coverUrl: string | null = null;
      if (coverImage) {
        coverUrl = await uploadFile(coverImage, 'covers');
      }

      let researchFileUrl: string | null = null;
      let researchFileName: string | null = null;
      if (researchFile) {
        researchFileUrl = await uploadFile(researchFile, 'documents');
        researchFileName = researchFile.name;
      }

      const photos: PhotoItem[] = [];
      for (let i = 0; i < photoFiles.length; i++) {
        const url = await uploadFile(photoFiles[i], 'photos');
        photos.push({
          url,
          title: photoTitle || `Foto Kegiatan ${i + 1}`,
          date: photoDate || new Date().toISOString().slice(0, 10),
          location: photoLocation,
        });
      }

      const videos: VideoItem[] = [];
      if (videoMode === 'file' && videoFile) {
        const url = await uploadFile(videoFile, 'videos');
        videos.push({
          url,
          title: videoTitle,
          description: videoDesc,
          type: 'file',
          groupName: videoGroup || groupName,
          className: videoClass || className,
        });
      } else if (videoMode === 'link' && videoLink) {
        videos.push({
          url: videoLink,
          title: videoTitle,
          description: videoDesc,
          type: 'link',
          groupName: videoGroup || groupName,
          className: videoClass || className,
        });
      }

      const finalTheme = theme === 'Tema Lainnya' ? customTheme.trim() : theme;
      if (theme === 'Tema Lainnya' && !finalTheme) {
        setError('Silakan tuliskan tema penelitian Anda.');
        setLoading(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from('nbr_projects')
        .insert({
          title,
          group_name: groupName,
          class_name: className,
          leader_name: leaderName,
          members,
          teacher,
          theme: finalTheme,
          year,
          summary,
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
          method,
          results,
          conclusion,
          cover_url: coverUrl,
          research_file_url: researchFileUrl,
          research_file_name: researchFileName,
          edit_code_hash: hash,
          photos,
          videos,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      setCreatedProjectId(data.id);
      setStep('done');
    } catch (e) {
      console.error(e);
      setError('Gagal mengunggah proyek. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 'info') {
    if (!title || !groupName || !className || !leaderName || !teacher) return false;
    if (theme === 'Tema Lainnya' && !customTheme.trim()) return false;
    return true;
  }
    if (step === 'content') return summary;
    return true;
  };

  const nextStep = () => {
    const order: Step[] = ['info', 'content', 'files', 'photos', 'videos'];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const prevStep = () => {
    const order: Step[] = ['info', 'content', 'files', 'photos', 'videos'];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proyek Berhasil Diunggah!</h2>
          <p className="text-gray-600 mb-6">
            Proyek penelitian kelompok Anda telah tersimpan dalam arsip digital NBR.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">Kode Edit Proyek Anda</p>
            </div>
            <p className="text-2xl font-bold tracking-widest text-amber-900 mb-2">{editCode}</p>
            <p className="text-xs text-amber-700 mb-3">
              Simpan kode ini baik-baik. Diperlukan untuk mengedit atau menghapus proyek di kemudian hari.
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(editCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-sm font-medium transition-colors"
            >
              <Copy className="w-4 h-4" />
              Salin Kode
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('projects')}
              className="flex-1 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
            >
              Lihat Daftar Proyek
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
            >
              Ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload Proyek Kelompok</h1>
              <p className="text-gray-600 text-sm">Unggah hasil penelitian kelompok Anda</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = currentStepIndex > i;
            return (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      active
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 scale-110'
                        : done
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${active ? 'text-green-700' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-1 mb-5 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {step === 'info' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Kelompok</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Judul Penelitian" required>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Judul penelitian kelompok" />
                </Field>
                <Field label="Nama Kelompok" required>
                  <input value={groupName} onChange={(e) => setGroupName(e.target.value)} className={inputClass} placeholder="Nama kelompok" />
                </Field>
                <Field label="Kelas" required>
                  <input value={className} onChange={(e) => setClassName(e.target.value)} className={inputClass} placeholder="Contoh: 7A" />
                </Field>
                <Field label="Nama Ketua Kelompok" required>
                  <input value={leaderName} onChange={(e) => setLeaderName(e.target.value)} className={inputClass} placeholder="Nama ketua" />
                </Field>
                <Field label="Nama Anggota Kelompok">
                  <textarea value={members} onChange={(e) => setMembers(e.target.value)} className={inputClass} placeholder="Pisahkan dengan koma" rows={2} />
                </Field>
                <Field label="Nama Guru Pembimbing" required>
                  <input value={teacher} onChange={(e) => setTeacher(e.target.value)} className={inputClass} placeholder="Nama guru" />
                </Field>
                <Field label="Tema Penelitian" required>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)} className={inputClass}>
                    {THEMES.map((t) => (
                      <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                    ))}
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

          {step === 'content' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Isi Penelitian</h2>
              <Field label="Ringkasan Penelitian" required>
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass} rows={2} placeholder="Ringkasan singkat penelitian" />
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

          {step === 'files' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Upload File Penelitian</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 mb-4">
                Format yang didukung: PDF, Word (DOC/DOCX), PowerPoint (PPT/PPTX). Maksimal 25 MB.
              </div>
              <Field label="Judul File">
                <input value={fileTitle} onChange={(e) => setFileTitle(e.target.value)} className={inputClass} placeholder="Judul file penelitian" />
              </Field>
              <Field label="Deskripsi Singkat">
                <textarea value={fileDesc} onChange={(e) => setFileDesc(e.target.value)} className={inputClass} rows={2} placeholder="Deskripsi singkat file" />
              </Field>
              <Field label="Upload File Penelitian">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setResearchFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                />
                {researchFile && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> {researchFile.name}
                  </p>
                )}
              </Field>
              <Field label="Foto Utama / Cover Proyek (opsional)">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                />
                {coverImage && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5">
                    <Images className="w-4 h-4" /> {coverImage.name}
                  </p>
                )}
              </Field>
            </div>
          )}

          {step === 'photos' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Foto Kegiatan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Judul / Keterangan Foto">
                  <input value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} className={inputClass} placeholder="Keterangan foto" />
                </Field>
                <Field label="Tanggal Kegiatan">
                  <input type="date" value={photoDate} onChange={(e) => setPhotoDate(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Lokasi Kegiatan">
                  <input value={photoLocation} onChange={(e) => setPhotoLocation(e.target.value)} className={inputClass} placeholder="Lokasi penelitian" />
                </Field>
              </div>
              <Field label="Upload Foto (banyak sekaligus)">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoSelect(e.target.files)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                />
              </Field>
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {photoPreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">{photoFiles.length} foto dipilih</p>
            </div>
          )}

          {step === 'videos' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Video Kegiatan</h2>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setVideoMode('link')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    videoMode === 'link' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" /> Link Video
                </button>
                <button
                  onClick={() => setVideoMode('file')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    videoMode === 'file' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Video className="w-4 h-4" /> Upload File
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Judul Video">
                  <input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className={inputClass} placeholder="Judul video" />
                </Field>
                <Field label="Deskripsi Video">
                  <input value={videoDesc} onChange={(e) => setVideoDesc(e.target.value)} className={inputClass} placeholder="Deskripsi video" />
                </Field>
                <Field label="Nama Kelompok">
                  <input value={videoGroup} onChange={(e) => setVideoGroup(e.target.value)} className={inputClass} placeholder="Nama kelompok" />
                </Field>
                <Field label="Kelas">
                  <input value={videoClass} onChange={(e) => setVideoClass(e.target.value)} className={inputClass} placeholder="Kelas" />
                </Field>
              </div>
              {videoMode === 'link' ? (
                <Field label="Link Video (YouTube / Vimeo / URL)">
                  <input value={videoLink} onChange={(e) => setVideoLink(e.target.value)} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
                </Field>
              ) : (
                <Field label="Upload File Video">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                  />
                  {videoFile && <p className="mt-2 text-sm text-green-600">{videoFile.name}</p>}
                </Field>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Kembali
          </button>
          {step === 'videos' ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm shadow-lg shadow-green-600/30 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {loading ? 'Mengunggah...' : 'Selesai & Simpan'}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm shadow-lg shadow-green-600/30 disabled:opacity-50 transition-colors"
            >
              Lanjut
            </button>
          )}
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
