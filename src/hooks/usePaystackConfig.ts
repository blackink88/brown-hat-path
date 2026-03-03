/**
 * Returns the Paystack public key from the VITE_PAYSTACK_PUBLIC_KEY env var.
 * The public key is safe to embed in the frontend bundle.
 * Set VITE_PAYSTACK_PUBLIC_KEY=pk_live_... in your .env file.
 */
export function usePaystackConfig() {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;

  return {
    publicKey: publicKey || null,
    isLoading: false,
    error: publicKey ? null : "VITE_PAYSTACK_PUBLIC_KEY not set in .env",
  };
}
