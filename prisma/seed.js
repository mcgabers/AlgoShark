import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const PROJECT_CATEGORIES = {
  'AI Content Creation': {
    tags: ['NLP', 'Content Generation', 'Machine Learning', 'GPT', 'Text Analysis'],
    fundingRange: { min: 250000, max: 2000000 },
    description: () => `An AI-powered platform that ${faker.helpers.arrayElement([
      'generates high-quality content using advanced language models',
      'automates content creation workflows with AI assistance',
      'provides intelligent content optimization and analysis'
    ])}. ${faker.lorem.paragraph()}`
  },
  'Trading & Finance': {
    tags: ['Algorithmic Trading', 'DeFi', 'Market Analysis', 'Risk Management'],
    fundingRange: { min: 500000, max: 5000000 },
    description: () => `A sophisticated ${faker.helpers.arrayElement([
      'algorithmic trading platform',
      'financial analysis system',
      'market prediction engine'
    ])} powered by advanced AI. ${faker.lorem.paragraph()}`
  }
}

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
  }
]

const PROJECT_STAGES = [
  'Prototype',
  'Alpha',
  'Private Beta',
  'Public Beta',
  'Production'
]

const INVESTMENT_ROUNDS = [
  'Seed',
  'Angel',
  'Series A',
  'Series B'
]

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

  // Create users
  const users = await Promise.all(
    Array.from({ length: 10 }, async () => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      
      return prisma.user.create({
        data: {
          email: faker.internet.email({ firstName, lastName }),
          name: `${firstName} ${lastName}`,
          walletAddress: faker.string.alphanumeric(58),
          profile: {
            bio: faker.person.bio(),
            expertise: faker.helpers.arrayElements([
              'Machine Learning',
              'Software Development',
              'Product Management',
              'Data Science'
            ], { min: 1, max: 3 }),
            github: faker.internet.userName(),
            twitter: faker.internet.userName(),
            linkedin: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
          }
        }
      })
    })
  )

  console.log('👥 Created users:', users.length)

  // Create projects
  const projects = await Promise.all(
    Array.from({ length: 10 }, async () => {
      const category = faker.helpers.arrayElement(Object.keys(PROJECT_CATEGORIES))
      const categoryData = PROJECT_CATEGORIES[category]
      const tags = faker.helpers.arrayElements(categoryData.tags, { min: 3, max: 5 })
      const fundingGoal = faker.number.int(categoryData.fundingRange)
      const currentFunding = faker.number.int({ min: 0, max: fundingGoal })
      const tokenSupply = fundingGoal
      const techStack = faker.helpers.arrayElement(TECH_STACKS)
      const stage = faker.helpers.arrayElement(PROJECT_STAGES)
      const round = faker.helpers.arrayElement(INVESTMENT_ROUNDS)
      
      const metadata = {
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
          linkedin: faker.internet.userName(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`
        })),
        roadmap: Array.from({ length: 4 }, (_, i) => ({
          phase: `Phase ${i + 1}`,
          title: faker.company.buzzPhrase(),
          description: faker.lorem.paragraph(),
          timeline: `Q${faker.number.int({ min: 1, max: 4 })} ${2024 + Math.floor(i / 4)}`,
          milestones: Array.from({ length: 3 }, () => faker.company.buzzPhrase())
        })),
        metrics: {
          users: faker.number.int({ min: 100, max: 10000 }),
          growth: faker.number.float({ min: 0.1, max: 0.9 }),
          retention: faker.number.float({ min: 0.4, max: 0.95 }),
          revenue: stage !== 'Prototype' ? faker.number.int({ min: 10000, max: 1000000 }) : 0
        },
        documentation: {
          technical: faker.lorem.paragraphs(3),
          legal: Array.from({ length: 3 }, () => faker.lorem.paragraph()),
          governance: faker.lorem.paragraphs(2)
        },
        aiAnalysis: {
          summary: faker.lorem.paragraph(3),
          strengths: Array.from({ length: 4 }, () => faker.company.buzzPhrase()),
          risks: Array.from({ length: 3 }, () => faker.lorem.sentence()),
          opportunities: Array.from({ length: 4 }, () => faker.company.buzzPhrase())
        }
      }

      return prisma.project.create({
        data: {
          title: faker.company.catchPhrase(),
          description: categoryData.description(),
          longDescription: faker.lorem.paragraphs(5),
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
          metadata
        }
      })
    })
  )

  console.log('📚 Created projects:', projects.length)

  // Create investments
  const investments = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const project = faker.helpers.arrayElement(projects)
      const amount = faker.number.int({ min: 1000, max: 50000 })
      
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
          metadata: {
            strategy: faker.helpers.arrayElement([
              'Long-term Growth',
              'Strategic Partnership',
              'Portfolio Diversification'
            ]),
            expectations: faker.lorem.sentence(),
            evaluationCriteria: faker.helpers.arrayElements([
              'Team Experience',
              'Market Potential',
              'Technical Innovation',
              'Growth Metrics'
            ], { min: 2, max: 4 })
          }
        }
      })
    })
  )

  console.log('💰 Created investments:', investments.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 