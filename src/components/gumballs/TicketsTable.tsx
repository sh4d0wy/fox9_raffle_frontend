import { useState } from "react";

export default function TicketsTable() {
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Rogues #3211",
      img: "/images/token-img-1.png",
      price: 0.008,
      tickets: 1,
    },
    {
      id: 2,
      name: "Rogues #4921",
      img: "/images/token-img-1.png",
      price: 0.008,
      tickets: 1,
    },
  ]);


interface Row {
    id: number;
    name: string;
    img: string;
    price: number;
    tickets: number;
}

const handleMinus = (id: number): void => {
    setRows((prev: Row[]) =>
        prev.map((row: Row) =>
            row.id === id
                ? { ...row, tickets: Math.max(1, row.tickets - 1) }
                : row
        )
    );
};

const handlePlus = (id: number): void => {
    setRows((prev: Row[]) =>
        prev.map((row: Row) =>
            row.id === id ? { ...row, tickets: row.tickets + 1 } : row
        )
    );
};

const handleChange = (id: number, val: string): void => {
    const num = Number(val);
    setRows((prev: Row[]) =>
        prev.map((row: Row) =>
            row.id === id ? { ...row, tickets: num > 0 ? num : 1 } : row
        )
    );
};

const handleDelete = (id: number): void => {
    setRows((prev: Row[]) => prev.filter((row: Row) => row.id !== id));
};

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[700px] w-full table-auto">
        <thead>
          <tr>
            <th className="text-gray-1200 text-start font-medium text-base py-3">
              NFT
            </th>
            <th className="text-gray-1200 text-start font-medium text-base py-3">
              Ticket Price
            </th>
            <th className="text-gray-1200 text-start font-medium text-base py-3">
              Tickets
            </th>
            <th className="text-gray-1200 text-start font-medium text-base py-3">
              Total Price
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-1100">
              <td className="py-5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={row.img}
                    className="w-[34px] h-[34px] rounded-[10px]"
                    alt={row.name}
                  />
                  <p className="text-base text-white font-medium font-inter">
                    {row.name}
                  </p>
                </div>
              </td>

              <td className="py-5">
                <p className="text-base text-white font-medium font-inter">
                  {row.price} SOL
                </p>
              </td>

              <td className="py-5 max-w-[140px]">
                <div className="flex max-w-[140px] flex-1 items-center border border-gray-1100 rounded-[10px] p-2.5 justify-center">
                  <button
                    onClick={() => handleMinus(row.id)}
                    className="min-w-6 h-6 cursor-pointer p-1.5 rounded bg-primary-color flex items-center justify-center"
                  >
                    <img src="/icons/min-icon.svg" alt="" />
                  </button>

                  <input
                    type="number"
                    value={row.tickets}
                    onChange={(e) => handleChange(row.id, e.target.value)}
                    className="text-base w-full font-inter font-bold text-white text-center"
                  />

                  <button
                    onClick={() => handlePlus(row.id)}
                    className="min-w-6 h-6 cursor-pointer p-1.5 rounded bg-primary-color flex items-center justify-center"
                  >
                    <img src="/icons/plus-white-icon.svg" alt="" />
                  </button>
                </div>
              </td>

              <td className="py-5">
                <p className="text-base text-white font-medium font-inter">
                  {(row.price * row.tickets).toFixed(3)} SOL
                </p>
              </td>

              <td className="py-5">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="cursor-pointer p-1"
                  >
                    <img src="/icons/delete-icon-3.svg" alt="" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-500">
                No NFTs added
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
