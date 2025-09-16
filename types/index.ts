export interface Claim {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  vehicleInfo: VehicleInfo
  location: Location
  issueType: IssueType
  description: string
  status: ClaimStatus
  priority: Priority
  createdAt: Date
  updatedAt: Date
  assignedAgentId?: string
  estimatedArrival?: Date
  notes?: string[]
}

export interface VehicleInfo {
  make: string
  model: string
  year: number
  color: string
  licensePlate: string
  vin?: string
}

export interface Location {
  address: string
  city: string
  state: string
  zipCode: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export type IssueType =
  | 'flat-tire'
  | 'dead-battery'
  | 'lockout'
  | 'towing'
  | 'fuel-delivery'
  | 'engine-trouble'
  | 'accident'
  | 'other'

export type ClaimStatus =
  | 'pending'
  | 'assigned'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  status: AgentStatus
  activeClaims: string[]
  maxClaims: number
}

export type AgentStatus = 'online' | 'offline' | 'busy'

export interface VoiceSession {
  id: string
  claimId?: string
  isRecording: boolean
  transcript: string
  isProcessing: boolean
  error?: string
}

export interface AIResponse {
  message: string
  action?: 'collect-info' | 'confirm-details' | 'create-claim' | 'escalate'
  extractedData?: Partial<Claim>
  confidence: number
}

export interface AIDecision {
  id: string
  claimId: string
  decision: 'covered' | 'not-covered' | 'requires-review'
  confidence: number
  reasoning: string
  factors: {
    positive: string[]
    negative: string[]
    neutral: string[]
  }
  recommendedAction: string
  serviceProvider?: ServiceProvider
  estimatedCost?: number
  timestamp: Date
  agentOverride?: AgentOverride
}

export interface ServiceProvider {
  id: string
  name: string
  type: 'towing' | 'mechanic' | 'locksmith' | 'fuel-delivery'
  rating: number
  estimatedArrival: number
  distance: number
  cost: number
}

export interface AgentOverride {
  agentId: string
  agentName: string
  action: 'approve' | 'reject' | 'escalate' | 'modify'
  reason: string
  timestamp: Date
  newDecision?: 'covered' | 'not-covered'
}

export interface DecisionAuditEntry {
  id: string
  timestamp: Date
  actor: 'ai' | 'agent'
  action: string
  details: string
  confidence?: number
}

export interface ClaimTimeline {
  id: string
  claimId: string
  timestamp: Date
  status: 'received' | 'processing' | 'approved' | 'dispatched' | 'en-route' | 'arrived' | 'completed'
  title: string
  description: string
  actor?: string
  metadata?: Record<string, any>
}

export interface Notification {
  id: string
  claimId: string
  type: 'sms' | 'email' | 'push'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface ServiceDispatch {
  id: string
  claimId: string
  provider: ServiceProvider
  status: 'assigned' | 'accepted' | 'en-route' | 'arrived' | 'completed'
  estimatedArrival: Date
  actualArrival?: Date
  contactInfo: {
    driverName: string
    driverPhone: string
    vehicleInfo?: string
  }
  location?: {
    lat: number
    lng: number
  }
  updates: string[]
}

export interface CoverageDecision {
  id: string
  claimId: string
  decision: 'approved' | 'denied' | 'partial'
  coverage: {
    deductible: number
    coverageLimit: number
    coveredAmount: number
    customerPays: number
  }
  policyDetails: {
    policyNumber: string
    planType: string
    effectiveDate: Date
    expirationDate: Date
  }
  reasoning: string
  timestamp: Date
}