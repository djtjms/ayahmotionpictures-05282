import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const StripeSettings = () => {
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Note: In production, these should be stored as Supabase secrets
      // For now, show a message about manual configuration
      toast.info("Stripe Configuration", {
        description: "Please add STRIPE_SECRET_KEY to your Lovable Cloud secrets through the backend panel.",
      });
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Configuration</CardTitle>
        <CardDescription>
          Configure your Stripe API keys for payment processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Stripe Secret Key
          </label>
          <Input
            type="password"
            value={stripeSecretKey}
            onChange={(e) => setStripeSecretKey(e.target.value)}
            placeholder="sk_test_..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Add STRIPE_SECRET_KEY to Lovable Cloud secrets
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Stripe Publishable Key
          </label>
          <Input
            value={stripePublishableKey}
            onChange={(e) => setStripePublishableKey(e.target.value)}
            placeholder="pk_test_..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Add VITE_STRIPE_PUBLISHABLE_KEY to your environment
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "View Instructions"}
        </Button>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Setup Instructions:</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Get your API keys from Stripe Dashboard</li>
            <li>Add STRIPE_SECRET_KEY to Lovable Cloud backend secrets</li>
            <li>Add VITE_STRIPE_PUBLISHABLE_KEY to environment variables</li>
            <li>Test donations to verify integration</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
