'use client'

import { CheckCircle, AlertCircle, User, MapPin, Car, FileText } from 'lucide-react'
import { ClaimData } from '@/types/conversation'

interface ClaimDataDisplayProps {
  claimData: Partial<ClaimData>
  isComplete?: boolean
}

export default function ClaimDataDisplay({ claimData, isComplete = false }: ClaimDataDisplayProps) {
  const sections = [
    {
      title: 'Customer Information',
      icon: User,
      fields: [
        { label: 'Name', value: claimData.customerName, key: 'customerName' },
        { label: 'Policy Number', value: claimData.policyNumber, key: 'policyNumber' },
        { label: 'Phone Number', value: claimData.phoneNumber, key: 'phoneNumber' },
      ]
    },
    {
      title: 'Location',
      icon: MapPin,
      fields: [
        { label: 'Address', value: claimData.location?.address, key: 'location.address' },
        { label: 'City', value: claimData.location?.city, key: 'location.city' },
        { label: 'State', value: claimData.location?.state, key: 'location.state' },
        { label: 'ZIP Code', value: claimData.location?.zipCode, key: 'location.zipCode' },
      ]
    },
    {
      title: 'Vehicle Information',
      icon: Car,
      fields: [
        { label: 'Make', value: claimData.vehicleInfo?.make, key: 'vehicleInfo.make' },
        { label: 'Model', value: claimData.vehicleInfo?.model, key: 'vehicleInfo.model' },
        { label: 'Year', value: claimData.vehicleInfo?.year?.toString(), key: 'vehicleInfo.year' },
        { label: 'Color', value: claimData.vehicleInfo?.color, key: 'vehicleInfo.color' },
        { label: 'License Plate', value: claimData.vehicleInfo?.licensePlate, key: 'vehicleInfo.licensePlate' },
      ]
    },
    {
      title: 'Issue Details',
      icon: FileText,
      fields: [
        { label: 'Issue Type', value: claimData.issueType, key: 'issueType' },
        { label: 'Description', value: claimData.issueDescription, key: 'issueDescription' },
        { label: 'Urgency Level', value: claimData.urgencyLevel, key: 'urgencyLevel' },
      ]
    }
  ]

  const getFieldStatus = (value: string | undefined) => {
    if (value && value.trim()) {
      return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50' }
    }
    return { icon: AlertCircle, color: 'text-yellow-500', bgColor: 'bg-yellow-50' }
  }

  const getUrgencyColor = (urgency: string | undefined) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const completedFields = sections.reduce((total, section) => {
    return total + section.fields.filter(field => field.value && field.value.trim()).length
  }, 0)

  const totalFields = sections.reduce((total, section) => total + section.fields.length, 0)

  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Claim Information</h3>
          <span className="text-sm text-gray-600">
            {completedFields} of {totalFields} fields completed
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {completionPercentage}% complete
          {isComplete && (
            <span className="ml-2 inline-flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Ready to submit
            </span>
          )}
        </p>
      </div>

      {/* Data Sections */}
      <div className="grid gap-4">
        {sections.map((section) => {
          const SectionIcon = section.icon
          const sectionFields = section.fields.filter(field => field.value && field.value.trim())

          return (
            <div key={section.title} className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <SectionIcon className="h-5 w-5 text-primary-600" />
                  <h4 className="font-medium text-gray-900">{section.title}</h4>
                  <span className="text-xs text-gray-500">
                    ({sectionFields.length}/{section.fields.length})
                  </span>
                </div>
              </div>

              <div className="p-4">
                {sectionFields.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No information collected yet</p>
                ) : (
                  <div className="space-y-3">
                    {section.fields.map((field) => {
                      if (!field.value || !field.value.trim()) return null

                      const status = getFieldStatus(field.value)
                      const StatusIcon = status.icon

                      return (
                        <div key={field.key} className="flex items-start space-x-3">
                          <div className={`p-1 rounded-full ${status.bgColor}`}>
                            <StatusIcon className={`h-3 w-3 ${status.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <dt className="text-sm font-medium text-gray-600">{field.label}</dt>
                            <dd className="text-sm text-gray-900 mt-1">
                              {field.key === 'urgencyLevel' ? (
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(field.value)}`}>
                                  {field.value}
                                </span>
                              ) : (
                                field.value
                              )}
                            </dd>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Missing Information Alert */}
      {completionPercentage < 100 && completedFields > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">Additional Information Needed</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Continue the conversation to provide the remaining details for your claim.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}