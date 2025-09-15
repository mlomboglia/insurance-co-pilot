'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
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

  const { speak, isSpeaking, stop: stopSpeaking } = useSpeechSynthesis()

  const [conversationState, setConversationState] = useState<ConversationState>({
    step: 'greeting',
    collectedData: {},
    isComplete: false,
    messages: []
  })

  const [isProcessing, setIsProcessing] = useState(false)

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

  // Initial greeting
  useEffect(() => {
    if (conversationState.messages.length === 0) {
      const greeting = "Hello! I'm your AI assistant for roadside assistance. I'm here to help you file a claim quickly and efficiently. Please tell me about your situation, including your location and what's happening with your vehicle."
      addMessage('assistant', greeting)
      speak(greeting)
    }
  }, [addMessage, speak, conversationState.messages.length])

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
    await new Promise(resolve => setTimeout(resolve, 1500))

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

    // Add AI response
    addMessage('assistant', response)
    speak(response)

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
    const nameMatch = lowerInput.match(/my name is (\w+(?:\s+\w+)*)/i) ||
                     lowerInput.match(/i'm (\w+(?:\s+\w+)*)/i) ||
                     lowerInput.match(/this is (\w+(?:\s+\w+)*)/i)
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
    if (!newData.location) newData.location = {}

    const addressMatch = lowerInput.match(/(?:at|on|near)\s+(.+?)(?:\s+in\s+|\s*,\s*|$)/i)
    if (addressMatch && !newData.location.address) {
      newData.location.address = addressMatch[1]
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
    if (!newData.vehicleInfo) newData.vehicleInfo = {}

    const vehicleMatch = lowerInput.match(/(\d{4})\s+(\w+)\s+(\w+)/i)
    if (vehicleMatch && !newData.vehicleInfo.make) {
      newData.vehicleInfo.year = parseInt(vehicleMatch[1])
      newData.vehicleInfo.make = vehicleMatch[2]
      newData.vehicleInfo.model = vehicleMatch[3]
    }

    const colorMatch = lowerInput.match(/(?:color|colored)\s+(\w+)/i) ||
                      lowerInput.match(/(\w+)\s+(?:colored|car|vehicle)/i)
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

  // Determine next conversation step
  const determineNextStep = (data: Partial<ClaimData>, currentStep: ConversationStep): ConversationStep => {
    if (isClaimDataComplete(data)) return 'complete'

    if (!data.customerName) return 'collecting-name'
    if (!data.policyNumber) return 'collecting-policy'
    if (!data.location?.address) return 'collecting-location'
    if (!data.vehicleInfo?.make) return 'collecting-vehicle'
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
        return "Now I need information about your vehicle. Can you tell me the make, model, year, and color of your car?"

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
    setConversationState({
      step: 'greeting',
      collectedData: {},
      isComplete: false,
      messages: []
    })
    resetTranscript()
    stopSpeaking()
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column - Voice Interface */}
      <div className="space-y-6">
        <MicrophoneControls
          isListening={isListening}
          isSpeaking={isSpeaking}
          isSupported={isSupported}
          error={speechError}
          onStartListening={startListening}
          onStopListening={stopListening}
          onReset={resetConversation}
          onStopSpeaking={stopSpeaking}
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