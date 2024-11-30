export default function VotesPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Votes</h1>
        
        <div className="space-y-6">
          {[
            {
              proposal: 'AIP-1: Increase Validator Rewards',
              vote: 'For',
              power: '50,000 ALGO',
              date: '2023-11-20',
              status: 'Active'
            },
            {
              proposal: 'AIP-2: Protocol Upgrade',
              vote: 'Against',
              power: '25,000 ALGO',
              date: '2023-11-15',
              status: 'Closed'
            },
            {
              proposal: 'AIP-3: Treasury Allocation',
              vote: 'For',
              power: '75,000 ALGO',
              date: '2023-11-10',
              status: 'Closed'
            },
          ].map((vote) => (
            <div
              key={vote.proposal}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{vote.proposal}</h2>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Voted: {vote.vote}</span>
                    <span>•</span>
                    <span>Power: {vote.power}</span>
                    <span>•</span>
                    <span>Date: {vote.date}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${vote.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {vote.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 