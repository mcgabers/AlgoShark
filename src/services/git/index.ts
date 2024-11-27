import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

export class GitService {
  private static workspaceRoot = process.cwd()

  static async init(): Promise<string> {
    try {
      const { stdout } = await execAsync('git init', { cwd: this.workspaceRoot })
      return stdout
    } catch (error) {
      console.error('Error initializing git:', error)
      throw error
    }
  }

  static async getStatus(): Promise<string> {
    try {
      const { stdout } = await execAsync('git status', { cwd: this.workspaceRoot })
      return stdout
    } catch (error) {
      console.error('Error getting git status:', error)
      throw error
    }
  }

  static async createBranch(branchName: string): Promise<string> {
    try {
      const { stdout } = await execAsync(`git checkout -b ${branchName}`, { cwd: this.workspaceRoot })
      return stdout
    } catch (error) {
      console.error('Error creating branch:', error)
      throw error
    }
  }

  static async switchBranch(branchName: string): Promise<string> {
    try {
      const { stdout } = await execAsync(`git checkout ${branchName}`, { cwd: this.workspaceRoot })
      return stdout
    } catch (error) {
      console.error('Error switching branch:', error)
      throw error
    }
  }

  static async commit(message: string): Promise<string> {
    try {
      // Stage all changes
      await execAsync('git add .', { cwd: this.workspaceRoot })
      
      // Create commit
      const { stdout } = await execAsync(`git commit -m "${message}"`, { cwd: this.workspaceRoot })
      return stdout
    } catch (error) {
      console.error('Error creating commit:', error)
      throw error
    }
  }

  static async getCommitHistory(): Promise<Array<{
    hash: string
    author: string
    date: string
    message: string
  }>> {
    try {
      const { stdout } = await execAsync(
        'git log --pretty=format:"%H|%an|%ad|%s"',
        { cwd: this.workspaceRoot }
      )

      return stdout.split('\n').map(line => {
        const [hash, author, date, message] = line.split('|')
        return { hash, author, date, message }
      })
    } catch (error) {
      console.error('Error getting commit history:', error)
      throw error
    }
  }

  static async revertToCommit(commitHash: string): Promise<string> {
    try {
      // Create a new branch for the revert
      const revertBranch = `revert-${commitHash.substring(0, 7)}`
      await this.createBranch(revertBranch)

      // Revert to the specified commit
      const { stdout } = await execAsync(`git reset --hard ${commitHash}`, { cwd: this.workspaceRoot })
      return stdout
    } catch (error) {
      console.error('Error reverting to commit:', error)
      throw error
    }
  }

  static async getBranches(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git branch', { cwd: this.workspaceRoot })
      return stdout
        .split('\n')
        .map(branch => branch.trim())
        .filter(branch => branch.length > 0)
        .map(branch => branch.replace('* ', ''))
    } catch (error) {
      console.error('Error getting branches:', error)
      throw error
    }
  }

  static async getDiff(fromCommit: string, toCommit: string): Promise<string> {
    try {
      const { stdout } = await execAsync(
        `git diff ${fromCommit} ${toCommit}`,
        { cwd: this.workspaceRoot }
      )
      return stdout
    } catch (error) {
      console.error('Error getting diff:', error)
      throw error
    }
  }

  static async getCurrentBranch(): Promise<string> {
    try {
      const { stdout } = await execAsync(
        'git rev-parse --abbrev-ref HEAD',
        { cwd: this.workspaceRoot }
      )
      return stdout.trim()
    } catch (error) {
      console.error('Error getting current branch:', error)
      throw error
    }
  }

  static async tag(version: string, message: string): Promise<string> {
    try {
      const { stdout } = await execAsync(
        `git tag -a ${version} -m "${message}"`,
        { cwd: this.workspaceRoot }
      )
      return stdout
    } catch (error) {
      console.error('Error creating tag:', error)
      throw error
    }
  }
} 