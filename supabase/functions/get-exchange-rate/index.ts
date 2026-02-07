import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch exchange rate from a free API (ZAR to USD)
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/ZAR'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json();
    const usdRate = data.rates.USD;
    
    return new Response(
      JSON.stringify({ 
        rate: usdRate,
        base: 'ZAR',
        target: 'USD',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        } 
      }
    );
  } catch (error) {
    console.error('Exchange rate error:', error);
    
    // Return a fallback rate if API fails (approximately 1 ZAR = 0.055 USD)
    return new Response(
      JSON.stringify({ 
        rate: 0.055,
        base: 'ZAR',
        target: 'USD',
        fallback: true,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
