import { useState, useEffect, useCallback } from 'react';
import { Video, Loader2, ExternalLink, Users, GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project, VideoItem } from '@/lib/types';
import { getEmbedUrl, isYoutubeOrVimeo } from '@/lib/utils';

interface VideoGalleryItem extends VideoItem {
  projectName: string;
}

export default function Videos() {
  const [videos, setVideos] = useState<VideoGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nbr_projects')
      .select('title, videos')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
    } else if (data) {
      const items: VideoGalleryItem[] = [];
      (data as Pick<Project, 'title' | 'videos'>[]).forEach((p) => {
        p.videos.forEach((v) => {
          items.push({ ...v, projectName: p.title });
        });
      });
      setVideos(items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Galeri Video</h1>
              <p className="text-gray-600 text-sm">Video kegiatan dan presentasi penelitian</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada video kegiatan</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{videos.length} video</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                  {v.type === 'link' && isYoutubeOrVimeo(v.url) ? (
                    <div className="aspect-video">
                      <iframe
                        src={getEmbedUrl(v.url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={v.title}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 text-green-600 hover:text-green-700"
                      >
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <Video className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" /> Buka Video
                        </span>
                      </a>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{v.title}</h3>
                    {v.description && <p className="text-sm text-gray-500 line-clamp-2 mb-2">{v.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {v.groupName}</span>
                      <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {v.className}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
