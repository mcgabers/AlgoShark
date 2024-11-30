export default function InvestmentsPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Investments</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500">
              <div>Project</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Status</div>
              <div>Return</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {[
              { project: 'AlgoFi', amount: '5,000 ALGO', date: '2023-11-15', status: 'Active', return: '+12.5%' },
              { project: 'NFT Market', amount: '2,500 ALGO', date: '2023-10-20', status: 'Pending', return: '0%' },
              { project: 'Gaming Hub', amount: '10,000 ALGO', date: '2023-09-01', status: 'Active', return: '+8.2%' },
            ].map((investment) => (
              <div key={investment.project} className="px-6 py-4">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="font-medium text-gray-900">{investment.project}</div>
                  <div className="text-gray-500">{investment.amount}</div>
                  <div className="text-gray-500">{investment.date}</div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${investment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {investment.status}
                    </span>
                  </div>
                  <div className={investment.return.startsWith('+') ? 'text-green-600' : 'text-gray-500'}>
                    {investment.return}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 