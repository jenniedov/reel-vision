
CREATE TABLE public.reels (
  id BIGSERIAL PRIMARY KEY,
  video_url TEXT NOT NULL,
  cover_url TEXT,
  caption TEXT NOT NULL DEFAULT '',
  author_username TEXT NOT NULL,
  likes INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  views INT NOT NULL DEFAULT 0,
  top_comments JSONB NOT NULL DEFAULT '[]'::jsonb,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  topic TEXT,
  approved_for_demo BOOLEAN NOT NULL DEFAULT false,
  blocked BOOLEAN NOT NULL DEFAULT false,
  block_reason TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reels are viewable by everyone"
  ON public.reels FOR SELECT
  USING (true);
