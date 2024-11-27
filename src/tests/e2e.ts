import { faker } from '@faker-js/faker'
import { PrismaClient, Prisma } from '@prisma/client'
import { AlgorandService } from '../services/blockchain/algorand'
import { DatabaseService } from '../services/database'

// Initialize Prisma client with verbose logging
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
})

// Log all Prisma events
prisma.$on('query', (e) => {
  console.log('Query:', e.query)
  console.log('Duration:', e.duration + 'ms')
  console.log('Timestamp:', e.timestamp)
})

prisma.$on('error', (e) => {
  console.error('Prisma Error:', e.message)
  console.error('Target:', e.target)
})

prisma.$on('info', (e) => {
  console.log('Prisma Info:', e.message)
  console.log('Target:', e.target)
})

prisma.$on('warn', (e) => {
  console.warn('Prisma Warning:', e.message)
  console.warn('Target:', e.target)
})

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught exception:', error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Prisma Error Code:', error.code)
    console.error('Prisma Error Message:', error.message)
    console.error('Prisma Error Meta:', error.meta)
  }
  process.exit(1)
})

process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled promise rejection. Reason:', reason)
  if (reason instanceof Error) {
    console.error('Stack trace:', reason.stack)
    if (reason instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma Error Code:', reason.code)
      console.error('Prisma Error Message:', reason.message)
      console.error('Prisma Error Meta:', reason.meta)
    }
  }
  process.exit(1)
})

// Test database connection
async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('Successfully connected to database')
  } catch (error) {
    console.error('Failed to connect to database:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    throw error
  }
}

interface TestResults {
  project: any
  investments: any[]
  proposals: any[]
  votes: any[]
}

async function generateRealisticProject() {
  try {
    const projectData = {
      title: 'AI-Powered Medical Imaging Analysis Platform',
      description: 'A cutting-edge SaaS platform leveraging deep learning algorithms to assist radiologists in detecting and diagnosing abnormalities in medical images.',
      longDescription: `Our solution integrates seamlessly with existing PACS systems and provides real-time analysis of X-rays, MRIs, and CT scans.`,
      fundingGoal: 2500000,
      category: 'Healthcare',
      tags: ['AI', 'Healthcare', 'Medical Imaging', 'Deep Learning'],
      githubUrl: 'https://github.com/algoshark/medical-imaging-ai',
      assetId: faker.number.int({ min: 1000000, max: 9999999 }),
      tokenPrice: 1.0,
      tokensAvailable: 2500000,
      metadata: {
        stage: 'Seed',
        round: 'A',
        techStack: ['Python', 'TensorFlow', 'React', 'Node.js'],
        team: [
          {
            name: faker.person.fullName(),
            role: 'CEO',
            background: 'Former Chief of Radiology at Major Hospital, PhD in Medical Imaging',
          },
          {
            name: faker.person.fullName(),
            role: 'CTO',
            background: 'PhD in Computer Vision, 15 years experience in healthcare AI',
          },
        ],
      },
    }
    return projectData
  } catch (error) {
    console.error('Error generating project data:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    throw error
  }
}

async function generateInvestors(count: number) {
  try {
    const investors = []
    for (let i = 0; i < count; i++) {
      const account = AlgorandService.generateAccount()
      const profile = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        walletAddress: account.addr,
        profile: {
          type: faker.helpers.arrayElement(['Individual', 'VC', 'Angel', 'Institution']),
          expertise: faker.helpers.arrayElements(['AI/ML', 'Healthcare', 'Finance', 'Technology'], { min: 1, max: 3 }),
          bio: faker.lorem.paragraph(),
        },
      }
      investors.push({ account, profile })
    }
    return investors
  } catch (error) {
    console.error('Error generating investors:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    throw error
  }
}

async function generateProposals(project: any, creator: any) {
  try {
    const proposals = [
      {
        title: 'Expand to Asian Markets in Q1 2025',
        description: 'Proposal to accelerate international expansion by entering key Asian markets.',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        type: 'STRATEGIC',
        parameters: {
          budget: 800000,
          timeline: '6 months',
          votingThreshold: 0.6,
          minimumParticipation: 0.4,
        },
      },
    ]
    return proposals
  } catch (error) {
    console.error('Error generating proposals:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    throw error
  }
}

export default async function runE2ETest(): Promise<TestResults> {
  try {
    // Ensure database connection
    await connectDatabase()

    // Clean up any existing test data
    console.log('Cleaning up existing test data...')
    await prisma.vote.deleteMany()
    await prisma.proposal.deleteMany()
    await prisma.investment.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()

    console.log('Starting E2E test...')

    // Create project creator
    console.log('Creating project creator...')
    const creatorAccount = AlgorandService.generateAccount()
    console.log('Generated creator account:', creatorAccount.addr)

    const creator = await DatabaseService.createUser({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      walletAddress: creatorAccount.addr,
      profile: {
        type: 'Founder',
        expertise: ['AI/ML', 'Healthcare'],
        bio: faker.lorem.paragraph(),
      },
    })
    console.log('Created project creator:', creator.id)

    // Create project with detailed data
    console.log('Creating project...')
    const projectData = await generateRealisticProject()
    const project = await DatabaseService.createProject({
      ...projectData,
      creatorId: creator.id,
    })
    console.log('Created project:', project.id)

    // Generate and create investors
    console.log('Creating investors...')
    const investors = await generateInvestors(5) // Reduced to 5 for testing
    const createdInvestors = await Promise.all(
      investors.map(({ profile }) => DatabaseService.createUser(profile))
    )
    console.log('Created investors:', createdInvestors.length)

    // Create investments
    console.log('Creating investments...')
    const investments = await Promise.all(
      createdInvestors.map(async (investor) => {
        const amount = faker.number.int({ min: 50000, max: 500000 })
        return DatabaseService.createInvestment({
          projectId: project.id,
          investorId: investor.id,
          amount,
          tokenAmount: amount,
          metadata: {
            strategy: faker.helpers.arrayElement(['Growth', 'Value', 'Impact']),
            round: 'Seed',
          },
        })
      })
    )
    console.log('Created investments:', investments.length)

    // Create governance proposals
    console.log('Creating proposals...')
    const proposalTemplates = await generateProposals(project, creator)
    const proposals = await Promise.all(
      proposalTemplates.map((template) =>
        DatabaseService.createProposal({
          ...template,
          projectId: project.id,
          creatorId: creator.id,
        })
      )
    )
    console.log('Created proposals:', proposals.length)

    // Create votes
    console.log('Creating votes...')
    const votes = await Promise.all(
      createdInvestors.map(async (investor) => {
        const proposal = faker.helpers.arrayElement(proposals)
        const choice = faker.helpers.arrayElement(['YES', 'NO', 'ABSTAIN'])
        return DatabaseService.createVote({
          proposalId: proposal.id,
          voterId: investor.id,
          choice,
          power: faker.number.int({ min: 1000, max: 10000 }),
          metadata: {
            rationale: faker.lorem.sentence(),
          },
        })
      })
    )
    console.log('Created votes:', votes.length)

    console.log('Test completed successfully!')

    return {
      project,
      investments,
      proposals,
      votes,
    }
  } catch (error) {
    console.error('E2E test failed:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    throw error
  } finally {
    // Ensure database connection is closed
    await prisma.$disconnect()
  }
} 