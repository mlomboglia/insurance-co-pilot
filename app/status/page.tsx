'use client'

import { useState } from 'react'
import { Search, Clock, CheckCircle, AlertCircle, MapPin, Car } from 'lucide-react'
import type { Claim } from '@/types'
import { formatDate } from '@/lib/utils'

export default function StatusPage() {
  const [claimId, setClaimId] = useState('')
  const [claim, setClaim] = useState<Claim | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const searchClaim = async () => {
    if (!claimId.trim()) {
      setError('Please enter a claim ID')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      // Mock claim data for demonstration
      if (claimId.toUpperCase() === 'CLM-2024-001') {
        setClaim({
          id: 'CLM-2024-001',
          customerId: 'CUST-001',
          customerName: 'John Smith',
          customerPhone: '(555) 123-4567',
          vehicleInfo: {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            color: 'Blue',
            licensePlate: 'ABC123'
          },
          location: {
            address: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701'
          },
          issueType: 'flat-tire',
          description: 'Front left tire is flat, need roadside assistance',
          status: 'in-progress',
          priority: 'medium',
          createdAt: new Date(Date.now() - 45 * 60 * 1000),
          updatedAt: new Date(Date.now() - 10 * 60 * 1000),
          assignedAgentId: 'AGENT-001',
          estimatedArrival: new Date(Date.now() + 15 * 60 * 1000),
          notes: [
            'Claim received and assigned to roadside technician',
            'Technician dispatched - ETA 15 minutes',
            'Customer contacted for location confirmation'
          ]
        })
      } else {
        setError('Claim not found. Please check your claim ID and try again.')
        setClaim(null)
      }
      setIsLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'in-progress':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Claim Received'
      case 'in-progress':
        return 'Help On The Way'
      case 'completed':
        return 'Service Complete'
      default:
        return 'Unknown Status'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check Your Claim Status
          </h1>
          <p className="text-gray-600">
            Enter your claim ID to track the progress of your roadside assistance request
          </p>
        </div>

        <div className="card mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter claim ID (e.g., CLM-2024-001)"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && searchClaim()}
              />
            </div>
            <button
              onClick={searchClaim}
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>{isLoading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>

        {claim && (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="card">
              <div className="flex items-center space-x-4 mb-4">
                {getStatusIcon(claim.status)}
                <div>
                  <h2 className="text-xl font-semibold">{getStatusText(claim.status)}</h2>
                  <p className="text-gray-600">Claim ID: {claim.id}</p>
                </div>
              </div>

              {claim.estimatedArrival && claim.status === 'in-progress' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Estimated Arrival: {formatDate(claim.estimatedArrival)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Claim Details */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Claim Details</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Vehicle Information</span>
                  </div>
                  <p className="text-gray-600">
                    {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    {claim.vehicleInfo.color} • License: {claim.vehicleInfo.licensePlate}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Service Location</span>
                  </div>
                  <p className="text-gray-600">
                    {claim.location.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {claim.location.city}, {claim.location.state} {claim.location.zipCode}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <span className="font-medium">Issue Type: </span>
                <span className="text-gray-600 capitalize">
                  {claim.issueType.replace('-', ' ')}
                </span>
              </div>

              <div className="mt-2">
                <span className="font-medium">Description: </span>
                <span className="text-gray-600">{claim.description}</span>
              </div>
            </div>

            {/* Progress Notes */}
            {claim.notes && claim.notes.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Progress Updates</h3>
                <div className="space-y-3">
                  {claim.notes.map((note, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <p className="text-gray-600">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="card bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have questions about your claim, contact our support team:
              </p>
              <div className="flex space-x-4">
                <button className="btn-primary">Call Support</button>
                <button className="btn-secondary">Live Chat</button>
              </div>
            </div>
          </div>
        )}

        {/* Sample Claim ID Hint */}
        {!claim && !error && (
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Demo Mode
            </h3>
            <p className="text-blue-700 text-sm">
              Try searching for claim ID: <code className="bg-blue-100 px-1 rounded">CLM-2024-001</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}