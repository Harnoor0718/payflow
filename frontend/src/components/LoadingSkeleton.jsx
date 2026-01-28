
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-2 border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;