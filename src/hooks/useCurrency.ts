import { useState, useEffect } from "react";

interface CurrencyInfo {
  currency: "ZAR" | "USD";
  symbol: string;
  rate: number;
  isLoading: boolean;
}

export function useCurrency() {
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>({
    currency: "ZAR",
    symbol: "R",
    rate: 1,
    isLoading: true,
  });

  useEffect(() => {
    const detect = async () => {
      const locale = navigator.language || "en-ZA";
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isSouthAfrican =
        locale.includes("ZA") || locale === "af" || timezone === "Africa/Johannesburg";

      if (isSouthAfrican) {
        setCurrencyInfo({ currency: "ZAR", symbol: "R", rate: 1, isLoading: false });
        return;
      }

      // Free public exchange rate API — no auth required
      try {
        const res = await fetch("https://api.frankfurter.app/latest?from=ZAR&to=USD");
        const data = await res.json() as { rates?: { USD?: number } };
        const rate = data.rates?.USD ?? 0.055;
        setCurrencyInfo({ currency: "USD", symbol: "$", rate, isLoading: false });
      } catch {
        setCurrencyInfo({ currency: "USD", symbol: "$", rate: 0.055, isLoading: false });
      }
    };
    detect();
  }, []);

  const formatPrice = (zarAmount: number): string => {
    if (currencyInfo.currency === "ZAR") return `R${zarAmount.toLocaleString()}`;
    const usdAmount = Math.round(zarAmount * currencyInfo.rate);
    return `$${usdAmount.toLocaleString()}`;
  };

  return { ...currencyInfo, formatPrice };
}
