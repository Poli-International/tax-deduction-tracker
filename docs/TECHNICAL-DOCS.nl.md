# Aftrekposten- en Uitgavenbeheerder voor Tatoeëerders: Technische Documentatie

**Taal:** Nederlands (nl)  
**Uitgever:** Poli International Co., Ltd.  
**Versie:** 2.0.0  
**Licentie:** MIT  

---

## 1. Architectuuroverzicht

De **Aftrekposten- en Uitgavenbeheerder voor Tatoeëerders** is een client-side single-page applicatie (SPA), ontworpen voor tatoeëerders, piercers en studio-eigenaren. De applicatie draait volledig lokaal in de webbrowser van de gebruiker, zonder afhankelijkheid van backend-servers, databases op afstand of permanente netwerkverbindingen.

### Technologische basis
- **Opmaak:** Semantische HTML5 met ARIA-toegankelijkheidsrollen en `data-i18n`-attributen.
- **Vormgeving:** Zuivere CSS3 met CSS custom properties (variabelen) voor het wisselen tussen licht en donker thema, responsieve weergave en `@media print`-regels.
- **Programmacode:** Modulaire ECMAScript 6+ (ES6+) verpakt in een direct aangeroepen functie (IIFE); geen zware externe frameworks of bibliotheken.
- **Lokalisatiesysteem:** Client-side i18n-framework (`js/i18n.js`) met afzonderlijke taalmodules per taal (`js/i18n/*.js`) voor 7 volledige talen.
- **Gegevensopslag:** Browser Web Storage API (`window.localStorage`).
- **Gegevensvisualisatie:** Dynamische inline SVG-vectorafbeeldingen rechtstreeks gerenderd in het Document Object Model (DOM); geen bitmap-rendering via Canvas of grafische bibliotheken van derden.
- **Beveiliging en Content Security Policy (CSP):** Volledige compatibiliteit met `script-src 'self'`; geen externe weblettertypen, CDN-verwijzingen of trackers.

---

## 2. Gegevensstructuren en lokale opslag

Alle boekhoudkundige gegevens worden lokaal opgeslagen in de `localStorage` van de browser onder vier afzonderlijke sleutels:

### 2.1. `poli-tax-tracker` (Uitgavenjournaal)
Bevat een JSON-geserialiseerde lijst met uitgavengegevens:

```typescript
interface ExpenseRecord {
  date: string;          // ISO-datumformaat (JJJJ-MM-DD)
  category: string;      // Categorienaam
  amount: string;        // Getalbedrag geformatteerd op 2 decimalen (bijv. "45.00")
  supplier?: string;     // Leverancier, begunstigde of reisdoel
  receiptRef?: string;   // Fysieke bewaarplaats of digitale bonreferentie
  desc?: string;         // Artikelnotities, omschrijving of kilometerberekening
  mileageDist?: number;  // Geregistreerde reisafstand (bij reiskosten)
  createdAt: string;     // ISO-tijdstempel van aanmaak
}
```

### 2.2. `poli-tax-categories` (Categorielijst)
Bevat een lijst met configureerbare categorienamen:

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

### 2.3. `poli-tax-currency` (Actief valutasymbool)
Slaat het gekozen valutasymbool op (`£`, `$`, `€`, `CHF`, `kr`, `¥`). Standaardwaarde: `£`.

### 2.4. `poli-tax-lang` (Actieve taalcode)
Slaat de actieve taalcode van de interface op (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`). Standaardwaarde: browsertaal of `en`.

---

## 3. Rekenalgoritmen en bedrijfslogica

### 3.1. Tabellering en jaarfiltering
1. **Filteren:** Posten worden geselecteerd met `date.startsWith(selectedYear)`. Bij de keuze "all" blijven alle geregistreerde jaren behouden.
2. **Totaalberekening:** Optelling met drijvende-kommaprecisie:  
   `total = expenses.reduce((som, item) => som + parseFloat(item.amount), 0)`.
3. **Groepering per categorie:** Opbouw van de gegevensstructuur `{ [categorienaam]: { amount: number, count: number } }`.
4. **Relatief aandeel:** Voor iedere categorie geldt `percentage = (categoriebedrag / total) * 100`, afgerond op één decimaal.

### 3.2. Kilometer- en reiskostenberekening
- **Formule:** `Berekend totaal = (Afstand * Vergoeding per eenheid) + Tol, parkeergeld en ov-kosten`
- Bij opslag wordt een uitgavenregel aangemaakt in de reiskostencategorie, waarbij de volledige berekeningsparameters in het veld `desc` worden bewaard.

### 3.3. Bedragopmaak (`fmtMoney`)
Plaatst het actieve valutasymbool voor het bedrag, stelt exact twee decimalen in en voegt scheidingstekens voor duizendtallen in via de reguliere expressie `\B(?=(\d{3})+(?!\d))`.

---

## 4. Gebruikersinterface en SVG-visualisatie

### 4.1. Inline SVG-categoriediagram
- Bouwt een horizontaal gestapeld staafdiagram op binnen een `<svg>`-element.
- Maakt gebruik van contrastrijke geometrische arceerpatronen (diagonale lijnen, stippen, volvlakken) die uitstekend afleesbaar zijn op monochrome afdrukken en voor gebruikers met verminderd kleurzicht.

### 4.2. Responsieve schermindeling
- **Desktop (>960px):** 4 overzichtskaarten op één rij, volledige journaaltabel en dubbele formulierkolommen.
- **Tablet (641px tot 960px):** 2x2 raster voor de kerncijfers en een horizontaal soepel scrollende tabel met touch-traagheid (`-webkit-overflow-scrolling: touch`).
- **Mobiel (<=640px):** De tabel transformeert naar verticaal gestapelde kaarten via `display: block` en `::before`-pseudoelementen die kolomtitels injecteren (`data-label`), waardoor horizontaal scrollen niet meer nodig is.

---

## 5. Meertaligheidsframework (`js/i18n.js`)

- **Opzet:** `js/i18n.js` initialiseert het centrale register `window.i18n.register(lang, dict)`.
- **Synchrone inlezing:** Woordenboekbestanden (`js/i18n/*.js`) worden direct na het basisframework synchroon geladen in documentvolgorde.
- **Dynamische DOM-koppeling:** `window.i18n.applyI18n()` doorzoekt alle elementen met `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria-label]` en `[data-i18n-title]`.
- **Variabelenvervanging:** Ondersteunt parameters in de notatie `{token}` (zoals `{year}`, `{date}`, `{count}`, `{dist}`) zonder zware externe template-engines.

---

## 6. Afdruk- en exportmodule

### 6.1. Afdrukopmaak (`@media print`)
- Verbergt invoervelden, navigatiebalken, knoppen en zoekvelden.
- Dwingt een hoog-contrast zwart-wit afdruk af zonder overmatig inktverbruik.
- Genereert een representatief samenvattingsblad voor de boekhouder met formele kopteksten, afdrukdatum en handtekeningstrook.

### 6.2. CSV-export
Converteert gegevens naar UTF-8 gecodeerde tekenreeksen via data-URI's (`data:text/csv;charset=utf-8,`) en start de download door tijdelijke injectie van een `<a>`-element in het DOM.

---

## 7. Beveiliging, privacy en compliance

- **Strikte CSP:** Geen enkele netwerkverbinding naar externe servers; volledige naleving van `script-src 'self'`.
- **Ingebouwde privacy:** Financiële gegevens blijven uitsluitend bewaard in de lokale browser van de gebruiker; er is geen sprake van telemetrie of externe tracking.
- **XSS-bescherming:** Alle dynamische invoergegevens worden vóór plaatsing in het document geneutraliseerd met de functie `escHtml()`.
