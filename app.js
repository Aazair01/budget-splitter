// SVG Icons
const Icons = {
  dollarSign: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
  users: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 8.048M12 4.354L9.172 7.172M12 4.354l2.828 2.818M19 12a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>',
  percent: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>',
  sliders: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>',
  split: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6L6 3m0 0L3 6m3-3v12a3 3 0 003 3h12a3 3 0 003-3V6m0 0l3 3m-3-3L15 3"></path></svg>',
  receipt: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
  copy: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>',
  check: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
  rotateReset: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>'
};

// App state
const state = {
  billAmount: '',
  numberOfPeople: '',
  tipPercentage: '',
  splitType: 'even',
  customSplits: {}
};

// Utility functions
function parseNum(str) {
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function calculateSplit() {
  const bill = parseNum(state.billAmount);
  const people = parseInt(state.numberOfPeople) || 0;
  const tip = parseNum(state.tipPercentage);

  if (bill <= 0 || people <= 0) {
    return null;
  }

  const tipAmount = (bill * tip) / 100;
  const totalWithTip = bill + tipAmount;

  let splitData = null;

  if (state.splitType === 'even') {
    const amountPerPerson = totalWithTip / people;
    const shares = Array(people).fill(amountPerPerson);
    
    splitData = {
      shares,
      tipAmount,
      totalAmount: totalWithTip,
      splitType: 'even',
      peopleCount: people
    };
  } else if (state.splitType === 'custom') {
    const shares = [];
    for (let i = 0; i < people; i++) {
      const key = `person_${i}`;
      const customData = state.customSplits[key] || { type: 'percentage', value: 0 };
      
      let amount = 0;
      if (customData.type === 'percentage') {
        amount = (totalWithTip * customData.value) / 100;
      } else {
        amount = parseNum(customData.value);
      }
      shares.push(amount);
    }

    splitData = {
      shares,
      tipAmount,
      totalAmount: totalWithTip,
      splitType: 'custom',
      peopleCount: people,
      customSplits: state.customSplits
    };
  }

  return splitData;
}

function generateReceiptText(splitData) {
  const bill = parseNum(state.billAmount);
  const tipPercent = parseNum(state.tipPercentage);
  const tipAmount = splitData.tipAmount;

  let receipt = '💰 BUDGET SPLITTER RECEIPT 💰\n';
  receipt += '═══════════════════════════════\n\n';
  
  receipt += `💵 BILL DETAILS:\n`;
  receipt += `  Original Bill: $${bill.toFixed(2)}\n`;
  
  if (tipPercent > 0) {
    receipt += `  Tip (${tipPercent}%): $${tipAmount.toFixed(2)}\n`;
  }
  
  receipt += `  Total: $${splitData.totalAmount.toFixed(2)}\n\n`;

  receipt += `👥 SPLIT BREAKDOWN:\n`;
  receipt += `  Split Type: ${splitData.splitType === 'even' ? 'EVEN SPLIT' : 'CUSTOM SPLIT'}\n`;
  receipt += `  Number of People: ${splitData.peopleCount}\n\n`;

  receipt += `💳 INDIVIDUAL SHARES:\n`;
  splitData.shares.forEach((share, index) => {
    receipt += `  Person ${index + 1}: $${share.toFixed(2)}\n`;
  });

  receipt += '\n═══════════════════════════════\n';
  receipt += '✓ Split using Budget Splitter';

  return receipt;
}

// Event handlers
function handleBillChange(e) {
  const value = e.target.value;
  if (value === '' || (!isNaN(value) && parseNum(value) >= 0)) {
    state.billAmount = value;
    render();
  }
}

function handlePeopleChange(e) {
  const value = e.target.value;
  if (value === '' || /^\d+$/.test(value)) {
    const num = parseInt(value) || 0;
    if (value === '' || num > 0) {
      state.numberOfPeople = value;
      render();
    }
  }
}

function handleTipChange(e) {
  const value = e.target.value;
  if (value === '' || (!isNaN(value) && parseNum(value) >= 0 && parseNum(value) <= 100)) {
    state.tipPercentage = value;
    render();
  }
}

function handleSplitTypeChange(type) {
  state.splitType = type;
  render();
}

function handleCustomSplitChange(personIndex, value, type) {
  const key = `person_${personIndex}`;
  
  if (value === '' || !isNaN(value)) {
    const num = parseNum(value);
    
    if (type === 'percentage' && num >= 0 && num <= 100) {
      state.customSplits[key] = { type: 'percentage', value: num };
    } else if (type === 'amount' && num >= 0) {
      state.customSplits[key] = { type: 'amount', value: num };
    } else if (value === '') {
      state.customSplits[key] = { type, value: 0 };
    }
    render();
  }
}

function handleToggleSplitType(personIndex) {
  const key = `person_${personIndex}`;
  const current = state.customSplits[key] || { type: 'percentage', value: 0 };
  const bill = parseNum(state.billAmount);
  const tip = parseNum(state.tipPercentage);
  const totalWithTip = bill + (bill * tip / 100);
  
  let newValue = current.value;
  if (current.type === 'percentage' && current.value > 0) {
    newValue = (totalWithTip * current.value) / 100;
  } else if (current.type === 'amount' && current.value > 0 && totalWithTip > 0) {
    newValue = (current.value / totalWithTip) * 100;
  }

  const newType = current.type === 'percentage' ? 'amount' : 'percentage';
  state.customSplits[key] = { type: newType, value: newValue };
  render();
}

function handleSplitEvenly() {
  const bill = parseNum(state.billAmount);
  const people = parseInt(state.numberOfPeople) || 0;
  const tip = parseNum(state.tipPercentage);
  const totalWithTip = bill + (bill * tip / 100);
  
  if (people > 0) {
    const evenAmount = totalWithTip / people;
    for (let i = 0; i < people; i++) {
      state.customSplits[`person_${i}`] = { type: 'amount', value: parseNum(evenAmount.toFixed(2)) };
    }
    render();
  }
}

function handleReset() {
  state.billAmount = '';
  state.numberOfPeople = '';
  state.tipPercentage = '';
  state.splitType = 'even';
  state.customSplits = {};
  render();
}

function handleCopyToClipboard(splitData) {
  const receiptText = generateReceiptText(splitData);
  navigator.clipboard.writeText(receiptText).then(() => {
    const btn = document.querySelector('.copy-button');
    btn.classList.add('copied');
    btn.textContent = '✓ Copied to clipboard';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = Icons.copy + ' Copy to Clipboard';
    }, 2000);
  }).catch(() => {
    const textArea = document.createElement('textarea');
    textArea.value = receiptText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  });
}

// Render functions
function renderInputSection() {
  const bill = parseNum(state.billAmount);
  const tip = parseNum(state.tipPercentage);
  const tipAmount = bill * tip / 100;
  const tipText = state.tipPercentage ? `That's $${tipAmount.toFixed(2)} in tip` : 'No tip added';

  return `
    <div class="card">
      <h2>${Icons.dollarSign} Bill Details</h2>
      <p>Enter the bill amount, number of people, and tip percentage</p>
      
      <div class="form-group">
        <label for="bill">Total Bill Amount</label>
        <div class="input-wrapper">
          <span class="input-icon">$</span>
          <input 
            id="bill" 
            type="number" 
            value="${state.billAmount}"
            placeholder="0.00"
            class="with-icon"
            step="0.01"
            min="0"
            onchange="handleBillChange(event)"
            oninput="handleBillChange(event)"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="people">Number of People</label>
        <div class="input-wrapper">
          <span class="input-icon">${Icons.users}</span>
          <input 
            id="people" 
            type="number" 
            value="${state.numberOfPeople}"
            placeholder="2"
            class="with-icon"
            min="1"
            onchange="handlePeopleChange(event)"
            oninput="handlePeopleChange(event)"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="tip">Tip Percentage <span style="color: #64748b; font-weight: normal;">(Optional)</span></label>
        <div class="input-wrapper">
          <span class="input-icon">%</span>
          <input 
            id="tip" 
            type="number" 
            value="${state.tipPercentage}"
            placeholder="15"
            class="with-icon"
            min="0"
            max="100"
            step="0.1"
            onchange="handleTipChange(event)"
            oninput="handleTipChange(event)"
          />
        </div>
        <p class="help-text">${tipText}</p>
      </div>
    </div>
  `;
}

function renderSplitTypeSelector() {
  return `
    <div class="card">
      <h2>${Icons.sliders} Split Type</h2>
      
      <div class="split-type-container">
        <button 
          class="split-type-btn ${state.splitType === 'even' ? 'active' : 'inactive'}"
          onclick="handleSplitTypeChange('even')"
        >
          <div class="split-type-btn-header">
            ${Icons.split}
            <span>Even Split</span>
            ${state.splitType === 'even' ? '<div class="split-type-btn-checkmark">✓</div>' : ''}
          </div>
          <p class="split-type-btn-desc">Divide equally among all people</p>
        </button>

        <button 
          class="split-type-btn custom ${state.splitType === 'custom' ? 'active' : 'inactive'}"
          onclick="handleSplitTypeChange('custom')"
        >
          <div class="split-type-btn-header">
            ${Icons.sliders}
            <span>Custom Split</span>
            ${state.splitType === 'custom' ? '<div class="split-type-btn-checkmark">✓</div>' : ''}
          </div>
          <p class="split-type-btn-desc">Define amounts or percentages</p>
        </button>
      </div>
    </div>
  `;
}

function renderCustomSplitForm() {
  const numberOfPeople = parseInt(state.numberOfPeople) || 0;
  if (numberOfPeople === 0 || state.splitType === 'even') {
    return '';
  }

  const bill = parseNum(state.billAmount);
  const tip = parseNum(state.tipPercentage);
  const totalWithTip = bill + (bill * tip / 100);

  let items = '';
  for (let i = 0; i < numberOfPeople; i++) {
    const key = `person_${i}`;
    const split = state.customSplits[key] || { type: 'percentage', value: 0 };
    const isPercentage = split.type === 'percentage';
    const buttonText = isPercentage ? 'Use Amount' : 'Use %';

    items += `
      <div class="custom-split-item">
        <div class="custom-split-item-header">
          <div class="custom-split-person-num">${i + 1}</div>
          <span>Person ${i + 1}</span>
        </div>
        <div class="custom-split-inputs">
          <input 
            type="number" 
            value="${split.value}"
            placeholder="${isPercentage ? '0' : '0.00'}"
            min="0"
            ${isPercentage ? 'max="100"' : ''}
            step="${isPercentage ? '1' : '0.01'}"
            onchange="handleCustomSplitChange(${i}, this.value, '${split.type}')"
            oninput="handleCustomSplitChange(${i}, this.value, '${split.type}')"
          />
          <button onclick="handleToggleSplitType(${i})">${buttonText}</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="card">
      <h2>${Icons.sliders} Custom Split Details</h2>
      <p>Define how much each person pays (either by amount or percentage)</p>
      
      <div style="margin-bottom: 1.5rem;">
        ${items}
      </div>

      <div class="button-group">
        <button class="btn-primary" onclick="handleSplitEvenly()">Split Evenly</button>
        <button class="btn-secondary" onclick="handleReset()" style="width: auto;">Reset</button>
      </div>
    </div>
  `;
}

function renderSummaryView() {
  const splitData = calculateSplit();
  
  if (!splitData) {
    return `
      <div class="card empty-state">
        <p>Enter bill details above to see the split breakdown</p>
      </div>
    `;
  }

  const bill = parseNum(state.billAmount);
  const tipPercent = parseNum(state.tipPercentage);

  let billSummary = `
    <div class="summary-item">
      <div class="summary-item-label">Bill Amount</div>
      <div class="summary-item-value">$${bill.toFixed(2)}</div>
    </div>
  `;

  if (tipPercent > 0) {
    billSummary += `
      <div class="summary-item">
        <div class="summary-item-label">Tip (${tipPercent}%)</div>
        <div class="summary-item-value tip">$${splitData.tipAmount.toFixed(2)}</div>
      </div>
    `;
  }

  billSummary += `
    <div class="summary-item">
      <div class="summary-item-label">Total</div>
      <div class="summary-item-value total">$${splitData.totalAmount.toFixed(2)}</div>
    </div>
  `;

  let shares = '';
  splitData.shares.forEach((share, index) => {
    const percentage = ((share / splitData.totalAmount) * 100).toFixed(1);
    shares += `
      <div class="split-item">
        <div class="split-item-left">
          <div class="split-item-avatar">${index + 1}</div>
          <span class="split-item-name">Person ${index + 1}</span>
        </div>
        <div class="split-item-right">
          <div class="split-item-amount">$${share.toFixed(2)}</div>
          <div class="split-item-percent">${percentage}%</div>
        </div>
      </div>
    `;
  });

  return `
    <div class="card summary-card">
      <h2>${Icons.receipt} Split Summary</h2>
      
      <div class="bill-summary">
        ${billSummary}
      </div>

      <div class="split-breakdown">
        <div class="split-breakdown-title">
          ${splitData.splitType === 'even' ? 'Even Split' : 'Custom Split'} (${splitData.peopleCount} ${splitData.peopleCount === 1 ? 'person' : 'people'})
        </div>
        <div class="split-breakdown-items">
          ${shares}
        </div>
      </div>

      <button class="copy-button" onclick="handleCopyToClipboard(calculateSplit())">
        ${Icons.copy} Copy to Clipboard
      </button>
      <button class="reset-button" onclick="handleReset()">
        ${Icons.rotateReset} Reset All
      </button>
    </div>
  `;
}

function render() {
  const app = document.getElementById('app');
  const numberOfPeople = parseInt(state.numberOfPeople) || 0;
  
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h1>💰 Budget Splitter</h1>
        <p>Split bills easily with friends and family</p>
      </div>

      <div class="main-content">
        ${renderInputSection()}
        ${renderSplitTypeSelector()}
        ${renderCustomSplitForm()}
      </div>

      <div style="display: grid; grid-template-columns: 1fr;">
        ${renderSummaryView()}
      </div>
    </div>
  `;
}

// Initialize
render();
