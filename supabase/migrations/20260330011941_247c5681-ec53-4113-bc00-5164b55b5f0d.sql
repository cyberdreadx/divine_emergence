
-- Event sponsors table
CREATE TABLE public.event_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  logo_url text,
  website_url text,
  description text,
  is_main boolean NOT NULL DEFAULT false,
  cta_label text,
  cta_link text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Event settings table (for toggles like sponsors_enabled)
CREATE TABLE public.event_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  setting_key text NOT NULL,
  setting_value jsonb NOT NULL DEFAULT 'true'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, setting_key)
);

-- RLS
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage event_sponsors" ON public.event_sponsors FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage event_settings" ON public.event_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Public can view sponsors for active events
CREATE POLICY "Anyone can view sponsors of active events" ON public.event_sponsors FOR SELECT TO public
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_sponsors.event_id AND e.status = 'active'));

-- Public can view settings for active events
CREATE POLICY "Anyone can view settings of active events" ON public.event_settings FOR SELECT TO public
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_settings.event_id AND e.status = 'active'));

-- Storage bucket for sponsor logos
INSERT INTO storage.buckets (id, name, public) VALUES ('sponsor-logos', 'sponsor-logos', true);

-- Storage RLS for sponsor logos
CREATE POLICY "Anyone can view sponsor logos" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'sponsor-logos');

CREATE POLICY "Admins can upload sponsor logos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'sponsor-logos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update sponsor logos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'sponsor-logos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sponsor logos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'sponsor-logos' AND has_role(auth.uid(), 'admin'));
