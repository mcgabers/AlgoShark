export default function CategoriesPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example categories */}
          {[
            { name: 'DeFi', count: 156 },
            { name: 'NFTs', count: 89 },
            { name: 'Gaming', count: 67 },
            { name: 'Infrastructure', count: 45 },
            { name: 'DAOs', count: 34 },
            { name: 'Social', count: 23 },
          ].map((category) => (
            <div
              key={category.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{category.count} projects</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 