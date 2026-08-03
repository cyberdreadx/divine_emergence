
-- Add asset_type to deliverables for categorizing (samples, logos, displays, signage, etc.)
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS asset_type text NOT NULL DEFAULT 'other';

-- Create partner_recaps table for post-event metrics
CREATE TABLE public.partner_recaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  photos_count integer DEFAULT 0,
  impressions integer DEFAULT 0,
  engagement_rate numeric(5,2) DEFAULT 0,
  social_mentions integer DEFAULT 0,
  notes text,
  recap_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (partner_id, event_id)
);

ALTER TABLE public.partner_recaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage partner_recaps" ON public.partner_recaps
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners can view own recaps" ON public.partner_recaps
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM partners p WHERE p.id = partner_recaps.partner_id AND p.user_id = auth.uid()
  ));
