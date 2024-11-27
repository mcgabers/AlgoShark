import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

interface CategoryData {
  tags: string[]
  fundingRange: { min: number; max: number }
  description: () => string
}

interface ProjectMetadata {
  [key: string]: unknown
  stage: string
  round: string
  techStack: {
    name: string
    components: string[]
    infrastructure: string[]
  }
  team: Array<{
    role: string
    experience: string
    linkedin: string
  }>
  roadmap: Array<{
    phase: string
    title: string
    description: string
    timeline: string
  }>
  metrics: {
    users: number
    growth: number
    retention: number
    revenue: number
  }
}

interface InvestmentMetadata {
  [key: string]: unknown
  strategy: string
  round: string
  expectations: string
  evaluationCriteria: string[]
}

interface VoteMetadata {
  [key: string]: unknown
  rationale: string
  concerns: string | null
  suggestions: string | null
}

// Categories and their associated tags
const PROJECT_CATEGORIES: Record<string, CategoryData> = {
  'AI Content Creation': {
    tags: ['NLP', 'Content Generation', 'Machine Learning', 'GPT', 'Text Analysis', 'Content Marketing', 'Automated Writing', 'Language Models'],
    fundingRange: { min: 250000, max: 2000000 },
    description: () => `An AI-powered platform that ${faker.helpers.arrayElement([
      'generates high-quality content using advanced language models',
      'automates content creation workflows with AI assistance',
      'provides intelligent content optimization and analysis'
    ])}. ${faker.lorem.paragraph()}`
  },
  'Trading & Finance': {
    tags: ['Algorithmic Trading', 'DeFi', 'Market Analysis', 'Risk Management', 'Portfolio Optimization', 'Quantitative Analysis', 'High-Frequency Trading', 'Financial Forecasting'],
    fundingRange: { min: 500000, max: 5000000 },
    description: () => `A sophisticated ${faker.helpers.arrayElement([
      'algorithmic trading platform',
      'financial analysis system',
      'market prediction engine'
    ])} powered by advanced AI. ${faker.lorem.paragraph()}`
  },
  'Healthcare AI': {
    tags: ['Medical Imaging', 'Diagnostics', 'Patient Care', 'Health Records', 'Telemedicine', 'Drug Discovery', 'Clinical Trials', 'Predictive Healthcare'],
    fundingRange: { min: 1000000, max: 10000000 },
    description: () => `An innovative healthcare solution that ${faker.helpers.arrayElement([
      'improves patient outcomes using AI-driven diagnostics',
      'accelerates drug discovery through machine learning',
      'optimizes clinical workflows with intelligent automation'
    ])}. ${faker.lorem.paragraph()}`
  },
  'Education Tech': {
    tags: ['Personalized Learning', 'EdTech', 'Course Creation', 'Student Analytics', 'Virtual Classroom', 'Adaptive Learning', 'Educational Games', 'Learning Management'],
    fundingRange: { min: 200000, max: 1500000 },
    description: () => `An educational technology platform that ${faker.helpers.arrayElement([
      'personalizes learning experiences using AI',
      'provides intelligent tutoring and assessment',
      'optimizes educational content delivery'
    ])}. ${faker.lorem.paragraph()}`
  },
  'Computer Vision': {
    tags: ['Image Recognition', 'Object Detection', 'Video Analysis', 'AR/VR', 'Robotics', 'Scene Understanding', 'Visual Search', '3D Reconstruction'],
    fundingRange: { min: 500000, max: 4000000 },
    description: () => `A cutting-edge computer vision system that ${faker.helpers.arrayElement([
      'enables real-time object detection and tracking',
      'provides advanced visual search capabilities',
      'powers augmented reality experiences'
    ])}. ${faker.lorem.paragraph()}`
  },
  'Data Analytics': {
    tags: ['Big Data', 'Predictive Analytics', 'Business Intelligence', 'Data Visualization', 'Real-time Analytics', 'Data Mining', 'Statistical Analysis', 'Machine Learning'],
    fundingRange: { min: 300000, max: 3000000 },
    description: () => `An enterprise analytics platform that ${faker.helpers.arrayElement([
      'transforms raw data into actionable insights',
      'provides predictive analytics for business decisions',
      'enables real-time data visualization and analysis'
    ])}. ${faker.lorem.paragraph()}`
  }
}

// Technical requirements for projects
const TECH_STACKS = [
  {
    name: 'Modern Web Stack',
    components: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    infrastructure: ['AWS', 'Kubernetes', 'CloudFront']
  },
  {
    name: 'AI/ML Stack',
    components: ['Python', 'PyTorch', 'TensorFlow', 'CUDA', 'Ray'],
    infrastructure: ['Google Cloud', 'TPUs', 'Kubernetes']
  },
  {
    name: 'Data Processing Stack',
    components: ['Python', 'Apache Spark', 'Kafka', 'Elasticsearch'],
    infrastructure: ['AWS', 'EMR', 'S3']
  }
]

// Project development stages
const PROJECT_STAGES = [
  'Prototype',
  'Alpha',
  'Private Beta',
  'Public Beta',
  'Production'
] as const

// Investment rounds
const INVESTMENT_ROUNDS = [
  'Seed',
  'Angel',
  'Series A',
  'Series B'
] as const

async function main() {
  const isDev = process.env.NODE_ENV === 'development'
  const shouldSeed = process.env.SEED_DATABASE === 'true'

  if (!isDev && !shouldSeed) {
    console.log('Seeding is only allowed in development or with SEED_DATABASE flag')
    return
  }

  // Clear existing data
  await prisma.vote.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Cleared existing data')

  // Create users with different roles and expertise
  const users = await Promise.all(
    Array.from({ length: 50 }, async () => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const expertise = faker.helpers.arrayElements([
        'Machine Learning',
        'Software Development',
        'Product Management',
        'Data Science',
        'Business Development',
        'Venture Capital'
      ], { min: 1, max: 3 })
      
      return prisma.user.create({
        data: {
          email: faker.internet.email({ firstName, lastName }),
          name: `${firstName} ${lastName}`,
          walletAddress: faker.string.alphanumeric(58),
          profile: {
            bio: faker.person.bio(),
            expertise,
            github: faker.internet.userName(),
            twitter: faker.internet.userName(),
            linkedin: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
          }
        }
      })
    })
  )

  console.log('👥 Created users:', users.length)

  // Create projects with technical details and roadmap
  const projects = await Promise.all(
    Array.from({ length: 30 }, async () => {
      const category = faker.helpers.arrayElement(Object.keys(PROJECT_CATEGORIES))
      const categoryData = PROJECT_CATEGORIES[category]
      const tags = faker.helpers.arrayElements(categoryData.tags, { min: 3, max: 5 })
      const fundingGoal = faker.number.int(categoryData.fundingRange)
      const currentFunding = faker.number.int({ min: 0, max: fundingGoal })
      const tokenSupply = fundingGoal
      const techStack = faker.helpers.arrayElement(TECH_STACKS)
      const stage = faker.helpers.arrayElement(PROJECT_STAGES)
      const round = faker.helpers.arrayElement(INVESTMENT_ROUNDS)
      
      const metadata: ProjectMetadata = {
        stage,
        round,
        techStack: {
          name: techStack.name,
          components: techStack.components,
          infrastructure: techStack.infrastructure
        },
        team: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
          role: faker.person.jobTitle(),
          experience: faker.person.bio(),
          linkedin: faker.internet.userName()
        })),
        roadmap: Array.from({ length: 4 }, (_, i) => ({
          phase: `Phase ${i + 1}`,
          title: faker.company.buzzPhrase(),
          description: faker.lorem.sentence(),
          timeline: `Q${faker.number.int({ min: 1, max: 4 })} ${2024 + Math.floor(i / 4)}`
        })),
        metrics: {
          users: faker.number.int({ min: 100, max: 10000 }),
          growth: faker.number.float({ min: 0.1, max: 0.9 }),
          retention: faker.number.float({ min: 0.4, max: 0.95 }),
          revenue: stage !== 'Prototype' ? faker.number.int({ min: 10000, max: 1000000 }) : 0
        }
      }

      return prisma.project.create({
        data: {
          title: faker.company.catchPhrase(),
          description: categoryData.description(),
          fundingGoal,
          currentFunding,
          category,
          tags,
          githubUrl: 'https://github.com/' + faker.internet.userName() + '/' + faker.helpers.slugify(faker.company.buzzPhrase()).toLowerCase(),
          assetId: faker.number.int({ min: 100000, max: 999999 }),
          tokenPrice: 1,
          tokensAvailable: tokenSupply - currentFunding,
          status: faker.helpers.arrayElement(['active', 'completed', 'pending']),
          creatorId: faker.helpers.arrayElement(users).id,
          createdAt: faker.date.past({ years: 1 }),
          metadata: metadata as Prisma.InputJsonValue
        }
      })
    })
  )

  console.log('📚 Created projects:', projects.length)

  // Create investments with rounds and strategies
  const investments = await Promise.all(
    Array.from({ length: 200 }, async () => {
      const project = faker.helpers.arrayElement(projects)
      const amount = faker.number.int({ min: 1000, max: 50000 })
      const strategy = faker.helpers.arrayElement([
        'Long-term Growth',
        'Strategic Partnership',
        'Portfolio Diversification',
        'Early Access to Technology'
      ])

      const metadata: InvestmentMetadata = {
        strategy,
        round: (project.metadata as ProjectMetadata).round,
        expectations: faker.lorem.sentence(),
        evaluationCriteria: faker.helpers.arrayElements([
          'Team Experience',
          'Market Potential',
          'Technical Innovation',
          'Growth Metrics',
          'Competition Analysis'
        ], { min: 2, max: 4 })
      }
      
      return prisma.investment.create({
        data: {
          amount,
          tokenAmount: amount,
          investorId: faker.helpers.arrayElement(users).id,
          projectId: project.id,
          createdAt: faker.date.between({ 
            from: project.createdAt, 
            to: new Date() 
          }),
          metadata: metadata as Prisma.InputJsonValue
        }
      })
    })
  )

  console.log('💰 Created investments:', investments.length)

  // Create proposals with detailed governance parameters
  const proposals = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const project = faker.helpers.arrayElement(projects)
      const startDate = faker.date.future()
      const type = faker.helpers.arrayElement(['FUNDING', 'GOVERNANCE', 'TECHNICAL'])
      
      let proposalDetails
      if (type === 'FUNDING') {
        proposalDetails = {
          requestedAmount: faker.number.int({ min: 50000, max: 500000 }),
          purpose: faker.lorem.sentence(),
          timeline: faker.date.future(),
          milestones: Array.from({ length: 3 }, () => ({
            title: faker.company.buzzPhrase(),
            deadline: faker.date.future(),
            deliverables: faker.lorem.sentences(2)
          }))
        }
      } else if (type === 'TECHNICAL') {
        proposalDetails = {
          change: faker.lorem.sentence(),
          impact: faker.lorem.paragraph(),
          implementation: faker.lorem.paragraphs(2),
          testing: faker.lorem.sentences(2)
        }
      } else {
        proposalDetails = {
          policy: faker.lorem.sentence(),
          rationale: faker.lorem.paragraph(),
          implementation: faker.date.future()
        }
      }
      
      return prisma.proposal.create({
        data: {
          title: faker.company.catchPhrase(),
          description: faker.lorem.paragraphs(2),
          startDate,
          endDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          type,
          status: faker.helpers.arrayElement(['active', 'completed', 'pending']),
          creatorId: project.creatorId,
          projectId: project.id,
          parameters: {
            requiredQuorum: faker.number.int({ min: 100000, max: 1000000 }),
            minimumVotingPower: faker.number.int({ min: 1000, max: 10000 }),
            votingPeriod: '7 days',
            details: proposalDetails
          },
          createdAt: faker.date.recent({ days: 30 })
        }
      })
    })
  )

  console.log('📜 Created proposals:', proposals.length)

  // Create votes with voter rationale
  const votes = await Promise.all(
    Array.from({ length: 300 }, async () => {
      const proposal = faker.helpers.arrayElement(proposals)
      const choice = faker.helpers.arrayElement(['YES', 'NO', 'ABSTAIN'])
      
      const suggestions = faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })
      const metadata: VoteMetadata = {
        rationale: faker.lorem.sentence(),
        concerns: choice === 'NO' ? faker.lorem.sentences(2) : null,
        suggestions: suggestions || null
      }

      return prisma.vote.create({
        data: {
          choice,
          power: faker.number.int({ min: 100, max: 10000 }),
          voterId: faker.helpers.arrayElement(users).id,
          proposalId: proposal.id,
          createdAt: faker.date.between({
            from: proposal.createdAt,
            to: proposal.endDate
          }),
          metadata: metadata as Prisma.InputJsonValue
        }
      })
    })
  )

  console.log('✅ Created votes:', votes.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 