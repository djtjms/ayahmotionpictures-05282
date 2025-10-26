-- Create enum for media types
CREATE TYPE public.media_type AS ENUM ('hero_video', 'synopsis_image', 'cause_image', 'presentation');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create media table for all uploads
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type media_type NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
      AND role = 'admin'
  )
$$;

-- RLS Policies for media table
CREATE POLICY "Anyone can view media"
  ON public.media
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert media"
  ON public.media
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update media"
  ON public.media
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete media"
  ON public.media
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for donations table
CREATE POLICY "Admins can view all donations"
  ON public.donations
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert donations"
  ON public.donations
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user_roles table
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true);

-- Storage policies for media bucket
CREATE POLICY "Anyone can view media files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'media' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update media files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'media' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete media files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'media' AND public.is_admin(auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for media table
CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();