'use client'

import { useState, useEffect } from 'react'
import { Heart, Share2, MessageCircle, BookmarkPlus, ExternalLink, TrendingUp, Users, Shield, Info, Download, TrendingDown, Globe, Target, BarChart2, Activity, Share, UserPlus, Repeat } from 'lucide-react'
import { WalletButton } from '@/components/ui/wallet-button'
import Image from 'next/image'
import { Tooltip } from '@/components/ui/tooltip'

interface ProjectMetrics {
  totalInvestment: number;
  investorCount: number;
  roi: number;
  riskScore: string;
  monthlyGrowth: number;
  newInvestors: number;
}

interface TokenMetrics {
  price: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  priceChange: {
    '24h': number;
    '7d': number;
    '30d': number;
  };
}

interface FinancialMetrics {
  tvl: number;
  revenue: number;
  fees: number;
  treasury: number;
  apr: number;
  tvlChange: number;
  revenueGrowth: number;
}

interface MarketingMetrics {
  acquisition: {
    totalUsers: number;
    userGrowth: number;
    acquisitionChannels: {
      name: string;
      users: number;
      conversion: number;
      growth: number;
    }[];
    cac: number;
    ltv: number;
  };
  engagement: {
    dau: number;
    dauGrowth: number;
    mau: number;
    mauGrowth: number;
    retention: number;
    averageSessionTime: number;
    bounceRate: number;
  };
  community: {
    totalMembers: number;
    memberGrowth: number;
    platforms: {
      name: string;
      followers: number;
      engagement: number;
      growth: number;
    }[];
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  marketing: {
    campaignPerformance: {
      name: string;
      reach: number;
      engagement: number;
      conversion: number;
      roi: number;
    }[];
    marketShare: number;
    brandAwareness: number;
    marketingRoi: number;
  }
}

interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  metrics: ProjectMetrics;
  createdAt: string;
  category: string;
  platform: string;
  website: string;
  socialLinks: {
    [key: string]: string;
  };
  tokenMetrics: TokenMetrics;
  financialMetrics: FinancialMetrics;
  historicalData: {
    date: string;
    tvl: number;
    price: number;
    volume: number;
  }[];
  marketingMetrics: MarketingMetrics;
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'financials', label: 'Financials' },
    { id: 'marketing', label: 'Marketing & Growth' },
    { id: 'team', label: 'Team' },
    { id: 'documents', label: 'Documents' },
    { id: 'discussion', label: 'Discussion' }
  ]

  const renderTabContent = () => {
    if (!project) {
      return <div className="text-center py-8">Loading project details...</div>;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Token Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Token Metrics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Price</span>
                    <span className={`text-sm font-medium ${
                      (project.tokenMetrics?.priceChange?.['24h'] || 0) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {(project.tokenMetrics?.priceChange?.['24h'] || 0) >= 0 ? '↑' : '↓'}
                      {Math.abs(project.tokenMetrics?.priceChange?.['24h'] || 0)}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${(project.tokenMetrics?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">USD</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Market Cap</span>
                    <Tooltip content="Total value of all tokens in circulation">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${((project.tokenMetrics?.marketCap || 0) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 })}M
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">24h Volume</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${((project.tokenMetrics?.volume24h || 0) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 })}M
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Price Change</h3>
                  <div className="space-y-3">
                    {Object.entries(project.tokenMetrics?.priceChange || {}).map(([period, change]) => (
                      <div key={period} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {period === '24h' ? 'Last 24h' : period === '7d' ? 'Last 7 days' : 'Last 30 days'}
                        </span>
                        <span className={`text-sm font-medium ${
                          (change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(change || 0) >= 0 ? '+' : ''}{change || 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Protocol Metrics</h2>
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">TVL</span>
                    <span className={`text-sm font-medium ${
                      (project.financialMetrics?.tvlChange || 0) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {(project.financialMetrics?.tvlChange || 0) >= 0 ? '↑' : '↓'}
                      {Math.abs(project.financialMetrics?.tvlChange || 0)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${((project.financialMetrics?.tvl || 0) / 1000000).toLocaleString()}M
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Revenue (30d)</span>
                    <span className={`text-sm font-medium ${
                      (project.financialMetrics?.revenueGrowth || 0) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {(project.financialMetrics?.revenueGrowth || 0) >= 0 ? '↑' : '↓'}
                      {Math.abs(project.financialMetrics?.revenueGrowth || 0)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${((project.financialMetrics?.revenue || 0) / 1000).toLocaleString()}K
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Treasury</span>
                    <Tooltip content="Total value held in protocol treasury">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${((project.financialMetrics?.treasury || 0) / 1000000).toLocaleString()}M
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'marketing':
        return (
          <div className="space-y-6">
            {/* User Acquisition Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Acquisition</h2>
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total Users</span>
                    <span className={`text-sm font-medium text-green-600`}>
                      ��� {project.marketingMetrics.acquisition.userGrowth}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900">
                      {project.marketingMetrics.acquisition.totalUsers.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">CAC</span>
                    <Tooltip content="Cost per Acquired Customer">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${project.marketingMetrics.acquisition.cac}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">LTV</span>
                    <Tooltip content="Lifetime Value per User">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-semibold text-gray-900">
                      ${project.marketingMetrics.acquisition.ltv}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4">Acquisition Channels</h3>
              <div className="space-y-4">
                {project.marketingMetrics.acquisition.acquisitionChannels.map((channel) => (
                  <div key={channel.name} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{channel.name}</span>
                      <span className={`text-sm font-medium ${
                        channel.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {channel.growth >= 0 ? '↑' : '↓'} {Math.abs(channel.growth)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Users</span>
                        <div className="font-medium text-gray-900">{channel.users.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Conversion</span>
                        <div className="font-medium text-gray-900">{channel.conversion}%</div>
                      </div>
                      <div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                            <div
                              style={{ width: `${(channel.users / project.marketingMetrics.acquisition.totalUsers) * 100}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">User Engagement</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">DAU</span>
                    <span className={`text-sm font-medium text-green-600`}>
                      ↑ {project.marketingMetrics.engagement.dauGrowth}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      {project.marketingMetrics.engagement.dau.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">MAU</span>
                    <span className={`text-sm font-medium text-green-600`}>
                      ↑ {project.marketingMetrics.engagement.mauGrowth}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      {project.marketingMetrics.engagement.mau.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Retention</span>
                    <Tooltip content="30-day retention rate">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      {project.marketingMetrics.engagement.retention}%
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Avg Session</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      {project.marketingMetrics.engagement.averageSessionTime}m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Growth */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Community & Social</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Total Members:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {project.marketingMetrics.community.totalMembers.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    (↑ {project.marketingMetrics.community.memberGrowth}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Growth</h3>
                  <div className="space-y-4">
                    {project.marketingMetrics.community.platforms.map((platform) => (
                      <div key={platform.name} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{platform.name}</span>
                          <span className={`text-sm font-medium text-green-600`}>
                            ↑ {platform.growth}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Followers</span>
                            <div className="font-medium text-gray-900">{platform.followers.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Engagement</span>
                            <div className="font-medium text-gray-900">{platform.engagement}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sentiment Analysis</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      {Object.entries(project.marketingMetrics.community.sentiment).map(([type, value]) => (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm capitalize text-gray-600">{type}</span>
                            <span className={`text-sm font-medium ${
                              type === 'positive' ? 'text-green-600' : 
                              type === 'negative' ? 'text-red-600' : 
                              'text-yellow-600'
                            }`}>
                              {value}%
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                              <div
                                style={{ width: `${value}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                  type === 'positive' ? 'bg-green-500' : 
                                  type === 'negative' ? 'bg-red-500' : 
                                  'bg-yellow-500'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Marketing Performance</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Market Share:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {project.marketingMetrics.marketing.marketShare}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Brand Awareness:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {project.marketingMetrics.marketing.brandAwareness}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Performance</h3>
                  <div className="space-y-4">
                    {project.marketingMetrics.marketing.campaignPerformance.map((campaign) => (
                      <div key={campaign.name} className="grid grid-cols-5 gap-4">
                        <div className="col-span-2">
                          <span className="text-sm font-medium text-gray-900">{campaign.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Reach</span>
                          <div className="font-medium text-gray-900">{campaign.reach.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Conversion</span>
                          <div className="font-medium text-gray-900">{campaign.conversion}%</div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">ROI</span>
                          <div className="font-medium text-green-600">{campaign.roi}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'John Smith',
                  role: 'Founder & CEO',
                  bio: '10+ years in DeFi and blockchain development',
                  image: '/team/john.jpg'
                },
                {
                  name: 'Sarah Johnson',
                  role: 'CTO',
                  bio: 'Former lead developer at Ethereum Foundation',
                  image: '/team/sarah.jpg'
                },
                {
                  name: 'Michael Chen',
                  role: 'Head of Research',
                  bio: 'PhD in Cryptography from MIT',
                  image: '/team/michael.jpg'
                }
              ].map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-blue-600">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{member.bio}</p>
                  <div className="mt-4 flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">GitHub</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Whitepaper', type: 'PDF', size: '2.4 MB', date: '2023-10-01' },
                { name: 'Technical Documentation', type: 'PDF', size: '1.8 MB', date: '2023-10-05' },
                { name: 'Tokenomics', type: 'PDF', size: '956 KB', date: '2023-10-10' },
                { name: 'Audit Report', type: 'PDF', size: '3.2 MB', date: '2023-10-15' }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{doc.date}</span>
                    <button className="p-2 text-gray-400 hover:text-gray-500">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'discussion':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Discussion</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <option>Latest</option>
                  <option>Most Liked</option>
                  <option>Most Discussed</option>
                </select>
              </div>
            </div>

            {/* Comment Input */}
            <div className="mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <textarea
                      rows={3}
                      className="block w-full border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Share your thoughts about this project..."
                    />
                    <div className="py-2 px-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-5">
                          <button type="button" className="text-gray-400 hover:text-gray-500">
                            <MessageCircle className="w-5 h-5" />
                          </button>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-8">
              {[
                {
                  author: 'Alex Thompson',
                  avatar: '/avatars/alex.jpg',
                  time: '2 hours ago',
                  content: 'Really impressed with the yield optimization strategies!',
                  likes: 12,
                  replies: 3,
                },
                {
                  author: 'Sarah Chen',
                  avatar: '/avatars/sarah.jpg',
                  time: '5 hours ago',
                  content: 'How does the cross-chain interoperability work?',
                  likes: 8,
                  replies: 4,
                },
              ].map((comment, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{comment.time}</span>
                      </div>
                      <p className="mt-2 text-gray-700">{comment.content}</p>
                      <div className="mt-4 flex items-center space-x-6">
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">{comment.replies} replies</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'financials':
        return (
          <div className="space-y-6">
            {/* Financial Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Last updated:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">Total Investment</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    ${(project.metrics?.totalInvestment || 0).toLocaleString()}
                  </dd>
                  <div className="mt-2 text-sm text-green-600">
                    ↑ {project.metrics?.monthlyGrowth || 0}% this month
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">Investors</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {(project.metrics?.investorCount || 0).toLocaleString()}
                  </dd>
                  <div className="mt-2 text-sm text-green-600">
                    ↑ {project.metrics?.newInvestors || 0} new this week
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">ROI</dt>
                  <dd className="mt-1 text-2xl font-semibold text-green-600">
                    +{project.metrics?.roi || 0}%
                  </dd>
                  <div className="mt-2 text-sm text-gray-600">Past 30 days</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">Risk Score</dt>
                  <dd className="mt-1 text-2xl font-semibold text-blue-600">
                    {project.metrics?.riskScore || 'N/A'}
                  </dd>
                  <div className="mt-2 text-sm text-gray-600">Moderate risk</div>
                </div>
              </div>
            </div>

            {/* Historical Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Historical Performance</h2>
              <div className="space-y-6">
                {/* TVL Chart */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Total Value Locked (TVL)</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="h-[300px]">
                      {project.historicalData ? (
                        <div className="w-full h-full">
                          {/* Chart implementation would go here */}
                          <div className="flex items-center justify-center h-full text-gray-500">
                            TVL Chart: ${(project.financialMetrics?.tvl || 0).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No historical data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Revenue (30d)</span>
                        <span className={`text-sm font-medium ${
                          (project.financialMetrics?.revenueGrowth || 0) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {(project.financialMetrics?.revenueGrowth || 0) >= 0 ? '↑' : '↓'}
                          {Math.abs(project.financialMetrics?.revenueGrowth || 0)}%
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-semibold text-gray-900">
                          ${((project.financialMetrics?.revenue || 0) / 1000).toLocaleString()}K
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Protocol Fees</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-semibold text-gray-900">
                          ${((project.financialMetrics?.fees || 0) / 1000).toLocaleString()}K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Risk Factors</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Smart Contract Risk', score: 85 },
                      { name: 'Market Risk', score: 70 },
                      { name: 'Liquidity Risk', score: 90 },
                      { name: 'Regulatory Risk', score: 75 }
                    ].map((risk) => (
                      <div key={risk.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{risk.name}</span>
                          <span className={`text-sm font-medium ${
                            risk.score >= 80 ? 'text-green-600' : risk.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {risk.score}/100
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                            <div
                              style={{ width: `${risk.score}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                risk.score >= 80 ? 'bg-green-500' : risk.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Audit Status</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">Audited by Certik</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Critical Issues</span>
                        <span className="font-medium text-green-600">0</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Major Issues</span>
                        <span className="font-medium text-yellow-600">2</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Minor Issues</span>
                        <span className="font-medium text-blue-600">5</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      >
                        View Full Audit Report
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        // Simulated API call
        const mockProject: ProjectDetails = {
          id: params.id,
          name: `DeFi Protocol #${params.id}`,
          description: 'A revolutionary DeFi protocol built on Algorand',
          status: 'active',
          metrics: {
            totalInvestment: 500000,
            investorCount: 127,
            roi: 15.4,
            riskScore: 'B+',
            monthlyGrowth: 12,
            newInvestors: 8
          },
          createdAt: 'November 20, 2023',
          category: 'DeFi',
          platform: 'Algorand',
          website: 'https://project-website.com',
          socialLinks: {
            Twitter: '#',
            Discord: '#',
            Telegram: '#',
            GitHub: '#'
          },
          tokenMetrics: {
            price: 1.23,
            marketCap: 100000000,
            volume24h: 1000000,
            circulatingSupply: 10000000,
            totalSupply: 20000000,
            priceChange: {
              '24h': 2.5,
              '7d': 1.8,
              '30d': 1.2
            }
          },
          financialMetrics: {
            tvl: 10000000,
            revenue: 1000000,
            fees: 500000,
            treasury: 5000000,
            apr: 15,
            tvlChange: 1.5,
            revenueGrowth: 10
          },
          historicalData: [
            { date: '2023-10-01', tvl: 10000000, price: 1.23, volume: 1000000 },
            { date: '2023-10-02', tvl: 10200000, price: 1.25, volume: 1200000 },
            { date: '2023-10-03', tvl: 10400000, price: 1.27, volume: 1400000 },
            { date: '2023-10-04', tvl: 10600000, price: 1.29, volume: 1600000 },
            { date: '2023-10-05', tvl: 10800000, price: 1.31, volume: 1800000 }
          ],
          marketingMetrics: {
            acquisition: {
              totalUsers: 125000,
              userGrowth: 15.4,
              acquisitionChannels: [
                { name: 'Organic Search', users: 45000, conversion: 3.2, growth: 12.5 },
                { name: 'Social Media', users: 35000, conversion: 2.8, growth: 18.7 },
                { name: 'Direct', users: 25000, conversion: 4.1, growth: 8.3 },
                { name: 'Referral', users: 20000, conversion: 5.5, growth: 22.1 }
              ],
              cac: 42,
              ltv: 380
            },
            engagement: {
              dau: 28000,
              dauGrowth: 8.5,
              mau: 85000,
              mauGrowth: 12.3,
              retention: 68,
              averageSessionTime: 8.5,
              bounceRate: 32
            },
            community: {
              totalMembers: 95000,
              memberGrowth: 25.4,
              platforms: [
                { name: 'Discord', followers: 45000, engagement: 8.5, growth: 15.4 },
                { name: 'Twitter', followers: 28000, engagement: 4.2, growth: 22.1 },
                { name: 'Telegram', followers: 15000, engagement: 6.8, growth: 18.7 },
                { name: 'Reddit', followers: 7000, engagement: 5.5, growth: 12.3 }
              ],
              sentiment: {
                positive: 65,
                neutral: 28,
                negative: 7
              }
            },
            marketing: {
              campaignPerformance: [
                { name: 'Launch Campaign', reach: 250000, engagement: 12.5, conversion: 3.8, roi: 285 },
                { name: 'Community Drive', reach: 180000, engagement: 15.2, conversion: 4.2, roi: 320 },
                { name: 'Yield Boost', reach: 120000, engagement: 18.7, conversion: 5.5, roi: 425 }
              ],
              marketShare: 12.5,
              brandAwareness: 28,
              marketingRoi: 345
            }
          }
        }
        setProject(mockProject)
        setError(null)
      } catch (err) {
        setError('Failed to fetch project details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-6" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error || 'Project not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">AlgoShark Protocol</h1>
                <p className="text-gray-500">Advanced DeFi protocol on Algorand</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <WalletButton />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Value Locked', value: '$10.5M', change: '+15.4%' },
              { label: 'Trading Volume (24h)', value: '$2.1M', change: '+8.2%' },
              { label: 'Total Users', value: '12.5K', change: '+22.3%' },
              { label: 'Token Price', value: '$1.23', change: '+5.6%' }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-6 mt-8">
            <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <Heart className="w-5 h-5 mr-2" />
              <span>256</span>
            </button>
            <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <Share2 className="w-5 h-5 mr-2" />
              <span>Share</span>
            </button>
            <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
              <BookmarkPlus className="w-5 h-5 mr-2" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative whitespace-nowrap py-4 px-1 font-medium text-sm transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {renderTabContent()}
        </div>

        {/* Activity Feed */}
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {[
                {
                  event: 'New Investment',
                  description: '$50,000 invested by @whale_investor',
                  timestamp: '2 hours ago'
                },
                {
                  event: 'Protocol Update',
                  description: 'Version 2.1.0 deployed successfully',
                  timestamp: '5 hours ago'
                }
              ].map((activity, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time>{activity.timestamp}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 