const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-gray-200" />
      <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="h-48 shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 shimmer rounded" />
      <div className="h-4 w-1/2 shimmer rounded" />
      <div className="h-3 w-full shimmer rounded mt-4" />
    </div>
  </div>
);

export default Loader;
