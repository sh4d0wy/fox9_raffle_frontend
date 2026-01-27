import { useQuery } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { VerifiedTokens, NATIVE_SOL_MINT } from "../src/utils/verifiedTokens";
import { NETWORK } from "../src/constants";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const useFetchUserToken = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const { data: userVerifiedTokens = [], isLoading, error } = useQuery({
        queryKey: ['userTokens', wallet.publicKey?.toString()],
        queryFn: async () => {
            if (!wallet.publicKey) return [];
            console.log("Entered useFetchUserToken");
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                wallet.publicKey,
                { programId: TOKEN_PROGRAM_ID }
            );

            const verifiedTokensHeld = VerifiedTokens.filter((verifiedToken) =>
                tokenAccounts.value.some(
                    (account) =>
                        account.account.data.parsed.info.mint === verifiedToken.address &&
                        account.account.data.parsed.info.tokenAmount.uiAmount >= 1
                )
            );
            
            const tokensWithBalance = verifiedTokensHeld.map(verifiedToken => {
                const tokenAccount = tokenAccounts.value.find(
                    account => account.account.data.parsed.info.mint === verifiedToken.address
                );
                
                return {
                    ...verifiedToken,
                    balance: tokenAccount?.account.data.parsed.info.tokenAmount.uiAmount || 0,
                    decimals: tokenAccount?.account.data.parsed.info.tokenAmount.decimals || 0
                };
            });
            console.log("tokensWithBalance", tokensWithBalance);
            const userSolbalance = await connection.getBalance(wallet.publicKey);
            console.log("userSolbalance", userSolbalance);
            
            if (NETWORK === "devnet") {
                return VerifiedTokens.filter((token) => (token.address === NATIVE_SOL_MINT || token.address === "BZfZhBoQSAMQVshvApFzwbKNA3dwuxKhK8m5GVCQ26yG"));
            }
            if (userSolbalance > 0) {
                return [...tokensWithBalance, {
                    name: "SOL",
                    address: NATIVE_SOL_MINT,
                    symbol: "SOL",
                    image: "https://cryptologos.cc/logos/solana-sol-logo.png?v=040",
                    decimals: 9,
                    balance: userSolbalance / LAMPORTS_PER_SOL,
                }];
            }
            return tokensWithBalance;
        },
        enabled: !!wallet.publicKey,
        staleTime: 30000,
        refetchOnWindowFocus: false,
    });

    return {
        userVerifiedTokens,
        isLoading,
        error
    };
};