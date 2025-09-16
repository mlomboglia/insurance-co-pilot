'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Car,
  Phone,
  MessageSquare,
  Truck,
  User,
  Shield,
  DollarSign,
  Star,
  Navigation,
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react'
import type {
  Claim,
  ClaimTimeline,
  Notification,
  ServiceDispatch,
  CoverageDecision
} from '@/types'
import { formatDate } from '@/lib/utils'
import { clsx } from 'clsx'

// Mock data for demonstration
const mockTimelines: Record<string, ClaimTimeline[]> = {
  'CLM-2024-001': [
    {
      id: 'TL-001',
      claimId: 'CLM-2024-001',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'received',
      title: 'Claim Received',
      description: 'Your roadside assistance claim has been received and is being processed.',
      actor: 'System'
    },
    {
      id: 'TL-002',
      claimId: 'CLM-2024-001',
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      status: 'processing',
      title: 'Coverage Verified',
      description: 'AI system verified policy coverage - tire repair service approved.',
      actor: 'AI Assistant'
    },
    {
      id: 'TL-003',
      claimId: 'CLM-2024-001',
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      status: 'approved',
      title: 'Claim Approved',
      description: 'Your claim has been approved. Service provider being assigned.',
      actor: 'Agent Smith'
    },
    {
      id: 'TL-004',
      claimId: 'CLM-2024-001',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'dispatched',
      title: 'Service Dispatched',
      description: 'QuickFix Towing has been assigned to your case.',
      actor: 'Dispatch System'
    },
    {
      id: 'TL-005',
      claimId: 'CLM-2024-001',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'en-route',
      title: 'Help On The Way',
      description: 'Mike Johnson is en route to your location. ETA: 8 minutes.',
      actor: 'Mike Johnson'
    }
  ]
}

const mockNotifications: Record<string, Notification[]> = {
  'CLM-2024-001': [
    {
      id: 'NOT-001',
      claimId: 'CLM-2024-001',
      type: 'sms',
      title: 'Claim Approved',
      message: 'Good news! Your roadside assistance claim CLM-2024-001 has been approved. Service is being dispatched.',
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      read: true,
      priority: 'medium'
    },
    {
      id: 'NOT-002',
      claimId: 'CLM-2024-001',
      type: 'sms',
      title: 'Service Dispatched',
      message: 'QuickFix Towing has been assigned to your case. Driver: Mike Johnson. ETA: 15 minutes.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      priority: 'high'
    },
    {
      id: 'NOT-003',
      claimId: 'CLM-2024-001',
      type: 'sms',
      title: 'Driver Update',
      message: 'Mike is 8 minutes away from your location at 123 Main St. His vehicle: Blue Ford Service Van (Plate: SRV-123)',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: 'urgent'
    }
  ]
}

const mockDispatch: Record<string, ServiceDispatch> = {
  'CLM-2024-001': {
    id: 'DISP-001',
    claimId: 'CLM-2024-001',
    provider: {
      id: 'SP-001',
      name: 'QuickFix Towing',
      type: 'towing',
      rating: 4.8,
      estimatedArrival: 8,
      distance: 2.1,
      cost: 85
    },
    status: 'en-route',
    estimatedArrival: new Date(Date.now() + 8 * 60 * 1000),
    contactInfo: {
      driverName: 'Mike Johnson',
      driverPhone: '(555) 789-0123',
      vehicleInfo: 'Blue Ford Service Van (Plate: SRV-123)'
    },
    location: {
      lat: 39.7817,
      lng: -89.6501
    },
    updates: [
      'Service provider assigned and notified',
      'Driver accepted the job',
      'Driver is en route to your location',
      'Current ETA: 8 minutes'
    ]
  }
}

const mockCoverageDecision: Record<string, CoverageDecision> = {
  'CLM-2024-001': {
    id: 'COV-001',
    claimId: 'CLM-2024-001',
    decision: 'approved',
    coverage: {
      deductible: 25,
      coverageLimit: 150,
      coveredAmount: 85,
      customerPays: 25
    },
    policyDetails: {
      policyNumber: 'POL-ABC123456',
      planType: 'Premium Roadside Plus',
      effectiveDate: new Date('2024-01-01'),
      expirationDate: new Date('2024-12-31')
    },
    reasoning: 'Tire repair service is covered under Premium Roadside Plus plan. Standard $25 deductible applies.',
    timestamp: new Date(Date.now() - 40 * 60 * 1000)
  }
}

export default function StatusPage() {
  const [claimId, setClaimId] = useState('')
  const [claim, setClaim] = useState<Claim | null>(null)
  const [timeline, setTimeline] = useState<ClaimTimeline[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dispatch, setDispatch] = useState<ServiceDispatch | null>(null)
  const [coverage, setCoverage] = useState<CoverageDecision | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'notifications' | 'contact'>('overview')

  // Simulate real-time updates
  useEffect(() => {
    if (claim && claim.status === 'in-progress') {
      const interval = setInterval(() => {
        // Simulate location updates for dispatch
        if (dispatch && dispatch.status === 'en-route') {
          const currentETA = Math.max(1, Math.floor(Math.random() * 10))
          setDispatch(prev => prev ? {
            ...prev,
            estimatedArrival: new Date(Date.now() + currentETA * 60 * 1000),
            provider: {
              ...prev.provider,
              estimatedArrival: currentETA
            }
          } : null)
        }
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [claim, dispatch])

  const searchClaim = async () => {
    if (!claimId.trim()) {
      setError('Please enter a claim ID')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      if (claimId.toUpperCase() === 'CLM-2024-001') {
        const mockClaim: Claim = {
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
          estimatedArrival: new Date(Date.now() + 8 * 60 * 1000)
        }

        setClaim(mockClaim)
        setTimeline(mockTimelines[claimId.toUpperCase()] || [])
        setNotifications(mockNotifications[claimId.toUpperCase()] || [])
        setDispatch(mockDispatch[claimId.toUpperCase()] || null)
        setCoverage(mockCoverageDecision[claimId.toUpperCase()] || null)
      } else {
        setError('Claim not found. Please check your claim ID and try again.')
        setClaim(null)
        setTimeline([])
        setNotifications([])
        setDispatch(null)
        setCoverage(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'in-progress':
        return <Truck className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getTimelineIcon = (status: string) => {
    const iconClass = "h-4 w-4"
    switch (status) {
      case 'received':
        return <MessageSquare className={`${iconClass} text-blue-500`} />
      case 'processing':
        return <Loader2 className={`${iconClass} text-yellow-500 animate-spin`} />
      case 'approved':
        return <CheckCircle2 className={`${iconClass} text-green-500`} />
      case 'dispatched':
        return <Truck className={`${iconClass} text-blue-600`} />
      case 'en-route':
        return <Navigation className={`${iconClass} text-purple-500`} />
      case 'arrived':
        return <MapPin className={`${iconClass} text-red-500`} />
      case 'completed':
        return <CheckCircle className={`${iconClass} text-green-600`} />
      default:
        return <Clock className={`${iconClass} text-gray-500`} />
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Track Your Claim
          </h1>
          <p className="text-gray-600">
            Real-time updates on your roadside assistance request
          </p>
        </div>

        {/* Search Section */}
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(claim.status)}
                  <div>
                    <h2 className="text-2xl font-semibold">{getStatusText(claim.status)}</h2>
                    <p className="text-gray-600">Claim ID: {claim.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(claim.createdAt)}</p>
                </div>
              </div>

              {/* ETA Banner */}
              {dispatch && claim.status === 'in-progress' && dispatch.status === 'en-route' && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 rounded-full p-2">
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">
                          {dispatch.contactInfo.driverName} is on the way!
                        </p>
                        <p className="text-blue-700 text-sm">
                          ETA: {dispatch.provider.estimatedArrival} minutes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <button className="btn-primary text-sm flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>Call Driver</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="card p-0">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { key: 'overview', label: 'Overview', icon: Car },
                    { key: 'timeline', label: 'Timeline', icon: Clock },
                    { key: 'notifications', label: 'Updates', icon: Bell },
                    { key: 'contact', label: 'Contact', icon: Phone }
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={clsx(
                          'flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors',
                          activeTab === tab.key
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Coverage Decision */}
                    {coverage && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Shield className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-green-900">Coverage Approved</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-green-700 mb-2">Coverage Details:</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Service Cost:</span>
                                <span>${coverage.coverage.coveredAmount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Deductible:</span>
                                <span>${coverage.coverage.deductible}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>You Pay:</span>
                                <span>${coverage.coverage.customerPays}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-green-700 mb-2">Policy Information:</p>
                            <div className="space-y-1 text-sm">
                              <p>Plan: {coverage.policyDetails.planType}</p>
                              <p>Policy: {coverage.policyDetails.policyNumber}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-green-700 mt-3">{coverage.reasoning}</p>
                      </div>
                    )}

                    {/* Service Provider Card */}
                    {dispatch && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Service Provider</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{dispatch.provider.rating}</span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">{dispatch.provider.name}</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {dispatch.provider.type} service
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Distance: {dispatch.provider.distance} miles
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{dispatch.contactInfo.driverName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{dispatch.contactInfo.driverPhone}</span>
                            </div>
                            {dispatch.contactInfo.vehicleInfo && (
                              <p className="text-sm text-gray-600 mt-1">
                                Vehicle: {dispatch.contactInfo.vehicleInfo}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Claim Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Car className="h-5 w-5 text-gray-500" />
                          <span className="font-semibold">Vehicle Information</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium">
                            {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model}
                          </p>
                          <p className="text-sm text-gray-600">
                            {claim.vehicleInfo.color} • License: {claim.vehicleInfo.licensePlate}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <span className="font-semibold">Service Location</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium">{claim.location.address}</p>
                          <p className="text-sm text-gray-600">
                            {claim.location.city}, {claim.location.state} {claim.location.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Issue Description</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 capitalize mb-1">
                          <strong>Type:</strong> {claim.issueType.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-gray-700">{claim.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Progress Timeline</h3>
                    <div className="relative">
                      {timeline.map((entry, index) => (
                        <div key={entry.id} className="flex items-start space-x-3 pb-6 relative">
                          {index !== timeline.length - 1 && (
                            <div className="absolute left-2 top-8 w-0.5 h-full bg-gray-200"></div>
                          )}
                          <div className="flex-shrink-0 w-4 h-4 mt-1">
                            {getTimelineIcon(entry.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{entry.title}</p>
                              <p className="text-sm text-gray-500">{formatDate(entry.timestamp)}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                            {entry.actor && (
                              <p className="text-xs text-gray-500 mt-1">by {entry.actor}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">SMS Notifications</h3>
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={clsx(
                            'border rounded-lg p-4 transition-colors',
                            notification.read
                              ? 'border-gray-200 bg-white'
                              : 'border-blue-200 bg-blue-50'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <MessageSquare className={clsx(
                                  'h-4 w-4',
                                  notification.read ? 'text-gray-500' : 'text-blue-600'
                                )} />
                                <span className={clsx(
                                  'font-medium text-sm',
                                  notification.read ? 'text-gray-700' : 'text-blue-900'
                                )}>
                                  {notification.title}
                                </span>
                                {!notification.read && (
                                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className={clsx(
                                'text-sm',
                                notification.read ? 'text-gray-600' : 'text-blue-800'
                              )}>
                                {notification.message}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {formatDate(notification.timestamp)}
                              </p>
                              <p className="text-xs text-gray-500 uppercase mt-1">
                                {notification.type}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

                    {dispatch && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3">Your Service Provider</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{dispatch.contactInfo.driverName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span>{dispatch.contactInfo.driverPhone}</span>
                          </div>
                          <button className="btn-primary mt-3 flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>Call Driver</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Customer Support</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Need help with your claim? Our support team is available 24/7.
                      </p>
                      <div className="flex space-x-3">
                        <button className="btn-primary flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>Call Support</span>
                        </button>
                        <button className="btn-secondary flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>Live Chat</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Emergency Contacts</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        If this is a life-threatening emergency, call 911 immediately.
                      </p>
                      <div className="space-y-2 text-sm">
                        <p><strong>24/7 Roadside:</strong> 1-800-ROADSIDE</p>
                        <p><strong>Claims Hotline:</strong> 1-800-CLAIMS-1</p>
                        <p><strong>Customer Service:</strong> 1-800-HELP-NOW</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Demo Hint */}
        {!claim && !error && (
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Demo Mode - Try It Out!
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              Experience the full tracking system with this sample claim:
            </p>
            <div className="flex items-center space-x-4">
              <code className="bg-blue-100 px-3 py-1 rounded text-blue-900 font-mono text-sm">
                CLM-2024-001
              </code>
              <button
                onClick={() => {
                  setClaimId('CLM-2024-001')
                  searchClaim()
                }}
                className="btn-primary text-sm"
              >
                Try Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}