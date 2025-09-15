'use client'

import { useRef, useEffect } from 'react'
import { User, Bot, AlertCircle, Clock } from 'lucide-react'
import { ConversationMessage } from '@/types/conversation'
import { formatDate } from '@/lib/utils'

interface ConversationDisplayProps {
  messages: ConversationMessage[]
  currentTranscript?: string
  isListening?: boolean
}

export default function ConversationDisplay({
  messages,
  currentTranscript,
  isListening
}: ConversationDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentTranscript])

  const getMessageIcon = (type: ConversationMessage['type']) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'assistant':
        return <Bot className="h-4 w-4" />
      case 'system':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getMessageStyle = (type: ConversationMessage['type']) => {
    switch (type) {
      case 'user':
        return 'bg-primary-600 text-white ml-auto'
      case 'assistant':
        return 'bg-white border border-gray-200'
      case 'system':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-800'
      default:
        return 'bg-gray-100'
    }
  }

  const getMessageAlignment = (type: ConversationMessage['type']) => {
    return type === 'user' ? 'justify-end' : 'justify-start'
  }

  return (
    <div className="flex flex-col h-96 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Start the conversation by clicking the microphone button</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${getMessageAlignment(message.type)}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${getMessageStyle(message.type)}`}>
              <div className="flex items-center space-x-2 mb-1">
                {getMessageIcon(message.type)}
                <span className="text-xs font-medium">
                  {message.type === 'user' ? 'You' :
                   message.type === 'assistant' ? 'AI Assistant' : 'System'}
                </span>
                <span className="text-xs opacity-70">
                  {formatDate(message.timestamp)}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
              {message.isProcessing && (
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="h-3 w-3 animate-spin" />
                  <span className="text-xs opacity-70">Processing...</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Current transcript while listening */}
        {isListening && currentTranscript && (
          <div className="flex justify-end">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary-100 border border-primary-200">
              <div className="flex items-center space-x-2 mb-1">
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">You</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              <p className="text-sm text-primary-800">{currentTranscript}</p>
              <p className="text-xs text-primary-600 mt-1">Listening...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
          {isListening && (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Listening</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}