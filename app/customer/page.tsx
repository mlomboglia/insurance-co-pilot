'use client'

import { useState } from 'react'
import { Phone, MapPin, CheckCircle, ExternalLink } from 'lucide-react'
import VoiceAgent from '@/components/VoiceAgent'
import { ClaimData, ConversationState } from '@/types/conversation'

export default function CustomerPage() {
  const [submittedClaim, setSubmittedClaim] = useState<ClaimData | null>(null)
  const [conversationState, setConversationState] = useState<ConversationState | null>(null)

  const handleClaimSubmit = (claimData: ClaimData) => {
    setSubmittedClaim(claimData)
    // Here you would typically send the data to your API
    console.log('Claim submitted:', claimData)
  }

  const handleConversationUpdate = (state: ConversationState) => {
    setConversationState(state)
  }

  const handleNewClaim = () => {
    setSubmittedClaim(null)
    setConversationState(null)
  }

  if (submittedClaim) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Claim Submitted Successfully!
            </h1>
            <p className="text-gray-600">
              Your roadside assistance request has been processed and help is on the way.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Claim Summary</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Customer:</span> {submittedClaim.customerName}
              </div>
              <div>
                <span className="font-medium">Location:</span> {submittedClaim.location.address}, {submittedClaim.location.city}
              </div>
              <div>
                <span className="font-medium">Vehicle:</span> {submittedClaim.vehicleInfo.year} {submittedClaim.vehicleInfo.make} {submittedClaim.vehicleInfo.model}
              </div>
              <div>
                <span className="font-medium">Issue:</span> {submittedClaim.issueType.replace('-', ' ')}
              </div>
              <div>
                <span className="font-medium">Urgency:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  submittedClaim.urgencyLevel === 'urgent' ? 'bg-red-100 text-red-800' :
                  submittedClaim.urgencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                  submittedClaim.urgencyLevel === 'medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {submittedClaim.urgencyLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <a
              href="/status"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-primary-600" />
              <div>
                <div className="font-medium">Track Your Claim</div>
                <div className="text-sm text-gray-600">View real-time updates</div>
              </div>
            </a>

            <button
              onClick={handleNewClaim}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Phone className="h-5 w-5 text-primary-600" />
              <div>
                <div className="font-medium">File Another Claim</div>
                <div className="text-sm text-gray-600">Start a new request</div>
              </div>
            </button>
          </div>

          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• A roadside technician has been dispatched to your location</li>
              <li>• You'll receive SMS updates about arrival time</li>
              <li>• Estimated arrival: 15-30 minutes</li>
              <li>• Emergency contact: 1-800-ROADSIDE</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-4">
          File a Roadside Assistance Claim
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Use our AI-powered voice assistant to quickly file your roadside assistance claim.
          Simply click the microphone and describe your situation naturally.
        </p>
      </div>

      <VoiceAgent
        onClaimSubmit={handleClaimSubmit}
        onConversationUpdate={handleConversationUpdate}
      />

      {/* Alternative Options */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Alternative Contact Methods</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <button className="flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-5 w-5 text-primary-600" />
              <div>
                <div className="font-medium">Call Emergency Line</div>
                <div className="text-sm text-gray-600">1-800-ROADSIDE</div>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <MapPin className="h-5 w-5 text-primary-600" />
              <div>
                <div className="font-medium">Share Your Location</div>
                <div className="text-sm text-gray-600">Help us find you faster</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}