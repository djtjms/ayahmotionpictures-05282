import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            The Problem Was Clear.
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              In today's digital age, Islamic content for children is scarce, often outdated, and fails to capture the imagination of young minds. While secular entertainment continues to evolve with stunning animation and compelling narratives, our children are left with limited options that truly reflect their faith and values.
            </p>
            <p>
              The lack of high-quality Islamic animated content creates a void where our youth turn to media that doesn't align with their cultural and spiritual heritage. This gap not only affects their understanding of Islam but also their identity and connection to their faith.
            </p>
            <p>
              We recognized this challenge and decided to take action. "Creatures of Faith" isn't just an animated series—it's a movement to reclaim storytelling for Muslim families worldwide, creating content that educates, inspires, and entertains while staying true to Islamic principles.
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={() => document.getElementById("presentation")?.scrollIntoView({ behavior: "smooth" })}
            className="group bg-gradient-gold hover:shadow-glow transition-all duration-300"
          >
            Discover More
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
