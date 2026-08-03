DROP POLICY IF EXISTS "Anyone can view active events" ON public.events;
CREATE POLICY "Anyone can view active events"
ON public.events
FOR SELECT
TO public, authenticated
USING (status = 'active');