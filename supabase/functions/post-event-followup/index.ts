import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify the user is an admin
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabaseUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Check admin role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { event_id } = await req.json();
    if (!event_id) {
      return new Response(
        JSON.stringify({ error: "event_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get event details
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: "Event not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Segment: update confirmed/checked_in guests to "attended"
    const { data: updatedGuests, error: updateError } = await supabaseAdmin
      .from("guests")
      .update({ status: "attended" })
      .eq("event_id", event_id)
      .in("status", ["confirmed", "checked_in"])
      .select("id, first_name, last_name, email, status");

    if (updateError) {
      throw updateError;
    }

    // Mark no-shows: pending guests become "no_show"
    const { data: noShows } = await supabaseAdmin
      .from("guests")
      .update({ status: "no_show" })
      .eq("event_id", event_id)
      .eq("status", "pending")
      .select("id");

    // Mark event as completed
    await supabaseAdmin
      .from("events")
      .update({ status: "completed" })
      .eq("id", event_id);

    // TODO: When email domain is configured, send thank-you emails here
    // Each attended guest would receive a personalized follow-up email with:
    // - Thank you message
    // - Reflection prompts
    // - Link to next upcoming event
    // - Feedback form link

    return new Response(
      JSON.stringify({
        success: true,
        attended: updatedGuests?.length || 0,
        no_shows: noShows?.length || 0,
        event_name: event.name,
        message: `Post-event follow-up complete. ${updatedGuests?.length || 0} guests marked as attended, ${noShows?.length || 0} marked as no-show.`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Follow-up error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
