
interface SoldRow {
  date: string; 
  spent: number;
  sold: number;
  pl: number;
  roi: number;
}

const dummySoldData: SoldRow[] = [

];

export const SoldTable = () => {
  return (
    <div className="border relative border-gray-1100 md:pb-32 pb-20 rounded-[20px] w-full overflow-hidden">
      {dummySoldData.length === 0 && (
        <div className="absolute w-full h-full flex items-center justify-center md:py-20 py-[120px]">
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
              Date
            </th>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium">
              <div className="pl-5 h-6">Spent</div>
            </th>
            <th className="md:text-base text-sm text-start font-inter text-gray-1600 font-medium">
              <div className="pl-5 h-6">Sold</div>
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
          {dummySoldData.map((row, idx) => {
            const [datePart, timePart] = row.date.split("|").map((s) => s.trim());
            return (
              <tr key={idx} className="w-full">
                <td>
                  <div className="px-6 flex items-center gap-2.5 py-6 border-b border-gray-1100">
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
                    <p className="md:text-base text-sm text-white font-medium font-inter">${row.sold}</p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 border-b border-gray-1100">
                    <p
                      className={`md:text-base text-sm font-medium font-inter ${
                        row.pl >= 0 ? "text-green-1000" : "text-red-1000"
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
                        row.roi > 0 ? "text-green-1000" : "text-white"
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
