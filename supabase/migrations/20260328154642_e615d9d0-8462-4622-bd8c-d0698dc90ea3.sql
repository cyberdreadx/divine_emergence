
CREATE TABLE public.event_flow_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 15,
  facilitator text,
  segment_order integer NOT NULL DEFAULT 0,
  segment_type text NOT NULL DEFAULT 'custom',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.event_flow_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage event flow segments" ON public.event_flow_segments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view segments of active events" ON public.event_flow_segments
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM events e WHERE e.id = event_flow_segments.event_id AND e.status = 'active'
  ));
