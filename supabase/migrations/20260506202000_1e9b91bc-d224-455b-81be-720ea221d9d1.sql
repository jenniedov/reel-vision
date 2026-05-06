
UPDATE public.reels SET video_url='https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4' WHERE display_order=1 AND blocked=false;
UPDATE public.reels SET video_url='https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4' WHERE display_order=2 AND blocked=false;
UPDATE public.reels SET video_url='https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4' WHERE display_order=3 AND blocked=false;
UPDATE public.reels SET video_url='https://media.w3.org/2010/05/sintel/trailer.mp4' WHERE display_order=4 AND blocked=false;
UPDATE public.reels SET video_url='https://media.w3.org/2010/05/bunny/trailer.mp4' WHERE display_order=5 AND blocked=false;

UPDATE public.reels SET video_url='https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' WHERE display_order=1 AND blocked=true;
UPDATE public.reels SET video_url='https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4' WHERE display_order=2 AND blocked=true;
UPDATE public.reels SET video_url='https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4' WHERE display_order=3 AND blocked=true;
