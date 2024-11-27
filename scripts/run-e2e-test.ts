import { fileURLToPath } from 'url'
import { dirname } from 'path'
import runE2ETest from '../src/tests/e2e'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error)
  process.exit(1)
})

async function main() {
  try {
    console.log('Running E2E test...')
    const results = await runE2ETest().catch((error) => {
      console.error('Error in E2E test:', error)
      throw error
    })
    
    console.log('\nTest Results Summary:')
    console.log('--------------------')
    console.log('Project ID:', results.project.id)
    console.log('Project Title:', results.project.title)
    console.log('Total Investment:', results.investments.reduce((sum, inv) => sum + inv.amount, 0))
    console.log('Number of Investors:', results.investments.length)
    console.log('Number of Proposals:', results.proposals.length)
    console.log('Number of Votes:', results.votes.length)
    
    console.log('\nTest completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error running E2E test:', error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
}) 