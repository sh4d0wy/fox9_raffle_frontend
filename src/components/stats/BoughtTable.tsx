
interface BoughtRow {
  date: string; 
  spent: number;
  won: number;
  pl: number;
  roi: number;
}

const dummyBoughtData: BoughtRow[] = [
  { date: "24 Oct '25 | 06:20", spent: 25, won: 90, pl: 65, roi: 500 },
  { date: "24 Oct '25 | 07:15", spent: 25, won: 90, pl: -65, roi: 0 },
  { date: "24 Oct '25 | 08:00", spent: 25, won: 90, pl: -65, roi: 0 },
  { date: "24 Oct '25 | 09:30", spent: 25, won: 90, pl: -65, roi: 0 },
];

export const BoughtTable = () => {
  return (
    <div className="border relative border-gray-1100 rounded-[20px] w-full overflow-hidden">
      {dummyBoughtData.length === 0 && (
        <div className="absolute w-full h-full flex items-center justify-center py-20">
          <p className="md:text-base text-sm font-medium text-center font-inter text-white">
            No data found
          </p>
        </div>
      )}
<div className="overflow-auto">
      <table className="table md:w-full w-[767px]">
        <thead className="bg-black-1300 border-b border-gray-1100 ">
          <tr>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium px-6 py-7">
              Date
            </th>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium">
              <div className="pl-5 h-6">Spent</div>
            </th>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium">
              <div className="pl-5 h-6">Won</div>
            </th>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium">
              <div className="pl-5 h-6">P&L</div>
            </th>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium">
              <div className="pl-5 h-6">ROI</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {dummyBoughtData.map((row, idx) => {
            const [datePart, timePart] = row.date.split("|").map((s) => s.trim());
            return (
              <tr key={idx} className="w-full">
                <td>
                  <div className="px-6 flex items-center gap-2.5 py-6 border-b border-gray-1100 ">
                    <p className="md:text-base text-sm text-white font-medium font-inter">
                      {datePart} <span className="text-gray-1200 mx-1">|</span> {timePart}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 border-b border-gray-1100">
                    <p className="md:text-base text-sm text-white font-medium font-inter">${row.spent}</p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 border-b border-gray-1100">
                    <p className="md:text-base text-sm text-white font-medium font-inter">${row.won}</p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 border-b border-gray-1100">
                    <p
                      className={`md:text-base text-sm font-medium font-inter ${
                        row.pl >= 0 ? "text-green-1100" : "text-orange-1100"
                      }`}
                    >
                      ${row.pl}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 border-b border-gray-1100">
                    <p
                      className={`md:text-base text-sm font-medium font-inter ${
                        row.roi > 0 ? "text-green-1100" : "text-white"
                      }`}
                    >
                      {row.roi}%
                    </p>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
};
