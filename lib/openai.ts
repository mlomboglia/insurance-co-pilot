import OpenAI from 'openai'
import { OpenAIMessage, OpenAIResponse } from '@/types/api'
import { ConversationStep, ClaimData } from '@/types/conversation'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function processVoiceWithOpenAI(
  userInput: string,
  conversationHistory: OpenAIMessage[],
  currentStep: ConversationStep,
  currentClaimData: Partial<ClaimData>
): Promise<OpenAIResponse> {
  try {
    const systemPrompt = createSystemPrompt(currentStep, currentClaimData)

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userInput }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 800,
      functions: [
        {
          name: 'extract_claim_information',
          description: 'Extract structured claim information from user input',
          parameters: {
            type: 'object',
            properties: {
              customerName: { type: 'string', description: 'Full name of the customer' },
              policyNumber: { type: 'string', description: 'Insurance policy number' },
              phoneNumber: { type: 'string', description: 'Customer phone number' },
              location: {
                type: 'object',
                properties: {
                  address: { type: 'string', description: 'Street address' },
                  city: { type: 'string', description: 'City name' },
                  state: { type: 'string', description: 'State abbreviation' },
                  zipCode: { type: 'string', description: 'ZIP code' }
                }
              },
              vehicleInfo: {
                type: 'object',
                properties: {
                  make: { type: 'string', description: 'Vehicle manufacturer' },
                  model: { type: 'string', description: 'Vehicle model' },
                  year: { type: 'number', description: 'Vehicle year' },
                  color: { type: 'string', description: 'Vehicle color' },
                  licensePlate: { type: 'string', description: 'License plate number' }
                }
              },
              issueType: {
                type: 'string',
                enum: ['flat-tire', 'dead-battery', 'lockout', 'towing', 'fuel-delivery', 'engine-trouble', 'accident', 'other'],
                description: 'Type of roadside assistance needed'
              },
              issueDescription: { type: 'string', description: 'Detailed description of the problem' },
              urgencyLevel: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'urgent'],
                description: 'Urgency level based on safety and location'
              },
              confidence: { type: 'number', description: 'Confidence score 0-1 for extracted information' },
              nextStep: {
                type: 'string',
                enum: ['greeting', 'collecting-name', 'collecting-policy', 'collecting-location', 'collecting-vehicle', 'collecting-issue', 'confirming-details', 'complete'],
                description: 'Next step in the conversation flow'
              }
            }
          }
        }
      ],
      function_call: { name: 'extract_claim_information' }
    })

    const choice = completion.choices[0]
    const functionCall = choice.message?.function_call

    if (!functionCall || !functionCall.arguments) {
      throw new Error('No function call returned from OpenAI')
    }

    let extractedData: any
    try {
      extractedData = JSON.parse(functionCall.arguments)
    } catch (error) {
      throw new Error('Failed to parse extracted data from OpenAI')
    }

    // Generate conversational response
    const responseCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: createResponseSystemPrompt(currentStep, extractedData) },
        { role: 'user', content: userInput }
      ],
      temperature: 0.8,
      max_tokens: 300
    })

    const aiResponse = responseCompletion.choices[0]?.message?.content || 'I understand. Let me help you with that.'

    // Merge extracted data with current claim data
    const updatedClaimData = mergeClaimData(currentClaimData, extractedData)

    return {
      response: aiResponse,
      extractedData: updatedClaimData,
      confidence: extractedData.confidence || 0.8,
      nextStep: extractedData.nextStep || determineNextStep(updatedClaimData)
    }

  } catch (error) {
    console.error('OpenAI processing error:', error)
    throw new Error('Failed to process voice input with AI')
  }
}

function createSystemPrompt(currentStep: ConversationStep, currentClaimData: Partial<ClaimData>): string {
  const basePrompt = `You are an AI assistant for an insurance company's roadside assistance service. Your role is to help customers file claims through natural conversation.

Current conversation step: ${currentStep}
Current claim data: ${JSON.stringify(currentClaimData, null, 2)}

Your goals:
1. Extract relevant information from user input
2. Determine what information is still needed
3. Provide helpful, empathetic responses
4. Guide the conversation toward completion

Guidelines:
- Be professional, empathetic, and efficient
- Ask for one piece of information at a time
- Confirm critical details for accuracy
- Prioritize safety for urgent situations
- Use natural, conversational language

Information needed for a complete claim:
- Customer name
- Policy number (optional but helpful)
- Phone number (optional but helpful)
- Exact location (address, city, state)
- Vehicle information (make, model, year, color, license plate)
- Issue type and detailed description
- Urgency level assessment

Extract information from the user's input and determine the next appropriate step in the conversation.`

  return basePrompt
}

function createResponseSystemPrompt(currentStep: ConversationStep, extractedData: any): string {
  return `You are a helpful AI assistant for roadside assistance. Generate a natural, empathetic response based on:

Current step: ${currentStep}
Extracted information: ${JSON.stringify(extractedData, null, 2)}

Guidelines:
- Be conversational and empathetic
- Acknowledge what the user provided
- Ask for the next needed piece of information if incomplete
- Confirm details if moving toward completion
- Show urgency awareness for safety situations
- Keep responses concise (2-3 sentences max)
- Don't repeat information already confirmed`
}

function mergeClaimData(current: Partial<ClaimData>, extracted: any): Partial<ClaimData> {
  const merged = { ...current }

  // Merge top-level fields
  if (extracted.customerName) merged.customerName = extracted.customerName
  if (extracted.policyNumber) merged.policyNumber = extracted.policyNumber
  if (extracted.phoneNumber) merged.phoneNumber = extracted.phoneNumber
  if (extracted.issueType) merged.issueType = extracted.issueType
  if (extracted.issueDescription) merged.issueDescription = extracted.issueDescription
  if (extracted.urgencyLevel) merged.urgencyLevel = extracted.urgencyLevel

  // Merge location data
  if (extracted.location) {
    if (!merged.location) merged.location = {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
    Object.assign(merged.location, extracted.location)
  }

  // Merge vehicle data
  if (extracted.vehicleInfo) {
    if (!merged.vehicleInfo) merged.vehicleInfo = {
      make: '',
      model: '',
      year: 0,
      color: '',
      licensePlate: ''
    }
    Object.assign(merged.vehicleInfo, extracted.vehicleInfo)
  }

  return merged
}

function determineNextStep(claimData: Partial<ClaimData>): ConversationStep {
  if (!claimData.customerName) return 'collecting-name'
  if (!claimData.location?.address) return 'collecting-location'
  if (!claimData.vehicleInfo?.make) return 'collecting-vehicle'
  if (!claimData.issueType || !claimData.issueDescription) return 'collecting-issue'

  // Check if we have enough for completion
  if (claimData.customerName &&
      claimData.location?.address &&
      claimData.vehicleInfo?.make &&
      claimData.issueType) {
    return 'complete'
  }

  return 'confirming-details'
}