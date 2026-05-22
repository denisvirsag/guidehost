export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-72 bg-slate-100 rounded-lg" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 h-28 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-9 w-9 bg-slate-200 rounded-xl" />
              <div className="h-4 w-4 bg-slate-200 rounded" />
            </div>
            <div className="space-y-1.5">
              <div className="h-6 w-12 bg-slate-200 rounded" />
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Items */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex justify-between items-center">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl">
                <div className="h-11 w-11 bg-slate-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-slate-200 rounded" />
                  <div className="h-3 w-1/4 bg-slate-100 rounded" />
                </div>
                <div className="h-8 w-8 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Actions */}
        <div className="space-y-3.5">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="h-7 w-7 bg-slate-200 rounded-lg" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
