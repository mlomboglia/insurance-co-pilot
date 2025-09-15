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