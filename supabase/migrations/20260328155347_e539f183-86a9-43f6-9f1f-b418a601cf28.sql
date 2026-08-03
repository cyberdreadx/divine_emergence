
-- Allow authenticated users to read guests for check-in (event staff)
CREATE POLICY "Authenticated users can view guests for check-in" ON public.guests
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update guest status for check-in
CREATE POLICY "Authenticated users can check in guests" ON public.guests
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
