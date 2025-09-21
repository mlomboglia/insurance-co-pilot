'use client'

import { ClaimData } from '@/types/conversation'
import { Claim, AIDecision, ServiceProvider, Priority } from '@/types'
import { generateClaimId } from '@/lib/utils'
import { notificationStore } from '@/lib/notificationStore'

// Mock service providers for AI recommendations
const mockServiceProviders: ServiceProvider[] = [
  {
    id: 'SP-001',
    name: 'QuickFix Towing',
    type: 'towing',
    rating: 4.8,
    estimatedArrival: 25,
    distance: 3.2,
    cost: 85
  },
  {
    id: 'SP-002',
    name: 'Metro Auto Repair',
    type: 'mechanic',
    rating: 4.6,
    estimatedArrival: 35,
    distance: 4.1,
    cost: 95
  },
  {
    id: 'SP-003',
    name: 'FastKey Locksmith',
    type: 'locksmith',
    rating: 4.9,
    estimatedArrival: 20,
    distance: 2.8,
    cost: 75
  },
  {
    id: 'SP-004',
    name: 'Emergency Fuel',
    type: 'fuel-delivery',
    rating: 4.7,
    estimatedArrival: 30,
    distance: 5.0,
    cost: 45
  }
]

// Mock policy data for coverage determination
const mockPolicyData: Record<string, any> = {
  'basic': {
    name: 'Basic Roadside',
    coverage: ['dead-battery', 'flat-tire'],
    monthlyLimit: 2,
    deductible: 25,
    maxCost: 100
  },
  'premium': {
    name: 'Premium Roadside',
    coverage: ['dead-battery', 'flat-tire', 'lockout', 'fuel-delivery', 'towing'],
    monthlyLimit: 4,
    deductible: 0,
    maxCost: 200
  },
  'premium-plus': {
    name: 'Premium Plus',
    coverage: ['dead-battery', 'flat-tire', 'lockout', 'fuel-delivery', 'towing', 'engine-trouble'],
    monthlyLimit: 6,
    deductible: 0,
    maxCost: 300
  }
}

class ClaimsStore {
  private claims: Claim[] = []
  private decisions: AIDecision[] = []
  private listeners: ((claims: Claim[], decisions: AIDecision[]) => void)[] = []

  addListener(callback: (claims: Claim[], decisions: AIDecision[]) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback([...this.claims], [...this.decisions]))
  }

  getClaims(): Claim[] {
    return [...this.claims]
  }

  getDecisions(): AIDecision[] {
    return [...this.decisions]
  }

  private determinePriority(claimData: ClaimData): Priority {
    switch (claimData.urgencyLevel) {
      case 'urgent': return 'urgent'
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'medium'
    }
  }

  private getServiceProviderForIssue(issueType: string): ServiceProvider | undefined {
    switch (issueType) {
      case 'towing':
      case 'accident':
        return mockServiceProviders.find(sp => sp.type === 'towing')
      case 'dead-battery':
      case 'engine-trouble':
        return mockServiceProviders.find(sp => sp.type === 'mechanic')
      case 'lockout':
        return mockServiceProviders.find(sp => sp.type === 'locksmith')
      case 'fuel-delivery':
        return mockServiceProviders.find(sp => sp.type === 'fuel-delivery')
      default:
        return mockServiceProviders.find(sp => sp.type === 'towing')
    }
  }

  private analyzeClaimCoverage(claimData: ClaimData): AIDecision {
    const claimId = generateClaimId()

    // Mock policy lookup - in real app would query database
    const assumedPolicyType = claimData.policyNumber?.toLowerCase().includes('premium') ?
      (claimData.policyNumber.toLowerCase().includes('plus') ? 'premium-plus' : 'premium') :
      'basic'

    const policy = mockPolicyData[assumedPolicyType]
    const serviceProvider = this.getServiceProviderForIssue(claimData.issueType)

    // Determine coverage
    const isCovered = policy.coverage.includes(claimData.issueType)
    const estimatedCost = serviceProvider?.cost || 75
    const withinLimit = estimatedCost <= policy.maxCost

    let decision: 'covered' | 'not-covered' | 'requires-review'
    let confidence: number
    let reasoning: string
    let factors = { positive: [], negative: [], neutral: [] }

    if (isCovered && withinLimit) {
      decision = 'covered'
      confidence = 0.92
      reasoning = `${claimData.issueType.replace('-', ' ')} is covered under ${policy.name} policy. Service provider available with reasonable cost.`
      factors.positive.push('Active policy', 'Covered service type', 'Within cost limits')
      if (policy.deductible === 0) factors.positive.push('No deductible')
      if (serviceProvider) factors.positive.push('Service provider available')
    } else if (isCovered && !withinLimit) {
      decision = 'requires-review'
      confidence = 0.68
      reasoning = `${claimData.issueType.replace('-', ' ')} is covered but estimated cost exceeds policy limit. Agent review required.`
      factors.positive.push('Active policy', 'Covered service type')
      factors.negative.push('Cost exceeds policy limit')
      factors.neutral.push('May require customer co-pay')
    } else {
      decision = 'not-covered'
      confidence = 0.88
      reasoning = `${claimData.issueType.replace('-', ' ')} is not covered under ${policy.name} policy. Consider policy upgrade.`
      factors.positive.push('Active policy')
      factors.negative.push('Service not covered in current plan')
      factors.neutral.push('Policy upgrade available')
    }

    // Additional factors
    if (claimData.urgencyLevel === 'urgent') {
      factors.positive.push('Emergency priority location')
      confidence += 0.05
    }

    // Create AI decision
    const aiDecision: AIDecision = {
      id: `DEC-${Date.now()}`,
      claimId: claimId,
      decision,
      confidence: Math.min(confidence, 0.99),
      reasoning,
      factors,
      recommendedAction: decision === 'covered'
        ? `Dispatch ${serviceProvider?.name || 'service provider'} immediately`
        : decision === 'requires-review'
        ? 'Agent review required - cost analysis needed'
        : 'Deny claim and offer policy upgrade options',
      serviceProvider,
      estimatedCost,
      timestamp: new Date()
    }

    return aiDecision
  }

  submitClaim(claimData: ClaimData): string {
    const claimId = generateClaimId()

    // Convert ClaimData to Claim format
    const claim: Claim = {
      id: claimId,
      customerId: `CUST-${Date.now()}`,
      customerName: claimData.customerName,
      customerPhone: claimData.phoneNumber || 'Not provided',
      vehicleInfo: claimData.vehicleInfo,
      location: claimData.location,
      issueType: claimData.issueType as any,
      description: claimData.issueDescription,
      status: 'pending',
      priority: this.determinePriority(claimData),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Generate AI coverage decision
    const aiDecision = this.analyzeClaimCoverage(claimData)
    aiDecision.claimId = claimId // Ensure IDs match

    // Add to store
    this.claims.unshift(claim) // Add to beginning for newest first
    this.decisions.unshift(aiDecision)

    // Notify listeners
    this.notifyListeners()

    console.log('Claim submitted:', claim)
    console.log('AI Decision:', aiDecision)

    return claimId
  }

  updateClaimStatus(claimId: string, status: Claim['status']) {
    const claimIndex = this.claims.findIndex(c => c.id === claimId)
    if (claimIndex >= 0) {
      this.claims[claimIndex] = {
        ...this.claims[claimIndex],
        status,
        updatedAt: new Date()
      }
      this.notifyListeners()
    }
  }

  approveDecision(claimId: string, agentId: string) {
    const claim = this.claims.find(c => c.id === claimId)
    const decision = this.decisions.find(d => d.claimId === claimId)

    if (claim && decision) {
      // Update claim status
      this.updateClaimStatus(claimId, 'assigned')

      // Send customer notification
      notificationStore.sendClaimApprovalNotification(
        claimId,
        claim.customerName,
        claim.customerPhone,
        decision,
        decision.serviceProvider
      )

      // If covered, also send service dispatch notification after a delay
      if (decision.decision === 'covered' && decision.serviceProvider) {
        setTimeout(() => {
          const driverInfo = {
            name: this.generateRandomDriverName(),
            phone: this.generateRandomPhone(),
            vehicle: this.generateRandomVehicleDescription()
          }

          notificationStore.sendServiceDispatchNotification(
            claimId,
            claim.customerName,
            claim.customerPhone,
            decision.serviceProvider!,
            driverInfo
          )

          // Send arrival update after another delay
          setTimeout(() => {
            const eta = Math.floor(decision.serviceProvider!.estimatedArrival * 0.7) // Realistic update
            notificationStore.sendArrivalNotification(
              claimId,
              claim.customerName,
              claim.customerPhone,
              eta
            )
          }, 3000)
        }, 5000)
      }

      console.log(`Claim ${claimId} approved by agent ${agentId}`)
    }
  }

  private generateRandomDriverName(): string {
    const names = ['Mike Johnson', 'Sarah Wilson', 'David Chen', 'Maria Garcia', 'James Smith', 'Lisa Brown']
    return names[Math.floor(Math.random() * names.length)]
  }

  private generateRandomPhone(): string {
    const area = Math.floor(Math.random() * 900) + 100
    const prefix = Math.floor(Math.random() * 900) + 100
    const suffix = Math.floor(Math.random() * 9000) + 1000
    return `(${area}) ${prefix}-${suffix}`
  }

  private generateRandomVehicleDescription(): string {
    const vehicles = ['White Ford Transit', 'Blue Chevy Express', 'Red Toyota Tundra', 'Black Ram ProMaster', 'Silver Ford F-150']
    return vehicles[Math.floor(Math.random() * vehicles.length)]
  }

  overrideDecision(claimId: string, agentId: string, newDecision: 'covered' | 'not-covered', reason: string) {
    const decision = this.decisions.find(d => d.claimId === claimId)
    if (decision) {
      decision.agentOverride = {
        agentId,
        agentName: `Agent ${agentId}`,
        action: 'modify',
        reason,
        timestamp: new Date(),
        newDecision
      }
      this.notifyListeners()
    }
  }
}

// Global store instance
export const claimsStore = new ClaimsStore()