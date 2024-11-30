import { prisma } from '@/lib/prisma'

// Mock data for development
const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'AlgoFi Protocol',
    description: 'Leading DeFi protocol on Algorand',
    fundingGoal: 1000000,
    currentFunding: 750000,
    category: 'DeFi',
    tags: ['defi', 'lending', 'algorand'],
    assetId: 123456,
    tokenPrice: 1.5,
    tokensAvailable: 1000000,
    creator: {
      id: '1',
      name: 'AlgoFi Team',
      walletAddress: '0x123...'
    },
    investments: Array(25).fill(null).map((_, i) => ({
      id: `inv_${i}`,
      amount: Math.random() * 10000,
      investorId: `user_${i}`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }))
  },
  {
    id: '2',
    title: 'AlgoGaming Platform',
    description: 'Next-gen gaming platform on Algorand',
    fundingGoal: 500000,
    currentFunding: 300000,
    category: 'Gaming',
    tags: ['gaming', 'nft', 'metaverse'],
    assetId: 123457,
    tokenPrice: 0.75,
    tokensAvailable: 2000000,
    creator: {
      id: '2',
      name: 'Gaming Team',
      walletAddress: '0x456...'
    },
    investments: Array(15).fill(null).map((_, i) => ({
      id: `inv_${i}`,
      amount: Math.random() * 5000,
      investorId: `user_${i}`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }))
  },
  {
    id: '3',
    title: 'AlgoNFT Marketplace',
    description: 'Premier NFT marketplace on Algorand',
    fundingGoal: 750000,
    currentFunding: 600000,
    category: 'NFT',
    tags: ['nft', 'marketplace', 'art'],
    assetId: 123458,
    tokenPrice: 1.25,
    tokensAvailable: 1500000,
    creator: {
      id: '3',
      name: 'NFT Team',
      walletAddress: '0x789...'
    },
    investments: Array(20).fill(null).map((_, i) => ({
      id: `inv_${i}`,
      amount: Math.random() * 7500,
      investorId: `user_${i}`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }))
  }
]

export const DatabaseService = {
  async getProjects({ category, status, search }: { 
    category?: string; 
    status?: string; 
    search?: string;
  } = {}) {
    // During development, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock data for projects')
      let filteredProjects = [...MOCK_PROJECTS]
      
      if (category) {
        filteredProjects = filteredProjects.filter(p => p.category.toLowerCase() === category.toLowerCase())
      }
      
      if (search) {
        const searchLower = search.toLowerCase()
        filteredProjects = filteredProjects.filter(p => 
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }
      
      return filteredProjects
    }

    // In production, use actual database
    try {
      console.log('Fetching projects with params:', { category, status, search })
      const projects = await prisma.project.findMany({
        where: {
          ...(category && { category }),
          ...(status && { status }),
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { tags: { hasSome: [search] } }
            ]
          })
        },
        select: {
          id: true,
          title: true,
          description: true,
          fundingGoal: true,
          currentFunding: true,
          category: true,
          tags: true,
          assetId: true,
          tokenPrice: true,
          tokensAvailable: true,
          creator: {
            select: {
              id: true,
              name: true,
              walletAddress: true
            }
          },
          investments: {
            select: {
              id: true,
              amount: true,
              investorId: true,
              createdAt: true
            }
          }
        }
      })
      console.log(`Found ${projects.length} projects`)
      return projects
    } catch (error) {
      console.error('Error in getProjects:', error)
      throw error
    }
  },

  async getAllInvestments() {
    try {
      return await prisma.investment.findMany({
        select: {
          id: true,
          amount: true,
          createdAt: true,
          investorId: true,
          projectId: true,
          investor: {
            select: {
              id: true,
              name: true,
              walletAddress: true
            }
          },
          project: {
            select: {
              id: true,
              title: true,
              assetId: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error in getAllInvestments:', error)
      throw error
    }
  },

  async createProject(data: any) {
    try {
      return await prisma.project.create({
        data,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              walletAddress: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error in createProject:', error)
      throw error
    }
  },

  async getRecentActivities() {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      const [investments, comments, votes] = await Promise.all([
        prisma.investment.findMany({
          where: {
            createdAt: {
              gte: sevenDaysAgo
            }
          },
          select: {
            id: true,
            projectId: true,
            createdAt: true,
            amount: true
          }
        }).then(items => items.map(item => ({ ...item, type: 'investment' as const }))),
        
        prisma.dueDiligenceComment.findMany({
          where: {
            createdAt: {
              gte: sevenDaysAgo
            }
          },
          select: {
            id: true,
            dueDiligence: {
              select: {
                projectId: true
              }
            },
            createdAt: true
          }
        }).then(items => items.map(item => ({ 
          id: item.id,
          projectId: item.dueDiligence.projectId,
          createdAt: item.createdAt,
          type: 'comment' as const
        }))),
        
        prisma.vote.findMany({
          where: {
            createdAt: {
              gte: sevenDaysAgo
            }
          },
          select: {
            id: true,
            proposal: {
              select: {
                projectId: true
              }
            },
            createdAt: true
          }
        }).then(items => items.map(item => ({
          id: item.id,
          projectId: item.proposal.projectId,
          createdAt: item.createdAt,
          type: 'vote' as const
        })))
      ])

      return [...investments, ...comments, ...votes].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
    } catch (error) {
      console.error('Error in getRecentActivities:', error)
      throw error
    }
  },

  async getProposals(filters?: {
    status?: string
    projectId?: string
    type?: string
  }) {
    try {
      const where: any = {}

      if (filters?.status) {
        where.status = filters.status
      }

      if (filters?.projectId) {
        where.projectId = filters.projectId
      }

      if (filters?.type) {
        where.type = filters.type
      }

      return await prisma.proposal.findMany({
        where,
        include: {
          creator: true,
          project: true,
          votes: {
            include: {
              voter: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Error in getProposals:', error)
      throw error
    }
  },

  async getRecentInvestments() {
    try {
      return await prisma.investment.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          investor: true,
          project: true
        }
      })
    } catch (error) {
      console.error('Error in getRecentInvestments:', error)
      throw error
    }
  },

  async getRecentProjects() {
    try {
      return await prisma.project.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          creator: true
        }
      })
    } catch (error) {
      console.error('Error in getRecentProjects:', error)
      throw error
    }
  },

  async getRecentProposals() {
    try {
      return await prisma.proposal.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          creator: true,
          project: true
        }
      })
    } catch (error) {
      console.error('Error in getRecentProposals:', error)
      throw error
    }
  },

  async getProject(id: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          fundingGoal: true,
          currentFunding: true,
          category: true,
          tags: true,
          githubUrl: true,
          assetId: true,
          tokenPrice: true,
          tokensAvailable: true,
          status: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          tokenMetadata: true,
          dividendSettings: true,
          longDescription: true,
          creator: {
            select: {
              id: true,
              name: true,
              walletAddress: true,
              profile: true
            }
          },
          investments: {
            select: {
              id: true,
              amount: true,
              investorId: true,
              createdAt: true,
              metadata: true
            }
          },
          proposals: {
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              type: true,
              createdAt: true,
              parameters: true,
              _count: {
                select: {
                  votes: true
                }
              }
            }
          },
          dueDiligence: {
            include: {
              comments: {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      profile: true
                    }
                  }
                },
                orderBy: {
                  createdAt: 'desc'
                }
              },
              reviews: {
                include: {
                  reviewer: {
                    select: {
                      id: true,
                      name: true,
                      profile: true
                    }
                  }
                }
              }
            }
          }
        }
      })
      
      if (!project) return null

      // Calculate additional financial metrics
      const financialMetrics = {
        totalInvestment: project.investments.reduce((sum, inv) => sum + inv.amount, 0),
        investorCount: new Set(project.investments.map(inv => inv.investorId)).size,
        averageInvestment: project.investments.length > 0 
          ? project.investments.reduce((sum, inv) => sum + inv.amount, 0) / project.investments.length 
          : 0,
        monthlyRevenue: project.metadata?.metrics?.mrr || 0,
        growthRate: project.metadata?.metrics?.growth_rate || 0,
        churnRate: project.metadata?.metrics?.churn_rate || 0,
        customerCount: project.metadata?.metrics?.customers || 0
      }

      return {
        ...project,
        financialMetrics
      }
    } catch (error) {
      console.error('Error in getProject:', error)
      throw error
    }
  },

  async getProjectTransactions(projectId: string) {
    try {
      return await prisma.investment.findMany({
        where: { projectId },
        include: {
          investor: {
            select: {
              id: true,
              name: true,
              walletAddress: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Error in getProjectTransactions:', error)
      throw error
    }
  }
} 