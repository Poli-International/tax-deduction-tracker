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

---

## Architecture Overview

### Technology Stack

The Tattoo Artist Tax Deduction Tracker is a **pure client-side, dependency-free static application** built with:

- **HTML5** for markup (`index.html`, `documentation.html`)
- **CSS** for styling (`./css/style.css`, referenced but not included in the provided source)
- **Vanilla JavaScript (ES5/ES6-compatible, IIFE-wrapped)** for all logic
- **`localStorage`** as the sole persistence layer
- **Inline SVG** for the category distribution chart (no external charting library)
- **Blob + `URL.createObjectURL`** for CSV export (no external export library)

No frameworks, no build step, no external runtime dependencies.

### File Structure

```
/
├── index.html                  # Main tool UI
├── documentation.html          # Standalone documentation page
├── css/
│   └── style.css               # Stylesheet (referenced, not provided)
└── js/
    ├── app.js                  # Core application logic
    ├── i18n.js                 # Localization engine
    └── i18n/
        ├── en.js               # English dictionary
        ├── fr.js               # French dictionary
        ├── it.js               # Italian dictionary
        ├── de.js               # German dictionary
        ├── es.js               # Spanish dictionary
        ├── nl.js               # Dutch dictionary
        └── pt.js               # Portuguese dictionary
```

### Component / Logic Breakdown

| Layer | Responsibility |
|---|---|
| `index.html` | Static markup: toolbar, summary cards, expense form, mileage form, category summary table, running ledger, category modal, print-only header/footer |
| `js/i18n.js` | Registers dictionaries, resolves `t(key, params)`, applies `data-i18n*` attributes to the DOM, persists language choice |
| `js/i18n/*.js` | Language dictionaries registered via `window.i18n.register(lang, dict)` |
| `js/app.js` | All state management, form handling, aggregation, SVG rendering, CSV export, category CRUD, print trigger |

The app is wrapped in an IIFE (`(function () { 'use strict'; ... })()`) so no globals leak except the intentionally exposed `window.t` and `window.onLanguageChange`.

---

## Data Schemas

### Expense Record

Stored as an array of objects under the `localStorage` key `poli-tax-tracker`.

```js
{
  date:       "2026-03-14",           // string, YYYY-MM-DD
  category:   "Equipment & Machines", // string, must match a category
  amount:     "42.50",                // string, 2-decimal fixed
  supplier:   "Inkjecta",             // string, may be ""
  receiptRef: "Binder 2026",          // string, may be ""
  desc:       "Box of 50 cartridges", // string, may be ""
  mileageDist: 45,                    // number, OPTIONAL (mileage entries only)
  createdAt:  "2026-03-14T09:12:00.000Z" // ISO timestamp
}
```

Notes grounded in code:

- `amount` is stored as a **string** via `amount.toFixed(2)`.
- `mileageDist` is only set when `dist > 0`; otherwise the property is `undefined` and omitted.
- Mileage entries reuse the same schema; the trip purpose is stored in `supplier`, and a formatted summary string is stored in `desc` (see `mileage.notes_format`).

### Categories Array

Stored under `localStorage` key `poli-tax-categories` as a plain array of strings:

```js
["Equipment & Machines", "Supplies (inks, needles, gloves, jewelry)", ...]
```

Defaults are produced by `getDefaultCategories()`, which resolves 12 translation keys:

```
category.equipment, category.supplies, category.studio_rent,
category.sterilisation, category.education, category.licences,
category.insurance, category.software, category.marketing,
category.travel, category.utilities, category.other
```

### Currency

Stored under `localStorage` key `poli-tax-currency` as a single string symbol. Supported values (from the `<select>` options):

`£`, `$`, `€`, `CHF`, `kr`, `¥`

### Language

Stored under `localStorage` key `poli-tax-lang`. Supported values: `en`, `fr`, `it`, `de`, `es`, `nl`, `pt`.

### Aggregation Object (in-memory only)

Built inside `render()` as `byCategory`:

```js
{
  "Equipment & Machines": { amount: 120.00, count: 3 },
  "Travel & Mileage":     { amount: 84.50,  count: 2 }
}
```

---

## Calculation / Logic Algorithms

### 1. `fmtMoney(num)`

Formats a number with the active currency symbol and thousands separators.

```
result = currentCurrency + Number(num).toFixed(2)
         .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
```

Example: `fmtMoney(1234.5)` with `£` → `£1,234.50`.

### 2. `updateMileageCalculation()`

Live-computes the mileage total as the user types.

```
dist  = parseFloat(mileageDistance.value) || 0
rate  = parseFloat(mileageRate.value)      || 0
extra = parseFloat(mileageExtra.value)     || 0
total = (dist * rate) + extra
mileageCalcTotal.textContent = fmtMoney(total)
```

Bound to `input` events on `#mileage-distance`, `#mileage-rate`, and `#mileage-extra`.

### 3. `render()`, Main Aggregation Pipeline

Steps performed in order:

1. `loadExpenses()` reads the full array from `localStorage`.
2. `updateYearFilterOptions(allExpenses)` rebuilds the year dropdown from the current year plus every distinct `YYYY` prefix found in `date` fields.
3. Filter by `filterYearSelect.value`:
   - `"all"` → use all expenses
   - otherwise → `e.date.startsWith(selectedYear)`
4. Iterate filtered expenses and accumulate:
   - `totalDeductions += parseFloat(e.amount) || 0`
   - `byCategory[cat].amount += amt` and `.count += 1`
   - If `cat.toLowerCase()` contains `"travel"` or `"mileage"`, add `amt` to `travelExpenseTotal`
   - If `e.mileageDist` is truthy, add it to `totalMilesRecorded`
5. Update the four summary cards:
   - **Total Recorded Expenses** = `fmtMoney(totalDeductions)`
   - **Entries Logged** = `filteredExpenses.length`
   - **Travel & Mileage** = `fmtMoney(travelExpenseTotal)`, with subtext either `"X miles recorded"` or `"Expenses & fares"`
   - **Top Category** = highest-amount category, subtext `"£X (N%)"` where `N = round(amount / totalDeductions * 100)`
6. Call `renderSvgChart(byCategory, totalDeductions)`.
7. Rebuild the category summary table rows (sorted descending by amount), with per-row percentage `(amount / totalDeductions * 100).toFixed(1)`.
8. Apply the search filter to the ledger:
   - `searchQuery` is lowercased and matched against `supplier`, `desc`, `category`, and `receiptRef` via `String.includes`.
9. Render the ledger rows in **reverse chronological order** using `[...ledgerExpenses].reverse()`, mapping each back to its original index via `allExpenses.indexOf(e)` so the delete button can target the correct record.

### 4. `renderSvgChart(byCategory, totalAmount)`

Generates an inline SVG horizontal bar chart.

- If no entries or `totalAmount <= 0`, renders a single `<text>` node with the `chart.no_entries` string.
- Otherwise:
  - `rowHeight = 38`, `chartHeight = entries.length * 38 + 20`, `chartWidth = 740`
  - `barStartX = 240`, `barMaxWidth = 360`
  - Entries sorted descending by amount; `maxCatAmount` = first entry's amount
  - For each row:
    - `pct = (data.amount / totalAmount) * 100`
    - `barW = max(4, round((data.amount / maxCatAmount) * barMaxWidth))`
    - Category label truncated to 26 chars + `…` if longer than 28
    - Value label formatted as `"£X (P%)"`
  - A `<pattern id="bar-hatch">` overlay at `opacity="0.25"` provides high-contrast hatching for print and accessibility.

### 5. CSV Export, Full Log (`exportAllBtn` handler)

- Filters by the selected year (or all).
- Header from `csv.header_full`:
  `Date,Category,Amount,Supplier,Receipt_Reference,Description`
- Each row is built by mapping the six fields, wrapping each in double quotes, and escaping internal quotes by doubling them (`"` → `""`).
- Rows joined with `\r\n`.
- Blob type: `text/csv;charset=utf-8;`
- Filename: `tax-deductions-{year|all}.csv`

### 6. CSV Export, Category Summary (`exportSummaryBtn` handler)

- Aggregates the filtered set into `byCategory` with `{ count, amount }`.
- Header from `csv.header_summary`:
  `Year,Category,Entries_Count,Total_Amount,Percent_Of_Total`
- Rows sorted descending by amount; percentage = `(amount / total * 100).toFixed(1) + '%'`.
- A final `TOTAL` row is appended with the total count, total amount, and `"100%"`.
- Filename: `tax-category-summary-{year|all}.csv`

### 7. Mileage Submission (`addMileageBtn` handler)

Validation:

- Requires `date` AND at least one of (`purpose`, `dist > 0`, `extra > 0`).
- Requires `calculatedTotal > 0`.

Category resolution:

```js
targetCategory = categories.find(c =>
  c.toLowerCase().includes('travel') || c.toLowerCase().includes('mileage')
) || categories[0] || t('mileage.travel_category');
```

Description is built from `mileage.notes_format`:

```
"Trip: {purpose} | Distance: {dist} @ {rate}/unit | Tolls/Parking: {extra}"
```

### 8. Standard Expense Submission (`addBtn` handler)

Validation:

- `date`, `category`, and `amountStr` must all be non-empty.
- `parseFloat(amountStr)` must be a number `> 0`.

On success, pushes a record and clears `amount`, `supplier`, `receiptRef`, and `desc` (date and category are preserved).

---

## API Reference

All functions below are defined inside the `app.js` IIFE. Only `window.t` and `window.onLanguageChange` are exposed globally.

### `t(key, params)` → `string`

Translation lookup. Delegates to `window.i18n.t` if available; otherwise falls back to `window.t`; otherwise returns the key itself. Supports `{placeholder}` interpolation via `params`.

### `getDefaultCategories()` → `string[]`

Returns the 12 default category labels resolved through `t()`.

### `loadExpenses()` → `object[]`

Reads and JSON-parses `localStorage['poli-tax-tracker']`. Returns `[]` on parse failure.

### `saveExpenses(expenses)` → `void`

Serializes and writes the array to `localStorage['poli-tax-tracker']`.

### `loadCategories()` → `string[]`

Reads `localStorage['poli-tax-categories']`. Falls back to `getDefaultCategories()` if the stored value is missing, non-array, or empty.

### `saveCategories(categories)` → `void`

Persists the category array.

### `escHtml(s)` → `string`

Escapes `&`, `<`, `>`, and `"` for safe HTML interpolation. Used on every user-supplied string before it is inserted via `innerHTML`.

### `fmtMoney(num)` → `string`

Currency-prefixed, thousands-separated, 2-decimal string.

### `setCurrency(curr)` → `void`

Updates `currentCurrency`, persists it, syncs the `<select>`, updates the amount label and addon symbol, recalculates mileage, and re-renders.

### `populateCategories()` → `void`

Rebuilds the category `<select>` options from `loadCategories()`, preserving the current selection when possible, then calls `renderCategoryModalList()`.

### `renderCategoryModalList()` → `void`

Renders the category list inside the modal, wiring **Rename** (via `prompt`) and **Delete** (via `confirm`) buttons. Enforces a minimum of one category and rejects duplicate names.

### `updateYearFilterOptions(expenses)` → `void`

Rebuilds the year `<select>` from the current year plus all distinct `YYYY` prefixes found in `date` fields, sorted descending. Preserves the previous selection when still valid.

### `updateMileageCalculation()` → `void`

Recomputes and displays the live mileage total (see Algorithm 2).

### `switchTab(mode)` → `void`

`mode` is `'standard'` or `'mileage'`. Toggles `is-active` and `aria-selected` on the tabs, and toggles the `print-only` class on the two forms.

### `renderSvgChart(byCategory, totalAmount)` → `void`

Generates the inline SVG bar chart (see Algorithm 4).

### `render()` → `void`

The master render pipeline (see Algorithm 3). Called after every mutation and on year/currency/search changes.

### `applyI18n()` → `void`

Applies translations to all `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria-label]`, and `[data-i18n-title]` elements. Delegates to `window.i18n.applyI18n` when available.

### `window.onLanguageChange(lang)` → `void`

Hook invoked by `i18n.setLang()` after a language switch. (Body is truncated in the provided source.)

### i18n Engine (`js/i18n.js`)

| Function | Signature | Behavior |
|---|---|---|
| `register` | `(lang, dict)` | Stores a dictionary under the given language code |
| `getLang` | `()` → `string` | Returns the active language code |
| `setLang` | `(lang)` | Persists to `localStorage['poli-tax-lang']`, applies i18n, fires `onLanguageChange` |
| `t` | `(key, params)` → `string` | Looks up in the active dict, falls back to English, then to the raw key; interpolates `{name}` placeholders |
| `applyI18n` | `()` | Walks the DOM applying `data-i18n*` attributes; sets `document.documentElement.lang` |

---

## Integration Guide

### Standalone Embedding

The tool is a static, dependency-free bundle. To embed:

**Direct link:**
```
https://poliinternational.com/tools/tax-deduction-tracker/
```

**Iframe:**
```html
<iframe
  src="https://poliinternational.com/tools/tax-deduction-tracker/"
  title="Tattoo Artist Tax Deduction Tracker"
  width="100%"
  height="900"
  style="border:0;"
  loading="lazy">
</iframe>
```

### Iframe Theme Bridge

`index.html` includes an inline script that detects iframe embedding (`window.self !== window.top`) and:

1. Sets `data-theme="dark"` on `<html>` by default.
2. Listens for `postMessage` events of shape `{ type: 'poli-theme', light: boolean }` and toggles `data-theme` between `"light"` and `"dark"`.

The parent page can therefore drive the theme:

```js
iframe.contentWindow.postMessage({ type: 'poli-theme', light: true }, '*');
```

### Data Isolation

All data is scoped to the origin's `localStorage`. If the tool is embedded from a different origin than the parent, its storage is isolated to that origin. No data is transmitted to any server.

### Dependencies

None. No CDN scripts, no fonts, no analytics, no external API calls. The only network requests are for the local `css/style.css` and the local `js/*.js` files.

---

## Customization

### Categories

End users customize categories at runtime via the **Categories** (⚙️) modal:

- **Add**, type a name and press Enter or click **Add**. Duplicates are rejected with `cat_modal.err_exists`.
- **Rename**, inline button per row; uses `prompt()`; rejects empty and duplicate names.
- **Delete**, inline button per row; blocked when only one category remains (`cat_modal.err_min_one`); requires `confirm()`.
- **Reset to Defaults**, restores the 12 built-in categories after `confirm()`.

Existing expense records retain their original category string even if the category is later renamed or deleted (confirmed by the `cat_modal.confirm_delete` copy).

### Currency

Six currency symbols are selectable from the toolbar. Changing the currency updates the amount label, the input addon symbol, the mileage calculation, and every rendered total.

### Language

Seven languages are shipped (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`). Adding a new language requires:

1. Creating `js/i18n/<code>.js` that calls `window.i18n.register('<code>', { ... })`.
2. Adding a `<script src="./js/i18n/<code>.js"></script>` tag in `index.html` before `app.js`.
3. Adding an `<option value="<code>">` to `#lang-select`.
4. Extending the validation list in `js/i18n.js` (`saved === 'en' || ...`) if persistence for the new code is desired.

### Theming

The stylesheet is not included in the provided source, but the code references CSS custom properties including `--text-main`, `--text-muted`, `--bg-input`, `--border`, and `--primary`. These are the intended theming hooks for the SVG chart and surrounding UI.

---

## Performance

- **No network I/O at runtime.** All reads and writes are synchronous `localStorage` operations.
- **Full re-render on every mutation.** `render()` rebuilds the summary cards, SVG chart, category table, and ledger from scratch. This is acceptable for typical annual expense volumes (hundreds to low thousands of entries) but is O(n) per render.
- **SVG chart is regenerated as a single `innerHTML` assignment**, avoiding per-node DOM churn.
- **Ledger uses `innerHTML` with a mapped string**, not per-row `createElement` calls.
- **Search filtering** runs on every `input` event against four fields per record via `String.includes`.
- **CSV export** builds the entire file in memory as a single string before creating the Blob.

---

## Browser Compatibility

The code targets modern evergreen browsers and uses:

- `localStorage` (with `try/catch` guards around reads and writes)
- `Array.prototype.find`, `Array.prototype.includes`, `Array.prototype.some`
- `Object.entries`
- Template literals, arrow functions, `const`/`let`, spread (`[...arr].reverse()`)
- `Blob` and `URL.createObjectURL` for CSV download
- `Date.prototype.toLocaleDateString('en-CA')` for local `YYYY-MM-DD` (chosen deliberately over `toISOString()` to avoid UTC off-by-one issues for users east of UTC)
- Inline SVG with `<pattern>` and `patternTransform`
- `window.postMessage` for the iframe theme bridge

No polyfills are included. Internet Explorer is not supported.

---

## Security

### XSS Mitigation

Every user-supplied string rendered into the DOM passes through `escHtml(s)` before interpolation into `innerHTML`. This applies to:

- Category names in the summary table and ledger
- Supplier, receipt reference, and description fields in the ledger
- Category labels in the SVG chart
- `data-label` attributes on table cells
- `title` attributes on description cells
- `aria-label` attributes on delete buttons

`escHtml` escapes `&`, `<`, `>`, and `"`. Note that single quotes are not escaped, but no code path interpolates user input into a single-quoted HTML attribute.

### Data Residency

No data leaves the browser. There are no `fetch`, `XMLHttpRequest`, `navigator.sendBeacon`, or WebSocket calls anywhere in the source. All persistence is `localStorage`-only.

### Input Validation

- Standard expense: `date`, `category`, and `amount` are required; `amount` must parse to a number `> 0`.
- Mileage: `date` plus at least one of `purpose` / `distance` / `extra` is required; the computed total must be `> 0`.
- Categories: empty names rejected; duplicates rejected; at least one category must remain.

### Destructive Actions

Deleting an expense, clearing all records, deleting a category, and resetting categories all require a `confirm()` dialog.

### Iframe Isolation

When embedded, the tool only accepts `postMessage` events of shape `{ type: 'poli-theme', light: boolean }` and only mutates the `data-theme` attribute in response. No data is read from or written to the parent frame.

---

## Version History

### 1.0.0

Initial documented release. The UI badge and documentation page both label this build as **V2** ("Tax Deduction Tracker V2"), reflecting the current feature set:

- Standard expense entry with date, category, amount, supplier, receipt reference, and description
- Travel & mileage log with live-calculated total (`distance × rate + extras`)
- Year filter with automatic discovery of years present in the data
- Four summary cards: Total Recorded Expenses, Entries Logged, Travel & Mileage, Top Category
- Inline SVG category distribution chart with print-friendly hatching
- Annual category summary table with per-category counts, totals, and percentage share
- Running expense ledger with full-text search across supplier, description, category, and receipt reference
- Two CSV exports: full log and category summary
- Print-optimized summary sheet with signature and date lines
- Customizable categories (add, rename, delete, reset)
- Six currencies and seven languages
- Iframe theme bridge via `postMessage`

---

## Support / Contact

For questions, bug reports, or feature requests regarding the Tattoo Artist Tax Deduction Tracker:

**Email:** support@poliinternational.com

This tool is provided free by Poli International as a record-keeping aid. It performs mathematical tabulation only and does not provide tax, legal, or financial advice. Consult a licensed accountant or tax professional before filing.
