import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CurrencyInfo {
  currency: "ZAR" | "USD";
  symbol: string;
  rate: number;
  isLoading: boolean;
}

// ZAR base prices in cents
const BASE_PRICES_ZAR = {
  foundation: 499,
  practitioner: 1500,
  professional: 3000,
};

export function useCurrency() {
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>({
    currency: "ZAR",
    symbol: "R",
    rate: 1,
    isLoading: true,
  });

  useEffect(() => {
    const detectCurrencyAndFetchRate = async () => {
      // Detect if user is in South Africa based on browser locale/timezone
      const locale = navigator.language || "en-ZA";
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const isSouthAfrican = 
        locale.includes("ZA") || 
        locale === "af" || 
        timezone === "Africa/Johannesburg";

      if (isSouthAfrican) {
        setCurrencyInfo({
          currency: "ZAR",
          symbol: "R",
          rate: 1,
          isLoading: false,
        });
        return;
      }

      // Fetch USD exchange rate for non-SA users
      try {
        const { data, error } = await supabase.functions.invoke("get-exchange-rate");
        
        if (error) throw error;
        
        setCurrencyInfo({
          currency: "USD",
          symbol: "$",
          rate: data.rate || 0.055,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        // Fallback rate
        setCurrencyInfo({
          currency: "USD",
          symbol: "$",
          rate: 0.055,
          isLoading: false,
        });
      }
    };

    detectCurrencyAndFetchRate();
  }, []);

  const formatPrice = (zarAmount: number): string => {
    if (currencyInfo.currency === "ZAR") {
      return `R${zarAmount.toLocaleString()}`;
    }
    
    const usdAmount = Math.round(zarAmount * currencyInfo.rate);
    return `$${usdAmount.toLocaleString()}`;
  };

  const getPrices = () => ({
    foundation: formatPrice(BASE_PRICES_ZAR.foundation),
    practitioner: formatPrice(BASE_PRICES_ZAR.practitioner),
    professional: formatPrice(BASE_PRICES_ZAR.professional),
  });

  return {
    ...currencyInfo,
    formatPrice,
    getPrices,
  };
}
