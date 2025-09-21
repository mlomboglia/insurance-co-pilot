'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import ConversationDisplay from './ConversationDisplay'
import ClaimDataDisplay from './ClaimDataDisplay'
import MicrophoneControls from './MicrophoneControls'
import { ConversationMessage, ConversationState, ClaimData, ConversationStep } from '@/types/conversation'
import { generateClaimId } from '@/lib/utils'

interface VoiceAgentProps {
  onClaimSubmit?: (claimData: ClaimData) => void
  onConversationUpdate?: (state: ConversationState) => void
}

export default function VoiceAgent({ onClaimSubmit, onConversationUpdate }: VoiceAgentProps) {
  const {
    isListening,
    transcript,
    finalTranscript,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition()

  // Speech synthesis removed - text-only AI responses

  const [conversationState, setConversationState] = useState<ConversationState>({
    step: 'greeting',
    collectedData: {},
    isComplete: false,
    messages: []
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const hasGreeted = useRef(false)
  const processingTimeoutRef = useRef<NodeJS.Timeout>()

  // Add message to conversation
  const addMessage = useCallback((type: ConversationMessage['type'], content: string, isProcessing = false) => {
    const message: ConversationMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      isProcessing
    }

    setConversationState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }))

    return message.id
  }, [])

  // Initial greeting - run only once (silent, no auto-speak)
  useEffect(() => {
    if (!hasGreeted.current && conversationState.messages.length === 0) {
      const greeting = "Hello! I'm your AI assistant for roadside assistance. I'm here to help you file a claim quickly and efficiently. Please tell me about your situation, including your location and what's happening with your vehicle."
      addMessage('assistant', greeting)
      // Removed auto-speak on page load
      hasGreeted.current = true
    }
  }, [addMessage, conversationState.messages.length])

  // Process user speech when final transcript changes
  useEffect(() => {
    if (finalTranscript && !isProcessing) {
      processUserInput(finalTranscript)
      resetTranscript()
    }
  }, [finalTranscript, isProcessing])

  // Mock AI processing function
  const processUserInput = async (userInput: string) => {
    if (!userInput.trim()) return

    // Add user message
    addMessage('user', userInput)
    setIsProcessing(true)

    // Add processing message
    const processingId = addMessage('assistant', 'Let me process that information...', true)

    // Simulate AI processing delay
    await new Promise(resolve => {
      processingTimeoutRef.current = setTimeout(resolve, 800)
    })

    // Extract information from user input (mock AI processing)
    const extractedData = extractClaimInformation(userInput, conversationState.collectedData)
    const nextStep = determineNextStep(extractedData, conversationState.step)
    const response = generateResponse(extractedData, nextStep, userInput)

    // Update conversation state
    const newState: ConversationState = {
      step: nextStep,
      collectedData: extractedData,
      isComplete: nextStep === 'complete',
      messages: conversationState.messages.filter(m => m.id !== processingId)
    }

    setConversationState(newState)
    setIsProcessing(false)

    // Add AI response (text only)
    addMessage('assistant', response)

    // Notify parent components
    onConversationUpdate?.(newState)

    // Submit claim if complete
    if (nextStep === 'complete' && isClaimDataComplete(extractedData)) {
      onClaimSubmit?.(extractedData as ClaimData)
    }
  }

  // Mock AI information extraction
  const extractClaimInformation = (input: string, currentData: Partial<ClaimData>): Partial<ClaimData> => {
    const lowerInput = input.toLowerCase()
    const newData = { ...currentData }

    // Extract name
    const nameMatch = lowerInput.match(/my name is (\w+(?:\s+\w+){0,2})/i) ||
                     lowerInput.match(/i'm (\w+(?:\s+\w+){0,2})/i) ||
                     lowerInput.match(/this is (\w+(?:\s+\w+){0,2})(?:\s+and|$)/i)
    if (nameMatch && !newData.customerName) {
      newData.customerName = nameMatch[1].replace(/\b\w/g, l => l.toUpperCase())
    }

    // Extract policy number
    const policyMatch = lowerInput.match(/policy\s*(?:number|#)?\s*(\w+)/i)
    if (policyMatch && !newData.policyNumber) {
      newData.policyNumber = policyMatch[1].toUpperCase()
    }

    // Extract phone number
    const phoneMatch = lowerInput.match(/(?:phone|number|call)\s*(?:is|me)?\s*(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/i)
    if (phoneMatch && !newData.phoneNumber) {
      newData.phoneNumber = phoneMatch[1]
    }

    // Extract location information
    if (!newData.location) newData.location = {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }

    const addressMatch = lowerInput.match(/(?:i'm at|located at|at|on|near)\s+([^.!?]+?)(?:\s+in\s+|\s*,\s*|\s+and\s+my|\s+my\s+car|$)/i)
    if (addressMatch && !newData.location.address && !addressMatch[1].match(/car|vehicle|tire|battery|engine|road|highway|freeway/i)) {
      newData.location.address = addressMatch[1].trim()
    }

    const cityMatch = lowerInput.match(/in\s+([a-z\s]+?)(?:\s*,\s*[a-z]{2}|$)/i)
    if (cityMatch && !newData.location.city) {
      newData.location.city = cityMatch[1].trim()
    }

    const stateMatch = lowerInput.match(/([a-z]{2})\s*(?:\d{5}|$)/i)
    if (stateMatch && !newData.location.state) {
      newData.location.state = stateMatch[1].toUpperCase()
    }

    const zipMatch = lowerInput.match(/(\d{5})/i)
    if (zipMatch && !newData.location.zipCode) {
      newData.location.zipCode = zipMatch[1]
    }

    // Extract vehicle information
    if (!newData.vehicleInfo) newData.vehicleInfo = {
      make: '',
      model: '',
      year: 0,
      color: '',
      licensePlate: ''
    }

    // Try multiple vehicle patterns
    const vehicleMatch = lowerInput.match(/(\d{4})\s+(\w+)\s+(\w+)/i) ||          // "2020 blue toyota"
                        lowerInput.match(/(\d{4})\s+(\w+)/i) ||                  // "2020 toyota"
                        lowerInput.match(/(\w+)\s+(\w+)\s+(\d{4})/i)             // "blue toyota 2020"

    if (vehicleMatch && !newData.vehicleInfo.make) {
      if (vehicleMatch[0].match(/^\d{4}/)) {
        // Year first pattern
        newData.vehicleInfo.year = parseInt(vehicleMatch[1])
        newData.vehicleInfo.make = vehicleMatch[2]
        if (vehicleMatch[3] && !vehicleMatch[3].match(/\d{4}/)) {
          newData.vehicleInfo.model = vehicleMatch[3]
        }
      } else {
        // Make first pattern
        newData.vehicleInfo.make = vehicleMatch[1]
        newData.vehicleInfo.model = vehicleMatch[2]
        if (vehicleMatch[3] && vehicleMatch[3].match(/\d{4}/)) {
          newData.vehicleInfo.year = parseInt(vehicleMatch[3])
        }
      }
    }

    // Extract individual components if not found in combined pattern
    if (!newData.vehicleInfo.make) {
      const makeMatch = lowerInput.match(/(?:drive|driving|have)\s+(?:a\s+)?(\w+)/i) ||
                       lowerInput.match(/(toyota|honda|ford|chevrolet|nissan|bmw|audi|mercedes|volkswagen|hyundai|kia|mazda|subaru|jeep|dodge|chrysler|buick|cadillac|gmc|lincoln|acura|infiniti|lexus|volvo|jaguar|porsche|tesla)/i)
      if (makeMatch) {
        newData.vehicleInfo.make = makeMatch[1]
      }
    }

    if (!newData.vehicleInfo.model) {
      const modelMatch = lowerInput.match(/(?:camry|corolla|accord|civic|f-150|silverado|altima|sentra|focus|escape|explorer|mustang|prius|rav4|highlander|pilot|cr-v|x3|x5|a4|c-class|jetta|passat|elantra|sonata|optima|soul|cx-5|outback|forester|wrangler|charger|challenger|300|enclave|escalade|sierra|navigator|tlx|q50|es|rx|xc90|f-pace|911|model\s+[3sxy])/i)
      if (modelMatch) {
        newData.vehicleInfo.model = modelMatch[0]
      }
    }

    if (!newData.vehicleInfo.year) {
      const yearMatch = lowerInput.match(/(19|20)\d{2}/i)
      if (yearMatch) {
        const year = parseInt(yearMatch[0])
        if (year >= 1990 && year <= new Date().getFullYear() + 1) {
          newData.vehicleInfo.year = year
        }
      }
    }

    const colorMatch = lowerInput.match(/(?:color|colored)\s+(\w+)/i) ||
                      lowerInput.match(/(red|blue|black|white|silver|gray|grey|green|yellow|orange|purple|brown|tan|beige|gold|pink)\s+(?:colored|car|vehicle|\w+)/i)
    if (colorMatch && !newData.vehicleInfo.color) {
      newData.vehicleInfo.color = colorMatch[1]
    }

    const plateMatch = lowerInput.match(/(?:plate|license)\s*(?:number|#)?\s*(\w+)/i)
    if (plateMatch && !newData.vehicleInfo.licensePlate) {
      newData.vehicleInfo.licensePlate = plateMatch[1].toUpperCase()
    }

    // Extract issue information
    if (lowerInput.includes('flat tire') || lowerInput.includes('tire')) {
      newData.issueType = 'flat-tire'
    } else if (lowerInput.includes('battery') || lowerInput.includes("won't start")) {
      newData.issueType = 'dead-battery'
    } else if (lowerInput.includes('locked out') || lowerInput.includes('keys')) {
      newData.issueType = 'lockout'
    } else if (lowerInput.includes('tow') || lowerInput.includes('accident')) {
      newData.issueType = 'towing'
    } else if (lowerInput.includes('gas') || lowerInput.includes('fuel')) {
      newData.issueType = 'fuel-delivery'
    } else if (!newData.issueType) {
      newData.issueType = 'other'
    }

    // Set issue description if not set
    if (!newData.issueDescription) {
      newData.issueDescription = input
    }

    // Determine urgency
    if (lowerInput.includes('emergency') || lowerInput.includes('urgent') || lowerInput.includes('highway')) {
      newData.urgencyLevel = 'urgent'
    } else if (lowerInput.includes('soon') || lowerInput.includes('quickly')) {
      newData.urgencyLevel = 'high'
    } else if (!newData.urgencyLevel) {
      newData.urgencyLevel = 'medium'
    }

    return newData
  }

  // Check if vehicle info has enough data to proceed
  const hasMinimalVehicleInfo = (vehicleInfo?: any) => {
    if (!vehicleInfo) return false
    // Need at least make, or make + model, or make + year
    return vehicleInfo.make && (vehicleInfo.model || vehicleInfo.year > 0)
  }

  // Determine next conversation step
  const determineNextStep = (data: Partial<ClaimData>, currentStep: ConversationStep): ConversationStep => {
    if (isClaimDataComplete(data)) return 'complete'

    if (!data.customerName) return 'collecting-name'
    if (!data.policyNumber) return 'collecting-policy'
    if (!data.location?.address) return 'collecting-location'
    if (!hasMinimalVehicleInfo(data.vehicleInfo)) {
      // Only ask for vehicle info once per conversation unless we have nothing
      if (currentStep !== 'collecting-vehicle' || !data.vehicleInfo?.make) {
        return 'collecting-vehicle'
      }
    }
    if (!data.issueType || !data.issueDescription) return 'collecting-issue'

    return 'confirming-details'
  }

  // Generate AI response based on context
  const generateResponse = (data: Partial<ClaimData>, nextStep: ConversationStep, userInput: string): string => {
    switch (nextStep) {
      case 'collecting-name':
        return "Thank you for that information. I still need to get your name for the claim. What's your full name?"

      case 'collecting-policy':
        return `Thank you, ${data.customerName}. Now I need your insurance policy number. Can you provide that for me?`

      case 'collecting-location':
        return "I need to know your exact location for the roadside assistance. Can you tell me the street address where you're located?"

      case 'collecting-vehicle':
        const hasPartialVehicle = data.vehicleInfo?.make || data.vehicleInfo?.model || data.vehicleInfo?.year
        if (hasPartialVehicle) {
          const missingParts = []
          if (!data.vehicleInfo?.make) missingParts.push('make')
          if (!data.vehicleInfo?.model) missingParts.push('model')
          if (!data.vehicleInfo?.year) missingParts.push('year')
          return `Thanks! I have some vehicle information. Can you also tell me the ${missingParts.join(' and ')} of your vehicle?`
        }
        return "Now I need information about your vehicle. Can you tell me the make, model, and year? For example, '2020 Toyota Camry'."

      case 'collecting-issue':
        return "Can you describe the specific problem you're experiencing with your vehicle? This will help us send the right type of assistance."

      case 'confirming-details':
        return "Great! I have most of your information. Let me confirm a few details before we submit your claim. Is there anything you'd like to add or correct?"

      case 'complete':
        const claimId = generateClaimId()
        return `Perfect! I have all the information needed. Your roadside assistance claim has been created with ID ${claimId}. A technician will be dispatched to your location shortly. You'll receive updates via text message. Is there anything else I can help you with?`

      default:
        return "I understand. Can you provide any additional details that might help us assist you better?"
    }
  }

  // Check if claim data is complete
  const isClaimDataComplete = (data: Partial<ClaimData>): boolean => {
    return !!(
      data.customerName &&
      data.location?.address &&
      data.vehicleInfo?.make &&
      data.issueType &&
      data.issueDescription
    )
  }

  // Reset conversation
  const resetConversation = () => {
    // Clear processing timeout
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current)
    }

    setConversationState({
      step: 'greeting',
      collectedData: {},
      isComplete: false,
      messages: []
    })
    setIsProcessing(false)
    resetTranscript()
    hasGreeted.current = false
  }

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column - Voice Interface */}
      <div className="space-y-6">
        <MicrophoneControls
          isListening={isListening}
          isSupported={isSupported}
          error={speechError}
          onStartListening={startListening}
          onStopListening={stopListening}
          onReset={resetConversation}
        />

        <ConversationDisplay
          messages={conversationState.messages}
          currentTranscript={transcript}
          isListening={isListening}
        />
      </div>

      {/* Right Column - Claim Data */}
      <div>
        <ClaimDataDisplay
          claimData={conversationState.collectedData}
          isComplete={conversationState.isComplete}
        />
      </div>
    </div>
  )
}