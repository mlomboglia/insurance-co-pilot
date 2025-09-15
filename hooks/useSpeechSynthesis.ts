'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void
  isSpeaking: boolean
  stop: () => void
  isSupported: boolean
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (isSupported) {
      synthRef.current = window.speechSynthesis
    }
  }, [isSupported])

  const speak = useCallback((text: string) => {
    if (!isSupported || !synthRef.current) return

    // Stop any current speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    utteranceRef.current = utterance
    synthRef.current.speak(utterance)
  }, [isSupported])

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  return {
    speak,
    isSpeaking,
    stop,
    isSupported,
  }
}