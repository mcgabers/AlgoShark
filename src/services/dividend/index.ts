import { PrismaClient } from '@prisma/client'
import { TokenManagementService } from '@/services/token'
import { AlgorandService } from '@/services/blockchain/algorand'

const prisma = new PrismaClient()

interface DividendDistribution {
  id: string
  projectId: string
  assetId: number
  amount: number
  timestamp: Date
  status: 'pending' | 'processing' | 'completed' | 'failed'
  metadata: Record<string, any>
}

interface DividendPayment {
  holderAddress: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  txId?: string
}

export class DividendService {
  static async createDistribution(
    projectId: string,
    amount: number,
    metadata: Record<string, any> = {}
  ): Promise<DividendDistribution> {
    try {
      // Get project details
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      })

      if (!project || !project.assetId) {
        throw new Error('Project not found or has no associated token')
      }

      // Create distribution record
      const distribution = await prisma.dividendDistribution.create({
        data: {
          projectId,
          assetId: project.assetId,
          amount,
          status: 'pending',
          metadata,
          payments: {
            create: [] // Will be populated during processing
          }
        }
      })

      // Start processing in background
      this.processDistribution(distribution.id).catch(error => {
        console.error('Error processing distribution:', error)
      })

      return distribution
    } catch (error) {
      console.error('Error creating distribution:', error)
      throw error
    }
  }

  static async processDistribution(distributionId: string) {
    try {
      // Update status to processing
      await prisma.dividendDistribution.update({
        where: { id: distributionId },
        data: { status: 'processing' }
      })

      const distribution = await prisma.dividendDistribution.findUnique({
        where: { id: distributionId }
      })

      if (!distribution) {
        throw new Error('Distribution not found')
      }

      // Get token holders
      const holders = await TokenManagementService.getTokenHolders(distribution.assetId)
      const totalSupply = holders.reduce((sum, h) => sum + h.balance, 0)

      // Calculate payments for each holder
      const payments: DividendPayment[] = holders.map(holder => ({
        holderAddress: holder.address,
        amount: (holder.balance / totalSupply) * distribution.amount,
        status: 'pending'
      }))

      // Create payment records
      await prisma.dividendPayment.createMany({
        data: payments.map(payment => ({
          distributionId,
          holderAddress: payment.holderAddress,
          amount: payment.amount,
          status: 'pending'
        }))
      })

      // Process payments
      for (const payment of payments) {
        try {
          const result = await AlgorandService.transferAsset(
            distribution.projectId, // Project's escrow account
            payment.holderAddress,
            distribution.assetId,
            payment.amount
          )

          // Update payment status
          await prisma.dividendPayment.updateMany({
            where: {
              distributionId,
              holderAddress: payment.holderAddress
            },
            data: {
              status: 'completed',
              txId: result.txId
            }
          })
        } catch (error) {
          console.error(`Error processing payment to ${payment.holderAddress}:`, error)
          await prisma.dividendPayment.updateMany({
            where: {
              distributionId,
              holderAddress: payment.holderAddress
            },
            data: {
              status: 'failed',
              metadata: { error: error.message }
            }
          })
        }
      }

      // Update distribution status
      const failedPayments = await prisma.dividendPayment.count({
        where: {
          distributionId,
          status: 'failed'
        }
      })

      await prisma.dividendDistribution.update({
        where: { id: distributionId },
        data: {
          status: failedPayments === 0 ? 'completed' : 'failed',
          metadata: {
            ...distribution.metadata,
            failedPayments,
            completedAt: new Date()
          }
        }
      })
    } catch (error) {
      console.error('Error processing distribution:', error)
      await prisma.dividendDistribution.update({
        where: { id: distributionId },
        data: {
          status: 'failed',
          metadata: {
            error: error.message,
            failedAt: new Date()
          }
        }
      })
      throw error
    }
  }

  static async getDistribution(distributionId: string) {
    try {
      return await prisma.dividendDistribution.findUnique({
        where: { id: distributionId },
        include: {
          payments: true
        }
      })
    } catch (error) {
      console.error('Error getting distribution:', error)
      throw error
    }
  }

  static async getProjectDistributions(
    projectId: string,
    limit: number = 10,
    offset: number = 0
  ) {
    try {
      return await prisma.dividendDistribution.findMany({
        where: { projectId },
        include: {
          payments: true
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: limit,
        skip: offset
      })
    } catch (error) {
      console.error('Error getting project distributions:', error)
      throw error
    }
  }

  static async getHolderPayments(
    holderAddress: string,
    limit: number = 10,
    offset: number = 0
  ) {
    try {
      return await prisma.dividendPayment.findMany({
        where: { holderAddress },
        include: {
          distribution: true
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: limit,
        skip: offset
      })
    } catch (error) {
      console.error('Error getting holder payments:', error)
      throw error
    }
  }
} 