# Betriebsausgaben-Rechner für Tattoo-Künstler: Technische Dokumentation

**Sprache:** Deutsch (de)  
**Herausgeber:** Poli International Co., Ltd.  
**Version:** 2.0.0  
**Lizenz:** MIT  

---

## 1. Architektur-Übersicht

Der **Betriebsausgaben-Rechner für Tattoo-Künstler** ist eine clientseitige Single-Page-Anwendung (SPA), entwickelt für Tätowierer, Piercer und Studiobetreiber. Die Anwendung läuft vollständig im Webbrowser des Nutzers und benötigt weder einen Backend-Server noch eine externe Datenbank oder eine permanente Internetverbindung.

### Technologie-Stack
- **Markup:** Semantisches HTML5 mit ARIA-Landmark-Rollen für Barrierefreiheit und `data-i18n`-Attribut-Bindungen.
- **Styling:** Natives CSS3 mit CSS-Custom-Properties (Variablen) für Hell-/Dunkel-Modus, responsives Layout und dedizierte `@media print`-Druckregeln.
- **Laufzeit-Logik:** Natives ECMAScript 6+ (ES6+), modular gekapselt in einer sofort aufgerufenen Funktionsausdruck-Struktur (IIFE); keine externen Frameworks oder Laufzeitbibliotheken.
- **Lokalisierungs-Engine:** Clientseitiges Übersetzungssystem (`js/i18n.js`) mit getrennten Sprachmodulen (`js/i18n/*.js`) für 7 vollständige Sprachen.
- **Persistenz:** Web Storage API (`window.localStorage`).
- **Datenvisualisierung:** Dynamische Inline-SVG-Vektorgrafiken direkt im DOM gerendert; keine Pixelgrafiken oder Chart-Bibliotheken.
- **Sicherheit & Content Security Policy (CSP):** Strikte Einhaltung von `script-src 'self'`; keine externen Fonts, CDN-Ressourcen oder Analysedienste.

---

## 2. Datenschemata und lokaler Speicher

Alle Buchungsdaten werden im `localStorage` des Webbrowsers unter vier definierten Schlüsseln gespeichert:

### 2.1. `poli-tax-tracker` (Ausgabenjournal)
Speichert ein JSON-serialisiertes Array aus Belegdatensätzen:

```typescript
interface ExpenseRecord {
  date: string;          // ISO-Datum (JJJJ-MM-TT)
  category: string;      // Ausgabenkategorie
  amount: string;        // Betrag mit 2 Nachkommastellen (z. B. "45.00")
  supplier?: string;     // Lieferant, Empfänger oder Reisezweck
  receiptRef?: string;   // Physischer oder digitaler Beleg-Ablageort
  desc?: string;         // Beschreibung, Notizen oder Reisekostenberechnung
  mileageDist?: number;  // Erfasste Fahrtstrecke in Kilometern oder Meilen
  createdAt: string;     // ISO-Zeitstempel der Datensatzerstellung
}
```

### 2.2. `poli-tax-categories` (Kategorienliste)
Speichert ein Array anpassbarer Kategoriebezeichnungen:

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

### 2.3. `poli-tax-currency` (Aktives Währungssymbol)
Speichert das vom Nutzer gewählte Währungszeichen (`£`, `$`, `€`, `CHF`, `kr`, `¥`). Standardwert: `£`.

### 2.4. `poli-tax-lang` (Aktiver Sprachcode)
Speichert den Sprachcode der Benutzeroberfläche (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`). Standardwert: Browsersprache oder `en`.

---

## 3. Berechnungsalgorithmen und Geschäftslogik

### 3.1. Jahressummierung und Filterung
1. **Filter:** Filterung der Datensätze nach `date.startsWith(selectedYear)`. Bei Auswahl von "all" bleiben alle Jahre sichtbar.
2. **Gesamtsumme:** Gleitkommaberechnung:  
   `total = expenses.reduce((summe, eintrag) => summe + parseFloat(eintrag.amount), 0)`.
3. **Kategoriengruppierung:** Aggregation in der Datenstruktur `{ [kategorieName]: { amount: number, count: number } }`.
4. **Prozentualer Anteil:** Für jede Kategorie berechnet nach `prozent = (kategorieBetrag / total) * 100`, gerundet auf eine Nachkommastelle.

### 3.2. Reisekosten- und Kilometerberechnung
- **Formel:** `Berechneter Abzug = (Strecke * Pauschale) + Nebenkosten (Maut, Parken, ÖPNV)`
- Beim Speichern wird eine Buchungszeile in der Reisekategorie generiert, wobei die Rechenschritte im Notizfeld `desc` dokumentiert werden.

### 3.3. Betragsformatierung (`fmtMoney`)
Setzt das aktive Währungssymbol voran, formatiert auf zwei Nachkommastellen und setzt Tausendertrennpunkte über den regulären Ausdruck `\B(?=(\d{3})+(?!\d))`.

---

## 4. UI-Komponenten und SVG-Visualisierung

### 4.1. Inline-SVG-Kategoriendiagramm
- Rendert ein horizontales Vektorbalkendiagramm direkt in einem `<svg>`-Container.
- Verwendet kontrastreiche geometrische Schraffurmuster (diagonale Linien, Rasterpunkte, Vollflächen), um optimale Lesbarkeit auch auf monochromen Papierausdrucken und bei Sehschwächen zu gewährleisten.

### 4.2. Responsive Bildschirmdarstellung
- **Desktop (>960px):** 4 Kennzahlenkarten in einer Zeile, breite Buchungstabelle und zweispaltige Formulare.
- **Tablet (641px bis 960px):** 2x2 Kennzahlengitter, horizontal scrollbare Tabelle mit Touch-Momentum (`-webkit-overflow-scrolling: touch`).
- **Mobilgeräte (<=640px):** Die Tabelle wandelt sich per `display: block` in vertikal gestapelte Karten um. Pseudoelemente `::before` blenden die jeweiligen Spaltenbezeichnungen (`data-label`) ein, sodass horizontales Scrollen entfällt.

---

## 5. Lokalisierungs-Framework (`js/i18n.js`)

- **Architektur:** `js/i18n.js` stellt die Registrierungsfunktion `window.i18n.register(lang, dict)` bereit.
- **Synchroner Ladevorgang:** Wörterbücher (`js/i18n/*.js`) werden synchron nach der Basis-Engine eingebunden.
- **Dynamische DOM-Bindung:** `window.i18n.applyI18n()` aktualisiert Elemente mit `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria-label]` und `[data-i18n-title]`.
- **Laufzeit-Platzhalter:** Ersetzt Variablen im Format `{token}` (z. B. `{year}`, `{date}`, `{count}`, `{dist}`) ohne externe Template-Bibliothek.

---

## 6. Druck- und Exportfunktionen

### 6.1. Druck-Stylesheet (`@media print`)
- Blendet Schaltflächen, Werkzeugleisten, Suchfelder und Eingabeformulare aus.
- Erzwingt kontrastreichen Schwarz-Weiß-Druck ohne unnötigen Tintenauftrag.
- Erstellt ein formal sauberes Auswertungsblatt für den Steuerberater mit Zeitraumangabe, Erstellungsdatum und Unterschriftszeile.

### 6.2. CSV-Exportfunktion
Erzeugt UTF-8-kodierte CSV-Datenströme als Daten-URI (`data:text/csv;charset=utf-8,`) und löst den automatischen Download über ein temporäres DOM-Element `<a>` aus.

---

## 7. Sicherheit, Datenschutz und Konformität

- **Strikte CSP-Richtlinien:** Keine Verbindung zu Drittservern, vollständige Konformität mit `script-src 'self'`.
- **Datenschutz durch Technikgestaltung:** Finanz- und Belegdaten verbleiben ausschließlich im lokalen Browser des Anwenders; keine Übertragung in eine externe Cloud.
- **XSS-Schutz:** Alle dynamischen Nutzereingaben werden vor dem Einfügen in das Dokument über die Funktion `escHtml()` maskiert.
