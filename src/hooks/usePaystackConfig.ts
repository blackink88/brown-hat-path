import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePaystackConfig() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-paystack-config");
        if (error) throw error;
        setPublicKey(data?.publicKey || null);
      } catch (err) {
        console.error("Failed to fetch Paystack config:", err);
        setError(err instanceof Error ? err.message : "Failed to load payment config");
        setPublicKey(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicKey();
  }, []);

  return { publicKey, isLoading, error };
}
