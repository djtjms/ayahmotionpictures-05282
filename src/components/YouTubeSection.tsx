import { useEffect, useState } from "react";
import { Youtube, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface VideoItem {
  id: string;
  url: string;
  caption: string | null;
  type: string;
}

export const YouTubeSection = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const subscriberCount = "1.2K";

  useEffect(() => {
    loadVideos();

    const channel = supabase
      .channel("youtube_videos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "media",
          filter: "type=in.(latest_video,behind_scenes_video)",
        },
        () => {
          loadVideos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadVideos = async () => {
    const { data } = await supabase
      .from("media")
      .select("*")
      .in("type", ["latest_video", "behind_scenes_video"])
      .order("created_at", { ascending: false });

    if (data) {
      setVideos(data);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <section id="youtube" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Youtube className="h-8 w-8" />
              <span className="text-sm font-semibold tracking-wider uppercase">Join Our Community</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Follow Our Journey on YouTube
            </h2>
          </div>

          {/* Subscriber Counter */}
          <div className="flex flex-col items-center justify-center mb-12 animate-scale-in">
            <div className="bg-gradient-gold p-8 rounded-2xl shadow-glow">
              <div className="flex items-center gap-4">
                <Youtube className="h-12 w-12 text-primary-foreground" />
                <div>
                  <div className="text-4xl font-bold text-primary-foreground">{subscriberCount}</div>
                  <div className="text-sm text-primary-foreground/80 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Subscribers
                  </div>
                </div>
              </div>
            </div>
            <Button 
              size="lg" 
              className="mt-6 bg-[#FF0000] hover:bg-[#CC0000] text-white"
              onClick={() => window.open("https://youtube.com/@ayahmotionpictures", "_blank")}
            >
              <Youtube className="mr-2 h-5 w-5" />
              Subscribe Now
            </Button>
          </div>

          {/* Video Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {videos.map((video, index) => (
              <div 
                key={video.id}
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(video.url, "_blank")}
              >
                <div className="aspect-video bg-gradient-hero rounded-xl overflow-hidden border border-border group-hover:border-primary transition-all duration-300 shadow-elegant">
                  {video.url ? (
                    <iframe
                      src={getEmbedUrl(video.url)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Youtube className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {video.type === "latest_video" ? "Latest Video" : "Behind The Scenes"}
                  </h4>
                  {video.caption && (
                    <p className="text-sm text-muted-foreground">{video.caption}</p>
                  )}
                </div>
              </div>
            ))}
            {videos.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                No videos uploaded yet. Upload videos from the admin dashboard.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
