import { useEffect, useState } from 'react'

// Define feature flag types
export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage: number
  environments: ('development' | 'staging' | 'production')[]
}

// Feature flag definitions
export const FEATURE_FLAGS: { [key: string]: FeatureFlag } = {
  NEW_FINANCIALS_TAB: {
    id: 'new-financials-tab',
    name: 'New Financials Tab',
    description: 'Enhanced financials tab with improved metrics and visualizations',
    enabled: true,
    rolloutPercentage: 50, // 50% of users will see this feature
    environments: ['development', 'staging', 'production'],
  },
  ENHANCED_RISK_ANALYSIS: {
    id: 'enhanced-risk-analysis',
    name: 'Enhanced Risk Analysis',
    description: 'Advanced risk analysis with ML-powered insights',
    enabled: true,
    rolloutPercentage: 25, // 25% of users will see this feature
    environments: ['development', 'staging'],
  },
}

// Helper to check if a feature should be enabled for a user
function shouldEnableFeature(featureFlag: FeatureFlag, userId?: string): boolean {
  if (!featureFlag.enabled) return false
  
  // Always enable in development
  if (process.env.NODE_ENV === 'development') return true
  
  // Check environment restrictions
  if (!featureFlag.environments.includes(process.env.NODE_ENV as any)) return false
  
  // If no rollout percentage, feature is fully enabled
  if (featureFlag.rolloutPercentage === 100) return true
  
  // If no user ID, disable percentage-based rollout
  if (!userId) return false
  
  // Use user ID to consistently determine if user should see feature
  const hash = hashString(userId)
  return (hash % 100) < featureFlag.rolloutPercentage
}

// Simple string hash function
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// React hook for feature flags
export function useFeatureFlag(flagId: string, userId?: string): boolean {
  const [isEnabled, setIsEnabled] = useState(false)
  
  useEffect(() => {
    const flag = FEATURE_FLAGS[flagId]
    if (!flag) {
      console.warn(`Feature flag ${flagId} not found`)
      return
    }
    
    setIsEnabled(shouldEnableFeature(flag, userId))
  }, [flagId, userId])
  
  return isEnabled
}

// Function to check feature flag without React
export function isFeatureEnabled(flagId: string, userId?: string): boolean {
  const flag = FEATURE_FLAGS[flagId]
  if (!flag) {
    console.warn(`Feature flag ${flagId} not found`)
    return false
  }
  
  return shouldEnableFeature(flag, userId)
} 