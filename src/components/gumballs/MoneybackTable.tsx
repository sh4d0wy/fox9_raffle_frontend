export const MoneybackTable = () => {
  return (
    <div className="border border-gray-1100 rounded-[20px] w-full overflow-x-auto xl:overflow-hidden">
      <table className="table xl:w-full w-[500px] md:w-[600px]">
        <thead className="bg-black-1300 border-b border-gray-1200">
          <tr className="flex-1">
            <th
              scope="col"
              className="text-base w-1/3 text-start font-inter text-gray-1600 font-medium px-4 md:px-10 py-4 md:py-7"
            >
              Prize
            </th>
            <th
              scope="col"
              className="text-base w-1/5 text-start font-inter text-gray-1600 font-medium"
            >
              <div className="pl-5 h-6"> TX</div>
            </th>
            <th
              scope="col"
              className="text-base w-1/5 text-start font-inter text-gray-1600 font-medium"
            >
              <div className="pl-5 h-6">Time</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="flex-1">
            <td scope="row">
              <div className="md:px-10 px-4 flex items-center gap-5 md:gap-2.5 py-6 border-b border-gray-1100">
                <img
                  src="/images/placeholder-user.png"
                  className="md:w-[60px] w-10 h-10 md:h-[60px] rounded-full object-cover"
                  alt="no img"
                />
                <p className="text-base text-white font-medium font-inter">
                  800
                </p>
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[34px] md:py-[42px] border-b border-gray-1100">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  5xAY...LFqk
                </p>
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[34px] md:py-[42px] border-b border-gray-1100">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  24 Oct '25 <span className="text-gray-1100">|</span> 06:20
                </p>
              </div>
            </td>
          </tr>

          <tr className="flex-1">
            <td scope="row">
              <div className="md:px-10 px-4 flex items-center gap-5 md:gap-2.5 py-6 border-b border-gray-1100">
                <img
                  src="/images/placeholder-user.png"
                  className="md:w-[60px] w-10 h-10 md:h-[60px] rounded-full object-cover"
                  alt="no img"
                />
                <p className="text-base text-white font-medium font-inter">
                  800
                </p>
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[34px] md:py-[42px] border-b border-gray-1100">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  5xAY...LFqk
                </p>
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[34px] md:py-[42px] border-b border-gray-1100">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  24 Oct '25 <span className="text-gray-1100">|</span> 06:20
                </p>
              </div>
            </td>
          </tr>

          <tr className="flex-1">
            <td scope="row">
              <div className="md:px-10 px-4 flex items-center gap-5 md:gap-2.5 py-6 border-b border-gray-1100">
                <img
                  src="/images/placeholder-user.png"
                  className="md:w-[60px] w-10 h-10 md:h-[60px] rounded-full object-cover"
                  alt="no img"
                />
                <p className="text-base text-white font-medium font-inter">
                  800
                </p>
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[34px] md:py-[42px] border-b border-gray-1100">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  5xAY...LFqk
                </p>
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[34px] md:py-[42px] border-b border-gray-1100">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  24 Oct '25 <span className="text-gray-1100">|</span> 06:20
                </p>
              </div>
            </td>
          </tr>

          <tr className="flex-1">
            <td scope="row">
              <div className="md:px-10 px-4 flex items-center gap-2.5 py-6">
                <img
                  src="/images/placeholder-user.png"
                  className="md:w-[60px] w-10 h-10 md:h-[60px] rounded-full object-cover"
                  alt="no img"
                />
                <p className="text-base text-white font-medium font-inter">
                  800
                </p>
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[42px]">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  5xAY...LFqk
                </p>
              </div>
            </td>
            <td>
              <div className="3xl:px-5 px-0 flex items-center gap-2.5 py-[42px]">
                <p className="md:text-base text-sm text-white font-medium font-inter">
                  24 Oct '25 <span className="text-gray-1100">|</span> 06:20
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
