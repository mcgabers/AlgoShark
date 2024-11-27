import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

function generateUniqueAssetId() {
  return faker.number.int({ min: 1000000, max: 999999999 })
}

async function testBasicProjectCreation() {
  console.log('\n🧪 Testing Basic Project Creation')
  console.log('--------------------------------')
  
  const creator = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      walletAddress: faker.string.alphanumeric(58),
    }
  })
  console.log('Created creator:', creator.id)
  
  const project = await prisma.project.create({
    data: {
      title: 'Basic Test Project',
      description: 'A simple test project',
      fundingGoal: 100000,
      category: 'Test',
      tags: ['test'],
      githubUrl: 'https://github.com/test',
      assetId: generateUniqueAssetId(),
      tokenPrice: 1,
      tokensAvailable: 100000,
      creatorId: creator.id,
    }
  })
  console.log('Created basic project:', project.id)
  
  return { creator, project }
}

async function testComplexProject() {
  console.log('\n🧪 Testing Complex Project')
  console.log('-------------------------')
  
  const creator = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      walletAddress: faker.string.alphanumeric(58),
      profile: {
        type: 'Founder',
        expertise: ['AI/ML', 'Healthcare'],
        bio: faker.lorem.paragraph(),
        socialLinks: {
          linkedin: faker.internet.url(),
          twitter: faker.internet.url(),
          github: faker.internet.url(),
        }
      }
    }
  })
  console.log('Created creator with profile:', creator.id)
  
  const project = await prisma.project.create({
    data: {
      title: 'AI Medical Imaging Platform',
      description: 'Advanced AI platform for medical image analysis',
      longDescription: faker.lorem.paragraphs(3),
      fundingGoal: 1000000,
      category: 'Healthcare',
      tags: ['AI', 'Healthcare', 'Medical'],
      githubUrl: 'https://github.com/test/medical-ai',
      assetId: generateUniqueAssetId(),
      tokenPrice: 1,
      tokensAvailable: 1000000,
      creatorId: creator.id,
      metadata: {
        stage: 'Seed',
        team: [
          {
            name: faker.person.fullName(),
            role: 'CEO',
            background: 'Former Chief of Radiology'
          },
          {
            name: faker.person.fullName(),
            role: 'CTO',
            background: '15 years in AI'
          }
        ],
        roadmap: [
          {
            phase: 'Q1 2024',
            milestones: ['FDA Approval', 'Beta Launch']
          },
          {
            phase: 'Q2 2024',
            milestones: ['Full Launch', 'Asian Expansion']
          }
        ],
        financials: {
          runway: '18 months',
          burnRate: '$50k/month',
          projections: {
            year1: { revenue: 1000000, users: 100 },
            year2: { revenue: 5000000, users: 500 }
          }
        }
      }
    }
  })
  console.log('Created complex project:', project.id)
  
  return { creator, project }
}

async function testInvestmentScenarios(project) {
  console.log('\n🧪 Testing Investment Scenarios')
  console.log('------------------------------')
  
  // Create different types of investors
  const institutionalInvestor = await prisma.user.create({
    data: {
      name: faker.company.name(),
      email: faker.internet.email(),
      walletAddress: faker.string.alphanumeric(58),
      profile: {
        type: 'Institution',
        aum: '$1B+',
        investmentFocus: ['Healthcare', 'AI'],
        minimumTicket: 500000
      }
    }
  })
  
  const angelInvestor = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      walletAddress: faker.string.alphanumeric(58),
      profile: {
        type: 'Angel',
        expertise: ['Healthcare'],
        investmentStyle: 'Early Stage'
      }
    }
  })
  
  const retailInvestor = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      walletAddress: faker.string.alphanumeric(58),
      profile: {
        type: 'Individual',
        riskProfile: 'Aggressive'
      }
    }
  })
  
  // Create investments with different sizes and strategies
  const investments = await Promise.all([
    // Large institutional investment
    prisma.investment.create({
      data: {
        projectId: project.id,
        investorId: institutionalInvestor.id,
        amount: 500000,
        tokenAmount: 500000,
        metadata: {
          strategy: 'Growth',
          round: 'Seed',
          terms: {
            lockupPeriod: '12 months',
            vestingSchedule: '24 months'
          }
        }
      }
    }),
    // Medium angel investment
    prisma.investment.create({
      data: {
        projectId: project.id,
        investorId: angelInvestor.id,
        amount: 100000,
        tokenAmount: 100000,
        metadata: {
          strategy: 'Value',
          round: 'Seed',
          terms: {
            lockupPeriod: '6 months',
            vestingSchedule: '12 months'
          }
        }
      }
    }),
    // Small retail investment
    prisma.investment.create({
      data: {
        projectId: project.id,
        investorId: retailInvestor.id,
        amount: 10000,
        tokenAmount: 10000,
        metadata: {
          strategy: 'Growth',
          round: 'Seed'
        }
      }
    })
  ])
  
  console.log('Created diverse investment portfolio:', investments.length, 'investments')
  return { institutionalInvestor, angelInvestor, retailInvestor, investments }
}

async function testGovernanceScenarios(project, investors) {
  console.log('\n🧪 Testing Governance Scenarios')
  console.log('------------------------------')
  
  // Create different types of proposals
  const proposals = await Promise.all([
    // Strategic proposal
    prisma.proposal.create({
      data: {
        title: 'Expand to Asian Markets',
        description: 'Strategic expansion into Asian markets',
        type: 'STRATEGIC',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        projectId: project.id,
        creatorId: project.creatorId,
        parameters: {
          budget: 800000,
          timeline: '6 months',
          votingThreshold: 0.6,
          minimumParticipation: 0.4,
          keyMilestones: [
            'Establish local presence',
            'Regulatory compliance',
            'Partnership development'
          ]
        }
      }
    }),
    // Technical proposal
    prisma.proposal.create({
      data: {
        title: 'Implement Blockchain Audit Trail',
        description: 'Technical implementation of blockchain audit system',
        type: 'TECHNICAL',
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        projectId: project.id,
        creatorId: project.creatorId,
        parameters: {
          budget: 400000,
          timeline: '4 months',
          votingThreshold: 0.5,
          minimumParticipation: 0.3,
          technicalSpecs: {
            blockchain: 'Algorand',
            features: ['Immutable audit trail', 'Smart contract automation']
          }
        }
      }
    }),
    // Emergency proposal
    prisma.proposal.create({
      data: {
        title: 'Emergency Security Update',
        description: 'Critical security patch implementation',
        type: 'EMERGENCY',
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        projectId: project.id,
        creatorId: project.creatorId,
        parameters: {
          budget: 50000,
          timeline: '1 week',
          votingThreshold: 0.75,
          minimumParticipation: 0.6,
          severity: 'HIGH',
          impact: ['Security', 'Operations']
        }
      }
    })
  ])
  
  // Create votes with different voting patterns
  const votes = await Promise.all(
    proposals.flatMap(proposal => 
      Object.values(investors).map(investor => {
        const isInstitutional = investor.profile?.type === 'Institution'
        const isEmergency = proposal.type === 'EMERGENCY'
        
        return prisma.vote.create({
          data: {
            proposalId: proposal.id,
            voterId: investor.id,
            // Institutional investors tend to vote YES on emergency proposals
            choice: isEmergency && isInstitutional ? 'YES' : faker.helpers.arrayElement(['YES', 'NO', 'ABSTAIN']),
            // Voting power proportional to investment size
            power: isInstitutional ? 5000 : investor.profile?.type === 'Angel' ? 2000 : 1000,
            metadata: {
              rationale: faker.lorem.sentence(),
              concerns: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
              suggestions: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
              votingStrategy: isInstitutional ? 'Risk-Managed' : 'Individual Assessment'
            }
          }
        })
      })
    )
  )
  
  console.log('Created governance scenarios:', {
    proposals: proposals.length,
    votes: votes.length
  })
  return { proposals, votes }
}

async function analyzeResults(project, investments, proposals, votes) {
  console.log('\n📊 Test Results Analysis')
  console.log('----------------------')
  
  // Investment Analysis
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const avgInvestment = totalInvestment / investments.length
  const investmentsByType = investments.reduce((acc, inv) => {
    const type = inv.metadata?.strategy || 'Unknown'
    acc[type] = (acc[type] || 0) + inv.amount
    return acc
  }, {})
  
  console.log('Investment Metrics:')
  console.log('- Total Investment:', totalInvestment)
  console.log('- Average Investment:', avgInvestment)
  console.log('- Investment by Strategy:', investmentsByType)
  
  // Governance Analysis
  const votesByProposal = proposals.map(proposal => {
    const proposalVotes = votes.filter(v => v.proposalId === proposal.id)
    const totalPower = proposalVotes.reduce((sum, v) => sum + v.power, 0)
    const distribution = proposalVotes.reduce((acc, v) => {
      acc[v.choice] = (acc[v.choice] || 0) + 1
      return acc
    }, {})
    
    return {
      title: proposal.title,
      type: proposal.type,
      votes: proposalVotes.length,
      totalPower,
      distribution,
      result: distribution.YES > distribution.NO ? 'PASSED' : 'FAILED'
    }
  })
  
  console.log('\nGovernance Metrics:')
  console.log('- Total Proposals:', proposals.length)
  console.log('- Total Votes:', votes.length)
  console.log('\nProposal Results:')
  votesByProposal.forEach(p => {
    console.log(`\n${p.title} (${p.type}):`)
    console.log(`- Status: ${p.result}`)
    console.log(`- Votes: ${p.votes}`)
    console.log(`- Total Power: ${p.totalPower}`)
    console.log(`- Distribution:`, p.distribution)
  })
}

async function main() {
  try {
    console.log('🚀 Starting Comprehensive Platform Test')
    console.log('=====================================')
    
    // Clean up existing test data
    await prisma.vote.deleteMany()
    await prisma.proposal.deleteMany()
    await prisma.investment.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()
    
    // Run test scenarios
    const { project: basicProject } = await testBasicProjectCreation()
    const { project: complexProject } = await testComplexProject()
    
    const { institutionalInvestor, angelInvestor, retailInvestor, investments } = 
      await testInvestmentScenarios(complexProject)
    
    const { proposals, votes } = await testGovernanceScenarios(
      complexProject,
      { institutionalInvestor, angelInvestor, retailInvestor }
    )
    
    // Analyze results
    await analyzeResults(complexProject, investments, proposals, votes)
    
    console.log('\n✅ Test completed successfully!')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 