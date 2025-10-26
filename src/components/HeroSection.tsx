import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ArabicLettersAnimation } from "@/components/ArabicLettersAnimation";

export const HeroSection = () => {
  const [heroVideo, setHeroVideo] = useState<string | null>(null);

  useEffect(() => {
    loadHeroVideo();

    // Subscribe to real-time updates for hero video
    const channel = supabase
      .channel('hero-video-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'media',
          filter: 'type=eq.hero_video'
        },
        () => {
          loadHeroVideo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadHeroVideo = async () => {
    const { data } = await supabase
      .from("media")
      .select("url")
      .eq("type", "hero_video")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (data) setHeroVideo(data.url);
  };

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Arabic Letters Animation */}
      <ArabicLettersAnimation />
      
      {/* Video Background or Gradient */}
      {heroVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-hero">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzYy0xLjY1NyAwLTMgMS4zNDMtMyAzczEuMzQzIDMgMyAzIDMtMS4zNDMgMy0zLTEuMzQzLTMtMy0zeiIgZmlsbD0iIzNiODJmNiIgb3BhY2l0eT0iLjMiLz48L2c+PC9zdmc+')] animate-pulse"></div>
          </div>
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-overlay"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight animate-slide-up">
            Creatures of Faith
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            An animated series bringing Islamic stories to life through stunning visuals and heartfelt storytelling
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" onClick={scrollToAbout} className="group bg-gradient-gold hover:shadow-glow transition-all duration-300">
              Join Our Journey
              <Play className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}>
              Support the Project
            </Button>
          </div>

          {/* Video Preview Icon */}
          <div className="pt-8 animate-scale-in" style={{ animationDelay: "0.6s" }}>
            <div className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <Play className="h-12 w-12 p-3 rounded-full bg-card border border-border hover:border-primary transition-all animate-glow-pulse" />
              <span className="text-sm">Watch Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
