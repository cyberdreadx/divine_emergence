
-- Ticket tiers table for multi-tier pricing per event
CREATE TABLE public.ticket_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  capacity INTEGER,
  sold_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_tiers ENABLE ROW LEVEL SECURITY;

-- Admins can manage
CREATE POLICY "Admins can manage ticket_tiers"
  ON public.ticket_tiers FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can view tiers of active events
CREATE POLICY "Anyone can view tiers of active events"
  ON public.ticket_tiers FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = ticket_tiers.event_id AND e.status = 'active'
  ));
