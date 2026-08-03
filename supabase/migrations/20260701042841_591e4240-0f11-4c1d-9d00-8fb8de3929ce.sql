
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate policies with schema-qualified has_role for reliability
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can upload event images" ON storage.objects;
CREATE POLICY "Admins can upload event images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update event images" ON storage.objects;
CREATE POLICY "Admins can update event images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete event images" ON storage.objects;
CREATE POLICY "Admins can delete event images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
