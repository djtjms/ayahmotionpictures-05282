-- Enable realtime for media table
ALTER PUBLICATION supabase_realtime ADD TABLE public.media;

-- Enable replica identity for proper realtime updates
ALTER TABLE public.media REPLICA IDENTITY FULL;