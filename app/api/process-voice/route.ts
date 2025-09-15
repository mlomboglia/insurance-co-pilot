import { NextRequest, NextResponse } from 'next/server'
import { processVoiceWithOpenAI } from '@/lib/openai'
import { ProcessVoiceRequest, ProcessVoiceResponse, OpenAIMessage } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const body: ProcessVoiceRequest = await request.json()

    // Validate required fields
    if (!body.userInput) {
      return NextResponse.json(
        { success: false, error: 'User input is required' },
        { status: 400 }
      )
    }

    if (!body.userInput.trim()) {
      return NextResponse.json(
        { success: false, error: 'User input cannot be empty' },
        { status: 400 }
      )
    }

    // Convert conversation history to OpenAI format
    const openAIHistory: OpenAIMessage[] = body.conversationHistory
      .filter(msg => msg.type !== 'system')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

    // Process with OpenAI
    const openAIResult = await processVoiceWithOpenAI(
      body.userInput,
      openAIHistory,
      body.currentStep,
      body.currentClaimData
    )

    // Build response with extracted information details
    const extractedInfo = {
      customerName: openAIResult.extractedData.customerName,
      policyNumber: openAIResult.extractedData.policyNumber,
      phoneNumber: openAIResult.extractedData.phoneNumber,
      location: openAIResult.extractedData.location,
      vehicleInfo: openAIResult.extractedData.vehicleInfo,
      issueType: openAIResult.extractedData.issueType,
      issueDescription: openAIResult.extractedData.issueDescription,
      urgencyLevel: openAIResult.extractedData.urgencyLevel,
      confidence: openAIResult.confidence
    }

    // Determine if claim is complete
    const isComplete = isClaimDataComplete(openAIResult.extractedData)

    const response: ProcessVoiceResponse = {
      success: true,
      aiResponse: openAIResult.response,
      updatedClaimData: openAIResult.extractedData,
      nextStep: openAIResult.nextStep,
      extractedInfo,
      confidence: openAIResult.confidence,
      isComplete
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Voice processing error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process voice input',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

function isClaimDataComplete(claimData: any): boolean {
  return !!(
    claimData.customerName &&
    claimData.location?.address &&
    claimData.location?.city &&
    claimData.vehicleInfo?.make &&
    claimData.vehicleInfo?.model &&
    claimData.issueType &&
    claimData.issueDescription
  )
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}