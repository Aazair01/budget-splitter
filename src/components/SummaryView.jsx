import React, { useState } from 'react'
import { Copy, Check, Receipt, RotateCcw } from 'lucide-react'

/**
 * SummaryView Component
 * 
 * Displays the final split breakdown including:
 * - Bill breakdown by person
 * - Tip distribution
 * - Copy-to-clipboard functionality for sharing
 * - Reset button to start over
 * 
 * Features:
 * - Formatted receipt text for easy sharing
 * - Visual feedback for copy action
 * - Responsive card layout
 * - Detailed split information
 */
export default function SummaryView({ splitData, billAmount, tipPercentage, onReset }) {
  const [copied, setCopied] = useState(false)

  /**
   * Generate formatted receipt text for sharing
   * Suitable for pasting into messaging apps like WhatsApp
   */
  const generateReceiptText = () => {
    const bill = parseFloat(billAmount) || 0
    const tipPercent = parseFloat(tipPercentage) || 0
    const tipAmount = splitData.tipAmount

    let receipt = '💰 BUDGET SPLITTER RECEIPT 💰\n'
    receipt += '═══════════════════════════════\n\n'
    
    receipt += `💵 BILL DETAILS:\n`
    receipt += `  Original Bill: $${bill.toFixed(2)}\n`
    
    if (tipPercent > 0) {
      receipt += `  Tip (${tipPercent}%): $${tipAmount.toFixed(2)}\n`
    }
    
    receipt += `  Total: $${splitData.totalAmount.toFixed(2)}\n\n`

    receipt += `👥 SPLIT BREAKDOWN:\n`
    receipt += `  Split Type: ${splitData.splitType === 'even' ? 'EVEN SPLIT' : 'CUSTOM SPLIT'}\n`
    receipt += `  Number of People: ${splitData.peopleCount}\n\n`

    receipt += `💳 INDIVIDUAL SHARES:\n`
    splitData.shares.forEach((share, index) => {
      receipt += `  Person ${index + 1}: $${share.toFixed(2)}\n`
    })

    receipt += '\n═══════════════════════════════\n'
    receipt += '✓ Split using Budget Splitter'

    return receipt
  }

  /**
   * Copy receipt text to clipboard and show feedback
   */
  const handleCopyToClipboard = () => {
    const receiptText = generateReceiptText()
    navigator.clipboard.writeText(receiptText).then(() => {
      setCopied(true)
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback: create a temporary text area and copy
      const textArea = document.createElement('textarea')
      textArea.value = receiptText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const bill = parseFloat(billAmount) || 0
  const tipPercent = parseFloat(tipPercentage) || 0

  return (
    <div className="space-y-6">
      {/* Main Summary Card */}
      <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-accent-green" />
          Split Summary
        </h2>

        {/* Bill Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 pb-8 border-b border-dark-700">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-dark-600 uppercase tracking-wide mb-1">
              Bill Amount
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white">
              ${bill.toFixed(2)}
            </span>
          </div>

          {tipPercent > 0 && (
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-dark-600 uppercase tracking-wide mb-1">
                Tip ({tipPercent}%)
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-accent-green">
                ${splitData.tipAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-dark-600 uppercase tracking-wide mb-1">
              Total
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-accent-blue">
              ${splitData.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Split Details */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-dark-600 uppercase tracking-wide mb-4">
            {splitData.splitType === 'even' ? 'Even Split' : 'Custom Split'} ({splitData.peopleCount} {splitData.peopleCount === 1 ? 'person' : 'people'})
          </h3>

          <div className="space-y-3">
            {splitData.shares.map((share, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-dark-900 border border-dark-700 rounded-lg hover:border-dark-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-semibold text-white text-sm">
                    {index + 1}
                  </div>
                  <span className="text-white font-semibold">
                    Person {index + 1}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl sm:text-2xl font-bold text-accent-green">
                    ${share.toFixed(2)}
                  </span>
                  <span className="text-xs text-dark-600">
                    {((share / splitData.totalAmount) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleCopyToClipboard}
            className={`w-full px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              copied
                ? 'bg-accent-green text-white'
                : 'bg-accent-blue hover:bg-opacity-80 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Summary
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="w-full px-6 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            New Split
          </button>
        </div>
      </div>

      {/* Receipt Preview Card */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h3 className="text-sm font-semibold text-dark-600 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Receipt className="w-4 h-4" />
          Preview for Sharing
        </h3>
        <div className="bg-dark-900 rounded-lg p-4 text-xs sm:text-sm text-dark-400 font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
          {generateReceiptText()}
        </div>
        <p className="text-xs text-dark-600 mt-3">
          💡 Click "Copy Summary" to copy this text and share it via WhatsApp, Telegram, Email, etc.
        </p>
      </div>
    </div>
  )
}
