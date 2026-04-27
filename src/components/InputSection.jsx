import React from 'react'
import { DollarSign, Users, Percent } from 'lucide-react'

/**
 * InputSection Component
 * 
 * Handles the primary inputs:
 * - Bill amount
 * - Number of people
 * - Tip percentage (optional)
 * 
 * Features:
 * - Real-time input validation
 * - Prevents negative numbers
 * - Handles non-numeric inputs gracefully
 * - Mobile-responsive layout
 */
export default function InputSection({
  billAmount,
  setBillAmount,
  numberOfPeople,
  setNumberOfPeople,
  tipPercentage,
  setTipPercentage
}) {
  /**
   * Validates and updates bill amount
   * Ensures non-negative numbers only
   */
  const handleBillChange = (e) => {
    const value = e.target.value
    
    // Allow empty string or valid positive numbers
    if (value === '' || !isNaN(value)) {
      const num = parseFloat(value)
      if (value === '' || num >= 0) {
        setBillAmount(value)
      }
    }
  }

  /**
   * Validates and updates people count
   * Ensures positive integers only
   */
  const handlePeopleChange = (e) => {
    const value = e.target.value
    
    // Allow empty string or valid positive integers
    if (value === '' || /^\d+$/.test(value)) {
      const num = parseInt(value)
      if (value === '' || num > 0) {
        setNumberOfPeople(value)
      }
    }
  }

  /**
   * Validates and updates tip percentage
   * Ensures non-negative numbers up to reasonable percentage
   */
  const handleTipChange = (e) => {
    const value = e.target.value
    
    if (value === '' || !isNaN(value)) {
      const num = parseFloat(value)
      if (value === '' || (num >= 0 && num <= 100)) {
        setTipPercentage(value)
      }
    }
  }

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-accent-blue" />
        Bill Details
      </h2>

      <div className="space-y-4">
        {/* Total Bill Amount Input */}
        <div className="flex flex-col">
          <label htmlFor="bill" className="text-sm font-semibold text-dark-600 uppercase tracking-wide mb-2">
            Total Bill Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600 font-semibold">
              $
            </span>
            <input
              id="bill"
              type="number"
              value={billAmount}
              onChange={handleBillChange}
              placeholder="0.00"
              className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-8 pr-4 py-3 text-white placeholder-dark-600 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Number of People Input */}
        <div className="flex flex-col">
          <label htmlFor="people" className="text-sm font-semibold text-dark-600 uppercase tracking-wide mb-2">
            Number of People
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-600" />
            <input
              id="people"
              type="number"
              value={numberOfPeople}
              onChange={handlePeopleChange}
              placeholder="2"
              className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-dark-600 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all"
              min="1"
            />
          </div>
        </div>

        {/* Tip Percentage Input */}
        <div className="flex flex-col">
          <label htmlFor="tip" className="text-sm font-semibold text-dark-600 uppercase tracking-wide mb-2">
            Tip Percentage <span className="text-dark-600 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-600" />
            <input
              id="tip"
              type="number"
              value={tipPercentage}
              onChange={handleTipChange}
              placeholder="15"
              className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-dark-600 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <p className="text-xs text-dark-600 mt-1">
            {tipPercentage ? `That's $${((parseFloat(billAmount) || 0) * parseFloat(tipPercentage) / 100).toFixed(2)} in tip` : 'No tip added'}
          </p>
        </div>
      </div>
    </div>
  )
}
