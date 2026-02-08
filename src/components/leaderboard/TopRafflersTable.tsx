import React from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  className?: string;
}

export function TopRafflersTable<T>({
  columns,
  data,
  rowKey,
  className,
}: TableProps<T>) {
  return (
    <div className={`bg-black-1300 p-3 rounded-[20px] w-full overflow-x-auto 2xl:overflow-hidden ${className ?? ""}`}>
      <table className="table md:w-full w-[700px]">
        <thead className="relative">
        <tr className="flex-1">
            {columns.map((col, index) => (
              <th key={String(col.key)}
                className={`
                    text-base text-start font-inter text-white font-medium px-2.5 2xl:px-5 py-4
                    ${col.className ?? ""}`}>
                      <div className="bg-gray-1000 absolute left-0 h-[94%] w-full rounded-t-xl top-0 z-0"></div>
                <div className={`${index !== 0 ? '':''} pl-5 h-6 relative z-10`}>
                    {col.header}
                </div>
                </th>
            ))}
            </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} className="flex-1 relative">
              {columns.map((col) => (
                <td key={String(col.key)} className="">
                   <div className="bg-black-1400 absolute left-0 h-[85%] top-2 w-full rounded-xl z-0"></div>
                  <div className="md:pl-10 pl-4 pr-4 text-sm md:text-base relative z-10 text-white font-medium font-inter w-full flex items-center gap-2.5 h-20">
                    {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
