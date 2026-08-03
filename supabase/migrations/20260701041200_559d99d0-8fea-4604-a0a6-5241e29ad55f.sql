DROP POLICY IF EXISTS "Admins can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete event images" ON storage.objects;

CREATE POLICY "Admins can upload event images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update event images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete event images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Same fix for other admin storage policies
DROP POLICY IF EXISTS "Admins can upload sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update sponsor logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete sponsor logos" ON storage.objects;
CREATE POLICY "Admins can upload sponsor logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'sponsor-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update sponsor logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'sponsor-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete sponsor logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'sponsor-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can upload partner assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update partner assets" ON storage.objects;
CREATE POLICY "Admins can upload partner assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'partner-assets' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update partner assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'partner-assets' AND public.has_role(auth.uid(), 'admin'::public.app_role));