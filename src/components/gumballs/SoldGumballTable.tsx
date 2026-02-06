import { useGumballById } from "hooks/gumball/useGumballsQuery";
import type { GumballBackendDataType } from "types/backend/gumballTypes";

interface BoughtRow {
  img: string; 
  prize: number;
  quantity: number;
  floorPrice: number;
}

const SoldGumball: BoughtRow[] = [

];

export const SoldGumballTable = ({gumballId}: {gumballId: string}) => {
  const { data: gumball } = useGumballById(gumballId) as { data: GumballBackendDataType };
  const soldGumballs = gumball?.spins;
  const claimedGumballs = gumball?.spins.filter((spin) => spin.prize?.prizeIndex !== undefined && spin.prize?.prizeIndex !== null && spin.claimedAt !== null);

  return (
    <div className="mt-5 border relative border-gray-1100 md:pb-32 pb-10 min-h-[494px] rounded-[20px] w-full overflow-hidden">
      {claimedGumballs?.length === 0&& (
        <div className="absolute w-full h-full flex items-center justify-center py-10">
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
        <tbody>
          {claimedGumballs?.map((row, idx) => {
            return (
              <tr key={idx} className="w-full">
                <td>
                  <div className="px-6 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <img src={row.prize?.image || ""} className="w-[60px] h-[60px] rounded-full" alt="no-img" />
                    <p className="md:text-base text-sm text-black-1000 font-medium font-inter">
                    {row.prize?.name && row.prize?.name.length > 15 ? row.prize?.name.slice(0,15)+"..." : row.prize?.name || "Prize"}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <p className="md:text-base text-sm text-black-1000 font-medium font-inter">{
                    row.prize?.isNft ? 1: 
                    parseFloat(row.prize?.prizeAmount || "0")/10** (row.prize?.decimals || 0)}</p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <p className="md:text-base text-sm text-black-1000 font-medium font-inter">{row.prize?.isNft?parseFloat(row.prize?.floorPrice || "0")/1e9:"NA"}</p>
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
