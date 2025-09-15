export interface ConversationMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isProcessing?: boolean
}

export interface ConversationState {
  step: ConversationStep
  collectedData: Partial<ClaimData>
  isComplete: boolean
  messages: ConversationMessage[]
}

export type ConversationStep =
  | 'greeting'
  | 'collecting-name'
  | 'collecting-policy'
  | 'collecting-location'
  | 'collecting-vehicle'
  | 'collecting-issue'
  | 'confirming-details'
  | 'complete'

export interface ClaimData {
  customerName: string
  policyNumber: string
  phoneNumber: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  vehicleInfo: {
    make: string
    model: string
    year: number
    color: string
    licensePlate: string
  }
  issueType: string
  issueDescription: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent'
}

export interface VoiceAgentProps {
  onClaimSubmit?: (claimData: ClaimData) => void
  onConversationUpdate?: (state: ConversationState) => void
}