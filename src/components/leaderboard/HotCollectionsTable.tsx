export const HotCollectionsTable = () => {

  const hotCollections = [
    { rank: "01", avatar: "/images/ranked-icon-1.svg", user: "@mjbreese613" },
    { rank: "02", avatar: "/images/ranked-icon-2.svg", user: "@ClarkOliiver" },
    { rank: "03", avatar: "/images/ranked-icon-3.svg", user: "@ArtueroY" },
    { rank: "04", user: "@tanrikulu_onur" },
    { rank: "05", user: "@ShylockCapital" },
    { rank: "06", user: "@FYqc...Xad8" },
    { rank: "07", user: "@SwannyNFT" },
    { rank: "08", user: "@Anon666NFT" },
    { rank: "09", user: "@frostyxsol" },
    { rank: "10", user: "@OzzyyySOL" },
  ];

  return (
    <div className="p-2.5 bg-black-1000 rounded-[20px] w-full overflow-hidden">
      <div className="w-full py-5 px-6 rounded-t-[20px] bg-primary-color">
        <p className="text-sm text-center text-black-1000 font-inter font-semibold">
          Hot Collections (7d)
        </p>
      </div>

      <table className="table w-full">
        <thead className="">
          <tr>
            <th className="text-base text-start font-inter text-white font-medium px-6 py-6">Rank</th>
            <th className="text-base w-3/4 text-start font-inter text-white font-medium">
              <div className="pl-5 h-6">User</div>
            </th>
          </tr>
        </thead>

        <tbody>
          {hotCollections.map((item, index) => (
            <tr key={index} className="w-full relative">
              <td className="relative">
                <div className="px-6 flex items-center gap-2.5 h-16">
                  <div className={`${item?.avatar ? 'bg-primary-color/10' : 'bg-black-1300'} absolute left-0 w-full  h-[95%] rounded-l-[12px]`}></div>
                  <div className="flex-1">
                  {item.avatar ? (
                    <img src={item.avatar} className="w-10 h-10" alt="avatar" />
                  ) : (
                    <p className="md:text-base text-sm text-white font-medium z-10 relative text-center font-inter pr-4">{item.rank}</p>
                  )}
                  </div>
                </div>
              </td>

              <td className="relative">
                <div className="px-5 flex items-center gap-2.5">
                  <div className={`${item?.avatar ? 'bg-primary-color/10' : 'bg-black-1300'} absolute left-0 w-full  h-[95%] rounded-r-[12px]`}></div>

                  <img src="/images/user-image-1.png" className="w-8 h-8 z-10 relative rounded-full object-cover" alt="" />
                  <p className="md:text-base text-sm text-white font-medium z-10 relative font-inter">{item.user}</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
