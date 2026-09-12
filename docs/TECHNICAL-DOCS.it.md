# Registro delle Deduzioni Fiscali per Tatuatori: Documentazione Tecnica

**Lingua:** Italiano (it)  
**Editore:** Poli International Co., Ltd.  
**Versione:** 2.0.0  
**Licenza:** MIT  

---

## 1. Panoramica dell'architettura

Il **Registro delle Deduzioni Fiscali per Tatuatori** è un'applicazione web monopagina (SPA) eseguita interamente sul lato client, concepita per tatuatori, piercer professionisti e gestori di studi. Funziona in modo autonomo all'interno del browser web, senza necessitare di server applicativi remoti, database esterni o connessione Internet continua.

### Stack tecnologico
- **Marcatura:** HTML5 semantico con ruoli ARIA per l'accessibilità e attributi gancio `data-i18n`.
- **Fogli di stile:** CSS3 puro con proprietà personalizzate (variabili CSS) per il cambio dinamico del tema chiaro/scuro, layout adattivo responsive e direttive `@media print`.
- **Logica di runtime:** JavaScript moderno nativo ECMAScript 6+ (ES6+) racchiuso in una funzione ad esecuzione immediata (IIFE); zero dipendenze o framework pesanti.
- **Motore di internazionalizzazione:** Sottosistema i18n locale (`js/i18n.js`) corredato da moduli dizionario dedicati per lingua (`js/i18n/*.js`) con supporto a 7 lingue complete.
- **Archiviazione:** API Web Storage del browser (`window.localStorage`).
- **Visualizzazione dati:** Grafica vettoriale SVG inline generata dinamicamente nel Document Object Model (DOM); nessun rendering bitmap su Canvas o librerie esterne.
- **Sicurezza e Content Security Policy (CSP):** Piena conformità alla direttiva restrittiva `script-src 'self'`; nessun caricamento di font esterni, fogli stile remoti, CDN o script di tracciamento.

---

## 2. Schemi dei dati e memorizzazione locale

Tutti i dati dell'applicazione persistono all'interno del `localStorage` del client mediante quattro chiavi distinte:

### 2.1. `poli-tax-tracker` (Registro spese)
Memorizza un array di registrazioni di spesa serializzato in formato JSON:

```typescript
interface ExpenseRecord {
  date: string;          // Data in formato ISO (AAAA-MM-GG)
  category: string;      // Categoria contabile di appartenenza
  amount: string;        // Importo numerico con 2 decimali fissi (es. "45.00")
  supplier?: string;     // Fornitore, beneficiario o causale della trasferta
  receiptRef?: string;   // Collocazione fisica o identificativo digitale della ricevuta
  desc?: string;         // Note, dettagli o riepilogo del calcolo chilometrico
  mileageDist?: number;  // Distanza registrata per le trasferte
  createdAt: string;     // Timestamp ISO di creazione della voce
}
```

### 2.2. `poli-tax-categories` (Elenco delle categorie)
Memorizza un array di stringhe rappresentanti le categorie di spesa personalizzabili:

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

### 2.3. `poli-tax-currency` (Simbolo della valuta attiva)
Memorizza la stringa della valuta scelta dall'utente (`£`, `$`, `€`, `CHF`, `kr`, `¥`). Valore predefinito: `£`.

### 2.4. `poli-tax-lang` (Codice della lingua attiva)
Memorizza il codice della lingua dell'interfaccia (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`). Valore predefinito: lingua del browser o `en`.

---

## 3. Algoritmi di calcolo e logica gestionale

### 3.1. Elaborazione e filtro annuale
1. **Filtro temporale:** I record vengono filtrati verificando `date.startsWith(selectedYear)`. Selezionando l'opzione "all", vengono mantenute tutte le annualità.
2. **Totale complessivo:** Somma con virgola mobile:  
   `total = expenses.reduce((somma, voce) => somma + parseFloat(voce.amount), 0)`.
3. **Raggruppamento per categoria:** Mappa associativa: `{ [nomeCategoria]: { amount: number, count: number } }`.
4. **Incidenza percentuale:** Per ciascuna categoria, `percentuale = (importoCategoria / totale) * 100`, arrotondata a una cifra decimale.

### 3.2. Calcolo rimborsi chilometrici e viaggi
- **Formula:** `Totale calcolato = (Distanza * Tariffa chilometrica) + Spese accessorie (pedaggi, parcheggi, trasporti)`
- Al salvataggio viene generata una voce nella categoria dedicata ai viaggi, preservando i parametri di calcolo nel campo `desc`.

### 3.3. Formattazione degli importi (`fmtMoney`)
Aggiunge il prefisso della valuta attiva, imposta due decimali e inserisce i separatori delle migliaia mediante l'espressione regolare `\B(?=(\d{3})+(?!\d))`.

---

## 4. Componenti UI e grafica vettoriale SVG

### 4.1. Grafico SVG integrato per categoria
- Genera un diagramma orizzontale a segmenti proporzionali direttamente all'interno di un elemento `<svg>`.
- Impiega trame di tratteggio geometrico ad alto contrasto (diagonali, puntinati, campiture piene) per assicurare perfetta leggibilità anche su stampe cartacee monocromatiche e per utenti con ridotta percezione cromatica.

### 4.2. Meccaniche di adattamento responsive
- **Desktop (>960px):** Riga riepilogativa a 4 metriche, tabella contabile estesa e form su due colonne.
- **Tablet (641px - 960px):** Griglia 2x2 per i totali, scorrimento orizzontale della tabella con inerzia tattile (`-webkit-overflow-scrolling: touch`).
- **Smartphone (<=640px):** Trasformazione del layout della tabella in schede verticali mediante `display: block` e pseudo-elementi `::before` che proiettano le etichette delle colonne (`data-label`), eliminando qualsiasi scorrimento laterale.

---

## 5. Sistema di internazionalizzazione (`js/i18n.js`)

- **Struttura:** `js/i18n.js` espone il registro `window.i18n.register(lang, dict)`.
- **Caricamento sincrono:** I file dizionario (`js/i18n/*.js`) vengono inclusi subito dopo il motore principale rispettando l'ordine del documento.
- **Binding dinamico:** La funzione `window.i18n.applyI18n()` aggiorna tutti gli elementi contrassegnati con `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria-label]` e `[data-i18n-title]`.
- **Interpolazione di stringhe:** Sostituzione nativa dei segnaposto `{token}` (es. `{year}`, `{date}`, `{count}`, `{dist}`) senza dipendere da motori di template terzi.

---

## 6. Motore di stampa ed esportazione

### 6.1. Foglio di stile per la stampa (`@media print`)
- Nasconde barre di comando, bottoni di modifica, campi di ricerca e form di inserimento.
- Impone un contrasto netto al 100% nero su fondo bianco.
- Produce un modulo formale per il commercialista corredato da intestazione, intervallo di date, timestamp di generazione e riga per firma autografa.

### 6.2. Esportazione in formato CSV
Genera stringhe codificate in formato UTF-8 con URI di dati (`data:text/csv;charset=utf-8,`) avviando il download mediante creazione temporanea di un elemento `<a>` nel DOM con conseguente deallocazione della risorsa.

---

## 7. Sicurezza, riservatezza e conformità

- **Politica CSP rigorosa:** Nessuna chiamata di rete verso domini terzi, piena rispondenza a `script-src 'self'`.
- **Privacy garantita:** Le cifre contabili non vengono mai trasmesse all'esterno e risiedono solo nel dispositivo dell'utente.
- **Prevenzione XSS:** Sanificazione preventiva di ogni valore iniettato nell'interfaccia tramite la funzione di escape `escHtml()`.
