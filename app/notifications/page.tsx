'use client'

import { MessageSquare, Bell } from 'lucide-react'
import SMSNotificationComponent from '@/components/SMSNotification'

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">
            SMS Notifications
          </h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          View all SMS notifications sent to customers about their roadside assistance claims.
          This simulates the customer's phone message inbox.
        </p>
      </div>

      {/* All Notifications */}
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">All Customer SMS Messages</h2>
          </div>

          <SMSNotificationComponent showAll={true} />
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 card bg-amber-50 border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Demo Instructions</h3>
          <div className="text-amber-800 text-sm space-y-2">
            <p>
              <strong>To see notifications in action:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Go to the <strong>Customer</strong> page and submit a claim using voice</li>
              <li>Navigate to the <strong>Agent Dashboard</strong> to see the new claim</li>
              <li>Click the <strong>"Approve"</strong> button on a claim</li>
              <li>Return to this page to see the SMS notifications that were sent</li>
              <li>The system will send multiple messages: approval, service dispatch, and arrival updates</li>
            </ol>
            <p className="mt-3">
              <strong>Note:</strong> This simulates real SMS messages that would be sent to the customer's phone.
              In a production system, these would integrate with Twilio or similar SMS services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}