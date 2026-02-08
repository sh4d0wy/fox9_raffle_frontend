import { VerifiedTokens } from "@/utils/verifiedTokens";
import { useGumballById } from "hooks/gumball/useGumballsQuery";
import { useMemo } from "react";
import type { GumballBackendDataType, PrizeDataBackend } from "types/backend/gumballTypes";

interface AvailablePrize extends PrizeDataBackend {
  remainingQuantity: number;
}

export const AvailableGumballTable = ({gumballId}: {gumballId: string}) => {
  const { data: gumball } = useGumballById(gumballId) as { data: GumballBackendDataType };
  const formatPrice = (price: string, mint: string) => {
    const numPrice = parseFloat(price)/ 10**(VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === mint)?.decimals || 0);
    return `${numPrice}`;
  }
  const availableGumballs = useMemo(() => {
    if (!gumball?.prizes) return [];
    
    const spinCountByPrizeIndex: Record<number, number> = {};
    gumball.spins?.forEach((spin) => {
      if (spin.prize?.prizeIndex === undefined || spin.prize?.prizeIndex === null) return;
      const prizeIndex = spin.prize?.prizeIndex;
      spinCountByPrizeIndex[prizeIndex] = (spinCountByPrizeIndex[prizeIndex] || 0) + 1;
    });
    return gumball.prizes
      .map((prize): AvailablePrize => ({
        ...prize,
        remainingQuantity: prize.quantity - (spinCountByPrizeIndex[prize.prizeIndex] || 0),
      }))
      .filter((prize) => prize.remainingQuantity > 0);
  }, [gumball?.prizes, gumball?.spins]);
  return (
    <div className={`mt-5 border relative border-gray-1100 h-full rounded-[20px] w-full overflow-hidden ${availableGumballs?.length === 0 ? "min-h-[394px]" : ""}`}>
      {(availableGumballs?.length === 0 || gumball?.status === "CANCELLED") && (
        <div className="absolute w-full h-full flex items-center justify-center py-20">
          <p className="md:text-base text-sm font-medium text-center font-inter text-white">
            No data found
          </p>
        </div>
      )}
    <div className="overflow-auto">
      <table className="table md:w-full w-[767px]">
        <thead className="bg-black-1300 border-b border-gray-1100">
          <tr>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium px-6 py-7">
              Prize
            </th>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium">
              <div className="pl-5 h-6">Quantity</div>
            </th>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium">
              <div className="pl-5 h-6">Floor price</div>
            </th>
          </tr>
        </thead>
        {gumball?.status !== "CANCELLED" && availableGumballs?.length > 0 && (
        <tbody>
          {availableGumballs?.map((row, idx) => {
            const displayQuantity = row.isNft 
            ? row.remainingQuantity 
            : `${parseFloat((parseFloat(formatPrice(row.prizeAmount, row.mint)) * row.remainingQuantity).toFixed(6))} ${row.symbol || ''}`;
          
          const displayFloorPrice = row.isNft 
            ? (row.floorPrice ? `${parseFloat(row.floorPrice) / 10 ** 9} SOL` : "N/A")
            : "N/A";
            return (
              <tr key={idx} className="w-full">
                <td>
                  <div className="px-6 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <img src={row.image} className={`w-[60px] h-[60px] ${row.isNft ? 'rounded-lg' : 'rounded-full'}`} alt="no-img" />
                    <div className="flex flex-col">
                      <p className="md:text-base text-sm text-white font-medium font-inter">
                        {row.name && row.name.length > 15 ? row.name.slice(0,15)+"..." : row.name || "Prize"}
                      </p>
                      <span className={`text-xs font-inter ${row.isNft ? 'text-purple-600' : 'text-green-600'}`}>
                        {row.isNft ? 'NFT' : 'Token'}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <p className="md:text-base text-sm text-white font-medium font-inter">{displayQuantity}</p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <p className="md:text-base text-sm text-white font-medium font-inter">{displayFloorPrice}</p>
                  </div>
                </td>
      
           
              </tr>
            );
          })}
        </tbody>
        )}
      </table>
    </div>
    </div>
  );
};
