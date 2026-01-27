
interface BoughtRow {
  img: string; 
  prize: number;
  quantity: number;
  floorPrice: number;
}

const SoldGumball: BoughtRow[] = [
  { img: "/images/prize-image.png", prize: 25, quantity: 90, floorPrice: 0 },
  { img: "/images/prize-image.png", prize: 25, quantity: 90, floorPrice: 0 },
  { img: "/images/prize-image.png", prize: 25, quantity: 90, floorPrice: 0 },
  { img: "/images/prize-image.png", prize: 25, quantity: 90, floorPrice: 0 },
];

export const AvailableGumballTable = () => {
  return (
    <div className="mt-5 border relative border-gray-1100 rounded-[20px] w-full overflow-hidden">
      {SoldGumball.length === 0 && (
        <div className="absolute w-full h-full flex items-center justify-center py-20">
          <p className="md:text-base text-sm font-medium text-center font-inter text-black-1000">
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
          {SoldGumball.map((row, idx) => {
            return (
              <tr key={idx} className="w-full">
                <td>
                  <div className="px-6 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <img src={row.img} className="w-[60px] h-[60px] rounded-full" alt="no-img" />
                    <p className="md:text-base text-sm text-white font-medium font-inter">
                      {row.prize}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <p className="md:text-base text-sm text-white font-medium font-inter">{row.quantity}</p>
                  </div>
                </td>
                <td>
                  <div className="px-5 flex items-center gap-2.5 py-6 h-24 border-b border-gray-1100">
                    <p className="md:text-base text-sm text-white font-medium font-inter">{row.floorPrice}</p>
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
