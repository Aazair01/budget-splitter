import React from 'react'
import { Split, Sliders } from 'lucide-react'

/**
 * SplitTypeSelector Component
 * 
 * Allows user to choose between:
 * - Even split (automatic equal distribution)
 * - Custom split (define specific amounts/percentages per person)
 * 
 * Provides visual feedback for the selected option
 */
export default function SplitTypeSelector({ splitType, setSplitType }) {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Sliders className="w-6 h-6 text-accent-purple" />
        Split Type
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Even Split Option */}
        <button
          onClick={() => setSplitType('even')}
          className={`p-5 rounded-xl border-2 transition-all flex flex-col items-start gap-3 ${
            splitType === 'even'
              ? 'border-accent-blue bg-accent-blue/10'
              : 'border-dark-600 bg-dark-900 hover:border-dark-500'
          }`}
        >
          <div className="flex items-center gap-3 w-full">
            <Split className={`w-6 h-6 ${splitType === 'even' ? 'text-accent-blue' : 'text-dark-600'}`} />
            <span className="font-bold text-white">
              Even Split
            </span>
            {splitType === 'even' && (
              <div className="ml-auto w-5 h-5 rounded-full bg-accent-blue flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </div>
          <p className="text-sm text-dark-600">
            Divide equally among all people
          </p>
        </button>

        {/* Custom Split Option */}
        <button
          onClick={() => setSplitType('custom')}
          className={`p-5 rounded-xl border-2 transition-all flex flex-col items-start gap-3 ${
            splitType === 'custom'
              ? 'border-accent-purple bg-accent-purple/10'
              : 'border-dark-600 bg-dark-900 hover:border-dark-500'
          }`}
        >
          <div className="flex items-center gap-3 w-full">
            <Sliders className={`w-6 h-6 ${splitType === 'custom' ? 'text-accent-purple' : 'text-dark-600'}`} />
            <span className="font-bold text-white">
              Custom Split
            </span>
            {splitType === 'custom' && (
              <div className="ml-auto w-5 h-5 rounded-full bg-accent-purple flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </div>
          <p className="text-sm text-dark-600">
            Define amounts or percentages
          </p>
        </button>
      </div>
    </div>
  )
}
