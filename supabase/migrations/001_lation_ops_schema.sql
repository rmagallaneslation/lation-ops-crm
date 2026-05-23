-- ============================================================
-- LATION OPS — Migration 001
-- Phase 1: Core tables for talent marketplace
-- Project: ymsjdxihduwlywcuwrld
-- ⚠️  Do NOT modify the `leads` table (owned by Lation 1)
-- ⚠️  RLS policies are intentionally permissive for MVP.
--     Flag as technical debt before multi-user expansion.
-- ============================================================

-- ─── TALENTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.talents (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name                text NOT NULL,
  email                    text NOT NULL,
  phone                    text,
  country                  text NOT NULL,
  timezone                 text,
  tech_stack               text[]  NOT NULL DEFAULT '{}',
  languages                text[]  NOT NULL DEFAULT '{}',
  level                    text    NOT NULL CHECK (level IN ('junior','mid','senior','lead','architect')),
  years_of_experience      integer NOT NULL DEFAULT 0,
  specialization           text    NOT NULL,
  cv_url                   text,
  available_from           date,
  employment_type          text    NOT NULL DEFAULT 'full_time'
                             CHECK (employment_type IN ('full_time','part_time','contract','freelance')),
  preferred_salary_min     integer,
  preferred_salary_max     integer,
  preferred_salary_currency text   NOT NULL DEFAULT 'USD',
  status                   text    NOT NULL DEFAULT 'available'
                             CHECK (status IN ('available','in_process','placed','inactive')),
  created_by               text,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- ─── EMPLOYERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employers (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name   text NOT NULL,
  industry       text NOT NULL,
  country        text NOT NULL,
  email          text NOT NULL,
  phone          text,
  website        text,
  contact_name   text NOT NULL,
  contact_email  text NOT NULL,
  contact_phone  text,
  employer_type  text NOT NULL DEFAULT 'hiring_company'
                   CHECK (employer_type IN ('talent_source','hiring_company','both')),
  status         text NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active','inactive','prospect')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ─── POSITIONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.positions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id         uuid NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  title               text NOT NULL,
  description         text,
  level               text NOT NULL CHECK (level IN ('junior','mid','senior','lead','architect')),
  specialization      text NOT NULL,
  required_skills     text[] NOT NULL DEFAULT '{}',
  languages_required  text[] NOT NULL DEFAULT '{}',
  salary_min          integer,
  salary_max          integer,
  currency            text NOT NULL DEFAULT 'USD',
  work_location       text NOT NULL DEFAULT 'remote'
                        CHECK (work_location IN ('remote','hybrid','on_site')),
  contract_type       text NOT NULL DEFAULT 'full_time'
                        CHECK (contract_type IN ('full_time','part_time','contract')),
  status              text NOT NULL DEFAULT 'open'
                        CHECK (status IN ('open','in_progress','filled','closed')),
  posted_date         date NOT NULL DEFAULT CURRENT_DATE,
  deadline            date,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ─── APPLICATIONS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id                uuid NOT NULL REFERENCES public.talents(id) ON DELETE CASCADE,
  position_id              uuid NOT NULL REFERENCES public.positions(id) ON DELETE CASCADE,
  status                   text NOT NULL DEFAULT 'applied'
                             CHECK (status IN ('applied','screening','interview','reviewed','offer_sent','accepted','rejected')),
  applied_at               timestamptz NOT NULL DEFAULT now(),
  interview_scheduled_at   timestamptz,
  notes                    text,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  UNIQUE (talent_id, position_id)
);

-- ─── PLACEMENTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.placements (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id             uuid NOT NULL REFERENCES public.talents(id) ON DELETE RESTRICT,
  position_id           uuid NOT NULL REFERENCES public.positions(id) ON DELETE RESTRICT,
  employer_id           uuid NOT NULL REFERENCES public.employers(id) ON DELETE RESTRICT,
  application_id        uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  start_date            date NOT NULL,
  end_date              date,
  final_salary          integer NOT NULL DEFAULT 0,
  commission_type       text NOT NULL DEFAULT 'percentage'
                          CHECK (commission_type IN ('percentage','fixed_fee','subscription','hybrid')),
  commission_percentage numeric(5,2) NOT NULL DEFAULT 0,
  commission_fixed_fee  integer NOT NULL DEFAULT 0,
  commission_amount     integer NOT NULL DEFAULT 0,  -- entered manually, not computed
  currency              text NOT NULL DEFAULT 'USD',
  status                text NOT NULL DEFAULT 'placed'
                          CHECK (status IN ('placed','completed','extended')),
  notes                 text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ─── INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_talents_email       ON public.talents(email);
CREATE INDEX IF NOT EXISTS idx_talents_country     ON public.talents(country);
CREATE INDEX IF NOT EXISTS idx_talents_status      ON public.talents(status);
CREATE INDEX IF NOT EXISTS idx_talents_level       ON public.talents(level);

CREATE INDEX IF NOT EXISTS idx_employers_status       ON public.employers(status);
CREATE INDEX IF NOT EXISTS idx_employers_employer_type ON public.employers(employer_type);

CREATE INDEX IF NOT EXISTS idx_positions_employer_id ON public.positions(employer_id);
CREATE INDEX IF NOT EXISTS idx_positions_status      ON public.positions(status);

CREATE INDEX IF NOT EXISTS idx_applications_talent_id   ON public.applications(talent_id);
CREATE INDEX IF NOT EXISTS idx_applications_position_id ON public.applications(position_id);
CREATE INDEX IF NOT EXISTS idx_applications_status      ON public.applications(status);

CREATE INDEX IF NOT EXISTS idx_placements_talent_id   ON public.placements(talent_id);
CREATE INDEX IF NOT EXISTS idx_placements_employer_id ON public.placements(employer_id);
CREATE INDEX IF NOT EXISTS idx_placements_position_id ON public.placements(position_id);
CREATE INDEX IF NOT EXISTS idx_placements_status      ON public.placements(status);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_talents_updated_at
  BEFORE UPDATE ON public.talents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_employers_updated_at
  BEFORE UPDATE ON public.employers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_positions_updated_at
  BEFORE UPDATE ON public.positions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_placements_updated_at
  BEFORE UPDATE ON public.placements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── RLS ────────────────────────────────────────────────────
-- ⚠️  TECHNICAL DEBT: single shared admin account for MVP.
-- All authenticated users get full CRUD. Revisit before
-- adding recruiter / employer roles.

ALTER TABLE public.talents      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements   ENABLE ROW LEVEL SECURITY;

-- One policy per table: authenticated = full access
CREATE POLICY "admin_all_talents"
  ON public.talents FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_employers"
  ON public.employers FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_positions"
  ON public.positions FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_applications"
  ON public.applications FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_placements"
  ON public.placements FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);
