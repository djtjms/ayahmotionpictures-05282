import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | "pci" | null>(null);
  const [headerLogo, setHeaderLogo] = useState<string | null>(null);
  const [footerLogo, setFooterLogo] = useState<string | null>(null);

  useEffect(() => {
    loadLogos();

    const channel = supabase
      .channel("logos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "media",
          filter: "type=in.(header_logo,footer_logo)",
        },
        () => {
          loadLogos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadLogos = async () => {
    const { data: headerData } = await supabase
      .from("media")
      .select("url")
      .eq("type", "header_logo")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { data: footerData } = await supabase
      .from("media")
      .select("url")
      .eq("type", "footer_logo")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (headerData) setHeaderLogo(headerData.url);
    if (footerData) setFooterLogo(footerData.url);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {headerLogo ? (
                <img src={headerLogo} alt="Ayah Motion Pictures" className="h-10 object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                    A
                  </div>
                  <span className="text-xl font-bold text-foreground">Ayah Motion Pictures</span>
                </>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection("home")} className="text-foreground hover:text-primary transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection("about")} className="text-foreground hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection("mission")} className="text-foreground hover:text-primary transition-colors">
                Mission
              </button>
              <button onClick={() => scrollToSection("donate")} className="text-foreground hover:text-primary transition-colors">
                Support Us
              </button>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = "/auth"}>
                Admin
              </Button>
              <ThemeToggle />
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button className="text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
              <button onClick={() => scrollToSection("home")} className="text-foreground hover:text-primary transition-colors text-left">
                Home
              </button>
              <button onClick={() => scrollToSection("about")} className="text-foreground hover:text-primary transition-colors text-left">
                About
              </button>
              <button onClick={() => scrollToSection("mission")} className="text-foreground hover:text-primary transition-colors text-left">
                Mission
              </button>
              <button onClick={() => scrollToSection("donate")} className="text-foreground hover:text-primary transition-colors text-left">
                Support Us
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4">
          {footerLogo && (
            <div className="flex justify-center mb-6">
              <img src={footerLogo} alt="Ayah Motion Pictures" className="h-12 object-contain" />
            </div>
          )}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Ayah Motion Pictures. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" onClick={() => setLegalModal("privacy")}>
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setLegalModal("terms")}>
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setLegalModal("pci")}>
                PCI DSS Compliance
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <Dialog open={legalModal !== null} onOpenChange={() => setLegalModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {legalModal === "privacy" && "Privacy Policy"}
              {legalModal === "terms" && "Terms of Service"}
              {legalModal === "pci" && "PCI DSS Compliance"}
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-invert max-w-none">
            {legalModal === "privacy" && (
              <div className="space-y-4 text-sm text-foreground">
                <p>At Ayah Motion Pictures, we are committed to protecting your privacy and personal data in accordance with GDPR and international data protection standards.</p>
                <h3 className="font-semibold text-base">Data Collection</h3>
                <p>We collect only necessary information for processing donations: name, email, and payment details. Payment information is securely processed through Stripe and never stored on our servers.</p>
                <h3 className="font-semibold text-base">Your Rights</h3>
                <p>You have the right to access, rectify, or delete your personal data. Contact us at privacy@ayahmotionpictures.com for any data-related requests.</p>
                <h3 className="font-semibold text-base">Data Security</h3>
                <p>We implement industry-standard security measures to protect your information from unauthorized access, disclosure, or destruction.</p>
              </div>
            )}
            {legalModal === "terms" && (
              <div className="space-y-4 text-sm text-foreground">
                <p>By using this platform and making donations, you agree to the following terms:</p>
                <h3 className="font-semibold text-base">Donations</h3>
                <p>All donations are final and non-refundable unless required by law. Donations will be used solely for the production of "Creatures of Faith" animated series.</p>
                <h3 className="font-semibold text-base">Use of Platform</h3>
                <p>You agree to use this platform only for lawful purposes and in accordance with these Terms of Service.</p>
                <h3 className="font-semibold text-base">Intellectual Property</h3>
                <p>All content, including videos, images, and text, is the property of Ayah Motion Pictures and protected by copyright laws.</p>
              </div>
            )}
            {legalModal === "pci" && (
              <div className="space-y-4 text-sm text-foreground">
                <p>Ayah Motion Pictures is committed to maintaining PCI DSS (Payment Card Industry Data Security Standard) compliance for all payment transactions.</p>
                <h3 className="font-semibold text-base">Secure Payment Processing</h3>
                <p>All payment processing is handled by Stripe, a PCI DSS Level 1 certified payment processor. We do not store any credit card information on our servers.</p>
                <h3 className="font-semibold text-base">Data Encryption</h3>
                <p>All sensitive data is encrypted in transit using TLS 1.2 or higher. Payment information is tokenized and never exposed to our systems.</p>
                <h3 className="font-semibold text-base">Security Measures</h3>
                <p>We implement strict access controls, regular security audits, and maintain secure network architecture to protect your payment information.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
