import { useQuery } from "@tanstack/react-query";
import { HELIUS_KEY, NETWORK } from "../src/constants";

export interface NftAttribute {
  trait_type: string;
  value: string | number;
}

export interface NftMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
  collection: {
    name: string;
    family: string;
  } | null;
  creators: {
    address: string;
    share: number;
    verified: boolean;
  }[];
  royalty: number;
  mintAddress: string;
  owner: string;
  supply: number;
  mutable: boolean;
  burnt: boolean;
  externalUrl: string;
}

const fetchNftMetadata = async (mintAddress: string): Promise<NftMetadata | null> => {
  if (!mintAddress) return null;

  const response = await fetch(`https://${NETWORK}.helius-rpc.com/?api-key=${HELIUS_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "nft-metadata",
      method: "getAsset",
      params: {
        id: mintAddress,
      },
    }),
  });

  const data = await response.json();

  if (data.error || !data.result) {
    console.error("Error fetching NFT metadata:", data.error);
    return null;
  }

  const asset = data.result;
  const content = asset.content;
  const metadata = content?.metadata || {};
  const jsonUri = content?.json_uri;
  const links = content?.links || {};

  let attributes: NftAttribute[] = metadata.attributes || [];
  
  if (jsonUri && attributes.length === 0) {
    try {
      const metadataResponse = await fetch(jsonUri);
      const jsonMetadata = await metadataResponse.json();
      attributes = jsonMetadata.attributes || [];
    } catch (err) {
      console.error("Error fetching JSON metadata:", err);
    }
  }

  const collectionGroup = asset.grouping?.find(
    (g: any) => g.group_key === "collection"
  );

  return {
    name: metadata.name || content?.metadata?.name || "",
    symbol: metadata.symbol || "",
    description: metadata.description || "",
    image: links.image || content?.files?.[0]?.uri || "",
    attributes,
    collection: collectionGroup
      ? {
          name: collectionGroup.collection_metadata?.name || "",
          family: collectionGroup.collection_metadata?.family || "",
        }
      : null,
    creators: asset.creators || [],
    royalty: asset.royalty?.percent || 0,
    mintAddress: asset.id || mintAddress,
    owner: asset.ownership?.owner || "",
    supply: asset.supply?.print_current_supply || 1,
    mutable: asset.mutable ?? true,
    burnt: asset.burnt ?? false,
    externalUrl: metadata.external_url || links.external_url || "",
  };
};

export const useNftMetadata = (mintAddress: string | undefined) => {
  return useQuery({
    queryKey: ["nftMetadata", mintAddress],
    queryFn: () => fetchNftMetadata(mintAddress || ""),
    enabled: !!mintAddress,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

