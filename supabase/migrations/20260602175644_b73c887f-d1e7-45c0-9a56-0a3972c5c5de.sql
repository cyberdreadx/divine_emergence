
-- Tighten guests table: remove permissive auth policies (admins retain full access via "Admins can manage guests")
DROP POLICY IF EXISTS "Authenticated users can view guests for check-in" ON public.guests;
DROP POLICY IF EXISTS "Authenticated users can check in guests" ON public.guests;

-- Tighten orders table: remove permissive auth read (admin ALL policy retains access)
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;

-- Remove anon read on partner_assets (DB table). Admins manage; partners view own.
DROP POLICY IF EXISTS "Public can view partner assets via share links" ON public.partner_assets;

-- Add admin SELECT for contact_submissions
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict event-images bucket writes to admins only
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update partner assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload partner assets" ON storage.objects;

CREATE POLICY "Admins can upload event images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update event images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete event images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can upload partner assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'partner-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update partner assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'partner-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Prevent broad listing of public buckets by removing the anon/auth SELECT policies on storage.objects.
-- Public buckets still serve files via getPublicUrl (which bypasses RLS).
DROP POLICY IF EXISTS "Anyone can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view partner assets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view sponsor logos" ON storage.objects;

-- Lock down has_role EXECUTE so it isn't directly callable via PostgREST
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

-- Restrict realtime subscriptions: only admins may receive broadcasts (guests table is in publication)
CREATE POLICY "Admins can receive realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
