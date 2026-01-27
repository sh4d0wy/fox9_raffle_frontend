interface TransactionRow {
  id: number;
  tx: string;
  buyer: string;
  date: string; 
  time: string;
  tickets: number;
}

const dummyTransactions: TransactionRow[] = [
  {
    id: 1,
    tx: "3gcT...tt3v",
    buyer: "3Yrq...HVRh",
    date: "24 Oct '25",
    time: "06:20",
    tickets: 1,
  },
  {
    id: 2,
    tx: "3gcT...tt3v",
    buyer: "3Yrq...HVRh",
    date: "24 Oct '25",
    time: "06:20",
    tickets: 1,
  },
  {
    id: 3,
    tx: "3gcT...tt3v",
    buyer: "3Yrq...HVRh",
    date: "24 Oct '25",
    time: "06:20",
    tickets: 1,
  },
  {
    id: 4,
    tx: "3gcT...tt3v",
    buyer: "3Yrq...HVRh",
    date: "24 Oct '25",
    time: "06:20",
    tickets: 1,
  },
];

export const TransactionsTable = ({
  transactions = dummyTransactions,
  isLoading = false,
}: {
  transactions?: TransactionRow[];
  isLoading?: boolean;
}) => {
  return (
    <div className="border border-gray-1100 rounded-[20px] w-full md:overflow-hidden overflow-x-auto">
      <table className="table w-full min-w-[600px]">
        <thead className="bg-black-1300 border-b border-gray-1100">
          <tr>
            <th className="text-base md:w-1/3 text-start font-inter text-gray-1600 font-medium md:px-10 px-4 py-7">
              Transaction
            </th>
            <th className="text-base md:w-1/5 text-start font-inter text-gray-1600 font-medium">
              <div className="px-5 h-6">Buyer</div>
            </th>
            <th className="text-base md:w-1/5 text-start font-inter text-gray-1600 font-medium">
              <div className="px-5 h-6">Date & time</div>
            </th>
            <th className="text-base md:w-1/5 text-start font-inter text-gray-1600 font-medium">
              <div className="px-5 h-6">Tickets</div>
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? 
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td>
                      <div className="md:px-10 px-4 py-4 border-b border-gray-1100 flex items-center gap-2.5">
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        <div className="h-5 w-5 bg-gray-300 rounded"></div>
                      </div>
                    </td>

                    <td>
                      <div className="px-5 md:py-6 py-4 border-b border-gray-1100">
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                      </div>
                    </td>

                    <td>
                      <div className="px-5 py-6 border-b border-gray-1100">
                        <div className="h-4 w-32 bg-gray-300 rounded"></div>
                      </div>
                    </td>

                    <td>
                      <div className="px-5 py-6 border-b border-gray-1100">
                        <div className="h-4 w-6 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
            : 
            transactions.map((t) => (
              <tr
                key={t.id}
                className="border-b border-gray-1100 last:border-b-0"
              >
                <td className="md:px-10 px-4 md:py-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <p className="text-base text-white font-medium font-inter">
                      {t.tx}
                    </p>
                    <img
                      src="/icons/external-link-icon.svg"
                      className="w-5 h-5"
                      alt="link"
                    />
                  </div>
                </td>

                <td className="px-5 md:py-6 py-4">
                  <p className="text-base text-white font-medium font-inter">
                    {t.buyer}
                  </p>
                </td>

                <td className="px-5 md:py-6 py-4">
                  <p className="text-base text-white font-medium font-inter">
                    {t.date} <span className="text-gray-1200">|</span> {t.time}
                  </p>
                </td>

                <td className="px-5 md:py-6 py-4">
                  <p className="text-base text-white font-medium font-inter">
                    {t.tickets}
                  </p>
                </td>
              </tr>
            ))}

        </tbody>
      </table>
    </div>
  );
};
