import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve((_req) => {
  return new Response(JSON.stringify({ status: "ok", name: "cmx-api" }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
