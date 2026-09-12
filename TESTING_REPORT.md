# Tattoo Artist Tax Deduction Tracker V2: Testing Report

**Tested:** 2026-09-13, before release to https://poliinternational.com/tax-deduction-tracker/

This report lists only what was actually run. It replaces an earlier generated
report that claimed cross-browser passes (Chrome, Firefox, Safari, Edge) no one
had performed.

## What was tested, and how

All checks ran in headless Chromium 141, serving the tool at its real site path
`/tools/tax-deduction-tracker/` under the site's `script-src 'self'` policy.

| Check | Result |
|---|---|
| Page loads with no JavaScript errors and no failed requests | Pass |
| No external script, stylesheet or network call | Pass (0 found) |
| French and German interface: no English left in visible text | Pass |
| Locale files: same 147 values in all 7 languages, none copied from another language | Pass |
| Add a standard expense (123.45): total, entry count, ledger row, category summary row and SVG chart update | Pass |
| Mileage line: 100 units at 0.50 plus 10.00 tolls calculates 60.00 and adds to the travel total | Pass |
| CSV export: header row, every field quoted, one row per entry | Pass |
| Entries persist after a page reload (localStorage) | Pass |
| Default entry date is the local calendar date | Pass after fix (see below) |

## Defects found and fixed before release

1. **Entries dated yesterday east of UTC.** The default date used
   `toISOString()`, which is UTC, so an expense logged before UTC midnight in
   Asia or Australia was dated the previous day. Now uses the local date.
2. **"Total Deductions" label.** The tool records spending; it does not decide
   what is deductible. Relabelled "Total Recorded Expenses" in all 7 languages.
3. **Mileage rate placeholder was a real tax rate (0.45).** Now a neutral 0.00.
4. **Related-tool links opened the bare embedded page** instead of the tool's
   page on the site. Now absolute links that open the full page.

## Not tested

- Firefox, Safari and Edge. The tool uses only standard DOM, `localStorage` and
  `Blob` download APIs, but no run was made in those browsers.
- Screen readers and a full WCAG audit.
- Very large ledgers (thousands of entries).
