export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center" role="status" aria-live="polite">
        <div 
          className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"
          aria-hidden="true"
        />
        <div className="text-gray-600" aria-label="Loading content">Loading...</div>
      </div>
    </div>
  )
} 