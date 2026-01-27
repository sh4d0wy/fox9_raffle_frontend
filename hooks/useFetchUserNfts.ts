import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { HELIUS_KEY, NETWORK } from "../src/constants";
import { VerifiedNftCollections } from "../src/utils/verifiedNftCollections";

export const useFetchUserNfts = () => {
    const wallet = useWallet();
    const getNFTsByOwner = async (ownerAddress:string) => {
            const response = await fetch(`https://${NETWORK}.helius-rpc.com/?api-key=${HELIUS_KEY}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: "1",
                method: "getAssetsByOwner",
                params: {
                  ownerAddress: ownerAddress,
                  page: 1,
                  limit: 10,
                },
              }),
            });
            
            const data = await response.json();
            return data;
          };
          
    const { data: userNfts = [], isLoading, error } = useQuery({
        queryKey: ['userNfts', wallet.publicKey?.toString()],
        queryFn: async () => {
            if (!wallet.publicKey) return [];
            const nfts = await getNFTsByOwner(wallet.publicKey?.toString() ?? "");
            
            const filteredNfts = nfts.result.items.filter((nft: any) => {
                return nft.grouping.some((group: any) => 
                    group.group_key === "collection" && 
                    VerifiedNftCollections.some((verifiedCollection) => 
                        verifiedCollection.address === group.group_value
                    )
                );
            });
            
            return filteredNfts;
        },
    });

    return { userNfts, isLoading, error };
};