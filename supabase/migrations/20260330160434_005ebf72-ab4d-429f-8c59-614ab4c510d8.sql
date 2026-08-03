
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  respondent_name TEXT,
  respondent_email TEXT,
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  favorite_moment TEXT,
  suggestions TEXT,
  would_attend_again BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a survey response (public form)
CREATE POLICY "Anyone can submit survey response"
  ON public.survey_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Admins can view all responses
CREATE POLICY "Admins can view survey responses"
  ON public.survey_responses
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete responses
CREATE POLICY "Admins can delete survey responses"
  ON public.survey_responses
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
