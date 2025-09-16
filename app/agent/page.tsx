'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  MapPin,
  Phone,
  Car,
  DollarSign,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { Claim, ClaimStatus, AIDecision, ServiceProvider, DecisionAuditEntry } from '@/types'
import { formatDate } from '@/lib/utils'
import { clsx } from 'clsx'

const mockAIDecisions: AIDecision[] = [
  {
    id: 'DEC-001',
    claimId: 'CLM-2024-001',
    decision: 'covered',
    confidence: 0.92,
    reasoning: 'Standard roadside assistance coverage applies. Customer has active policy with tire repair benefits.',
    factors: {
      positive: ['Active policy', 'Covered service type', 'Valid location'],
      negative: [],
      neutral: ['Standard deductible applies']
    },
    recommendedAction: 'Dispatch roadside assistance immediately',
    serviceProvider: {
      id: 'SP-001',
      name: 'QuickFix Towing',
      type: 'towing',
      rating: 4.8,
      estimatedArrival: 25,
      distance: 3.2,
      cost: 85
    },
    estimatedCost: 85,
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 'DEC-002',
    claimId: 'CLM-2024-002',
    decision: 'requires-review',
    confidence: 0.67,
    reasoning: 'Battery jump service requested but customer has exceeded monthly limit for this service type.',
    factors: {
      positive: ['Active policy', 'Covered service type'],
      negative: ['Monthly service limit exceeded', 'Recent similar claims'],
      neutral: ['Standard location']
    },
    recommendedAction: 'Agent review required - service limit exceeded',
    estimatedCost: 75,
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  }
]

const mockClaims: Claim[] = [
  {
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
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'CLM-2024-002',
    customerId: 'CUST-002',
    customerName: 'Sarah Johnson',
    customerPhone: '(555) 987-6543',
    vehicleInfo: {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Red',
      licensePlate: 'XYZ789'
    },
    location: {
      address: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    issueType: 'dead-battery',
    description: 'Car won\'t start, battery appears to be dead',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    assignedAgentId: 'AGENT-001'
  }
]

const mockAuditTrail: Record<string, DecisionAuditEntry[]> = {
  'CLM-2024-001': [
    {
      id: 'AUDIT-001',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      actor: 'ai',
      action: 'Initial Assessment',
      details: 'AI analyzed claim and determined coverage eligibility',
      confidence: 0.92
    },
    {
      id: 'AUDIT-002',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      actor: 'ai',
      action: 'Service Provider Selection',
      details: 'Selected QuickFix Towing based on proximity and rating',
      confidence: 0.88
    }
  ],
  'CLM-2024-002': [
    {
      id: 'AUDIT-003',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      actor: 'ai',
      action: 'Initial Assessment',
      details: 'AI flagged potential service limit issue',
      confidence: 0.67
    },
    {
      id: 'AUDIT-004',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      actor: 'agent',
      action: 'Manual Review',
      details: 'Agent AGENT-001 assigned for manual review'
    }
  ]
}

export default function AgentPage() {
  const [claims] = useState<Claim[]>(mockClaims)
  const [decisions] = useState<AIDecision[]>(mockAIDecisions)
  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | 'all'>('all')
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null)
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null)

  const filteredClaims = selectedStatus === 'all'
    ? claims
    : claims.filter(claim => claim.status === selectedStatus)

  const getDecisionForClaim = (claimId: string) => {
    return decisions.find(decision => decision.claimId === claimId)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50'
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'covered':
        return 'bg-green-100 text-green-800'
      case 'not-covered':
        return 'bg-red-100 text-red-800'
      case 'requires-review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAgentAction = (claimId: string, action: 'approve' | 'override' | 'escalate') => {
    console.log(`Agent action: ${action} for claim ${claimId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor AI decisions and manage claim oversight</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search claims..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ClaimStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredClaims.map((claim) => {
          const decision = getDecisionForClaim(claim.id)
          const isExpanded = expandedClaim === claim.id
          const auditEntries = mockAuditTrail[claim.id] || []

          return (
            <div key={claim.id} className="card border-l-4 border-l-primary-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{claim.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(claim.priority)}`}>
                      {claim.priority} priority
                    </span>
                    {decision && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDecisionColor(decision.decision)}`}>
                        {decision.decision.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{claim.customerName}</span>
                    </span>
                    <span>{claim.customerPhone}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(claim.status)}
                  <span className="text-sm text-gray-500">
                    {formatDate(claim.updatedAt)}
                  </span>
                </div>
              </div>

              {decision && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>AI Coverage Decision</span>
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(decision.confidence)}`}>
                      {Math.round(decision.confidence * 100)}% confidence
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{decision.reasoning}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Decision Factors</h5>
                      {decision.factors.positive.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-green-600 font-medium">Positive</p>
                          {decision.factors.positive.map((factor, idx) => (
                            <p key={idx} className="text-xs text-gray-600 flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span>{factor}</span>
                            </p>
                          ))}
                        </div>
                      )}
                      {decision.factors.negative.length > 0 && (
                        <div>
                          <p className="text-xs text-red-600 font-medium">Concerns</p>
                          {decision.factors.negative.map((factor, idx) => (
                            <p key={idx} className="text-xs text-gray-600 flex items-center space-x-1">
                              <TrendingDown className="h-3 w-3 text-red-500" />
                              <span>{factor}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {decision.serviceProvider && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Recommended Service</h5>
                        <div className="bg-white rounded p-2 border">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{decision.serviceProvider.name}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs">{decision.serviceProvider.rating}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>ETA: {decision.serviceProvider.estimatedArrival} mins</p>
                            <p>Distance: {decision.serviceProvider.distance} miles</p>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${decision.serviceProvider.cost}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      <strong>Recommended Action:</strong> {decision.recommendedAction}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAgentAction(claim.id, 'approve')}
                        className="btn-primary text-xs flex items-center space-x-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleAgentAction(claim.id, 'override')}
                        className="btn-secondary text-xs flex items-center space-x-1"
                      >
                        <XCircle className="h-3 w-3" />
                        <span>Override</span>
                      </button>
                      <button
                        onClick={() => handleAgentAction(claim.id, 'escalate')}
                        className="btn-outline text-xs flex items-center space-x-1"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span>Escalate</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center space-x-1">
                    <Car className="h-4 w-4" />
                    <span>Vehicle</span>
                  </h4>
                  <p className="text-gray-600">
                    {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model} ({claim.vehicleInfo.color})
                  </p>
                  <p className="text-sm text-gray-500">License: {claim.vehicleInfo.licensePlate}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </h4>
                  <p className="text-gray-600">
                    {claim.location.address}, {claim.location.city}, {claim.location.state} {claim.location.zipCode}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">Issue Description</h4>
                <p className="text-gray-600 capitalize">{claim.issueType.replace('-', ' ')}</p>
                <p className="text-sm text-gray-500 mt-1">{claim.description}</p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created {formatDate(claim.createdAt)}</span>
                  {auditEntries.length > 0 && (
                    <span>{auditEntries.length} audit entries</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedClaim(isExpanded ? null : claim.id)}
                    className="btn-outline text-xs flex items-center space-x-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Audit Trail</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {claim.status === 'pending' && (
                    <button className="btn-primary text-sm">Assign to Me</button>
                  )}
                  {claim.status === 'in-progress' && (
                    <button className="btn-primary text-sm">Update Status</button>
                  )}
                </div>
              </div>

              {isExpanded && auditEntries.length > 0 && (
                <div className="mt-4 border-t pt-4 bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Decision Audit Trail</h5>
                  <div className="space-y-3">
                    {auditEntries.map((entry) => (
                      <div key={entry.id} className="flex items-start space-x-3">
                        <div className={clsx(
                          'w-2 h-2 rounded-full mt-2',
                          entry.actor === 'ai' ? 'bg-blue-500' : 'bg-green-500'
                        )} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{entry.action}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span className={clsx(
                                'px-2 py-1 rounded',
                                entry.actor === 'ai' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              )}>
                                {entry.actor.toUpperCase()}
                              </span>
                              {entry.confidence && (
                                <span className={getConfidenceColor(entry.confidence)}>
                                  {Math.round(entry.confidence * 100)}%
                                </span>
                              )}
                              <span>{formatDate(entry.timestamp)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredClaims.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}