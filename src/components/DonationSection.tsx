import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, DollarSign } from "lucide-react";
import { toast } from "sonner";

export const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const predefinedAmounts = [10, 50, 100, 500];

  const handleDonate = async () => {
    if (!selectedAmount && !customAmount) {
      toast.error("Please select or enter an amount");
      return;
    }

    const amount = customAmount || selectedAmount;
    
    toast.success("Payment Integration Ready", {
      description: "Stripe will be configured once you add your API key in the admin dashboard.",
    });
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
    </section>
  );
};
