// // Import required types and Supabase client
// import "https://jsr.io/@supabase/functions-js/2.4.4/src/edge-runtime.d.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js";

// // Initialize Supabase client with environment variables
// const supabase = createClient(
//   Deno.env.get("SUPABASE_URL")!,
//   Deno.env.get("SUPABASE_ANON_KEY")!
// );

// // Handle incoming requests
// Deno.serve(async (req) => {
//   try {
//     const { email } = await req.json();

//     if (!email || !email.includes('@')) {
//       return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
//     }

//     // Check if email exists in the "subscribers" table
//     const { data, error } = await supabase
//       .from('subscribers')
//       .select('email')
//       .eq('email', email);

//     if (error) {
//       return new Response(JSON.stringify({ error: 'Error checking email' }), { status: 500 });
//     }

//     return new Response(
//       JSON.stringify({ exists: data.length > 0 }),
//       { headers: { "Content-Type": "application/json" }, status: 200 }
//     );

//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
//   }
// });


// Import required types and Supabase client
import "https://jsr.io/@supabase/functions-js/2.4.4/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Initialize Supabase client with environment variables
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change "*" to your frontend domain if needed
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle incoming requests
Deno.serve(async (req) => {
  try {
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Check if email exists in the "subscribers" table
    const { data, error } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', email);

    if (error) {
      return new Response(JSON.stringify({ error: 'Error checking email' }), {
        status: 500,
        headers: corsHeaders
      });
    }

    return new Response(
      JSON.stringify({ exists: data.length > 0 }),
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
