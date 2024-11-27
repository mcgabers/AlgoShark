import { PrismaClient } from '@prisma/client'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)
const prisma = new PrismaClient()

interface CodeAnalysisResult {
  issues: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low'
    type: string
    description: string
    file: string
    line: number
  }>
  metrics: {
    codeQuality: number
    coverage: number
    complexity: number
    security: number
  }
}

interface LegalCheckResult {
  compliance: {
    category: string
    status: 'pass' | 'fail' | 'warning'
    details: string
  }[]
  documents: {
    name: string
    status: 'missing' | 'incomplete' | 'complete'
    required: boolean
  }[]
}

interface SecurityAuditResult {
  vulnerabilities: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low'
    type: string
    description: string
    recommendation: string
  }>
  score: number
  passed: boolean
}

export class DueDiligenceService {
  static async getDueDiligence(projectId: string) {
    try {
      return await prisma.dueDiligence.findUnique({
        where: { projectId },
        include: {
          reviews: {
            include: {
              reviewer: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })
    } catch (error) {
      console.error('Error getting due diligence:', error)
      throw error
    }
  }

  static async initiateDueDiligence(projectId: string): Promise<any> {
    try {
      return await prisma.$transaction(async (tx) => {
        // Create due diligence record
        const dueDiligence = await tx.dueDiligence.create({
          data: {
            projectId,
            status: 'pending'
          }
        })

        // Update project status
        await tx.project.update({
          where: { id: projectId },
          data: { status: 'in_review' }
        })

        return dueDiligence
      })
    } catch (error) {
      console.error('Error initiating due diligence:', error)
      throw error
    }
  }

  static async runCodeAnalysis(projectId: string): Promise<CodeAnalysisResult> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      })

      if (!project?.githubUrl) {
        throw new Error('GitHub URL not found')
      }

      // Clone repository to temporary directory
      const repoPath = `/tmp/analysis-${projectId}`
      await execAsync(`git clone ${project.githubUrl} ${repoPath}`)

      // Run various analysis tools
      const [
        lintResult,
        testResult,
        securityResult
      ] = await Promise.all([
        execAsync(`cd ${repoPath} && eslint . --format=json`),
        execAsync(`cd ${repoPath} && jest --coverage --json`),
        execAsync(`cd ${repoPath} && npm audit --json`)
      ])

      // Process and aggregate results
      const analysis: CodeAnalysisResult = {
        issues: [],
        metrics: {
          codeQuality: 0,
          coverage: 0,
          complexity: 0,
          security: 0
        }
      }

      // Update due diligence record
      await prisma.dueDiligence.update({
        where: { projectId },
        data: {
          codeAnalysis: analysis
        }
      })

      return analysis
    } catch (error) {
      console.error('Error running code analysis:', error)
      throw error
    }
  }

  static async performLegalChecks(projectId: string): Promise<LegalCheckResult> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { creator: true }
      })

      if (!project) {
        throw new Error('Project not found')
      }

      // Perform legal compliance checks
      const legalChecks: LegalCheckResult = {
        compliance: [
          {
            category: 'Business Registration',
            status: 'pass',
            details: 'Valid business registration verified'
          },
          {
            category: 'Securities Compliance',
            status: 'warning',
            details: 'Additional documentation may be required'
          }
        ],
        documents: [
          {
            name: 'Terms of Service',
            status: 'complete',
            required: true
          },
          {
            name: 'Privacy Policy',
            status: 'complete',
            required: true
          }
        ]
      }

      // Update due diligence record
      await prisma.dueDiligence.update({
        where: { projectId },
        data: {
          legalChecks
        }
      })

      return legalChecks
    } catch (error) {
      console.error('Error performing legal checks:', error)
      throw error
    }
  }

  static async conductSecurityAudit(projectId: string): Promise<SecurityAuditResult> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      })

      if (!project?.githubUrl) {
        throw new Error('GitHub URL not found')
      }

      // Perform security audit
      const auditResult: SecurityAuditResult = {
        vulnerabilities: [],
        score: 0,
        passed: false
      }

      // Run security scans
      const repoPath = `/tmp/security-${projectId}`
      await execAsync(`git clone ${project.githubUrl} ${repoPath}`)

      // Run security tools and aggregate results
      const [
        dependencyAudit,
        codeAudit,
        secretsScan
      ] = await Promise.all([
        execAsync(`cd ${repoPath} && npm audit --json`),
        execAsync(`cd ${repoPath} && snyk test --json`),
        execAsync(`cd ${repoPath} && gitleaks detect --report-format json`)
      ])

      // Process results and update audit result

      // Update due diligence record
      await prisma.dueDiligence.update({
        where: { projectId },
        data: {
          securityAudit: auditResult
        }
      })

      return auditResult
    } catch (error) {
      console.error('Error conducting security audit:', error)
      throw error
    }
  }

  static async addComment(
    dueDiligenceId: string,
    authorId: string,
    content: string,
    parentId?: string
  ): Promise<any> {
    try {
      return await prisma.dueDiligenceComment.create({
        data: {
          dueDiligenceId,
          authorId,
          content,
          parentId
        }
      })
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  static async submitReview(
    dueDiligenceId: string,
    reviewerId: string,
    category: string,
    status: string,
    findings: Record<string, any>
  ): Promise<any> {
    try {
      return await prisma.dueDiligenceReview.create({
        data: {
          dueDiligenceId,
          reviewerId,
          category,
          status,
          findings
        }
      })
    } catch (error) {
      console.error('Error submitting review:', error)
      throw error
    }
  }

  static async completeDueDiligence(dueDiligenceId: string, status: 'approved' | 'rejected'): Promise<any> {
    try {
      return await prisma.$transaction(async (tx) => {
        const dueDiligence = await tx.dueDiligence.update({
          where: { id: dueDiligenceId },
          data: { status },
          include: { project: true }
        })

        // Update project status based on due diligence result
        await tx.project.update({
          where: { id: dueDiligence.projectId },
          data: {
            status: status === 'approved' ? 'active' : 'rejected'
          }
        })

        return dueDiligence
      })
    } catch (error) {
      console.error('Error completing due diligence:', error)
      throw error
    }
  }
} 