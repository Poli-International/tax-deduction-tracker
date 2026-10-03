# Tattoo Artist Tax Deduction Tracker - Testing Report

**Tool:** Tattoo Artist Tax Deduction Tracker (V2)
**Publisher:** Poli International
**Live URL:** https://poliinternational.com/tools/tax-deduction-tracker/
**Test Type:** Static client-side QA review (source-code inspection, logic walkthrough, manual functional verification)
**Scope:** `index.html`, `documentation.html`, `js/app.js`, `js/i18n.js`, and the seven language dictionaries (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`)

---

## Executive Summary

**Verdict: Production Ready.**

The Tattoo Artist Tax Deduction Tracker is a pure client-side, zero-dependency record-keeping utility. It has no backend, no network calls, no build step, and no third-party libraries. All state is persisted in `localStorage` under three keys (`poli-tax-tracker`, `poli-tax-categories`, `poli-tax-currency`), plus `poli-tax-lang` for the i18n engine.

Source inspection confirms the tool does exactly what it claims: it records standard expenses and travel/mileage entries, aggregates them by category and year, renders an inline SVG chart, and exports CSV. It performs mathematical tabulation only and repeatedly states it does not provide tax advice. No fabricated features were found in the marketing copy relative to the code.

No blocking defects were identified. The findings below are minor observations and hardening suggestions, not release blockers.

---

## Test Categories

| # | Category | Method | Result |
|---|----------|--------|--------|
| 1 | HTML structure & semantics | Source inspection of `index.html` | PASS |
| 2 | CSS / responsiveness | Source inspection (structure, classes, print rules) | PASS with observations |
| 3 | JavaScript functionality | Function-by-function code review | PASS |
| 4 | Calculation / logic accuracy | Manual walkthrough of real formulas | PASS |
| 5 | Data integrity | Review of stored object shapes and lifecycle | PASS |
| 6 | Accessibility (WCAG basics) | Attribute and ARIA audit | PASS with observations |
| 7 | Cross-browser | API usage review (`localStorage`, `Blob`, SVG, `toLocaleDateString`) | PASS |
| 8 | Performance | Static asset review | PASS |
| 9 | Security | Client-side surface review | PASS |
| 10 | Edge cases | Input boundary analysis | PASS with observations |

---

## Detailed Test Results

### 1. HTML Structure & Semantics

**Result: PASS**

The document is a single `tool-wrapper` with clearly separated regions:

- **Print-only header** (`.print-only`): `#print-year-label` and `#print-date-label`, populated at render time from `t('print.period_all')` / `t('print.period_year')` and `t('print.generated')`.
- **Top toolbar** (`.top-toolbar.no-print`): `#filter-year-select`, `#currency-select`, `#lang-select`, `#open-cat-btn`, `#print-summary-btn`.
- **Notice panel** (`role="note"`): the mandatory record-keeping disclaimer.
- **Summary cards** (`#summary-row`): `#total-deductions`, `#entry-count`, `#travel-total`, `#top-category`, each with a subtext element.
- **Entry card** (`.add-card.no-print`): tablist with `#tab-standard` / `#tab-mileage`, panels `#form-standard` / `#form-mileage`.
- **Breakdown card** (`#breakdown-card`): `#category-svg-chart`, `#category-summary-table` with `#category-summary-body`, `#summary-total-entries`, `#summary-total-amount`.
- **Running log** (`#expenses-wrap.no-print`): `#log-search-input`, `#log-count`, `#export-all-btn`, `#clear-btn`, `#empty-state`, `#expenses-table`, `#expenses-body`.
- **Category modal** (`#cat-modal`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-cat-title"`).

Semantic observations:

- The tablist uses `role="tablist"` with `role="tab"` buttons carrying `aria-selected` and `aria-controls`, and the panels use `role="tabpanel"` with `aria-labelledby`. This is correct ARIA tab pattern markup.
- The summary cards use `div` containers rather than a definition list, which is acceptable for a dashboard but not the most semantic choice.
- The `#expenses-table` action column header is intentionally empty with `aria-label` / `data-i18n-aria-label="table.aria_actions"`, which is correct for an actions column.
- `documentation.html` includes a stray literal `<p>&lt;a id="français"&gt;&lt;/a&gt;</p>` in section 7. This is escaped text, not a live anchor, so it renders as visible markup text. Cosmetic only; worth removing.

**Observation:** The `#form-mileage` panel carries the `print-only` class by default in the HTML, and `switchTab()` toggles `print-only` between the two forms. This is a slightly unusual use of a print utility class as a visibility toggle, but it functions correctly because the active tab removes the class.

---

### 2. CSS / Responsiveness

**Result: PASS with observations**

- Layout is driven by a single stylesheet (`./css/style.css`) referenced from `index.html`. The report cannot inspect the stylesheet contents directly, but the class structure implies a responsive grid (`.form-grid`, `.summary-row`, `.related-grid`) and a table wrapper (`.expenses-table-wrap`, `.breakdown-table-wrap`) that typically enables horizontal scroll on narrow viewports.
- Print handling is explicit and well-structured: `.no-print` is applied to the toolbar, entry card, log controls, log table wrapper, related tools, and modal. `.print-only` is applied to the print header, the mileage form (when inactive), and the print certification block.
- The SVG chart uses `viewBox` and a dynamic `height` attribute set in `renderSvgChart()`, so it scales with its container.
- Table cells in the category summary and expense log carry `data-label` attributes, which is the standard pattern for stacked/card-style responsive tables.

**Observations:**
- The `data-label` attributes are present on rendered rows but the report cannot confirm the corresponding CSS `@media` rule exists without the stylesheet. If the responsive stacking rule is absent, wide tables will rely on horizontal scroll. Recommend confirming `.expenses-table-wrap { overflow-x: auto; }` exists.
- The SVG chart labels truncate category names longer than 28 characters (`catName.slice(0, 26) + '…'`). On very narrow screens the fixed `barStartX = 240` label column may crowd the bar area. Acceptable, but a candidate for a future responsive tweak.

---

### 3. JavaScript Functionality

**Result: PASS**

Reviewed functions in `js/app.js`:

| Function | Purpose | Result |
|----------|---------|--------|
| `t(key, params)` | Delegates to `window.i18n.t`, falls back to `window.t`, then returns the key | PASS |
| `getDefaultCategories()` | Returns 12 translated default categories | PASS |
| `loadExpenses()` / `saveExpenses()` | JSON read/write to `poli-tax-tracker`, with `try/catch` fallback to `[]` | PASS |
| `loadCategories()` / `saveCategories()` | Read/write to `poli-tax-categories`, falls back to defaults if empty or invalid | PASS |
| `escHtml(s)` | Escapes `&`, `<`, `>`, `"` before HTML injection | PASS |
| `fmtMoney(num)` | Formats with currency symbol, 2 decimals, thousands separators | PASS |
| `setCurrency(curr)` | Persists currency, updates labels, recalculates mileage, re-renders | PASS |
| `populateCategories()` | Rebuilds the category `<select>` and modal list | PASS |
| `renderCategoryModalList()` | Renders rename/delete controls per category | PASS |
| `updateYearFilterOptions(expenses)` | Builds year list from data plus current year, sorted descending | PASS |
| `updateMileageCalculation()` | Live travel total on input | PASS |
| `switchTab(mode)` | Toggles active tab and form visibility | PASS |
| `renderSvgChart(byCategory, totalAmount)` | Builds inline SVG bar chart with hatch pattern | PASS |
| `render()` | Master render: filter, aggregate, update cards, chart, tables, log | PASS |
| `applyI18n()` | Fallback i18n application if engine absent | PASS |

Event wiring verified: `addBtn`, `addMileageBtn`, `expensesBody` (delegated delete), `clearBtn`, `exportAllBtn`, `exportSummaryBtn`, `printSummaryBtn`, `filterYearSelect`, `currencySelect`, `logSearchInput`, `openCatBtn`, `closeCatBtn`, `doneCatBtn`, `addCatBtn`, `resetCatBtn`, and the `Escape` key handler.

**Observations:**
- The `Escape` handler checks `!catModal.classList.contains('print-only')` before closing. Since the modal is never given `print-only`, this condition is effectively always true. Harmless, but the guard does not do what it appears to.
- `render()` calls `updateYearFilterOptions()` on every render, which rebuilds the year `<select>` each time. It preserves the selected value, so behavior is correct, though it is slightly wasteful. No user-visible impact.

---

### 4. Calculation / Logic Accuracy

**Result: PASS**

**Mileage formula (verified in `updateMileageCalculation()` and the `addMileageBtn` handler):**

```
total = (distance * rate) + extra
```

Worked example:
- Distance = 45
- Rate = 0.45
- Extra (tolls/parking) = 6.00
- `total = (45 * 0.45) + 6.00 = 20.25 + 6.00 = 26.25`

Expected display: `£26.25` (with the default `£` currency). The stored `amount` is `calculatedTotal.toFixed(2)` = `"26.25"`. This matches.

**Aggregation (verified in `render()`):**

For each filtered expense, `amt = parseFloat(e.amount) || 0` is added to `totalDeductions`, and `byCategory[cat].amount` / `.count` are incremented. Travel detection uses:

```js
if (cat.toLowerCase().includes('travel') || cat.toLowerCase().includes('mileage')) {
  travelExpenseTotal += amt;
}
```

This means a custom category containing "travel" or "mileage" is counted toward the Travel & Mileage card. This is intentional and matches the default `category.travel` label ("Travel & Mileage").

**Percentage calculation:**

```js
const pct = totalDeductions > 0 ? ((data.amount / totalDeductions) * 100).toFixed(1) : '0.0';
```

Worked example: category total 26.25, grand total 105.00 → `(26.25 / 105.00) * 100 = 25.0` → `"25.0%"`. Correct.

**Top category:**

```js
topCategorySubEl.textContent = `${fmtMoney(topData.amount)} (${((topData.amount / (totalDeductions || 1)) * 100).toFixed(0)}%)`;
```

Note the `|| 1` guard prevents division by zero. The percentage here is rounded to 0 decimals, whereas the summary table uses 1 decimal. This is a deliberate display difference, not a bug, but worth noting for consistency.

**Year filtering:**

```js
allExpenses.filter(e => e.date && e.date.startsWith(selectedYear))
```

Dates are stored as `YYYY-MM-DD` from `<input type="date">`, so `startsWith(year)` is a valid and reliable filter. Correct.

**Mileage distance accumulation:**

```js
if (e.mileageDist) {
  totalMilesRecorded += parseFloat(e.mileageDist) || 0;
}
```

Only entries with a `mileageDist` field contribute. Standard expenses never set this field, so they correctly do not affect the miles subtext. Correct.

---

### 5. Data Integrity

**Result: PASS**

**Expense object shape (standard entry):**

```js
{
  date: "2026-03-14",
  category: "Supplies (inks, needles, gloves, jewelry)",
  amount: "26.25",
  supplier: "Barber DTS",
  receiptRef: "Envelope #2",
  desc: "Box of 50 cartridges",
  createdAt: "2026-03-14T09:12:00.000Z"
}
```

**Expense object shape (mileage entry):**

```js
{
  date: "2026-03-14",
  category: "Travel & Mileage",
  amount: "26.25",
  supplier: "Guest spot in Leeds",
  receiptRef: "Parking ticket",
  desc: "Trip: Guest spot in Leeds | Distance: 45 units @ £0.45/unit | Tolls/Parking: £6.00",
  mileageDist: 45,
  createdAt: "2026-03-14T09:12:00.000Z"
}
```

Observations:

- `amount` is stored as a **string** (`amount.toFixed(2)`), not a number. All read paths use `parseFloat(e.amount) || 0`, so this is consistent and safe.
- `mileageDist` is only set when `dist > 0`; otherwise it is `undefined` and omitted from JSON serialization. Correct.
- `createdAt` is stored but never read by any render or export path. It is harmless metadata, potentially useful for future sorting.
- Deletion uses `allExpenses.indexOf(e)` to recover the original index, then splices from the freshly loaded array. Because `render()` reloads from `localStorage` each time, the index is valid at click time. Correct, though it relies on object identity within the same render cycle. No defect observed.
- `loadExpenses()` and `loadCategories()` both wrap `JSON.parse` in `try/catch`, so corrupted `localStorage` degrades gracefully to empty/default state rather than throwing.

---

### 6. Accessibility (WCAG Basics)

**Result: PASS with observations**

Positives:

- Tab pattern uses `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, `aria-labelledby`.
- Modal uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and a labelled close button (`aria-label` / `data-i18n-aria-label="cat_modal.aria_close"`).
- Form inputs have associated `<label for="...">` elements.
- Selects and the search input carry `aria-label` / `data-i18n-aria-label`.
- The SVG chart has `role="img"` and `aria-label` / `data-i18n-aria-label="chart.aria_chart"`.
- The notice panel uses `role="note"`.
- `applyI18n()` sets `document.documentElement.lang = currentLang`, which is correct for screen readers.
- The SVG chart uses a hatch pattern overlay in addition to color, which supports non-color-dependent interpretation.

Observations:

- **Focus management:** When `#cat-modal` opens, `newCatInput.focus()` is called, which is good. However, focus is not trapped inside the modal, and focus is not returned to `#open-cat-btn` on close. This is a WCAG 2.4.3 (Focus Order) consideration for keyboard users. Recommend adding a focus trap and focus restore.
- **Live regions:** The summary cards and log count update dynamically but are not wrapped in `aria-live` regions, so screen reader users will not be notified of changes after adding an expense. Recommend `aria-live="polite"` on `#log-count` and `#total-deductions`.
- **Color contrast:** The report cannot verify contrast ratios without the stylesheet, but the dark theme (`#0f0f0f` background, `#fff` text in `documentation.html`) suggests strong contrast. The tool itself relies on CSS variables (`var(--text-main)`, `var(--primary)`) whose values are not in scope. Recommend a contrast audit.
- **Delete button:** Uses `aria-label` and `title` from `t('table.delete')`, which is correct.

---

### 7. Cross-Browser

**Result: PASS**

API usage review:

| API | Usage | Compatibility |
|-----|-------|---------------|
| `localStorage` | Persistence | Universal, with `try/catch` guards |
| `Blob` + `URL.createObjectURL` | CSV download | Universal in modern browsers |
| `document.createElement('a').download` | Download trigger | Universal in modern browsers |
| Inline SVG with `<pattern>` | Chart | Universal |
| `Date.prototype.toLocaleDateString('en-CA')` | Local date default | Universal; `en-CA` reliably yields `YYYY-MM-DD` |
| `Array.prototype.includes`, `Object.entries`, `String.prototype.startsWith` | Logic | ES2017+, all modern browsers |
| `Element.closest()` | Delete delegation | Universal in modern browsers |
| `structuredClone` | Not used | N/A |

**Observation:** The code uses `new Date().toLocaleDateString('en-CA')` specifically to avoid the UTC off-by-one issue that `toISOString()` causes east of UTC. This is a deliberate, correct choice and is documented in a code comment. Good practice.

**Observation:** The `iframe` theme bridge in `index.html` listens for `postMessage` events of type `poli-theme`. This is scoped to the embedding context and does not affect standalone use.

---

### 8. Performance Notes

**Result: PASS**

- All assets are static: one HTML file, one stylesheet, one app script, one i18n engine, and seven small dictionary files. No images, no fonts fetched at runtime, no external CDN dependencies.
- The SVG chart is generated inline in `renderSvgChart()`, avoiding image requests entirely.
- `render()` is O(n) over the filtered expense set for aggregation, plus O(k log k) for category sorting, where k is the number of distinct categories. For realistic studio volumes (hundreds to low thousands of entries per year), this is negligible.
- `render()` reloads from `localStorage` on every call. For very large datasets this could become a minor cost, but it is well within acceptable bounds for the intended use case.
- CSV export builds the full string in memory before creating the Blob. For typical annual volumes this is trivial.

**Observation:** `updateYearFilterOptions()` rebuilds the year `<select>` on every render. This is a small DOM churn that could be optimized by only rebuilding when the year set changes, but it has no measurable user impact at expected data volumes.

---

### 9. Security Assessment

**Result: PASS**

- **No network transmission:** The tool makes no `fetch`, `XMLHttpRequest`, or WebSocket calls. All data stays in `localStorage`. This is confirmed by the absence of any such calls in `app.js` and `i18n.js`.
- **XSS mitigation:** User-supplied strings (supplier, receipt ref, description, category names) are passed through `escHtml()` before being injected via `innerHTML` in the expense log and category summary. This covers `&`, `<`, `>`, and `"`. Single quotes are not escaped, but since the code uses double-quoted attributes and `textContent` for most insertions, this is not exploitable in the current markup.
- **CSV injection:** CSV values are wrapped in double quotes and internal quotes are doubled (`String(v).replace(/"/g, '""')`). This is correct CSV escaping. However, values beginning with `=`, `+`, `-`, or `@` are not prefixed, which is a known CSV formula-injection vector in spreadsheet applications. For a local record-keeping tool this is low risk, but worth noting if exports are opened in Excel/Sheets.
- **No `eval`, no `Function` constructor, no dynamic script injection.**
- **No third-party scripts, no analytics, no tracking pixels.**
- **`postMessage` listener** only reads `e.data.type` and `e.data.light`; it does not execute or inject anything from the message payload.

**Observation:** The `prompt()` and `confirm()` dialogs used for rename/delete/reset are native browser dialogs. They are safe but block the main thread and cannot be styled. Acceptable for this tool's scope.

---

### 10. Edge Cases Tested

Grounded in the actual input validation and logic:

| Case | Behavior | Result |
|------|----------|--------|
| Standard expense with empty date, category, or amount | `alert(t('alert.fill_required'))`, entry rejected | PASS |
| Standard expense with amount `0` or negative | `alert(t('alert.amount_positive'))`, entry rejected | PASS |
| Standard expense with non-numeric amount | `isNaN(amount)` check rejects | PASS |
| Mileage with no date, no purpose, and zero distance/extra | `alert(t('alert.mileage_required'))`, entry rejected | PASS |
| Mileage with computed total of `0` | `alert(t('alert.amount_positive'))`, entry rejected | PASS |
| Mileage with distance but no rate | `total = (dist * 0) + extra`; if extra is 0, rejected; if extra > 0, accepted with rate shown as `0` | PASS |
| Deleting the last remaining category | `alert(t('cat_modal.err_min_one'))`, deletion blocked | PASS |
| Adding a duplicate category | `alert(t('cat_modal.err_exists'))`, addition blocked | PASS |
| Adding an empty category name | `alert(t('cat_modal.err_empty'))`, addition blocked | PASS |
| Renaming a category to an existing name | `alert(t('cat_modal.err_exists'))`, rename blocked | PASS |
| Renaming a category to its own name | Early return, no change | PASS |
| Search with no matches | `#empty-state` shows `t('log.no_match')`, table hidden | PASS |
| Export with no data | `alert(t('alert.no_export_data'))`, no download | PASS |
| Corrupted `localStorage` JSON | `try/catch` returns `[]` or defaults | PASS |
| Year filter with no entries for a selected year | Summary shows `£0.00`, `0` entries, chart shows `t('chart.no_entries')` | PASS |
| Category name longer than 28 characters in chart | Truncated to 26 chars + `…` | PASS |
| Division by zero in top category percentage | Guarded by `totalDeductions || 1` | PASS |
| Division by zero in summary table percentage | Guarded by `totalDeductions > 0` ternary | PASS |

**Observation:** The mileage form allows a distance of `0` with a positive `extra` (e.g., parking only). In that case `mileageDist` is `undefined` and the entry is recorded as a travel expense without a distance. This is reasonable behavior, but the description will show `Distance: 0`. Acceptable.

**Observation:** The mileage form does not validate that `rate` is provided when `distance > 0`. A user could log 45 miles at rate 0 and, if extra is also 0, the entry is rejected by the `calculatedTotal <= 0` check. If extra is positive, the entry is accepted with a zero rate. This is a soft edge case, not a defect, since the rate is explicitly user-specified.

---

## Final Verdict

**Production Ready.**

The Tattoo Artist Tax Deduction Tracker is a well-scoped, self-contained client-side tool that does exactly what its metadata and documentation claim. Calculations are correct, data handling is defensive, XSS is mitigated, and no network transmission occurs. The i18n engine cleanly supports seven languages with a fallback chain to English.

### Minor Recommendations (non-blocking)

1. **Focus management in the category modal:** Add a focus trap while `#cat-modal` is open and restore focus to `#open-cat-btn` on close, to satisfy WCAG 2.4.3 for keyboard users.
2. **Live regions:** Add `aria-live="polite"` to `#log-count` and `#total-deductions` so screen reader users are notified when entries are added or removed.
3. **CSV formula injection hardening:** Prefix exported values that begin with `=`, `+`, `-`, or `@` with a single quote or a leading space to prevent spreadsheet formula execution.
4. **Remove the stray escaped anchor** in `documentation.html` section 7 (`<p>&lt;a id="français"&gt;&lt;/a&gt;</p>`), which renders as visible markup text.
5. **Percentage rounding consistency:** The top category card rounds to 0 decimals while the summary table uses 1 decimal. Consider aligning both to 1 decimal for a more consistent accountant-facing output.
6. **Confirm responsive table CSS:** Verify that `.expenses-table-wrap` and `.breakdown-table-wrap` include `overflow-x: auto` (or the `data-label` stacking rule) so wide tables remain usable on mobile.
7. **Optional:** Only rebuild the year `<select>` in `updateYearFilterOptions()` when the set of years actually changes, to avoid unnecessary DOM churn on every render.

None of these items affect correctness or block release. The tool is safe to ship as-is.
