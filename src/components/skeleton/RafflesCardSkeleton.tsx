const CryptoCardSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`bg-black-1300 border border-black-1000 rounded-2xl animate-pulse ${className}`}>
      <div className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-700" />
          <div className="h-4 w-24 bg-gray-700 rounded" />
        </div>
        <div className="w-6 h-6 bg-gray-700 rounded-full" />
      </div>

      <div className="w-full h-[339px] bg-gray-700 border-y border-black-1300 relative" />

      <div className="w-full flex flex-col px-4 py-4 gap-7">
        <div className="w-full flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-700 rounded" />
          <div className="h-6 w-16 bg-gray-700 rounded" />
        </div>

        <div className="w-full flex items-center justify-between gap-5">
          <div className="h-5 w-12 bg-gray-700 rounded" />
          <div className="h-5 w-16 bg-gray-700 rounded" />
        </div>

        <div className="w-full h-11 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
};

export default CryptoCardSkeleton;
