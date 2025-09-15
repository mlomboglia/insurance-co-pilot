'use client'

import { Mic, MicOff, Square, RotateCcw, Volume2, VolumeX } from 'lucide-react'

interface MicrophoneControlsProps {
  isListening: boolean
  isSpeaking: boolean
  isSupported: boolean
  error: string | null
  onStartListening: () => void
  onStopListening: () => void
  onReset: () => void
  onStopSpeaking: () => void
}

export default function MicrophoneControls({
  isListening,
  isSpeaking,
  isSupported,
  error,
  onStartListening,
  onStopListening,
  onReset,
  onStopSpeaking
}: MicrophoneControlsProps) {
  const handleMainButtonClick = () => {
    if (isListening) {
      onStopListening()
    } else {
      onStartListening()
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
        <MicOff className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Speech Recognition Not Supported</h3>
        <p className="text-red-600">
          Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center">
        {/* Main Microphone Button */}
        <div className="relative mb-6">
          <button
            onClick={handleMainButtonClick}
            disabled={isSpeaking}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200'
                : isSpeaking
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200'
            }`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </button>

          {/* Listening Indicator */}
          {isListening && (
            <div className="absolute -inset-2 rounded-full border-2 border-red-300 animate-ping"></div>
          )}

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="absolute -inset-2 rounded-full border-2 border-blue-300 animate-pulse"></div>
          )}
        </div>

        {/* Status Text */}
        <div className="mb-4">
          {isListening && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Listening...</span>
            </div>
          )}

          {isSpeaking && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Volume2 className="h-4 w-4" />
              <span className="font-medium">AI Speaking...</span>
            </div>
          )}

          {!isListening && !isSpeaking && (
            <span className="text-gray-600">Click microphone to start</span>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-3">
          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <VolumeX className="h-4 w-4" />
              <span className="text-sm">Stop</span>
            </button>
          )}

          {/* Stop Listening Button */}
          {isListening && (
            <button
              onClick={onStopListening}
              className="flex items-center space-x-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <Square className="h-4 w-4" />
              <span className="text-sm">Stop</span>
            </button>
          )}

          {/* Reset Button */}
          <button
            onClick={onReset}
            disabled={isListening || isSpeaking}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-500">
          <p>
            {isListening
              ? 'Speak clearly about your roadside assistance needs'
              : 'Click the microphone and describe your situation'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <MicOff className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Tips */}
        {!isListening && !isSpeaking && !error && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-left text-sm text-blue-700">
              <p className="font-medium mb-1">Tips for best results:</p>
              <ul className="space-y-1 text-xs">
                <li>• Speak clearly and at normal volume</li>
                <li>• Mention your location and vehicle details</li>
                <li>• Describe the problem you're experiencing</li>
                <li>• Include your urgency level if needed</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}