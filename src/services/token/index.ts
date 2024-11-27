import { PrismaClient } from '@prisma/client'
import { AlgorandService } from '@/services/blockchain/algorand'

const prisma = new PrismaClient()

interface TokenTransaction {
  id: string
  type: 'purchase' | 'transfer' | 'sale'
  amount: number
  price: number
  fromAddress: string
  toAddress: string
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
  txId: string
}

interface TokenHolding {
  address: string
  balance: number
  lastUpdated: Date
}

export class TokenManagementService {
  static async createToken(
    projectId: string,
    supply: number,
    decimals: number = 6,
    unitName: string,
    assetName: string,
    metadata: Record<string, any>
  ) {
    try {
      // Create token on Algorand
      const tokenResult = await AlgorandService.createProjectToken(
        assetName,
        unitName,
        supply,
        decimals,
        metadata
      )

      // Update project with token details
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          assetId: tokenResult.assetId,
          tokenMetadata: {
            supply,
            decimals,
            unitName,
            assetName,
            ...metadata
          }
        }
      })

      return project
    } catch (error) {
      console.error('Error creating token:', error)
      throw error
    }
  }

  static async getTokenHolders(assetId: number): Promise<TokenHolding[]> {
    try {
      const holders = await AlgorandService.getAssetHolders(assetId)
      return holders.map(holder => ({
        address: holder.address,
        balance: holder.amount,
        lastUpdated: new Date()
      }))
    } catch (error) {
      console.error('Error getting token holders:', error)
      throw error
    }
  }

  static async getTokenTransactions(
    assetId: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<TokenTransaction[]> {
    try {
      const transactions = await AlgorandService.getAssetTransactions(assetId, limit, offset)
      return transactions.map(tx => ({
        id: tx.id,
        type: this.determineTransactionType(tx),
        amount: tx.amount,
        price: tx.price || 0,
        fromAddress: tx.sender,
        toAddress: tx.receiver,
        timestamp: new Date(tx.timestamp),
        status: tx.confirmedRound ? 'completed' : 'pending',
        txId: tx.id
      }))
    } catch (error) {
      console.error('Error getting token transactions:', error)
      throw error
    }
  }

  static async transferTokens(
    fromAddress: string,
    toAddress: string,
    assetId: number,
    amount: number
  ) {
    try {
      const result = await AlgorandService.transferAsset(
        fromAddress,
        toAddress,
        assetId,
        amount
      )

      // Record the transfer in our database
      await prisma.tokenTransaction.create({
        data: {
          type: 'transfer',
          amount,
          fromAddress,
          toAddress,
          assetId,
          status: 'completed',
          txId: result.txId
        }
      })

      return result
    } catch (error) {
      console.error('Error transferring tokens:', error)
      throw error
    }
  }

  static async getTokenMetrics(assetId: number) {
    try {
      const [holders, transactions] = await Promise.all([
        this.getTokenHolders(assetId),
        this.getTokenTransactions(assetId, 1000) // Get last 1000 transactions for metrics
      ])

      const totalHolders = holders.length
      const totalSupply = holders.reduce((sum, h) => sum + h.balance, 0)
      const circulatingSupply = totalSupply // Implement locked token tracking if needed

      // Calculate 24h volume
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const dailyTransactions = transactions.filter(tx => tx.timestamp > oneDayAgo)
      const dailyVolume = dailyTransactions.reduce((sum, tx) => sum + tx.amount, 0)

      return {
        totalHolders,
        totalSupply,
        circulatingSupply,
        dailyVolume,
        dailyTransactions: dailyTransactions.length
      }
    } catch (error) {
      console.error('Error getting token metrics:', error)
      throw error
    }
  }

  static async freezeTokens(assetId: number, address: string) {
    try {
      const result = await AlgorandService.freezeAsset(assetId, address)
      
      // Record freeze action
      await prisma.tokenAction.create({
        data: {
          type: 'freeze',
          assetId,
          targetAddress: address,
          status: 'completed',
          txId: result.txId
        }
      })

      return result
    } catch (error) {
      console.error('Error freezing tokens:', error)
      throw error
    }
  }

  static async unfreezeTokens(assetId: number, address: string) {
    try {
      const result = await AlgorandService.unfreezeAsset(assetId, address)
      
      // Record unfreeze action
      await prisma.tokenAction.create({
        data: {
          type: 'unfreeze',
          assetId,
          targetAddress: address,
          status: 'completed',
          txId: result.txId
        }
      })

      return result
    } catch (error) {
      console.error('Error unfreezing tokens:', error)
      throw error
    }
  }

  private static determineTransactionType(tx: any): 'purchase' | 'transfer' | 'sale' {
    // Implement logic to determine transaction type based on transaction data
    // This is a placeholder implementation
    return 'transfer'
  }
} 