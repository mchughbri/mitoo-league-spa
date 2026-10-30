function Bar({ className = "" }) {
  return <div className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export function FixturesSkeleton() {
  return (
    <div className="max-w-full sm:max-w-4xl mx-auto animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <Bar className="h-9 w-20" />
        <Bar className="h-6 w-28" />
        <Bar className="h-9 w-20" />
      </div>
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 shadow-card overflow-hidden"
          >
            <div className="h-9 bg-gray-200 dark:bg-gray-700" />
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[0, 1, 2].map((j) => (
                <div key={j} className="px-4 py-3 flex items-center justify-between gap-3">
                  <Bar className="h-4 flex-1" />
                  <Bar className="h-6 w-10 shrink-0" />
                  <Bar className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="max-w-full sm:max-w-4xl mx-auto animate-pulse">
      <div className="bg-white dark:bg-gray-800 shadow-card overflow-hidden">
        <div className="h-10 bg-gray-200 dark:bg-gray-700" />
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <Bar className="h-4 w-5" />
              <Bar className="h-4 flex-1" />
              <Bar className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="max-w-full sm:max-w-4xl mx-auto animate-pulse">
      <div className="bg-white dark:bg-gray-800 shadow-card overflow-hidden">
        <div className="h-9 bg-gray-200 dark:bg-gray-700" />
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center justify-between">
              <Bar className="h-4 w-32" />
              <Bar className="h-5 w-5 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
