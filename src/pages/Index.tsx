import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { MissionSection } from "@/components/MissionSection";
import { SynopsisSection } from "@/components/SynopsisSection";
import { CausesSection } from "@/components/CausesSection";
import { YouTubeSection } from "@/components/YouTubeSection";
import { PresentationSection } from "@/components/PresentationSection";
import { DonationSection } from "@/components/DonationSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <SynopsisSection />
      <CausesSection />
      <YouTubeSection />
      <PresentationSection />
      <DonationSection />
    </Layout>
  );
};

export default Index;
