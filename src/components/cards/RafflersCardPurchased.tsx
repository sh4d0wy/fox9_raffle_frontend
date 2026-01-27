import { Link } from "@tanstack/react-router";

export interface RafflersCardPurchasedProps {
  id: number;
  title: string;
  userName: string;
  MainImage: string;
  TicketBought: number;
  rafflesType: string;
  ChancePercent: number;
  verified?: boolean;
  totalTickets: number;
  soldTickets: number;
  pricePerTicket: number;
  className?: string;
  category: string;
  sol: number;
}

export const RafflersCardPurchased: React.FC<RafflersCardPurchasedProps> = ({
  id,
  userName,
  title,
  MainImage,
  TicketBought,
  ChancePercent,
  verified = false,
  totalTickets,
  soldTickets,
  pricePerTicket,
  className,
  category,
  sol,
}) => {
  const remainingTickets = totalTickets - soldTickets;

  return (
    <div
      className={`bg-transparent hover:bg-primary-color/10 w-full transition duration-300 border border-gray-1100 rounded-2xl ${className}`}
    >
      {<p className="hidden">{category}</p>}
      <div className="w-full flex gap-5 p-5 sm:flex-row flex-col">
        <img
          src={MainImage}
          alt="featured-card"
          className="object-cover w-[109px] h-[109px] rounded-lg"
        />

        <div className="flex-1">
          <div className="flex w-full items-center justify-between">
            <h3 className="xl:text-2xl text-xl text-white font-bold font-inter">
              {title}
            </h3>
            <div className="flex items-center justify-center gap-5">
              <Link to="/" className="inline-flex items-center gap-3 bg-primary-color py-2.5 px-4 rounded-full">
              <img src="/icons/gift-line-icon.svg" alt="" />
               Claim Prize</Link>
            <Link
              to="/auctions/$id"
              params={{ id: id.toString() }}
              className="w-10 h-10 transition duration-300 hover:opacity-90 flex items-center justify-center text-white font-semibold font-inter bg-primary-color rounded-md"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 4.16665L13.3333 9.99998L7.5 15.8333"
                  stroke="#212121"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            </div>
          </div>

          <div className="w-full gap-6 flex justify-between mt-6 md:flex-row flex-col">
            <div className="flex flex-col gap-1.5">
              {verified && (
                <div className="inline-flex gap-2.5 items-center">
                  <p className="text-sm text-white font-semibold font-inter">
                    Transdimensional fox federation
                  </p>
                  <img
                    src="/icons/verified-icon.svg"
                    alt="verified"
                    className="w-5 h-5"
                  />
                </div>
              )}

              <p className="text-sm font-medium text-primary-color font-inter">
                {userName}
              </p>
            </div>

            <p className="text-base mt-auto text-primary-color font-medium font-inter">
              Raffle Ended 1 y 5 mo ago
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-1100"></div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 md:gap-20 p-5">
        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">
            Tickets remaining
          </h4>
          {totalTickets !== soldTickets ? (
            <h4 className="md:text-base text-sm text-white font-inter font-medium">
              {remainingTickets}/{totalTickets}
            </h4>
          ) : (
            <h4 className="text-base text-red-1000 font-semibold font-inter">
              SOLD OUT
            </h4>
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">Price</h4>
          <h4 className="md:text-base text-sm text-white font-inter font-medium">
            <span>{pricePerTicket}</span> SOL
          </h4>
        </div>

        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">
            Tickets Bought
          </h4>
          <h4 className="md:text-base text-sm text-white font-inter font-medium">
            <span>{TicketBought}</span>
          </h4>
        </div>

        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">Chance</h4>
          <h4 className="md:text-base text-sm text-white font-inter font-medium">
            <span>{ChancePercent}</span>%Chance
          </h4>
        </div>

        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">Spent</h4>
          <h4 className="md:text-base text-sm text-white font-inter font-medium">
            <span>{sol}</span> SOL Spent
          </h4>
        </div>
      </div>
    </div>
  );
};
