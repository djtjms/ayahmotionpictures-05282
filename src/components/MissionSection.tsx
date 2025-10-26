import { Button } from "@/components/ui/button";
import { Target, Heart, Globe, Sparkles } from "lucide-react";

export const MissionSection = () => {
  const missions = [
    {
      icon: Target,
      title: "Quality Content",
      description: "Creating world-class animation that rivals industry standards while staying true to Islamic values"
    },
    {
      icon: Heart,
      title: "Authentic Stories",
      description: "Bringing timeless Islamic narratives to life with accuracy, respect, and emotional depth"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Making Islamic content accessible to Muslim families worldwide through multiple languages"
    },
    {
      icon: Sparkles,
      title: "Inspire Faith",
      description: "Nurturing love for Islam in young hearts through engaging storytelling and beautiful visuals"
    }
  ];

  return (
    <section id="mission" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              How are we changing this?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Through innovation, dedication, and a commitment to excellence, we're revolutionizing Islamic children's entertainment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {missions.map((mission, index) => (
              <div 
                key={index}
                className="group bg-card p-8 rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-elegant animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <mission.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-foreground mb-3">{mission.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{mission.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in">
            <Button 
              size="lg"
              onClick={() => document.getElementById("youtube")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-gradient-gold hover:shadow-glow transition-all duration-300"
            >
              Watch Our Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
