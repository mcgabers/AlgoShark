import { DatabaseService } from '@/services/database'
import { AlgorandService } from '@/services/blockchain/algorand'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Version {
  id: string
  contractId: string
  version: string
  bytecode: string
  sourceCode: string
  timestamp: Date
  status: 'active' | 'inactive' | 'deprecated'
  changes: string[]
  metadata: Record<string, any>
  createdBy: string
}

export class VersioningService {
  static async createVersion(
    contractId: string,
    sourceCode: string,
    bytecode: string,
    changes: string[],
    metadata: Record<string, any>,
    createdBy: string
  ): Promise<Version> {
    try {
      // Get the latest version number and increment it
      const latestVersion = await prisma.contractVersion.findFirst({
        where: { contractId },
        orderBy: { version: 'desc' },
      })

      const newVersion = latestVersion 
        ? this.incrementVersion(latestVersion.version)
        : '1.0.0'

      // Create new version record
      const version = await prisma.contractVersion.create({
        data: {
          contractId,
          version: newVersion,
          sourceCode,
          bytecode,
          changes,
          metadata,
          createdBy,
          status: 'inactive', // New versions start as inactive
        },
      })

      return version
    } catch (error) {
      console.error('Error creating version:', error)
      throw error
    }
  }

  static async activateVersion(versionId: string): Promise<Version> {
    try {
      // Start a transaction to ensure data consistency
      return await prisma.$transaction(async (tx) => {
        // Deactivate current active version
        await tx.contractVersion.updateMany({
          where: { 
            contractId: (await tx.contractVersion.findUnique({ where: { id: versionId } }))?.contractId,
            status: 'active',
          },
          data: { status: 'inactive' },
        })

        // Activate new version
        const newActiveVersion = await tx.contractVersion.update({
          where: { id: versionId },
          data: { status: 'active' },
        })

        return newActiveVersion
      })
    } catch (error) {
      console.error('Error activating version:', error)
      throw error
    }
  }

  static async rollbackVersion(contractId: string, targetVersionId: string): Promise<Version> {
    try {
      // Get target version details
      const targetVersion = await prisma.contractVersion.findUnique({
        where: { id: targetVersionId },
      })

      if (!targetVersion) {
        throw new Error('Target version not found')
      }

      // Create new version with rolled back code
      const rollbackVersion = await this.createVersion(
        contractId,
        targetVersion.sourceCode,
        targetVersion.bytecode,
        [`Rollback to version ${targetVersion.version}`],
        { 
          ...targetVersion.metadata,
          rolledBackFrom: targetVersion.version,
        },
        'SYSTEM'
      )

      // Activate rollback version
      await this.activateVersion(rollbackVersion.id)

      return rollbackVersion
    } catch (error) {
      console.error('Error rolling back version:', error)
      throw error
    }
  }

  static async getVersionHistory(contractId: string): Promise<Version[]> {
    try {
      const versions = await prisma.contractVersion.findMany({
        where: { contractId },
        orderBy: { timestamp: 'desc' },
      })

      return versions
    } catch (error) {
      console.error('Error getting version history:', error)
      throw error
    }
  }

  private static incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number)
    return `${major}.${minor}.${patch + 1}`
  }
} 