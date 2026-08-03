ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS affiliate_link text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monetary_value numeric DEFAULT 0;