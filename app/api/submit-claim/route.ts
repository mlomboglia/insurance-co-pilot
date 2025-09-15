import { NextRequest, NextResponse } from 'next/server'
import { SubmitClaimRequest, SubmitClaimResponse } from '@/types/api'
import { ClaimProcessor } from '@/lib/claimProcessing'
import { ClaimData } from '@/types/conversation'

export async function POST(request: NextRequest) {
  try {
    const body: SubmitClaimRequest = await request.json()

    // Validate required fields
    const validationError = validateClaimData(body.claimData)
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      )
    }

    // Process the complete claim
    const claimRecord = ClaimProcessor.processCompleteCllaim(body.claimData)

    // Build response
    const response: SubmitClaimResponse = {
      success: true,
      claimId: claimRecord.id,
      coverage: claimRecord.coverage,
      dispatch: claimRecord.dispatch,
      estimatedArrival: claimRecord.dispatch?.estimatedArrival || new Date(),
      totalCost: claimRecord.totalCost
    }

    // Log claim submission for monitoring
    console.log('Claim submitted:', {
      claimId: claimRecord.id,
      customer: body.claimData.customerName,
      issueType: body.claimData.issueType,
      approved: claimRecord.coverage.isApproved,
      totalCost: claimRecord.totalCost
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error('Claim submission error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process claim submission',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

/**
 * Validate claim data completeness and format
 */
function validateClaimData(claimData: ClaimData): string | null {
  // Required fields validation
  if (!claimData.customerName || claimData.customerName.trim().length < 2) {
    return 'Customer name is required and must be at least 2 characters'
  }

  if (!claimData.location?.address || claimData.location.address.trim().length < 5) {
    return 'Complete address is required'
  }

  if (!claimData.location?.city || claimData.location.city.trim().length < 2) {
    return 'City is required'
  }

  if (!claimData.location?.state || claimData.location.state.length !== 2) {
    return 'Valid 2-character state code is required'
  }

  if (!claimData.vehicleInfo?.make || claimData.vehicleInfo.make.trim().length < 2) {
    return 'Vehicle make is required'
  }

  if (!claimData.vehicleInfo?.model || claimData.vehicleInfo.model.trim().length < 1) {
    return 'Vehicle model is required'
  }

  if (!claimData.vehicleInfo?.year || claimData.vehicleInfo.year < 1990 || claimData.vehicleInfo.year > new Date().getFullYear() + 1) {
    return 'Valid vehicle year is required'
  }

  if (!claimData.issueType) {
    return 'Issue type is required'
  }

  if (!claimData.issueDescription || claimData.issueDescription.trim().length < 10) {
    return 'Detailed issue description is required (at least 10 characters)'
  }

  // Format validations
  if (claimData.phoneNumber) {
    const phoneRegex = /^\+?[\d\s\-\(\)\.]{10,}$/
    if (!phoneRegex.test(claimData.phoneNumber)) {
      return 'Phone number format is invalid'
    }
  }

  if (claimData.policyNumber) {
    const policyRegex = /^[A-Z0-9]{6,}$/i
    if (!policyRegex.test(claimData.policyNumber)) {
      return 'Policy number format is invalid'
    }
  }

  if (claimData.location.zipCode) {
    const zipRegex = /^\d{5}(-\d{4})?$/
    if (!zipRegex.test(claimData.location.zipCode)) {
      return 'ZIP code format is invalid'
    }
  }

  if (claimData.vehicleInfo.licensePlate) {
    const plateRegex = /^[A-Z0-9\s\-]{2,10}$/i
    if (!plateRegex.test(claimData.vehicleInfo.licensePlate)) {
      return 'License plate format is invalid'
    }
  }

  // Business logic validations
  const validIssueTypes = [
    'flat-tire', 'dead-battery', 'lockout', 'towing',
    'fuel-delivery', 'engine-trouble', 'accident', 'other'
  ]
  if (!validIssueTypes.includes(claimData.issueType)) {
    return 'Invalid issue type specified'
  }

  const validUrgencyLevels = ['low', 'medium', 'high', 'urgent']
  if (claimData.urgencyLevel && !validUrgencyLevels.includes(claimData.urgencyLevel)) {
    return 'Invalid urgency level specified'
  }

  // Location safety checks
  if (claimData.urgencyLevel === 'urgent' && !claimData.phoneNumber) {
    return 'Phone number is required for urgent claims'
  }

  return null // No validation errors
}

/**
 * Additional claim processing utilities
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const claimId = url.searchParams.get('claimId')

  if (!claimId) {
    return NextResponse.json(
      { success: false, error: 'Claim ID is required' },
      { status: 400 }
    )
  }

  try {
    // This would typically fetch from a real database
    const mockDatabase = await import('@/lib/mockData')
    const claim = mockDatabase.mockDatabase.claims[claimId]

    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      claim
    })

  } catch (error) {
    console.error('Claim lookup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve claim' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}