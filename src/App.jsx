import React, { useState } from 'react'
import InputSection from './components/InputSection'
import SplitTypeSelector from './components/SplitTypeSelector'
import CustomSplitForm from './components/CustomSplitForm'
import SummaryView from './components/SummaryView'
import { Calculator } from 'lucide-react'

/**
 * Main App Component
 * 
 * Manages the state for the budget splitter application including:
 * - Total bill amount, number of people, and tip percentage
 * - Split type (even or custom)
 * - Custom split amounts/percentages
 */
export default function App() {
  // Core input states
  const [billAmount, setBillAmount] = useState('')
  const [numberOfPeople, setNumberOfPeople] = useState('')
  const [tipPercentage, setTipPercentage] = useState('')
  
  // Split type: 'even' or 'custom'
  const [splitType, setSplitType] = useState('even')
  
  // Custom split state - stores custom split data
  const [customSplits, setCustomSplits] = useState({})

  /**
   * Calculate the final amounts based on inputs
   * Returns an object with calculated split information
   */
  const calculateSplit = () => {
    const bill = parseFloat(billAmount) || 0
    const people = parseInt(numberOfPeople) || 0
    const tip = parseFloat(tipPercentage) || 0

    // Input validation
    if (bill <= 0 || people <= 0) {
      return null
    }

    // Calculate tip amount
    const tipAmount = (bill * tip) / 100
    const totalWithTip = bill + tipAmount

    let splitData = null

    if (splitType === 'even') {
      // Even split calculation
      const amountPerPerson = totalWithTip / people
      const shares = Array.from({ length: people }, () => amountPerPerson)
      
      splitData = {
        shares,
        tipAmount,
        totalAmount: totalWithTip,
        splitType: 'even',
        peopleCount: people
      }
    } else if (splitType === 'custom') {
      // Custom split calculation
      const shares = Array.from({ length: people }, (_, idx) => {
        const key = `person_${idx}`
        const customData = customSplits[key] || { type: 'percentage', value: 0 }
        
        if (customData.type === 'percentage') {
          return (totalWithTip * customData.value) / 100
        } else {
          return parseFloat(customData.value) || 0
        }
      })

      splitData = {
        shares,
        tipAmount,
        totalAmount: totalWithTip,
        splitType: 'custom',
        peopleCount: people,
        customSplits
      }
    }

    return splitData
  }

  // Get split data for rendering
  const splitData = calculateSplit()

  /**
   * Reset all form data to initial state
   */
  const handleReset = () => {
    setBillAmount('')
    setNumberOfPeople('')
    setTipPercentage('')
    setSplitType('even')
    setCustomSplits({})
  }

  /**
   * Handle people count change - reinitialize custom splits if needed
   */
  const handlePeopleChange = (newCount) => {
    setNumberOfPeople(newCount)
    
    // Reset custom splits when changing people count
    if (splitType === 'custom') {
      const newCustomSplits = {}
      for (let i = 0; i < parseInt(newCount) || 0; i++) {
        newCustomSplits[`person_${i}`] = { type: 'percentage', value: 0 }
      }
      setCustomSplits(newCustomSplits)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-4 py-8 sm:px-6 sm:py-12">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-blue opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-purple opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calculator className="w-8 h-8 text-accent-blue" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Budget Splitter
            </h1>
          </div>
          <p className="text-dark-600 text-sm sm:text-base">
            Split bills effortlessly with friends and colleagues
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Input Section */}
          <InputSection
            billAmount={billAmount}
            setBillAmount={setBillAmount}
            numberOfPeople={numberOfPeople}
            setNumberOfPeople={handlePeopleChange}
            tipPercentage={tipPercentage}
            setTipPercentage={setTipPercentage}
          />

          {/* Only show split type selector if people count is valid */}
          {parseInt(numberOfPeople) > 0 && (
            <>
              {/* Split Type Selector */}
              <SplitTypeSelector
                splitType={splitType}
                setSplitType={setSplitType}
              />

              {/* Custom Split Form - Only show when custom split is selected */}
              {splitType === 'custom' && (
                <CustomSplitForm
                  numberOfPeople={parseInt(numberOfPeople)}
                  customSplits={customSplits}
                  setCustomSplits={setCustomSplits}
                  billAmount={billAmount}
                  tipPercentage={tipPercentage}
                />
              )}
            </>
          )}

          {/* Summary View - Only show when we have valid data */}
          {splitData && (
            <SummaryView
              splitData={splitData}
              billAmount={billAmount}
              tipPercentage={tipPercentage}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-dark-600 text-xs sm:text-sm">
          <p>© 2024 Budget Splitter | Made with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
