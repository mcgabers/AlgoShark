export default function DelegatesPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Delegates</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'AlgoFoundation',
              address: 'ALGO...X1Y2',
              delegatedPower: '1.2M ALGO',
              proposals: 45,
              participation: '98%'
            },
            {
              name: 'Community DAO',
              address: 'ALGO...A3B4',
              delegatedPower: '800K ALGO',
              proposals: 32,
              participation: '95%'
            },
            {
              name: 'Dev Collective',
              address: 'ALGO...C5D6',
              delegatedPower: '500K ALGO',
              proposals: 28,
              participation: '92%'
            },
          ].map((delegate) => (
            <div
              key={delegate.address}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{delegate.name}</h2>
                  <p className="text-sm text-gray-500">{delegate.address}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Delegated Power</span>
                  <span className="font-medium text-gray-900">{delegate.delegatedPower}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Proposals Voted</span>
                  <span className="font-medium text-gray-900">{delegate.proposals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Participation Rate</span>
                  <span className="font-medium text-green-600">{delegate.participation}</span>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Delegate Votes
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 