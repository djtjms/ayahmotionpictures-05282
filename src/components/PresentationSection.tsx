import { useState, useEffect } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const PresentationSection = () => {
  const [presentations, setPresentations] = useState<any[]>([]);

  useEffect(() => {
    loadPresentations();

    // Subscribe to real-time updates for presentations
    const channel = supabase
      .channel('presentations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'media',
          filter: 'type=eq.presentation'
        },
        () => {
          loadPresentations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPresentations = async () => {
    const { data } = await supabase
      .from("media")
      .select("*")
      .eq("type", "presentation")
      .order("created_at", { ascending: false });
    
    if (data) setPresentations(data);
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <section id="presentation" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <FileText className="h-8 w-8" />
              <span className="text-sm font-semibold tracking-wider uppercase">Learn More</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Presentation & Resources
            </h2>
            <p className="text-xl text-muted-foreground">
              Download our detailed presentations to learn more about the project
            </p>
          </div>

          <div className="space-y-6">
            {presentations.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No presentations available yet</p>
              </div>
            ) : (
              presentations.map((presentation, index) => (
                <div 
                  key={presentation.id}
                  className="group bg-card p-6 rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-elegant animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {presentation.file_name}
                        </h3>
                        {presentation.caption && (
                          <p className="text-muted-foreground text-sm mb-3">
                            {presentation.caption}
                          </p>
                        )}
                        <span className="text-xs text-muted-foreground">
                          PowerPoint • {formatFileSize(presentation.file_size)}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex-shrink-0" asChild>
                      <a href={presentation.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 p-6 bg-muted rounded-xl text-center">
            <p className="text-sm text-muted-foreground">
              Need more information? Contact us at{" "}
              <a href="mailto:info@ayahmotionpictures.com" className="text-primary hover:underline">
                info@ayahmotionpictures.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
