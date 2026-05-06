export interface ReelComment {
  username: string;
  text: string;
  likes: number;
  replies_count: number;
  timestamp: string;
  profile_pic_url?: string;
}

export interface Reel {
  id: number;
  url: string | null;
  embed_url: string;
  video_url: string | null;
  cover_url: string | null;
  caption: string;
  author_username: string;
  author_followers: number;
  author_profile_pic_url: string | null;
  author_verified: boolean;
  likes: number;
  comments_count: number;
  views: number;
  shares: number;
  hashtags: string[];
  topic: string | null;
  top_comments: ReelComment[];
  post_date: string | null;
  blocked: boolean;
  block_reason: string | null;
  display_order: number;
}
