'use client'

import { useEffect, useCallback } from 'react'

interface KeyboardShortcuts {
  [key: string]: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Don't trigger shortcuts when user is typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as any)?.contentEditable === 'true'
    ) {
      return
    }

    const key = event.key.toLowerCase()
    const shortcutKey = [
      event.ctrlKey && 'ctrl',
      event.metaKey && 'meta',
      event.altKey && 'alt',
      event.shiftKey && 'shift',
      key
    ].filter(Boolean).join('+')

    // Check for the exact key combination
    if (shortcuts[shortcutKey]) {
      event.preventDefault()
      shortcuts[shortcutKey]()
      return
    }

    // Check for just the key (for simple shortcuts)
    if (shortcuts[key]) {
      event.preventDefault()
      shortcuts[key]()
    }
  }, [shortcuts, enabled])

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])
}

// Demo-specific keyboard shortcuts hook
export function useDemoKeyboardShortcuts({
  onStartVoice,
  onStopVoice,
  onReset,
  onToggleDemo,
  onShowHelp,
  onSelectScenario,
  isListening = false,
  isDemoMode = true
}: {
  onStartVoice?: () => void
  onStopVoice?: () => void
  onReset?: () => void
  onToggleDemo?: () => void
  onShowHelp?: () => void
  onSelectScenario?: (scenarioIndex: number) => void
  isListening?: boolean
  isDemoMode?: boolean
}) {
  const shortcuts = {
    ' ': () => {
      // Spacebar for voice control
      if (isListening && onStopVoice) {
        onStopVoice()
      } else if (!isListening && onStartVoice) {
        onStartVoice()
      }
    },
    'r': () => onReset?.(),
    'd': () => onToggleDemo?.(),
    'h': () => onShowHelp?.(),
    '?': () => onShowHelp?.(),
    '1': () => onSelectScenario?.(0),
    '2': () => onSelectScenario?.(1),
    '3': () => onSelectScenario?.(2),
    'escape': () => {
      // Close any open modals
      const modals = document.querySelectorAll('[data-modal]')
      modals.forEach(modal => {
        if (modal instanceof HTMLElement) {
          const closeButton = modal.querySelector('[data-close]')
          if (closeButton instanceof HTMLElement) {
            closeButton.click()
          }
        }
      })
    }
  }

  useKeyboardShortcuts(shortcuts, isDemoMode)
}