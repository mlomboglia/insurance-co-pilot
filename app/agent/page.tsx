'use client'

import { useState } from 'react'
import { Search, Filter, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import type { Claim, ClaimStatus } from '@/types'
import { formatDate } from '@/lib/utils'

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

export default function AgentPage() {
  const [claims] = useState<Claim[]>(mockClaims)
  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | 'all'>('all')

  const filteredClaims = selectedStatus === 'all'
    ? claims
    : claims.filter(claim => claim.status === selectedStatus)

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
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
        {filteredClaims.map((claim) => (
          <div key={claim.id} className="card">
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
                </div>
                <p className="text-gray-600">{claim.customerName} • {claim.customerPhone}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(claim.status)}
                <span className="text-sm text-gray-500">
                  {formatDate(claim.updatedAt)}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Vehicle</h4>
                <p className="text-gray-600">
                  {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model} ({claim.vehicleInfo.color})
                </p>
                <p className="text-sm text-gray-500">License: {claim.vehicleInfo.licensePlate}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                <p className="text-gray-600">
                  {claim.location.address}, {claim.location.city}, {claim.location.state} {claim.location.zipCode}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-1">Issue</h4>
              <p className="text-gray-600 capitalize">{claim.issueType.replace('-', ' ')}</p>
              <p className="text-sm text-gray-500 mt-1">{claim.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Created {formatDate(claim.createdAt)}
              </div>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm">View Details</button>
                {claim.status === 'pending' && (
                  <button className="btn-primary text-sm">Assign to Me</button>
                )}
                {claim.status === 'in-progress' && (
                  <button className="btn-primary text-sm">Update Status</button>
                )}
              </div>
            </div>
          </div>
        ))}
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