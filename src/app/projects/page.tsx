'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Star, Folder, Search } from 'lucide-react'

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const projectCategories = [
    { name: 'Featured Projects', href: '/projects/featured', icon: Star, count: 12 },
    { name: 'My Projects', href: '/projects/my-projects', icon: Folder, count: 3 },
    { name: 'Trending', href: '/discover/trending', icon: TrendingUp, count: 8 },
  ]

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-gray-600">
            Discover, track, and manage blockchain projects
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Project Categories */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      {category.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {category.count} projects
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Projects', value: '23' },
            { label: 'Active Investments', value: '8' },
            { label: 'Total Value Locked', value: '$2.1M' },
            { label: 'Average ROI', value: '15.4%' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <dt className="text-sm font-medium text-gray-500">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 