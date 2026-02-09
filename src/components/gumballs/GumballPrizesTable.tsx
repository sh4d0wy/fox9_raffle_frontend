import { VerifiedTokens } from "@/utils/verifiedTokens";
import type { PrizeDataBackend } from "types/backend/gumballTypes";

interface AvailablePrize extends PrizeDataBackend {
  remainingQuantity: number;
}

interface GumballPrizesTableProps {
    prizes: AvailablePrize[];
}
export const GumballPrizesTable = ({prizes}:GumballPrizesTableProps) => {
  const formatPrice = (price: string, mint: string) => {
    const numPrice = parseFloat(price)/ 10**(VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === mint)?.decimals || 0);
    return `${numPrice}`;
  }
  return (
    <div className={`border relative border-gray-1100  h-full rounded-[20px] w-full overflow-hidden ${prizes.length === 0 ? "min-h-[394px]" : ""}`}>
      {prizes.length === 0 && (
        <div className="absolute w-full h-full flex items-center justify-center py-10">
          <p className="md:text-base text-sm font-medium text-center font-inter text-white">
            No prizes available
          </p>
        </div>
      )}
    <div className="overflow-auto">
      <table className="table md:w-full w-[767px]">
        <thead className="bg-black-1300 border-b border-gray-1200">
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
        <tbody>
        {prizes.map((prize, idx) => (
  <tr
    key={idx}
    className="border-b border-gray-1100 last:border-b-0"
  >
    <td className="px-6 py-5 h-24">
      <div className="flex items-center gap-2.5">
        <img
          src={prize.image || "/images/prize-image.png"}
          className="w-[60px] h-[60px] rounded-full"
          alt="no-img"
        />
        <p className="md:text-base text-sm text-white font-medium font-inter">
        {prize.isNft ? (
                      <p className="md:text-base text-sm text-white font-medium font-inter">
                        {prize.name?.slice(0, 10) + "..." || prize.symbol || "Prize"}
                      </p>) : (
                        <p className="text-md text-white font-medium font-inter">
                          {formatPrice(prize.prizeAmount, prize.mint)}
                        </p>
                      )}
        </p>
      </div>
    </td>

    <td className="px-5 py-6 h-24">
      <p className="md:text-base text-sm text-white font-medium font-inter">
        {prize.remainingQuantity}
      </p>
    </td>

    <td className="px-5 py-6 h-24">
      <p className="md:text-base text-sm text-white font-medium font-inter">
      {(prize.floorPrice ? parseFloat((parseFloat(prize.floorPrice)/1e9).toFixed(6)) +" SOL": "N/A")}
      </p>
    </td>
  </tr>
))}

        </tbody>
      </table>
    </div>
    </div>
  );
};
