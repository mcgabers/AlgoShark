'use client'

import { History, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Transaction {
  txId: string
  type?: string
  from: string
  to: string
  amount: number
  token: string
  timestamp: string
}

function formatAddress(address: string): string {
  if (!address) return 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatTransactionType(type?: string): string {
  if (!type) return 'Transaction';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatAmount(amount?: number, token?: string): string {
  if (amount === undefined) return 'N/A';
  return `${amount.toLocaleString()} ${token || 'tokens'}`;
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isInvestment = transaction.type === 'investment'
  
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div className={`p-1 rounded-full ${
            isInvestment ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {isInvestment ? (
              <ArrowUpRight className={`h-4 w-4 ${
                isInvestment ? 'text-green-600' : 'text-blue-600'
              }`} />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-blue-600" />
            )}
          </div>
          <span className="ml-2 font-medium text-gray-900">
            {formatTransactionType(transaction.type)}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {formatAddress(transaction.from)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {formatAddress(transaction.to)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
        {formatAmount(transaction.amount, transaction.token)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'N/A'}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        {transaction.txId && (
          <a
            href={`https://explorer.algorand.org/tx/${transaction.txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-900"
          >
            View<span className="sr-only">, transaction {transaction.txId}</span>
          </a>
        )}
      </td>
    </tr>
  )
}

export function TransactionsView({ transactions = [] }: { transactions: Transaction[] }) {
  if (!transactions.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="text-center py-12 bg-white rounded-lg border">
          <History className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Transactions</h3>
          <p className="mt-1 text-sm text-gray-500">
            No transactions have been recorded for this project yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Type
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                From
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                To
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Time
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.txId || Math.random()} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-md bg-gray-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              Transaction Privacy
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                All wallet addresses are anonymized for privacy. Full transaction details
                can be viewed on the Algorand Explorer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 