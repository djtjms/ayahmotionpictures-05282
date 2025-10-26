-- Add new media types for logos and video URLs
ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'header_logo';
ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'footer_logo';
ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'latest_video';
ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'behind_scenes_video';