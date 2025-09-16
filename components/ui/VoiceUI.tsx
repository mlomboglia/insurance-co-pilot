'use client'

import { Mic, MicOff, Volume2, Square, Play } from 'lucide-react'
import { clsx } from 'clsx'

interface VoiceMicrophoneProps {
  isListening: boolean
  isProcessing: boolean
  isDisabled?: boolean
  onClick: () => void
  className?: string
}

export function VoiceMicrophone({
  isListening,
  isProcessing,
  isDisabled = false,
  onClick,
  className
}: VoiceMicrophoneProps) {
  return (
    <div className={clsx('flex flex-col items-center space-y-4', className)}>
      {/* Main Microphone Button */}
      <div className="relative">
        {/* Outer pulse rings - only when listening */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-blue-500/30 listening-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-blue-400/20 listening-pulse" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}

        {/* Processing ring - only when processing */}
        {isProcessing && (
          <div className="absolute -inset-2 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        )}

        {/* Main Button */}
        <button
          onClick={onClick}
          disabled={isDisabled || isProcessing}
          className={clsx(
            'relative w-20 h-20 rounded-full shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20',
            isListening
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform scale-110'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105',
            isDisabled || isProcessing
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          )}
        >
          <div className="absolute inset-0 rounded-full bg-white/10"></div>
          {isListening ? (
            <Square className="h-8 w-8 text-white mx-auto" />
          ) : (
            <Mic className="h-8 w-8 text-white mx-auto" />
          )}
        </button>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className={clsx(
          'text-sm font-semibold transition-colors',
          isListening ? 'text-red-600' : 'text-blue-600'
        )}>
          {isProcessing
            ? 'Processing...'
            : isListening
            ? 'Listening... (Tap to stop)'
            : 'Tap to start speaking'
          }
        </p>
      </div>
    </div>
  )
}

interface VoiceWaveformProps {
  isActive: boolean
  amplitude?: number
  bars?: number
  className?: string
}

export function VoiceWaveform({
  isActive,
  amplitude = 1,
  bars = 5,
  className
}: VoiceWaveformProps) {
  return (
    <div className={clsx('flex items-end justify-center space-x-1 h-12', className)}>
      {Array.from({ length: bars }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            'bg-gradient-to-t from-blue-500 to-blue-400 rounded-full transition-all duration-150',
            isActive ? 'speaking-bars' : 'opacity-30'
          )}
          style={{
            width: '4px',
            height: isActive ? `${10 + Math.random() * 30 * amplitude}px` : '10px',
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

interface SpeakingIndicatorProps {
  isVisible: boolean
  message?: string
}

export function SpeakingIndicator({ isVisible, message = 'AI is responding...' }: SpeakingIndicatorProps) {
  if (!isVisible) return null

  return (
    <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 slide-in-left">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full">
            <Volume2 className="h-5 w-5 text-white animate-pulse" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-900">{message}</p>
          <VoiceWaveform isActive={true} bars={8} className="mt-2" />
        </div>
      </div>
    </div>
  )
}

interface VoiceControlsProps {
  isListening: boolean
  isProcessing: boolean
  isSpeaking: boolean
  onStartListening: () => void
  onStopListening: () => void
  onReset?: () => void
}

export function VoiceControls({
  isListening,
  isProcessing,
  isSpeaking,
  onStartListening,
  onStopListening,
  onReset
}: VoiceControlsProps) {
  return (
    <div className="space-y-6">
      {/* Main Microphone */}
      <VoiceMicrophone
        isListening={isListening}
        isProcessing={isProcessing}
        onClick={isListening ? onStopListening : onStartListening}
      />

      {/* Speaking Indicator */}
      <SpeakingIndicator isVisible={isSpeaking} />

      {/* Additional Controls */}
      <div className="flex justify-center space-x-3">
        {onReset && (
          <button
            onClick={onReset}
            className="btn-secondary text-sm flex items-center space-x-2"
            disabled={isListening || isProcessing}
          >
            <Square className="h-4 w-4" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  )
}

interface AudioVisualizerProps {
  isActive: boolean
  type?: 'bars' | 'circle' | 'line'
  color?: 'blue' | 'green' | 'red'
}

export function AudioVisualizer({
  isActive,
  type = 'bars',
  color = 'blue'
}: AudioVisualizerProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-400',
    green: 'from-green-500 to-green-400',
    red: 'from-red-500 to-red-400'
  }

  if (type === 'bars') {
    return (
      <div className="flex items-end justify-center space-x-1 h-16">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              'rounded-full transition-all duration-200',
              `bg-gradient-to-t ${colorClasses[color]}`,
              isActive ? 'waveform' : 'opacity-30'
            )}
            style={{
              width: '6px',
              height: isActive ? `${15 + Math.random() * 35}px` : '15px',
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>
    )
  }

  if (type === 'circle') {
    return (
      <div className="relative w-32 h-32 mx-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              'absolute inset-0 rounded-full border-2 opacity-20',
              `border-${color}-500`,
              isActive ? 'listening-pulse' : ''
            )}
            style={{
              animationDelay: `${index * 0.5}s`,
              transform: `scale(${1 + index * 0.1})`
            }}
          />
        ))}
        <div className={clsx(
          'absolute inset-4 rounded-full',
          `bg-gradient-to-r ${colorClasses[color]}`,
          isActive ? 'pulse-animation' : ''
        )} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
        {isActive && (
          <div className={clsx(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-1000',
            `bg-gradient-to-r ${colorClasses[color]}`
          )}
          style={{ width: `${Math.random() * 100}%` }} />
        )}
      </div>
    </div>
  )
}