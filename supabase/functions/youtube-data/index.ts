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
    const url = new URL(req.url);
    const type = url.searchParams.get("type"); // 'subscribers' or 'videos'
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "YouTube API not configured. Please add YOUTUBE_API_KEY in admin settings.",
          subscribers: "0",
          videos: []
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const channelId = "UCYourChannelIdHere"; // Will be updated when channel is provided

    if (type === "subscribers") {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
      );
      const data = await response.json();
      const subscribers = data.items?.[0]?.statistics?.subscriberCount || "0";
      
      return new Response(
        JSON.stringify({ subscribers }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (type === "videos") {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=4&key=${apiKey}`
      );
      const data = await response.json();
      
      return new Response(
        JSON.stringify({ videos: data.items || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid request type" }),
      { 
        status: 400,
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
