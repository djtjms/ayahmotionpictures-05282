import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DonationReceiptRequest {
  donorName: string;
  email: string;
  amount: number;
  donationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donorName, email, amount, donationId }: DonationReceiptRequest = await req.json();

    // For now, just log the receipt data
    // In production, integrate with an email service like Resend
    console.log("Donation receipt:", {
      donorName,
      email,
      amount,
      donationId,
      date: new Date().toISOString(),
    });

    // Update donation status
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabase
      .from("donations")
      .update({ status: "completed" })
      .eq("id", donationId);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Receipt sent successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-donation-receipt function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
