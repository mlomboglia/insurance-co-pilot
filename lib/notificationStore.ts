'use client'

import { Notification } from '@/types'

export interface SMSNotification {
  id: string
  claimId: string
  customerName: string
  customerPhone: string
  message: string
  timestamp: Date
  type: 'claim-approved' | 'service-dispatched' | 'arrival-update' | 'completion'
  status: 'sent' | 'delivered' | 'read'
}

class NotificationStore {
  private notifications: SMSNotification[] = []
  private listeners: ((notifications: SMSNotification[]) => void)[] = []

  addListener(callback: (notifications: SMSNotification[]) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback([...this.notifications]))
  }

  getNotifications(): SMSNotification[] {
    return [...this.notifications]
  }

  getNotificationsForClaim(claimId: string): SMSNotification[] {
    return this.notifications.filter(n => n.claimId === claimId)
  }

  sendClaimApprovalNotification(
    claimId: string,
    customerName: string,
    customerPhone: string,
    decision: any,
    serviceProvider?: any
  ): string {
    const firstName = customerName.split(' ')[0]

    let message = `Hi ${firstName}! Great news about your roadside assistance claim ${claimId}:\n\n`

    if (decision.decision === 'covered') {
      message += `✅ APPROVED: Your ${decision.factors.positive.includes('No deductible') ? 'claim is fully covered' : 'claim is covered'}.\n\n`

      if (serviceProvider) {
        message += `🚗 SERVICE DISPATCHED:\n`
        message += `• Provider: ${serviceProvider.name}\n`
        message += `• ETA: ${serviceProvider.estimatedArrival} minutes\n`
        message += `• Cost: $${serviceProvider.cost}${decision.factors.positive.includes('No deductible') ? ' (no charge to you)' : ''}\n\n`
      }

      message += `📱 You'll receive updates via SMS as the technician approaches.\n\n`
      message += `Questions? Call 1-800-ROADSIDE\n`
      message += `Track status: insuranceapp.com/status`
    } else if (decision.decision === 'requires-review') {
      message += `⏳ UNDER REVIEW: Your claim requires additional review due to coverage limits.\n\n`
      message += `An agent will contact you within 30 minutes with options.\n\n`
      message += `Estimated timeline: 1-2 hours\n`
      message += `Questions? Call 1-800-ROADSIDE`
    } else {
      message += `❌ NOT COVERED: Unfortunately, this service isn't covered under your current plan.\n\n`
      message += `💡 OPTIONS:\n`
      message += `• Upgrade your plan for future coverage\n`
      message += `• Pay out-of-pocket (estimated $${decision.estimatedCost})\n\n`
      message += `Call 1-800-ROADSIDE to discuss options.`
    }

    const notification: SMSNotification = {
      id: `SMS-${Date.now()}`,
      claimId,
      customerName,
      customerPhone,
      message,
      timestamp: new Date(),
      type: 'claim-approved',
      status: 'sent'
    }

    this.notifications.unshift(notification)
    this.notifyListeners()

    // Simulate delivery after 2 seconds
    setTimeout(() => {
      notification.status = 'delivered'
      this.notifyListeners()
    }, 2000)

    console.log(`📱 SMS sent to ${customerPhone}:`, message)
    return notification.id
  }

  sendServiceDispatchNotification(
    claimId: string,
    customerName: string,
    customerPhone: string,
    serviceProvider: any,
    driverInfo: any
  ): string {
    const firstName = customerName.split(' ')[0]

    const message = `Hi ${firstName}! Your roadside technician is on the way:\n\n` +
      `🚗 ${serviceProvider.name}\n` +
      `👨‍🔧 Driver: ${driverInfo.name}\n` +
      `📞 Driver Phone: ${driverInfo.phone}\n` +
      `🚙 Vehicle: ${driverInfo.vehicle}\n\n` +
      `⏰ Current ETA: ${serviceProvider.estimatedArrival} minutes\n` +
      `📍 GPS tracking: bit.ly/track-${claimId.slice(-4)}\n\n` +
      `The driver will call when 5 minutes away.`

    const notification: SMSNotification = {
      id: `SMS-${Date.now()}`,
      claimId,
      customerName,
      customerPhone,
      message,
      timestamp: new Date(),
      type: 'service-dispatched',
      status: 'sent'
    }

    this.notifications.unshift(notification)
    this.notifyListeners()

    setTimeout(() => {
      notification.status = 'delivered'
      this.notifyListeners()
    }, 1500)

    return notification.id
  }

  sendArrivalNotification(
    claimId: string,
    customerName: string,
    customerPhone: string,
    estimatedMinutes: number
  ): string {
    const firstName = customerName.split(' ')[0]

    const message = `Hi ${firstName}! Your technician will arrive in ${estimatedMinutes} minutes.\n\n` +
      `🚗 Please have your vehicle keys ready\n` +
      `📱 Driver will call when they arrive\n` +
      `🆔 Claim ID: ${claimId}\n\n` +
      `Questions? Call 1-800-ROADSIDE`

    const notification: SMSNotification = {
      id: `SMS-${Date.now()}`,
      claimId,
      customerName,
      customerPhone,
      message,
      timestamp: new Date(),
      type: 'arrival-update',
      status: 'sent'
    }

    this.notifications.unshift(notification)
    this.notifyListeners()

    setTimeout(() => {
      notification.status = 'delivered'
      this.notifyListeners()
    }, 1000)

    return notification.id
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.status = 'read'
      this.notifyListeners()
    }
  }
}

// Global store instance
export const notificationStore = new NotificationStore()