CREATE TABLE public.partner_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'image',
  file_size bigint DEFAULT 0,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text
);

ALTER TABLE public.partner_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage partner_assets"
  ON public.partner_assets FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners can view own assets"
  ON public.partner_assets FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM partners p WHERE p.id = partner_assets.partner_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Public can view partner assets via share links"
  ON public.partner_assets FOR SELECT TO anon
  USING (true);