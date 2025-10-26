import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaManager } from "@/components/admin/MediaManager";
import { DonationsView } from "@/components/admin/DonationsView";
import { StripeSettings } from "@/components/admin/StripeSettings";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Ayah Motion Pictures CMS</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-8">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="logos">Logos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="synopsis">Synopsis</TabsTrigger>
            <TabsTrigger value="causes">Causes</TabsTrigger>
            <TabsTrigger value="presentation">Presentation</TabsTrigger>
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>

          <TabsContent value="hero">
            <MediaManager type="hero_video" title="Hero Video" acceptedTypes="video/*" />
          </TabsContent>

          <TabsContent value="logos">
            <div className="space-y-6">
              <MediaManager type="header_logo" title="Header Logo" acceptedTypes="image/*" />
              <MediaManager type="footer_logo" title="Footer Logo" acceptedTypes="image/*" />
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="space-y-6">
              <MediaManager type="latest_video" title="Latest Video URL" acceptedTypes="" />
              <MediaManager type="behind_scenes_video" title="Behind The Scenes URL" acceptedTypes="" />
            </div>
          </TabsContent>

          <TabsContent value="synopsis">
            <MediaManager type="synopsis_image" title="Synopsis Image" acceptedTypes="image/*" />
          </TabsContent>

          <TabsContent value="causes">
            <MediaManager type="cause_image" title="Cause Images" acceptedTypes="image/*" multiple />
          </TabsContent>

          <TabsContent value="presentation">
            <MediaManager type="presentation" title="Presentations" acceptedTypes=".pptx,.pdf" multiple />
          </TabsContent>

          <TabsContent value="stripe">
            <StripeSettings />
          </TabsContent>

          <TabsContent value="donations">
            <DonationsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
