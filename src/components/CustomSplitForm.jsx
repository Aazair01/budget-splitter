import React, { useState } from 'react'
import { Sliders, DollarSign, Percent } from 'lucide-react'

/**
 * CustomSplitForm Component
 * 
 * Allows users to define custom split for each person using either:
 * - Percentage-based splits
 * - Flat amount-based splits
 * 
 * Features:
 * - Toggle between percentage and amount input modes per person
 * - Real-time validation
 * - Visual feedback for total coverage
 * - Quick distribution buttons (Split Evenly, Reset)
 */
export default function CustomSplitForm({
  numberOfPeople,
  customSplits,
  setCustomSplits,
  billAmount,
  tipPercentage
}) {
  const [currentMode, setCurrentMode] = useState('percentage') // 'percentage' or 'amount'

  /**
   * Calculate total amount with tip for reference
   */
  const totalWithTip = (parseFloat(billAmount) || 0) + 
    ((parseFloat(billAmount) || 0) * (parseFloat(tipPercentage) || 0) / 100)

  /**
   * Handle custom split value change for a specific person
   */
  const handleSplitChange = (personIndex, value, type) => {
    const key = `person_${personIndex}`
    
    // Validate input
    if (value === '' || !isNaN(value)) {
      const num = parseFloat(value) || 0
      
      // Validate based on type
      if (type === 'percentage' && num >= 0 && num <= 100) {
        setCustomSplits({
          ...customSplits,
          [key]: { type: 'percentage', value: num }
        })
      } else if (type === 'amount' && num >= 0) {
        setCustomSplits({
          ...customSplits,
          [key]: { type: 'amount', value: num }
        })
      } else if (value === '') {
        setCustomSplits({
          ...customSplits,
          [key]: { type, value: 0 }
        })
      }
    }
  }

  /**
   * Toggle split type between percentage and amount for a person
   */
  const toggleSplitType = (personIndex) => {
    const key = `person_${personIndex}`
    const current = customSplits[key] || { type: 'percentage', value: 0 }
    
    // Convert values when toggling
    let newValue = current.value
    if (current.type === 'percentage' && current.value > 0) {
      // Convert percentage to amount
      newValue = (totalWithTip * current.value) / 100
    } else if (current.type === 'amount' && current.value > 0 && totalWithTip > 0) {
      // Convert amount to percentage
      newValue = (current.value / totalWithTip) * 100
    }

    const newType = current.type === 'percentage' ? 'amount' : 'percentage'
    setCustomSplits({
      ...customSplits,
      [key]: { type: newType, value: newValue }
    })
  }

  /**
   * Calculate total coverage for visual feedback
   */
  const calculateTotalCoverage = () => {
    let total = 0
    for (let i = 0; i < numberOfPeople; i++) {
      const key = `person_${i}`
      const split = customSplits[key] || { type: 'percentage', value: 0 }
      
      if (split.type === 'percentage') {
        total += split.value
      } else {
        total += split.value
      }
    }
    return total
  }

  /**
   * Distribute bill evenly among all people
   */
  const handleSplitEvenly = () => {
    const evenAmount = totalWithTip / numberOfPeople
    const newSplits = {}
    for (let i = 0; i < numberOfPeople; i++) {
      newSplits[`person_${i}`] = { type: 'amount', value: parseFloat(evenAmount.toFixed(2)) }
    }
    setCustomSplits(newSplits)
  }

  /**
   * Reset all custom splits
   */
  const handleReset = () => {
    const resetSplits = {}
    for (let i = 0; i < numberOfPeople; i++) {
      resetSplits[`person_${i}`] = { type: 'percentage', value: 0 }
    }
    setCustomSplits(resetSplits)
  }

  const totalCoverage = calculateTotalCoverage()
  const isBalanced = totalWithTip > 0 && Math.abs(totalCoverage - totalWithTip) < 0.01

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <Sliders className="w-6 h-6 text-accent-purple" />
        Custom Split Details
      </h2>
      <p className="text-dark-600 text-sm mb-6">
        Define how much each person pays (either by amount or percentage)
      </p>

      {/* Person splits list */}
      <div className="space-y-4 mb-6">
        {Array.from({ length: numberOfPeople }).map((_, index) => {
          const key = `person_${index}`
          const split = customSplits[key] || { type: 'percentage', value: 0 }
          const displayValue = split.type === 'percentage' 
            ? `${split.value}%`
            : `$${split.value.toFixed(2)}`

          return (
            <div key={key} className="bg-dark-900 border border-dark-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="font-semibold text-white min-w-fit">
                Person {index + 1}
              </div>

              <div className="flex-grow">
                <div className="relative flex">
                  <input
                    type="number"
                    value={split.value || ''}
                    onChange={(e) => handleSplitChange(index, e.target.value, split.type)}
                    placeholder="0"
                    className="flex-grow bg-dark-800 border border-dark-600 rounded-lg pl-4 py-2 text-white placeholder-dark-600 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition-all"
                    min="0"
                    step={split.type === 'percentage' ? '0.1' : '0.01'}
                    max={split.type === 'percentage' ? '100' : undefined}
                  />
                  <button
                    onClick={() => toggleSplitType(index)}
                    className="ml-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-dark-400 font-semibold transition-all text-sm"
                    title={`Switch to ${split.type === 'percentage' ? 'amount' : 'percentage'}`}
                  >
                    {split.type === 'percentage' ? '%' : '$'}
                  </button>
                </div>
              </div>

              <div className="text-sm text-dark-500">
                {split.value > 0 && split.type === 'percentage' && (
                  <span>${((totalWithTip * split.value) / 100).toFixed(2)}</span>
                )}
                {split.value > 0 && split.type === 'amount' && (
                  <span>{((split.value / totalWithTip) * 100).toFixed(1)}%</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick action buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={handleSplitEvenly}
          className="flex-1 min-w-fit px-4 py-2 bg-accent-green hover:bg-opacity-80 text-white rounded-lg font-semibold transition-all text-sm"
        >
          Split Evenly
        </button>
        <button
          onClick={handleReset}
          className="flex-1 min-w-fit px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white rounded-lg font-semibold transition-all text-sm"
        >
          Reset
        </button>
      </div>

      {/* Coverage indicator */}
      <div className="bg-dark-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-dark-600">Total Coverage</span>
          <span className={`font-bold ${isBalanced ? 'text-accent-green' : 'text-accent-blue'}`}>
            ${totalCoverage.toFixed(2)} / ${totalWithTip.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-dark-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isBalanced ? 'bg-accent-green' : 'bg-accent-blue'
            }`}
            style={{
              width: totalWithTip > 0 ? `${Math.min((totalCoverage / totalWithTip) * 100, 100)}%` : '0%'
            }}
          ></div>
        </div>
        {!isBalanced && (
          <p className="text-xs text-accent-blue mt-2">
            {totalCoverage < totalWithTip
              ? `Remaining: $${(totalWithTip - totalCoverage).toFixed(2)}`
              : `Over by: $${(totalCoverage - totalWithTip).toFixed(2)}`}
          </p>
        )}
        {isBalanced && (
          <p className="text-xs text-accent-green mt-2">✓ Bill perfectly split!</p>
        )}
      </div>
    </div>
  )
}
