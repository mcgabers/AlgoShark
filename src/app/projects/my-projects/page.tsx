export default function MyProjectsPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Project
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Example projects */}
          {[
            { name: 'Project Alpha', status: 'Active', lastUpdated: '2 hours ago' },
            { name: 'Beta Launch', status: 'In Review', lastUpdated: '1 day ago' },
            { name: 'Gamma Protocol', status: 'Draft', lastUpdated: '1 week ago' },
          ].map((project) => (
            <div
              key={project.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Last updated {project.lastUpdated}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${project.status === 'Active' ? 'bg-green-100 text-green-800' :
                    project.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 