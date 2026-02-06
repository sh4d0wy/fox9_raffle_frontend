export const HELIUS_KEY = import.meta.env.VITE_HELIUS_API_KEY;
// change to "mainnet" when deploying to mainnet
export const NETWORK = "mainnet" as "devnet" | "mainnet";
export const SOLANA_RPC = (NETWORK === "devnet") ? "https://api.devnet.solana.com" : `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;
// export const API_URL = "https://raffle.meccain.com";
export const API_URL = "http://localhost:3000";

export const NATIVE_SOL_MINT = "native";
export const WRAPPED_SOL_MINT = "So11111111111111111111111111111111111111112";