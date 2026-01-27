
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

export const GumballPrizesTable = () => {
  return (
    <div className="border relative border-gray-1100  min-h-[494px] rounded-[20px] w-full overflow-hidden">
      {SoldGumball.length === 0 && (
        <div className="absolute w-full h-full flex items-center justify-center py-10">
          <p className="md:text-base text-sm font-medium text-center font-inter text-white">
            No Gumball Yet
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
        {SoldGumball.map((row, idx) => (
  <tr
    key={idx}
    className="border-b border-gray-1100 last:border-b-0"
  >
    <td className="px-6 py-5 h-24">
      <div className="flex items-center gap-2.5">
        <img
          src={row.img}
          className="w-[60px] h-[60px] rounded-full"
          alt="no-img"
        />
        <p className="md:text-base text-sm text-white font-medium font-inter">
          {row.prize}
        </p>
      </div>
    </td>

    <td className="px-5 py-6 h-24">
      <p className="md:text-base text-sm text-white font-medium font-inter">
        {row.quantity}
      </p>
    </td>

    <td className="px-5 py-6 h-24">
      <p className="md:text-base text-sm text-white font-medium font-inter">
        {row.floorPrice}
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
