import { useState, useEffect } from "react";
import { Book } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const SynopsisSection = () => {
  const [synopsisImage, setSynopsisImage] = useState<string | null>(null);

  useEffect(() => {
    loadSynopsisImage();

    // Subscribe to real-time updates for synopsis image
    const channel = supabase
      .channel('synopsis-image-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'media',
          filter: 'type=eq.synopsis_image'
        },
        () => {
          loadSynopsisImage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSynopsisImage = async () => {
    const { data } = await supabase
      .from("media")
      .select("url")
      .eq("type", "synopsis_image")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (data) setSynopsisImage(data.url);
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Book className="h-8 w-8" />
              <span className="text-sm font-semibold tracking-wider uppercase">Series Overview</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              CREATURES OF FAITH PART 1 SYNOPSIS
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="aspect-video bg-gradient-hero rounded-xl shadow-elegant overflow-hidden border border-border">
                {synopsisImage ? (
                  <img src={synopsisImage} alt="Synopsis" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Book className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join young Amina as she discovers the magnificent creatures mentioned in the Quran and Islamic traditions. From the loyal dog of the Seven Sleepers to the wise hoopoe of Prophet Sulaiman, each episode brings these remarkable animals to life through breathtaking animation.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Through Amina's adventures, children learn valuable lessons about faith, compassion, and the wonders of Allah's creation. Each story is carefully crafted to be both entertaining and educational, suitable for family viewing.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <span className="px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground">
                  10 Episodes
                </span>
                <span className="px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground">
                  All Ages
                </span>
                <span className="px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground">
                  Multiple Languages
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
