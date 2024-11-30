import { ContractDeploymentService } from '../blockchain/contract-deployment';
import { KYCVerificationService, type VerificationStatus } from '../kyc/verification';
import { prisma } from '@/lib/prisma';
import algosdk from 'algosdk';

export interface ProjectConfig {
  name: string;
  description: string;
  githubUrl: string;
  tokenSymbol: string;
  initialSupply: number;
  decimals: number;
  vestingSchedule: {
    initialUnlock: number;
    cliffPeriod: number;
    vestingPeriod: number;
  };
  initialLiquidity: number;
  startingPrice: number;
}

export interface TeamMember {
  name: string;
  role: string;
  linkedIn: string;
  kycVerificationId?: string;
}

export type LaunchStatus =
  | 'draft'
  | 'kyc_approved'
  | 'contract_deployment_pending'
  | 'contract_deployed'
  | 'launch_preparation'
  | 'launching'
  | 'live'

export interface LaunchMetrics {
  price: number
  marketCap: number
  volume24h: number
  holders: number
  tvl: number
}

export class ProjectLaunchService {
  private constructor() {}

  static async createProject(
    creatorId: string,
    config: ProjectConfig,
    team: TeamMember[]
  ) {
    try {
      // Create project in database
      const project = await prisma.project.create({
        data: {
          name: config.name,
          description: config.description,
          githubUrl: config.githubUrl,
          tokenSymbol: config.tokenSymbol,
          initialSupply: config.initialSupply,
          decimals: config.decimals,
          vestingSchedule: config.vestingSchedule,
          initialLiquidity: config.initialLiquidity,
          startingPrice: config.startingPrice,
          status: 'draft',
          creatorId,
          team: {
            create: team.map(member => ({
              name: member.name,
              role: member.role,
              linkedIn: member.linkedIn,
            })),
          },
        },
      });

      return project;
    } catch (error) {
      console.error('Project creation failed:', error);
      throw new Error('Project creation failed: ' + error.message);
    }
  }

  static async submitForReview(projectId: string) {
    try {
      // Update project status
      const project = await prisma.project.update({
        where: { id: projectId },
        data: { status: 'submitted' },
        include: { team: true },
      });

      // Initiate KYC for team members
      const kycPromises = project.team.map(async (member) => {
        // Start KYC process for each team member
        const verification = await KYCVerificationService.submitVerification(
          member.id,
          {
            fullName: member.name,
            // Other KYC data would be collected from the team member
            documents: [],
          } as any // Type assertion needed as we don't have full KYC data here
        );

        // Update team member with verification ID
        await prisma.teamMember.update({
          where: { id: member.id },
          data: { kycVerificationId: verification.id },
        });
      });

      await Promise.all(kycPromises);

      return project;
    } catch (error) {
      console.error('Project submission failed:', error);
      throw new Error('Project submission failed: ' + error.message);
    }
  }

  static async checkKYCStatus(projectId: string): Promise<boolean> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { team: true },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Check KYC status for all team members
      const verificationPromises = project.team.map(async (member) => {
        if (!member.kycVerificationId) {
          return false;
        }

        const status = await KYCVerificationService.checkVerificationStatus(
          member.kycVerificationId
        );

        return status.status === 'approved';
      });

      const verificationResults = await Promise.all(verificationPromises);
      const allVerified = verificationResults.every(result => result);

      if (allVerified) {
        // Update project status
        await prisma.project.update({
          where: { id: projectId },
          data: { status: 'kyc_approved' },
        });
      }

      return allVerified;
    } catch (error) {
      console.error('KYC status check failed:', error);
      throw new Error('KYC status check failed: ' + error.message);
    }
  }

  static async deployContracts(
    projectId: string,
    network: 'mainnet' | 'testnet'
  ) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Update status to deployment pending
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'contract_deployment_pending' },
      });

      // Create creator account
      const creator = algosdk.generateAccount();

      // Deploy token and contracts
      const deployment = await ContractDeploymentService.deployToken(
        {
          name: project.name,
          symbol: project.tokenSymbol,
          decimals: project.decimals,
          totalSupply: project.initialSupply,
          initialLiquidity: project.initialLiquidity,
          startingPrice: project.startingPrice,
        },
        {
          schedule: 'linear',
          initialUnlock: project.vestingSchedule.initialUnlock,
          cliffPeriod: project.vestingSchedule.cliffPeriod,
          vestingPeriod: project.vestingSchedule.vestingPeriod,
        },
        creator,
        network
      );

      // Update project with contract details
      await prisma.project.update({
        where: { id: projectId },
        data: {
          status: 'contract_deployed',
          assetId: deployment.assetId,
          vestingContractId: deployment.vestingContractId,
          poolId: deployment.poolId,
        },
      });

      return deployment;
    } catch (error) {
      console.error('Contract deployment failed:', error);
      // Update project status to failed
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'failed' },
      });
      throw new Error('Contract deployment failed: ' + error.message);
    }
  }

  static async prepareLaunch(projectId: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Update status to launch preparation
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'launch_preparation' },
      });

      // Additional launch preparation steps could be added here
      // Such as: marketing materials, community announcements, etc.

      return project;
    } catch (error) {
      console.error('Launch preparation failed:', error);
      throw new Error('Launch preparation failed: ' + error.message);
    }
  }

  static async launch(projectId: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Update status to launching
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'launching' },
      });

      // Perform launch operations
      // Such as: enabling trading, starting vesting, etc.

      // Update status to live
      await prisma.project.update({
        where: { id: projectId },
        data: {
          status: 'live',
          launchedAt: new Date(),
        },
      });

      return project;
    } catch (error) {
      console.error('Project launch failed:', error);
      // Update status to failed
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'failed' },
      });
      throw new Error('Project launch failed: ' + error.message);
    }
  }

  static async getLaunchMetrics(projectId: string): Promise<LaunchMetrics> {
    // Mock metrics for development
    return {
      price: 1.25,
      marketCap: 1250000,
      volume24h: 50000,
      holders: 156,
      tvl: 750000
    }
  }
} 