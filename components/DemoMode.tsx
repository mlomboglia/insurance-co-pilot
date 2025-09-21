'use client'

import { useState } from 'react'
import { Play, RotateCcw, Book, Zap, Users, ClipboardList, Keyboard, X } from 'lucide-react'
import { demoScenarios, getScenarioById, type DemoScenario } from '@/lib/mockData'
import { clsx } from 'clsx'

interface DemoModeProps {
  onScenarioSelect?: (scenario: DemoScenario) => void
  onReset?: () => void
  onSimulateInput?: (input: string) => void
  className?: string
}

export default function DemoMode({ onScenarioSelect, onReset, onSimulateInput, className }: DemoModeProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = getScenarioById(scenarioId)
    if (scenario) {
      setSelectedScenario(scenarioId)
      onScenarioSelect?.(scenario)
    }
  }

  const handleReset = () => {
    setSelectedScenario(null)
    onReset?.()
  }

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Demo Header */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Demo Mode</h2>
              <p className="text-sm text-slate-600">Try pre-configured scenarios or create your own</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowInstructions(true)}
              className="btn-outline text-sm flex items-center space-x-2"
            >
              <Book className="h-4 w-4" />
              <span>Instructions</span>
            </button>
            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className="btn-outline text-sm flex items-center space-x-2"
            >
              <Keyboard className="h-4 w-4" />
              <span>Shortcuts</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary text-sm flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button className="card hover:shadow-lg transition-all duration-200 p-4 text-center group">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-sm">Quick Demo</p>
            <p className="text-xs text-slate-600">Random scenario</p>
          </button>
          <button className="card hover:shadow-lg transition-all duration-200 p-4 text-center group">
            <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-sm">Agent View</p>
            <p className="text-xs text-slate-600">Switch to dashboard</p>
          </button>
          <button className="card hover:shadow-lg transition-all duration-200 p-4 text-center group">
            <ClipboardList className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-sm">Track Status</p>
            <p className="text-xs text-slate-600">View claim progress</p>
          </button>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose a Demo Scenario</h3>
        <div className="space-y-3">
          {demoScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={clsx(
                'border-2 rounded-xl p-4 cursor-pointer transition-all duration-200',
                selectedScenario === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
              )}
              onClick={() => handleScenarioSelect(scenario.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-slate-900">{scenario.title}</h4>
                    <span className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      scenario.expectedOutcome === 'approved' && 'bg-green-100 text-green-800',
                      scenario.expectedOutcome === 'denied' && 'bg-red-100 text-red-800',
                      scenario.expectedOutcome === 'requires-review' && 'bg-yellow-100 text-yellow-800'
                    )}>
                      {scenario.expectedOutcome}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{scenario.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-medium text-slate-700">Customer:</p>
                      <p className="text-slate-600">{scenario.customerProfile.name}</p>
                      <p className="text-slate-600">{scenario.customerProfile.policy}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">Scenario:</p>
                      <p className="text-slate-600">{scenario.scenario.issue}</p>
                      <p className="text-slate-600">{scenario.scenario.location}</p>
                    </div>
                  </div>
                </div>

                {selectedScenario === scenario.id && (
                  <div className="ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onScenarioSelect?.(scenario)
                      }}
                      className="btn-primary text-sm flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Demo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Voice Inputs */}
      {selectedScenario && (
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sample Voice Inputs</h3>
          <p className="text-sm text-slate-600 mb-4">
            You can use these sample phrases to test the voice interface without a microphone:
          </p>

          {(() => {
            const scenario = getScenarioById(selectedScenario)
            if (!scenario) return null

            return (
              <div className="space-y-3">
                {scenario.sampleUserInputs.map((input, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-700">"{input}"</p>
                    </div>
                    <button
                      onClick={() => {
                        onSimulateInput?.(input)
                      }}
                      className="btn-outline text-xs px-3 py-1 hover:bg-blue-50 hover:border-blue-300"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Demo Instructions</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <section>
                <h3 className="font-semibold text-slate-900 mb-2">Getting Started</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Choose a demo scenario from the options above</li>
                  <li>Click "Start Demo" to begin the conversation</li>
                  <li>Use your microphone or the sample inputs provided</li>
                  <li>Follow the conversation flow to complete the claim</li>
                </ol>
              </section>

              <section>
                <h3 className="font-semibold text-slate-900 mb-2">Demo Scenarios</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Flat Tire:</strong> Standard approved claim with Premium Plus coverage</li>
                  <li><strong>Battery Jump:</strong> Service limit exceeded scenario requiring review</li>
                  <li><strong>Lockout:</strong> Service not covered under Basic plan</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-slate-900 mb-2">Voice Interface Tips</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Speak clearly and at normal pace</li>
                  <li>Wait for the AI to finish speaking before responding</li>
                  <li>Use the sample inputs if your microphone isn't working</li>
                  <li>You can reset the conversation at any time</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-slate-900 mb-2">Navigation</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Switch to Agent Dashboard to see claim processing</li>
                  <li>Visit Claim Status to track submitted claims</li>
                  <li>Use the navigation menu to explore all features</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { key: 'Space', action: 'Start/Stop Voice Recording' },
                { key: 'R', action: 'Reset Conversation' },
                { key: 'D', action: 'Toggle Demo Mode' },
                { key: 'H', action: 'Show Help' },
                { key: '1, 2, 3', action: 'Quick Scenario Selection' },
                { key: 'Esc', action: 'Close Modals' }
              ].map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-slate-700">{shortcut.action}</span>
                  <kbd className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}