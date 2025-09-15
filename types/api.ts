import { ConversationMessage, ConversationStep, ClaimData } from './conversation'

// Voice Processing API Types
export interface ProcessVoiceRequest {
  userInput: string
  conversationHistory: ConversationMessage[]
  currentStep: ConversationStep
  currentClaimData: Partial<ClaimData>
}

export interface ProcessVoiceResponse {
  success: boolean
  aiResponse: string
  updatedClaimData: Partial<ClaimData>
  nextStep: ConversationStep
  extractedInfo: ExtractedInformation
  confidence: number
  isComplete: boolean
  error?: string
}

export interface ExtractedInformation {
  customerName?: string
  policyNumber?: string
  phoneNumber?: string
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    coordinates?: { lat: number; lng: number }
  }
  vehicleInfo?: {
    make?: string
    model?: string
    year?: number
    color?: string
    licensePlate?: string
  }
  issueType?: string
  issueDescription?: string
  urgencyLevel?: 'low' | 'medium' | 'high' | 'urgent'
  confidence: number
}

// Claim Submission API Types
export interface SubmitClaimRequest {
  claimData: ClaimData
  conversationHistory: ConversationMessage[]
}

export interface SubmitClaimResponse {
  success: boolean
  claimId: string
  coverage: CoverageDecision
  dispatch: ServiceDispatch
  estimatedArrival: Date
  totalCost: number
  error?: string
}

export interface CoverageDecision {
  isApproved: boolean
  coverageType: 'full' | 'partial' | 'none'
  approvedServices: string[]
  deductible: number
  maxCoverage: number
  reason: string
  confidence: number
  policyDetails: PolicyInfo
}

export interface ServiceDispatch {
  dispatchId: string
  serviceType: 'towing' | 'roadside-repair' | 'battery-jump' | 'tire-change' | 'lockout' | 'fuel-delivery'
  provider: ServiceProvider
  estimatedArrival: Date
  estimatedCost: number
  instructions: string[]
}

export interface PolicyInfo {
  policyNumber: string
  customerName: string
  status: 'active' | 'inactive' | 'suspended'
  roadsideAssistance: {
    included: boolean
    maxCalls: number
    usedCalls: number
    maxTowDistance: number
    coverageTypes: string[]
  }
  deductible: number
  expirationDate: Date
}

export interface ServiceProvider {
  id: string
  name: string
  type: 'towing' | 'roadside'
  phone: string
  location: {
    address: string
    city: string
    state: string
    coordinates: { lat: number; lng: number }
  }
  rating: number
  availableServices: string[]
  estimatedResponseTime: number
}

// OpenAI Integration Types
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenAIResponse {
  response: string
  extractedData: Partial<ClaimData>
  confidence: number
  nextStep: ConversationStep
}

// Database Mock Types
export interface MockDatabase {
  policies: { [policyNumber: string]: PolicyInfo }
  serviceProviders: ServiceProvider[]
  claims: { [claimId: string]: ClaimRecord }
}

export interface ClaimRecord {
  id: string
  claimData: ClaimData
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'denied'
  coverage: CoverageDecision
  dispatch: ServiceDispatch
  createdAt: Date
  updatedAt: Date
  totalCost: number
}