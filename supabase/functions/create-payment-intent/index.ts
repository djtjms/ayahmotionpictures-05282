import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount } = await req.json();

    // Placeholder for Stripe integration
    // User will add STRIPE_SECRET_KEY from admin dashboard later
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ 
          error: "Stripe not configured. Please add STRIPE_SECRET_KEY in admin settings." 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(),
        currency: "usd",
        automatic_payment_methods: JSON.stringify({ enabled: true }),
      }),
    });

    const paymentIntent = await response.json();

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
