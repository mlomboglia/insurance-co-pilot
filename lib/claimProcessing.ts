import { ClaimData } from '@/types/conversation'
import {
  CoverageDecision,
  ServiceDispatch,
  ServiceProvider,
  PolicyInfo,
  ClaimRecord
} from '@/types/api'
import {
  mockDatabase,
  serviceTypeMapping,
  coverageFactors
} from './mockData'
import { generateClaimId } from './utils'

export class ClaimProcessor {

  /**
   * Analyze policy coverage for a claim
   */
  static analyzeCoverage(claimData: ClaimData): CoverageDecision {
    // Look up policy information
    const policy = claimData.policyNumber
      ? mockDatabase.policies[claimData.policyNumber]
      : this.findPolicyByName(claimData.customerName)

    if (!policy) {
      return {
        isApproved: false,
        coverageType: 'none',
        approvedServices: [],
        deductible: 0,
        maxCoverage: 0,
        reason: 'Policy not found or customer not verified',
        confidence: 0.1,
        policyDetails: this.createDefaultPolicy(claimData.customerName)
      }
    }

    // Check policy status
    if (policy.status !== 'active') {
      return {
        isApproved: false,
        coverageType: 'none',
        approvedServices: [],
        deductible: policy.deductible,
        maxCoverage: 0,
        reason: `Policy is ${policy.status}`,
        confidence: 0.9,
        policyDetails: policy
      }
    }

    // Check if roadside assistance is included
    if (!policy.roadsideAssistance.included) {
      return {
        isApproved: false,
        coverageType: 'none',
        approvedServices: [],
        deductible: policy.deductible,
        maxCoverage: 0,
        reason: 'Roadside assistance not included in policy',
        confidence: 0.9,
        policyDetails: policy
      }
    }

    // Check usage limits
    if (policy.roadsideAssistance.usedCalls >= policy.roadsideAssistance.maxCalls) {
      return {
        isApproved: false,
        coverageType: 'none',
        approvedServices: [],
        deductible: policy.deductible,
        maxCoverage: 0,
        reason: 'Annual roadside assistance limit exceeded',
        confidence: 0.9,
        policyDetails: policy
      }
    }

    // Determine service type
    const serviceType = serviceTypeMapping[claimData.issueType] || 'roadside-repair'

    // Check if service is covered
    const isCovered = policy.roadsideAssistance.coverageTypes.includes(serviceType) ||
                     policy.roadsideAssistance.coverageTypes.includes(claimData.issueType)

    if (!isCovered) {
      return {
        isApproved: false,
        coverageType: 'none',
        approvedServices: [],
        deductible: policy.deductible,
        maxCoverage: 0,
        reason: `Service type '${claimData.issueType}' not covered by policy`,
        confidence: 0.8,
        policyDetails: policy
      }
    }

    // Calculate coverage details
    const baseCost = coverageFactors.baseCosts[serviceType as keyof typeof coverageFactors.baseCosts] || 100
    const urgencyMultiplier = coverageFactors.urgencyMultiplier[claimData.urgencyLevel || 'medium']
    const timeMultiplier = this.getTimeOfDayMultiplier()

    const estimatedCost = Math.round(baseCost * urgencyMultiplier * timeMultiplier)
    const maxCoverage = serviceType === 'towing' ? 500 : 300

    // Determine coverage type
    let coverageType: 'full' | 'partial' | 'none' = 'full'
    if (estimatedCost > maxCoverage) {
      coverageType = 'partial'
    }

    return {
      isApproved: true,
      coverageType,
      approvedServices: [serviceType],
      deductible: policy.deductible,
      maxCoverage,
      reason: 'Claim approved under roadside assistance coverage',
      confidence: 0.95,
      policyDetails: policy
    }
  }

  /**
   * Dispatch appropriate service provider
   */
  static dispatchService(claimData: ClaimData, coverage: CoverageDecision): ServiceDispatch {
    if (!coverage.isApproved) {
      throw new Error('Cannot dispatch service for unapproved claim')
    }

    const serviceType = serviceTypeMapping[claimData.issueType] || 'roadside-repair'

    // Find best service provider
    const provider = this.findBestProvider(claimData, serviceType)

    if (!provider) {
      throw new Error('No service providers available for this location')
    }

    // Calculate costs
    const baseCost = coverageFactors.baseCosts[serviceType as keyof typeof coverageFactors.baseCosts] || 100
    const urgencyMultiplier = coverageFactors.urgencyMultiplier[claimData.urgencyLevel || 'medium']
    const timeMultiplier = this.getTimeOfDayMultiplier()
    const estimatedCost = Math.round(baseCost * urgencyMultiplier * timeMultiplier)

    // Calculate estimated arrival
    const baseResponseTime = provider.estimatedResponseTime
    const urgencyAdjustment = claimData.urgencyLevel === 'urgent' ? -5 :
                             claimData.urgencyLevel === 'high' ? -2 : 0
    const adjustedResponseTime = Math.max(10, baseResponseTime + urgencyAdjustment)

    const estimatedArrival = new Date(Date.now() + adjustedResponseTime * 60 * 1000)

    // Generate instructions
    const instructions = this.generateInstructions(claimData, serviceType)

    return {
      dispatchId: `DISP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`.toUpperCase(),
      serviceType: serviceType as any,
      provider,
      estimatedArrival,
      estimatedCost,
      instructions
    }
  }

  /**
   * Process complete claim submission
   */
  static processCompleteCllaim(claimData: ClaimData): ClaimRecord {
    const claimId = generateClaimId()

    // Analyze coverage
    const coverage = this.analyzeCoverage(claimData)

    // Dispatch service if approved
    let dispatch: ServiceDispatch | null = null
    let totalCost = 0

    if (coverage.isApproved) {
      dispatch = this.dispatchService(claimData, coverage)
      totalCost = Math.min(dispatch.estimatedCost, coverage.maxCoverage) + coverage.deductible
    }

    // Create claim record
    const claim: ClaimRecord = {
      id: claimId,
      claimData,
      status: coverage.isApproved ? 'approved' : 'denied',
      coverage,
      dispatch: dispatch!,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalCost
    }

    // Store in mock database
    mockDatabase.claims[claimId] = claim

    // Update policy usage if approved
    if (coverage.isApproved && claimData.policyNumber) {
      const policy = mockDatabase.policies[claimData.policyNumber]
      if (policy) {
        policy.roadsideAssistance.usedCalls += 1
      }
    }

    return claim
  }

  /**
   * Find policy by customer name (fallback when policy number not provided)
   */
  private static findPolicyByName(customerName: string): PolicyInfo | null {
    const policies = Object.values(mockDatabase.policies)
    const match = policies.find(policy =>
      policy.customerName.toLowerCase() === customerName.toLowerCase()
    )
    return match || null
  }

  /**
   * Create default policy for unknown customers
   */
  private static createDefaultPolicy(customerName: string): PolicyInfo {
    return {
      policyNumber: 'UNKNOWN',
      customerName,
      status: 'inactive',
      roadsideAssistance: {
        included: false,
        maxCalls: 0,
        usedCalls: 0,
        maxTowDistance: 0,
        coverageTypes: []
      },
      deductible: 0,
      expirationDate: new Date()
    }
  }

  /**
   * Find best service provider based on location and service type
   */
  private static findBestProvider(
    claimData: ClaimData,
    serviceType: string
  ): ServiceProvider | null {
    const providers = mockDatabase.serviceProviders.filter(provider =>
      provider.availableServices.includes(serviceType)
    )

    if (providers.length === 0) {
      return null
    }

    // Simple scoring algorithm (in real app, use geolocation)
    const scoredProviders = providers.map(provider => {
      let score = provider.rating * 20 // Rating factor

      // Response time factor (lower is better)
      score += (60 - provider.estimatedResponseTime)

      // Service type specialization
      if (provider.type === 'towing' && serviceType === 'towing') {
        score += 10
      }
      if (provider.type === 'roadside' && serviceType !== 'towing') {
        score += 10
      }

      return { provider, score }
    })

    // Sort by score and return best
    scoredProviders.sort((a, b) => b.score - a.score)
    return scoredProviders[0].provider
  }

  /**
   * Get time of day multiplier for pricing
   */
  private static getTimeOfDayMultiplier(): number {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()

    // Weekend check
    if (day === 0 || day === 6) {
      return coverageFactors.timeOfDayMultiplier.weekend
    }

    // Time of day check
    if (hour >= 8 && hour < 18) {
      return coverageFactors.timeOfDayMultiplier.day
    } else if (hour >= 18 && hour < 22) {
      return coverageFactors.timeOfDayMultiplier.evening
    } else {
      return coverageFactors.timeOfDayMultiplier.night
    }
  }

  /**
   * Generate service instructions
   */
  private static generateInstructions(claimData: ClaimData, serviceType: string): string[] {
    const baseInstructions = [
      `Service technician will contact you at ${claimData.phoneNumber || 'the number on file'}`,
      `Please remain with your vehicle if safe to do so`,
      `Have your driver's license and insurance information ready`
    ]

    const serviceInstructions = {
      'towing': [
        'Remove all personal items from the vehicle',
        'Take photos of any damage for insurance purposes',
        'Provide destination address to the tow truck driver'
      ],
      'tire-change': [
        'Move to a safe location away from traffic if possible',
        'Turn on hazard lights',
        'Stay in the vehicle if on a busy road'
      ],
      'battery-jump': [
        'Turn off all electrical accessories',
        'Locate your vehicle\'s battery',
        'Do not attempt to jumpstart the vehicle yourself'
      ],
      'lockout': [
        'Verify your identity with photo ID',
        'Confirm vehicle ownership or rental agreement',
        'Check all doors and windows before service arrival'
      ],
      'fuel-delivery': [
        'Move vehicle to safe location if possible',
        'Specify fuel type when technician calls',
        'Have payment ready for fuel cost'
      ],
      'roadside-repair': [
        'Describe symptoms to the technician',
        'Do not attempt repairs yourself',
        'Be prepared for potential towing if repair is not possible'
      ]
    }

    return [
      ...baseInstructions,
      ...(serviceInstructions[serviceType as keyof typeof serviceInstructions] || serviceInstructions['roadside-repair'])
    ]
  }
}