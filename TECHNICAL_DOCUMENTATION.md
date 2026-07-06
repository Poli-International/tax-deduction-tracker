# Tattoo Artist Tax Deduction Tracker - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support / Contact](#support--contact)

## Architecture Overview

### Technology Stack

- **HTML5**, Semantic markup with ARIA-friendly structure
- **CSS3**, Single stylesheet (`/tools/tax-deduction-tracker/css/style.css`)
- **Vanilla JavaScript (ES6)**, No frameworks, no libraries, no dependencies
- **localStorage API**, Client-side persistence
- **No server-side code**, Fully client-side; no data leaves the browser

### File Structure

```
/tools/tax-deduction-tracker/
├── index.html          # Main tool page
├── css/
│   └── style.css       # All styling
└── js/
    └── app.js          # All application logic
```

### Component / Logic Breakdown

| Component | Responsibility |
|-----------|---------------|
| **Expense Form** | Collects date, category, amount, supplier, description |
| **Summary Row** | Displays total deductions, entry count, top category |
| **Category Breakdown** | Shows per-category totals with horizontal bar chart |
| **Expense Log Table** | Lists all expenses in reverse chronological order with delete buttons |
| **Export CSV** | Generates and downloads a CSV file of all expenses |
| **Clear All** | Removes all data from localStorage after confirmation |

## Data Schemas

### localStorage Key

```
poli-tax-tracker
```

### Expense Object (single entry in the array)

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `date` | `string` | Yes | ISO date string (YYYY-MM-DD) | `"2025-04-01"` |
| `category` | `string` | Yes | One of 12 predefined categories | `"Supplies (inks, needles, gloves)"` |
| `amount` | `string` | Yes | Numeric value as string (stored from input) | `"45.00"` |
| `supplier` | `string` | No | Vendor or source name | `"Inkjecta"` |
| `desc` | `string` | No | Free-text description | `"FK Irons Spektra Edge II rotary machine"` |

### Expenses Array

```json
[
  {
    "date": "2025-04-01",
    "category": "Supplies (inks, needles, gloves)",
    "amount": "45.00",
    "supplier": "Inkjecta",
    "desc": "Black ink bottles"
  },
  {
    "date": "2025-04-02",
    "category": "Studio / Booth Rent",
    "amount": "350.00",
    "supplier": "",
    "desc": "April booth rent"
  }
]
```

### Predefined Categories (from `<select>` options)

```
Equipment & Machines
Supplies (inks, needles, gloves)
Studio / Booth Rent
Apprenticeship / Training
Professional Membership
Marketing & Advertising
Software & Subscriptions
Travel (studio-related)
Insurance
Sterilisation & PPE
Photography & Promotion
Other business expense
```

## Calculation / Logic Algorithms

### `load()`

**Purpose:** Retrieve expenses from localStorage.

**Steps:**
1. Call `localStorage.getItem('poli-tax-tracker')`
2. Parse the JSON string into an array
3. Return the array (empty array if no data exists)

### `save(expenses)`

**Purpose:** Persist expenses to localStorage.

**Steps:**
1. Accept an array of expense objects
2. Serialize to JSON string
3. Store under key `poli-tax-tracker` via `localStorage.setItem()`

### `render()`

**Purpose:** Rebuild the entire UI from current data.

**Steps:**
1. Load expenses via `load()`
2. Update log count text (e.g., "3 expenses")
3. If no expenses exist: show empty state, hide table, summary, and breakdown
4. If expenses exist:
   - Calculate total deductions: `reduce` over all amounts, parse each as float, sum
   - Display total with `fmtMoney()` (e.g., "£395.00")
   - Display entry count
   - Build category map: iterate expenses, accumulate amounts per category
   - Determine top category by sorting entries by amount descending, take first
   - Render category breakdown bars: for each category, calculate width as `(categoryAmount / maxCategoryAmount) * 100` percent
   - Render table rows in reverse chronological order (newest first)
   - Attach `data-idx` attribute to each delete button for index reference

### `fmtMoney(n)`

**Purpose:** Format a number as UK currency.

**Steps:**
1. Prefix with `£`
2. Call `n.toFixed(2)` for two decimal places
3. Apply regex `\B(?=(\d{3})+(?!\d))` to insert comma thousands separators

### `escHtml(s)`

**Purpose:** Sanitize strings for safe HTML insertion.

**Steps:**
1. Convert to string
2. Replace `&` with `&amp;`
3. Replace `<` with `&lt;`
4. Replace `>` with `&gt;`
5. Replace `"` with `&quot;`

## API Reference

All functions are internal to `app.js` and not exposed globally.

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `load()` | None | `Array` | Reads expenses from localStorage |
| `save(expenses)` | `expenses: Array` | `undefined` | Writes expenses to localStorage |
| `render()` | None | `undefined` | Rebuilds all UI elements from current data |
| `fmtMoney(n)` | `n: Number` | `String` | Formats number as "£1,234.56" |
| `escHtml(s)` | `s: String` | `String` | HTML-escapes a string |

### Event Handlers

| Handler | Trigger | Behavior |
|---------|---------|----------|
| `addBtn click` | User clicks "Add Expense" | Validates inputs, creates expense object, saves, resets form, re-renders |
| `expensesBody click` | User clicks delete button (`.del-btn`) | Confirms deletion, removes expense by index, saves, re-renders |
| `exportBtn click` | User clicks "Export CSV" | Generates CSV string, creates download link, triggers download |
| `clearBtn click` | User clicks "Clear All" | Confirms, removes localStorage key, re-renders |

## Integration Guide

### Standalone Embedding

The tool is fully self-contained and dependency-free. Embed via iframe:

```html
<iframe
  src="https://poliinternational.com/tools/tax-deduction-tracker/"
  width="100%"
  height="800"
  frameborder="0"
  title="Tattoo Artist Tax Deduction Tracker"
></iframe>
```

### Theme Support (iframe only)

When embedded in an iframe, the tool listens for `message` events:

```javascript
// From parent window
iframe.contentWindow.postMessage({
  type: 'poli-theme',
  light: true   // or false for dark
}, '*');
```

The tool defaults to dark theme when detected inside an iframe.

### Data Persistence

All data is stored in `localStorage` under key `poli-tax-tracker`. Data persists across sessions and page reloads. Clearing browser storage or using private/incognito mode will reset data.

## Customization

### Adding Categories

Modify the `<select id="expense-category">` in `index.html`:

```html
<option value="New Category">New Category</option>
```

No JavaScript changes required; the tool dynamically reads all option values.

### Changing Currency Symbol

Replace `£` in `fmtMoney()` within `app.js`:

```javascript
function fmtMoney(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
```

### Styling

All visual styles are in `/tools/tax-deduction-tracker/css/style.css`. Key classes:

- `.summary-card`, Summary statistics cards
- `.cat-bar`, Category breakdown bar width
- `.log-table`, Expense log table
- `.add-card`, Input form container

## Performance

- **Zero network requests** after initial page load (no CDN, no API calls)
- **O(n) operations** for render (single pass over expenses array)
- **localStorage** operations are synchronous and fast for typical datasets (hundreds of entries)
- **No reflows** beyond standard DOM updates on render
- Suitable for thousands of expense entries without noticeable lag

## Browser Compatibility

| Feature | Support |
|---------|---------|
| `localStorage` | IE 8+, all modern browsers |
| `fetch` / `Promise` | Not used |
| `Arrow functions` | ES6, Chrome 49+, Firefox 52+, Safari 10+, Edge 14+ |
| `template literals` | ES6, Chrome 41+, Firefox 34+, Safari 9+, Edge 12+ |
| `Array.prototype.reduce` | IE 9+, all modern browsers |
| `Element.closest()` | IE 9+ (polyfill not needed for modern targets) |

Minimum practical support: **Chrome 49+, Firefox 52+, Safari 10+, Edge 14+**

## Security

### Input Handling

- **HTML escaping**: All user-supplied text is passed through `escHtml()` before insertion into the DOM, preventing XSS attacks
- **CSV injection prevention**: Values are wrapped in double quotes and internal quotes are escaped (`""`)
- **No innerHTML with unsanitized data**: Only escaped strings are used in template literals
- **No eval() or dynamic code execution**

### Data Privacy

- All data remains in the user's browser (`localStorage`)
- No data is transmitted to any server
- No cookies, tracking, or analytics are used within the tool
- The tool includes a visible disclaimer about consulting tax professionals

### localStorage Considerations

- Data is accessible to any JavaScript running on the same origin
- Clearing browser data removes all stored expenses
- No encryption is applied (standard for client-side tools)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-04-01 | Initial release |

## Support / Contact

For technical issues, feature requests, or integration questions:

- **Email:** support@poliinternational.com
- **Website:** https://poliinternational.com
- **Tool URL:** https://poliinternational.com/tools/tax-deduction-tracker/

---

*This documentation reflects the tool as of version 1.0.0. The tool is provided as-is for record-keeping purposes. Tax deductibility should be verified with a qualified accountant.*
