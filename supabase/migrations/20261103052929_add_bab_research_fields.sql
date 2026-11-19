/*
# Add BAB-structured research content fields

1. Modified Tables
- `nbr_projects` — add columns to match the Word template structure:
  - `hypothesis` (text) — 1.4 Hipotesis (jika ada)
  - `benefits` (text) — 1.5 Manfaat Penelitian
  - `theory_basis` (text) — 2.1 Landasan Teori
  - `literature_review` (text) — 2.2 Studi Pustaka
  - `research_time_place` (text) — 3.1 Waktu dan Tempat Penelitian
  - `tools_materials` (text) — 3.2 Alat dan Bahan
  - `research_procedure` (text) — 3.3 Rancangan dan Prosedur Penelitian
  - `data_processing` (text) — 3.4 Rancangan Pengolahan Data
  - `budget` (text) — 4.1 Rancangan Anggaran Biaya Penelitian
  - `schedule` (text) — 4.2 Jadwal Penelitian
  - `references_list` (text) — Daftar Pustaka
2. Security
- No RLS policy changes. Existing permissive policies cover the new columns.
3. Important notes
- All new columns are text NOT NULL DEFAULT '' so existing rows and inserts remain valid.
- Column named `references_list` (not `references`) because `references` is a PostgreSQL reserved word.
- Old `method`, `results`, `conclusion` columns are kept for backward compatibility with existing records.
*/

DO $$ BEGIN
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS hypothesis text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS benefits text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS theory_basis text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS literature_review text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS research_time_place text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS tools_materials text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS research_procedure text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS data_processing text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS budget text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS schedule text NOT NULL DEFAULT '';
  ALTER TABLE public.nbr_projects ADD COLUMN IF NOT EXISTS references_list text NOT NULL DEFAULT '';
END $$;