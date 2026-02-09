import { API_URL } from "@/constants";
import { VerifiedTokens } from "@/utils/verifiedTokens";
import { useMemo } from "react";
import { DEFAULT_AVATAR } from "store/userStore";

interface Bid {
    id: string;
    bidAmount: number;
    bidderWallet: string;
    bidder: { walletAddress: string; twitterId?: string | null , profileImage?: string | null};
    bidTime: string;
    transactionId: string;
  }

export const AuctionParticipants = ({
  bids,
  isLoading = false,
  currency,
}: {
  bids?: Bid[];
  isLoading?: boolean;
  currency: string;
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday =
          new Date(now.setDate(now.getDate() - 1)).toDateString() ===
          date.toDateString();
    
        const time = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
    
        if (isToday) return `Today, ${time}`;
        if (isYesterday) return `Yesterday, ${time}`;
        return `${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}, ${time}`;
      };
    
      const currencyDecimals = useMemo(() => {
        return (
          VerifiedTokens.find((token) => token.symbol === currency)?.decimals ?? 0
        );
      }, [currency]);
  return (
    <div className="border border-gray-1100 pb-14 rounded-[20px] w-full md:overflow-hidden overflow-x-auto">
      <table className="table w-full min-w-[600px]">
        <thead className="bg-black-1300 border-b border-gray-1100">
          <tr className="flex-1">
            <th className="text-sm md:text-base md:w-1/3 text-start font-inter text-gray-1600 font-medium md:px-10 px-4 py-7">
              User
            </th>
            <th className="text-sm md:text-base md:w-1/5 text-start font-inter text-gray-1600 font-medium">
              <div className="px-5 h-6">
                Bid amount
              </div>
            </th>
            <th className="text-sm md:text-base md:w-1/5 text-start font-inter text-gray-1600 font-medium">
              <div className="px-5 h-6">
                Tx
              </div>
            </th>
            <th className="text-sm md:text-base md:w-1/5 text-start font-inter text-gray-1600 font-medium">
              <div className="px-5 h-6">
                Bid time
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <tr key={i} className="flex-1 animate-pulse">
                  <td>
                    <div className="md:px-10 px-4 py-4 border-b border-gray-1100 flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </div>
                  </td>
                  <td>
                    <div className="px-5 py-6 border-b border-gray-1100">
                      <div className="h-4 w-6 bg-gray-300 rounded"></div>
                    </div>
                  </td>
                  <td>
                    <div className="px-5 py-6 border-b border-gray-1100">
                      <div className="h-4 w-6 bg-gray-300 rounded"></div>
                    </div>
                  </td>
                  <td>
                    <div className="px-5 py-6 border-b border-gray-1100">
                      <div className="h-4 w-12 bg-gray-300 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            bids?.map((b) => (
              <tr key={b.id} className="flex-1 border-b border-gray-1100">
                <td>
                  <div className="md:px-10 px-4 flex items-center gap-2.5 py-4 ">
                    <img
                      src={b.bidder.profileImage?API_URL + b.bidder.profileImage:DEFAULT_AVATAR}
                      className="md:w-10 md:h-10 w-8 h-8 rounded-full object-cover"
                      alt="user"
                    />
                    <p className="text-sm md:text-base text-white font-medium font-inter">
                      { b.bidder.walletAddress.slice(0, 4) + "..." + b.bidder.walletAddress.slice(-4)}
                    </p>
                  </div>
                </td>

                <td>
                  <div className="px-5 py-6 ">
                    <p className="text-sm md:text-base text-white font-medium font-inter">
                      {b.bidAmount/(10**currencyDecimals)} {currency}
                    </p>
                  </div>
                </td>

                <td>
                    <div className="px-5 py-6  flex items-center gap-2.5">
                      <p className="text-sm md:text-base text-white font-medium font-inter">
                        {b.transactionId.slice(0, 6)}...
                        {b.transactionId.slice(-4)}
                      </p>
                      <img
                        src="/icons/external-link-icon.svg"
                        onClick={() =>
                          window.open(
                            `https://solscan.io/tx/${b.transactionId}`,
                            "_blank"
                          )
                        }
                        className="w-5 h-5 cursor-pointer"
                        alt="link"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="px-5 py-6">
                      <p className="text-sm md:text-base text-white font-medium font-inter">
                        {formatDate(b.bidTime)}
                      </p>
                    </div>
                  </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
