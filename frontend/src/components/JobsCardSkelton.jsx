const JobCardSkeleton = () => {
  return (
    <div className="w-full bg-white border shadow-sm rounded-xl px-4 py-6 space-y-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="flex justify-between text-sm">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-40"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-36"></div>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-4 bg-gray-200 rounded w-28 ml-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

export default JobCardSkeleton;
