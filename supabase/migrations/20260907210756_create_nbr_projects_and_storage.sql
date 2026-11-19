/*
# Create NBR public project archive

1. New Tables
- `nbr_projects` stores the public research project archive, including group information, research content, edit-code hash, counts, and optional attachment paths.
- `id` is the project identifier.
- `title`, `group_name`, `class_name`, `leader_name`, `members`, `teacher`, `theme`, `summary`, `background`, `question`, `objectives`, `method`, `results`, and `conclusion` store the project content.
- `year` stores the activity year.
- `cover_url` stores an optional public cover image path.
- `research_file_url` stores an optional public document path.
- `research_file_name` stores the original display name.
- `edit_code_hash` stores a one-way hash for future edit verification.
- `photos` and `videos` store public attachment metadata as JSON arrays.
- `created_at` stores publication time.

2. Storage
- Create the public `nbr-files` bucket for documents, images, and videos.
- Enforce a 25 MB object size limit and an allowlist of common project file types.

3. Security
- Enable row level security on `nbr_projects`.
- Allow anonymous and authenticated users to read, create, update, and delete shared public project records because this app intentionally has no login.
- Add storage policies for public read and upload/update/delete access inside the shared bucket.

4. Important notes
- The edit code is stored as a hash and is not returned by the app after submission.
- Public access is intentional for a school-wide archive without accounts.
*/

CREATE TABLE IF NOT EXISTS public.nbr_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  group_name text NOT NULL,
  class_name text NOT NULL,
  leader_name text NOT NULL,
  members text NOT NULL DEFAULT '',
  teacher text NOT NULL,
  theme text NOT NULL,
  summary text NOT NULL DEFAULT '',
  background text NOT NULL DEFAULT '',
  question text NOT NULL DEFAULT '',
  objectives text NOT NULL DEFAULT '',
  method text NOT NULL DEFAULT '',
  results text NOT NULL DEFAULT '',
  conclusion text NOT NULL DEFAULT '',
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM now())::integer,
  cover_url text,
  research_file_url text,
  research_file_name text,
  edit_code_hash text NOT NULL,
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  videos jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nbr_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read NBR projects" ON public.nbr_projects;
CREATE POLICY "Public can read NBR projects"
  ON public.nbr_projects FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can create NBR projects" ON public.nbr_projects;
CREATE POLICY "Public can create NBR projects"
  ON public.nbr_projects FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update NBR projects" ON public.nbr_projects;
CREATE POLICY "Public can update NBR projects"
  ON public.nbr_projects FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete NBR projects" ON public.nbr_projects;
CREATE POLICY "Public can delete NBR projects"
  ON public.nbr_projects FOR DELETE
  TO anon, authenticated
  USING (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nbr-files',
  'nbr-files',
  true,
  26214400,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view NBR files" ON storage.objects;
CREATE POLICY "Public can view NBR files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'nbr-files');

DROP POLICY IF EXISTS "Public can upload NBR files" ON storage.objects;
CREATE POLICY "Public can upload NBR files"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'nbr-files');

DROP POLICY IF EXISTS "Public can update NBR files" ON storage.objects;
CREATE POLICY "Public can update NBR files"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'nbr-files')
  WITH CHECK (bucket_id = 'nbr-files');

DROP POLICY IF EXISTS "Public can delete NBR files" ON storage.objects;
CREATE POLICY "Public can delete NBR files"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'nbr-files');