import { useState, useEffect, useCallback } from 'react';
import { Images, Loader2, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project, PhotoItem } from '@/lib/types';

interface GalleryItem extends PhotoItem {
  projectName: string;
  groupName: string;
}

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nbr_projects')
      .select('title, group_name, photos')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
    } else if (data) {
      const items: GalleryItem[] = [];
      (data as Pick<Project, 'title' | 'group_name' | 'photos'>[]).forEach((p) => {
        p.photos.forEach((photo) => {
          items.push({
            ...photo,
            projectName: p.title,
            groupName: p.group_name,
          });
        });
      });
      setPhotos(items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl w-full">
            <img src={lightbox.url} alt={lightbox.title} className="max-w-full max-h-[70vh] rounded-lg mx-auto" />
            <div className="text-white text-center mt-4">
              <p className="font-semibold">{lightbox.title}</p>
              <p className="text-sm text-gray-300">{lightbox.groupName} - {lightbox.projectName}</p>
              {lightbox.location && <p className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> {lightbox.location}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md">
              <Images className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Galeri Foto Kegiatan</h1>
              <p className="text-gray-600 text-sm">Dokumentasi foto kegiatan penelitian alam</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Images className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada foto kegiatan</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{photos.length} foto</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="group cursor-pointer"
                  onClick={() => setLightbox(photo)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-lg transition-all">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{photo.title}</p>
                    <p className="text-xs text-gray-400 truncate">{photo.groupName}</p>
                    {photo.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3" /> {photo.location}
                      </p>
                    )}
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
