import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

export const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const predefinedAmounts = [10, 50, 100, 500];

  const handleDonate = async () => {
    if (!selectedAmount && !customAmount) {
      toast.error("Please select or enter an amount");
      return;
    }
    setShowDonorForm(true);
  };

  const processDonation = async () => {
    if (!donorName || !donorEmail) {
      toast.error("Please provide your name and email");
      return;
    }

    const amount = parseFloat(customAmount) || selectedAmount;
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        "create-payment-intent",
        {
          body: { amount }
        }
      );

      if (paymentError) {
        if (paymentError.message?.includes("Stripe not configured")) {
          toast.error("Payment system is not configured yet. Please contact admin.");
        } else {
          toast.error("Payment failed. Please try again.");
        }
        return;
      }

      // Insert donation record
      const { error: dbError } = await supabase
        .from("donations")
        .insert({
          donor_name: donorName,
          email: donorEmail,
          amount,
          status: "pending",
          stripe_payment_intent_id: paymentData.clientSecret,
        });

      if (dbError) throw dbError;

      toast.success("Processing payment...", {
        description: "You will receive a receipt via email shortly.",
      });

      // Reset form
      setShowDonorForm(false);
      setDonorName("");
      setDonorEmail("");
      setSelectedAmount(null);
      setCustomAmount("");
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="donate" className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Heart className="h-8 w-8" />
              <span className="text-sm font-semibold tracking-wider uppercase">Support Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Get involved and support
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your contribution helps us create world-class Islamic content that educates and inspires millions of children worldwide
            </p>
          </div>

          <div className="bg-card p-8 md:p-12 rounded-2xl shadow-elegant border border-border animate-scale-in">
            {/* Predefined Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedAmount === amount
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border bg-secondary hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl font-bold text-foreground">${amount}</div>
                  <div className="text-sm text-muted-foreground mt-1">One-time</div>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-2">
                Or enter a custom amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="pl-12 py-6 text-lg"
                  min="1"
                />
              </div>
            </div>

            {/* Donate Button */}
            <Button 
              size="lg" 
              onClick={handleDonate}
              className="w-full py-6 text-lg bg-gradient-gold hover:shadow-glow transition-all duration-300"
            >
              <Heart className="mr-2 h-5 w-5" />
              Donate Now
            </Button>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Secure payment powered by Stripe • All donations are final and non-refundable
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { number: "50K+", label: "Families Reached" },
              { number: "$25K", label: "Raised So Far" },
              { number: "10", label: "Episodes Planned" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-card rounded-xl border border-border animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donor Information Dialog */}
      <Dialog open={showDonorForm} onOpenChange={setShowDonorForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Donation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Donation Amount</p>
              <p className="text-2xl font-bold text-primary">
                ${customAmount || selectedAmount}
              </p>
            </div>
            <Button
              onClick={processDonation}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Complete Donation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
