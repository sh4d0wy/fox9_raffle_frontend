import { VerifiedTokens } from "@/utils/verifiedTokens";
import type { SpinDataBackend } from "types/backend/gumballTypes";

export const MoneybackTable = ({spins}:{spins:SpinDataBackend[]}) => {
  const filterSpins = spins.filter((spin) => {
    return spin.isPendingClaim === false && spin.claimedAt !== null;
  });
  const formatPrice = (price: string, mint: string) => {
    const numPrice = parseFloat(price)/ 10**(VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === mint)?.decimals || 0);
    return `${numPrice}`;
  }
  return (
    <div className="border border-gray-1100 rounded-[20px] w-full overflow-x-auto xl:overflow-hidden">
      <table className="table xl:w-full w-[500px] md:w-[600px]">
        <thead className="bg-black-1300 border-b border-gray-1200">
          <tr className="flex-1">
            <th
              scope="col"
              className="text-base w-1/3 text-start font-inter text-gray-1600 font-medium px-4 md:px-10 py-4 md:py-7"
            >
              Prize
            </th>
            <th
              scope="col"
              className="text-base w-1/5 text-start font-inter text-gray-1600 font-medium"
            >
              <div className="pl-5 h-6"> TX</div>
            </th>
            <th
              scope="col"
              className="text-base w-1/5 text-start font-inter text-gray-1600 font-medium"
            >
              <div className="pl-5 h-6">Time</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filterSpins.map((spin, idx) => (
          <tr className="flex-1">
            <td scope="row">
              <div className="md:px-10 px-4 flex items-center gap-5 md:gap-2.5 py-6 border-b border-gray-1100">
                <img
                  src={spin.prize?.image || "/images/prize-image.png"}
                  className="md:w-[60px] w-10 h-10 md:h-[60px] rounded-full object-cover"
                  alt="no img"
                />
               {spin.prize ? (
                  spin.prize.isNft ? (
                    <p className="text-base text-white font-medium font-inter">
                      {spin.prize.name && spin.prize.name.length > 10 ? spin.prize.name.slice(0,10)+"..." : spin.prize.name}
                    </p>
                  ) : (
                    <p className="text-base text-white font-medium font-inter">
                      {formatPrice(spin.prize.prizeAmount, spin.prize.mint)}
                    </p>
                  )
                ) : (
                  <p className="text-base text-white font-medium font-inter">
                    Prize not claimed yet
                  </p>
                )}
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[34px] md:py-[42px] border-b border-gray-1100">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  {spin.transaction.transactionId.slice(0, 4)+"..."+spin.transaction.transactionId.slice(-6)}
                </p>
                <img
                  src="/icons/external-link-icon.svg"
                  onClick={() => window.open(`https://solscan.io/tx/${spin.transaction.transactionId}`, "_blank")}
                  className="w-5 h-5 cursor-pointer"
                  alt="link"
                />
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[34px] md:py-[42px] border-b border-gray-1100">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                {new Date(spin.spunAt)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .replace(",", "")
                    .replace(/ (\d{2})$/, "'$1")}
                </p>
              </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
