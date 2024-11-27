import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
})

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error)
  })

export class DatabaseService {
  static async createUser(email: string, walletAddress: string, name?: string) {
    return prisma.user.create({
      data: {
        email,
        walletAddress,
        name,
      },
    })
  }

  static async getUserByWallet(walletAddress: string) {
    return prisma.user.findUnique({
      where: { walletAddress },
      include: {
        projects: true,
        investments: {
          include: {
            project: true,
          },
        },
      },
    })
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        projects: true,
        investments: {
          include: {
            project: true,
          },
        },
      },
    })
  }

  static async getAllUsers() {
    return prisma.user.findMany({
      include: {
        projects: true,
        investments: true,
      },
    })
  }

  static async createProject(data: {
    title: string
    description: string
    fundingGoal: number
    category: string
    tags: string[]
    githubUrl: string
    assetId: number
    tokenPrice: number
    tokensAvailable: number
    creatorId: string
    metadata?: any
  }) {
    return prisma.project.create({
      data: {
        ...data,
        currentFunding: 0,
      },
      include: {
        creator: true,
      },
    })
  }

  static async getProjects(filters?: {
    category?: string
    status?: string
    search?: string
  }) {
    const where: any = {}

    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } },
      ]
    }

    return prisma.project.findMany({
      where,
      include: {
        creator: true,
        investments: {
          include: {
            investor: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async getProject(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        creator: true,
        investments: {
          include: {
            investor: true,
          },
        },
        proposals: {
          include: {
            votes: true,
          },
        },
      },
    })
  }

  static async getRecentProjects() {
    return prisma.project.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        creator: true,
      },
    })
  }

  static async createInvestment(data: {
    amount: number
    tokenAmount: number
    projectId: string
    investorId: string
    metadata?: any
  }) {
    return prisma.$transaction(async (tx) => {
      // Create the investment
      const investment = await tx.investment.create({
        data,
        include: {
          investor: true,
          project: true,
        },
      })

      // Update the project's current funding
      await tx.project.update({
        where: { id: data.projectId },
        data: {
          currentFunding: {
            increment: data.amount,
          },
          tokensAvailable: {
            decrement: data.tokenAmount,
          },
        },
      })

      return investment
    })
  }

  static async getUserInvestments(userId: string) {
    return prisma.investment.findMany({
      where: {
        investorId: userId,
      },
      include: {
        project: {
          include: {
            creator: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async getRecentInvestments() {
    return prisma.investment.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        investor: true,
        project: true,
      },
    })
  }

  static async getAllInvestments() {
    return prisma.investment.findMany({
      include: {
        investor: true,
        project: true,
      },
    })
  }

  static async createProposal(data: {
    title: string
    description: string
    startDate: Date
    endDate: Date
    type: string
    creatorId: string
    projectId: string
    parameters?: any
  }) {
    return prisma.proposal.create({
      data: {
        ...data,
        status: 'pending',
      },
      include: {
        creator: true,
        project: true,
      },
    })
  }

  static async getProposals(filters?: {
    status?: string
    projectId?: string
    type?: string
  }) {
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

    return prisma.proposal.findMany({
      where,
      include: {
        creator: true,
        project: true,
        votes: {
          include: {
            voter: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async getRecentProposals() {
    return prisma.proposal.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        creator: true,
        project: true,
      },
    })
  }

  static async createVote(data: {
    choice: string
    power: number
    voterId: string
    proposalId: string
    metadata?: any
  }) {
    return prisma.vote.create({
      data,
      include: {
        voter: true,
        proposal: {
          include: {
            project: true,
          },
        },
      },
    })
  }

  static async getUserVotes(userId: string) {
    return prisma.vote.findMany({
      where: {
        voterId: userId,
      },
      include: {
        proposal: {
          include: {
            project: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async getProposalVotes(proposalId: string) {
    return prisma.vote.findMany({
      where: {
        proposalId,
      },
      include: {
        voter: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async getProjectTransactions(projectId: string) {
    return prisma.tokenTransaction.findMany({
      where: { projectId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            walletAddress: true
          }
        },
        receiver: {
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
  }
} 