'use client'

import { Loader2, Truck, Shield, Phone } from 'lucide-react'
import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={clsx(
      'animate-spin text-blue-600',
      sizeClasses[size],
      className
    )} />
  )
}

interface LoadingCardProps {
  title?: string
  message?: string
}

export function LoadingCard({ title = 'Loading...', message }: LoadingCardProps) {
  return (
    <div className="card text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full">
            <LoadingSpinner size="lg" className="text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {message && (
            <p className="text-sm text-slate-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface LoadingStateProps {
  type?: 'processing' | 'searching' | 'connecting'
  title?: string
  message?: string
}

export function LoadingState({ type = 'processing', title, message }: LoadingStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'processing':
        return <Shield className="h-8 w-8 text-white" />
      case 'searching':
        return <Truck className="h-8 w-8 text-white" />
      case 'connecting':
        return <Phone className="h-8 w-8 text-white" />
      default:
        return <Loader2 className="h-8 w-8 text-white animate-spin" />
    }
  }

  const getTitle = () => {
    if (title) return title
    switch (type) {
      case 'processing':
        return 'Processing Your Request'
      case 'searching':
        return 'Finding Service Provider'
      case 'connecting':
        return 'Connecting to Agent'
      default:
        return 'Please Wait'
    }
  }

  const getMessage = () => {
    if (message) return message
    switch (type) {
      case 'processing':
        return 'Our AI is analyzing your claim and checking coverage...'
      case 'searching':
        return 'We\'re locating the best service provider for your needs...'
      case 'connecting':
        return 'Connecting you with a qualified agent...'
      default:
        return 'This may take a moment...'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 rounded-full blur-lg opacity-30 pulse-animation"></div>

        {/* Middle ring */}
        <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-20 animate-spin" style={{ animationDuration: '3s' }}></div>

        {/* Inner circle with icon */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-full shadow-xl">
          {getIcon()}
        </div>
      </div>

      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl font-bold text-slate-900">{getTitle()}</h2>
        <p className="text-slate-600">{getMessage()}</p>
      </div>

      {/* Progress dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx(
      'animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg',
      className
    )} />
  )
}

export function CardSkeleton() {
  return (
    <div className="card space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  title?: string
  message?: string
}

export function LoadingOverlay({ isVisible, title, message }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
        <LoadingState title={title} message={message} />
      </div>
    </div>
  )
}