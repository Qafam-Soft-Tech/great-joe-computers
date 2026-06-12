const SkeletonLoader = ({ type = 'product', count = 1 }) => {
  if (type === 'product') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-${count > 2 ? 4 : count} gap-6`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-xl" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className="animate-pulse space-y-6 py-10">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        <div className="h-64 bg-gray-200 rounded-xl mx-auto max-w-4xl" />
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;