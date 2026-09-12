# Tattoo Artist Tax Deduction Tracker: Technical Documentation

**Author:** Poli International Co., Ltd.  
**Version:** 2.0.0  
**License:** MIT  

---

### Language Editions / Éditions linguistiques / Edizioni linguistiche / Sprachausgaben / Ediciones por idioma / Taaluitgaven / Edições por idioma

- [English (en)](TECHNICAL-DOCS.en.md)
- [Français (fr)](TECHNICAL-DOCS.fr.md)
- [Italiano (it)](TECHNICAL-DOCS.it.md)
- [Deutsch (de)](TECHNICAL-DOCS.de.md)
- [Español (es)](TECHNICAL-DOCS.es.md)
- [Nederlands (nl)](TECHNICAL-DOCS.nl.md)
- [Português (pt)](TECHNICAL-DOCS.pt.md)

---

## 1. Architecture Overview

The **Tattoo Artist Tax Deduction Tracker** is a high-performance, client-side single-page application (SPA) created for tattoo artists, body piercers, and studio owners. It runs entirely inside the user's web browser, requiring no backend servers, database administration, or external network connections.

### Technology Stack
- **Markup:** Semantic HTML5 with ARIA landmark roles, accessible form labels, and `data-i18n` attribute hooks.
- **Styling:** Modern CSS3 featuring CSS custom properties (variables) for dynamic light and dark theme switching, responsive viewports, and dedicated `@media print` rules.
- **Runtime Logic:** Modular native ECMAScript 6+ (ES6+) encapsulated within an immediately invoked function expression (IIFE); zero runtime frameworks or heavy bundles.
- **Localization Engine:** Client-side i18n system (`js/i18n.js`) with dedicated per-language dictionary modules (`js/i18n/*.js`) supporting 7 languages.
- **Persistence:** Web Storage API (`window.localStorage`).
- **Data Visualization:** Dynamic inline Scalable Vector Graphics (SVG) rendered directly into the Document Object Model (DOM); no canvas bitmap rendering or third-party chart dependencies.
- **Security & Content Security Policy (CSP):** Strict `script-src 'self'` compliance; zero external fonts, remote stylesheets, CDNs, or telemetry trackers.

---

## 2. Data Schemas & LocalStorage

All application data persists in the client's `localStorage` across four isolated keys:

### 2.1. `poli-tax-tracker` (Expense Ledger)
Stores an array of expense records serialized as JSON:

```typescript
interface ExpenseRecord {
  date: string;          // ISO date string (YYYY-MM-DD)
  category: string;      // Category classification
  amount: string;        // Numerical amount formatted to 2 decimal places (e.g. "45.00")
  supplier?: string;     // Payee, supplier, or travel purpose
  receiptRef?: string;   // Reference to physical or digital receipt location
  desc?: string;         // Line-item notes, description, or mileage breakdown
  mileageDist?: number;  // Recorded travel distance (if logged via mileage tab)
  createdAt: string;     // ISO timestamp of record creation
}
```

### 2.2. `poli-tax-categories` (Category List)
Stores an array of custom category strings:

```json
[
  "Equipment & Machines",
  "Supplies (inks, needles, gloves, jewelry)",
  "Studio / Booth Rent",
  "Sterilisation, PPE & Waste Disposal",
  "Apprenticeship & Education",
  "Professional Licences & Memberships",
  "Insurance",
  "Software, POS & Subscriptions",
  "Marketing, Website & Advertising",
  "Travel & Mileage",
  "Studio Utilities & Upkeep",
  "Other Business Expenses"
]
```

### 2.3. `poli-tax-currency` (Active Currency Symbol)
Stores a string representing the user's active currency symbol (`£`, `$`, `€`, `CHF`, `kr`, `¥`). Defaults to `£`.

### 2.4. `poli-tax-lang` (Active Language Code)
Stores a string representing the user's active interface language (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`). Defaults to browser locale or `en`.

---

## 3. Calculation & Business Logic

### 3.1. Tabulation and Year Filtering
1. **Filtering:** Records are filtered where `date.startsWith(selectedYear)`. When "all" is selected, all historical records are retained.
2. **Total Calculation:** Aggregated with floating-point precision:  
   `total = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0)`.
3. **Category Breakdown:** Grouped by category into `{ [categoryName]: { amount: number, count: number } }`.
4. **Proportional Share:** For each category, `percentage = (categoryAmount / total) * 100`, rounded to one decimal place.

### 3.2. Mileage & Travel Calculation
- **Formula:** `Calculated Total = (Distance * Rate) + Tolls_Parking_Transit`
- When saved, a transaction entry is generated under the designated travel category with the exact formula parameters preserved in the `desc` field.

### 3.3. Currency Formatting (`fmtMoney`)
Prefixes the active currency symbol, fixes decimals to two places, and injects thousands commas using the regular expression `\B(?=(\d{3})+(?!\d))`.

---

## 4. UI Components & SVG Visualisation

### 4.1. Inline SVG Category Chart
- Renders an inline horizontal stacked bar chart or categorical breakdown directly into an `<svg>` element.
- Employs distinct high-contrast fill patterns (diagonal hatching, dots, solid fills) to guarantee readability on black-and-white paper printouts and for users with color vision deficiencies.

### 4.2. Responsive Viewport Mechanics
- **Desktop (>960px):** 4-column KPI metric summary row, full ledger table, and side-by-side forms.
- **Tablet (641px - 960px):** 2x2 metric grid, horizontally scrollable data table with touch momentum (`-webkit-overflow-scrolling: touch`).
- **Mobile (<=640px):** Table layout converts into stacked card elements using CSS `display: block` and `data-label` pseudo-elements (`::before`), eliminating horizontal scroll.

---

## 5. Internationalisation Framework (`js/i18n.js`)

- **Architecture:** `js/i18n.js` initializes `window.i18n` with a registration registry `window.i18n.register(lang, dict)`.
- **Synchronous Loading:** Language dictionary files (`js/i18n/*.js`) load immediately after `js/i18n.js` in synchronous document order.
- **Dynamic Attribute Binding:** `window.i18n.applyI18n()` sweeps DOM elements matching `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria-label]`, and `[data-i18n-title]`.
- **Runtime Interpolation:** Supports token interpolation `{token}` (e.g. `{year}`, `{date}`, `{count}`, `{dist}`) without external templating libraries.

---

## 6. Print & Export Engine

### 6.1. Print Stylesheet (`@media print`)
- Hides input forms, toolbar controls, action buttons, search bars, and navigation elements.
- Forces high-contrast 100% black text on crisp white background.
- Emits dedicated accountant summary headers, period ranges, timestamp lines, and signature lines.

### 6.2. CSV Export Engine
Generates clean UTF-8 CSV data strings encoded as data URIs (`data:text/csv;charset=utf-8,`) and triggers browser download via transient DOM `<a>` anchors with automatic memory cleanup.

---

## 7. Security, Privacy & Compliance

- **Strict CSP:** Zero external requests; compatible with `script-src 'self'` and `style-src 'self'`.
- **Privacy by Design:** Zero transmission of user financial figures or notes to external cloud services or telemetry trackers; data remains strictly inside the user's browser.
- **XSS Prevention:** All dynamic data injections pass through an HTML entity sanitizer (`escHtml()`).
