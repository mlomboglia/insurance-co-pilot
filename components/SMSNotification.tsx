'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Check, CheckCheck, Clock, X } from 'lucide-react'
import { notificationStore, SMSNotification } from '@/lib/notificationStore'
import { formatDate } from '@/lib/utils'

interface SMSNotificationProps {
  claimId?: string
  showAll?: boolean
  className?: string
}

export default function SMSNotificationComponent({ claimId, showAll = false, className = '' }: SMSNotificationProps) {
  const [notifications, setNotifications] = useState<SMSNotification[]>([])
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = notificationStore.addListener((newNotifications) => {
      if (showAll) {
        setNotifications(newNotifications)
      } else if (claimId) {
        setNotifications(newNotifications.filter(n => n.claimId === claimId))
      }
    })

    // Initialize with current data
    const currentNotifications = showAll
      ? notificationStore.getNotifications()
      : claimId
      ? notificationStore.getNotificationsForClaim(claimId)
      : []

    setNotifications(currentNotifications)

    return unsubscribe
  }, [claimId, showAll])

  const getStatusIcon = (status: SMSNotification['status']) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'delivered':
        return <Check className="h-4 w-4 text-green-500" />
      case 'read':
        return <CheckCheck className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: SMSNotification['status']) => {
    switch (status) {
      case 'sent':
        return 'border-blue-200 bg-blue-50'
      case 'delivered':
        return 'border-green-200 bg-green-50'
      case 'read':
        return 'border-green-300 bg-green-100'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getTypeIcon = (type: SMSNotification['type']) => {
    switch (type) {
      case 'claim-approved':
        return '✅'
      case 'service-dispatched':
        return '🚗'
      case 'arrival-update':
        return '⏰'
      case 'completion':
        return '🎉'
      default:
        return '📱'
    }
  }

  const getTypeLabel = (type: SMSNotification['type']) => {
    switch (type) {
      case 'claim-approved':
        return 'Claim Decision'
      case 'service-dispatched':
        return 'Service Dispatch'
      case 'arrival-update':
        return 'Arrival Update'
      case 'completion':
        return 'Service Complete'
      default:
        return 'Notification'
    }
  }

  if (notifications.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No SMS notifications yet</p>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {!showAll && (
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Customer Notifications</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {notifications.length} message{notifications.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {notifications.map((notification) => {
        const isExpanded = expandedNotification === notification.id
        const preview = notification.message.slice(0, 100) + (notification.message.length > 100 ? '...' : '')

        return (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 transition-all ${getStatusColor(notification.status)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTypeIcon(notification.type)}</span>
                <div>
                  <p className="font-medium text-sm">{getTypeLabel(notification.type)}</p>
                  <p className="text-xs text-gray-600">To: {notification.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(notification.status)}
                <span className="text-xs text-gray-500 capitalize">{notification.status}</span>
                <span className="text-xs text-gray-400">{formatDate(notification.timestamp)}</span>
              </div>
            </div>

            <div className="bg-white rounded p-3 border-l-4 border-l-blue-400">
              <div className="flex items-start justify-between">
                <div className="flex-1 font-mono text-sm">
                  {isExpanded ? (
                    <div className="whitespace-pre-wrap">{notification.message}</div>
                  ) : (
                    <div>{preview}</div>
                  )}
                </div>
                {notification.message.length > 100 && (
                  <button
                    onClick={() => setExpandedNotification(isExpanded ? null : notification.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>

            {showAll && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-600">Claim: {notification.claimId}</span>
                {notification.status === 'delivered' && (
                  <button
                    onClick={() => notificationStore.markAsRead(notification.id)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}