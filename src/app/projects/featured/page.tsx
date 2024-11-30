export default function FeaturedProjectsPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example featured projects */}
          {[
            { name: 'AlgoFi', description: 'Leading DeFi protocol on Algorand', stars: 128 },
            { name: 'NFT Marketplace', description: 'Trade unique digital assets', stars: 89 },
            { name: 'AlgoGaming', description: 'Blockchain gaming platform', stars: 76 },
          ].map((project) => (
            <div
              key={project.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{project.description}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1">{project.stars} stars</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 