import { useState, useEffect } from "react";
import { BookOpen, Users, Lightbulb, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const defaultCauses = [
  {
    icon: BookOpen,
    title: "Educational Excellence",
    description: "Creating content that teaches Islamic history, values, and traditions in an engaging and accessible way for children of all ages.",
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Bringing Muslim families together through shared stories and experiences that strengthen their connection to faith.",
  },
  {
    icon: Lightbulb,
    title: "Creative Innovation",
    description: "Pushing the boundaries of Islamic animation with cutting-edge technology and artistic excellence.",
  },
  {
    icon: Award,
    title: "Authentic Representation",
    description: "Ensuring accurate portrayal of Islamic teachings while consulting with scholars and community leaders.",
  },
];

export const CausesSection = () => {
  const [causeImages, setCauseImages] = useState<any[]>([]);

  useEffect(() => {
    loadCauseImages();

    // Subscribe to real-time updates for cause images
    const channel = supabase
      .channel('cause-images-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'media',
          filter: 'type=eq.cause_image'
        },
        () => {
          loadCauseImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCauseImages = async () => {
    const { data } = await supabase
      .from("media")
      .select("*")
      .eq("type", "cause_image")
      .order("created_at", { ascending: false });
    
    if (data) setCauseImages(data);
  };

  const causes = defaultCauses.map((cause, index) => ({
    ...cause,
    image: causeImages[index]?.url || null,
  }));

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Our causes to expand the knowledge of Islam
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every contribution helps us create meaningful content that educates and inspires the next generation of Muslims
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {causes.map((cause, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {cause.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={cause.image} 
                      alt={cause.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="relative p-8 space-y-4">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <cause.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{cause.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{cause.description}</p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
