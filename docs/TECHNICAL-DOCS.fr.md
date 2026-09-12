# Suivi des Déductions Fiscales pour Tatoueurs: Documentation Technique

**Langue :** Français (fr)  
**Éditeur :** Poli International Co., Ltd.  
**Version :** 2.0.0  
**Licence :** MIT  

---

## 1. Vue d'ensemble de l'architecture

Le **Suivi des Déductions Fiscales pour Tatoueurs** est une application web monopage (SPA) exécutée exclusivement côté client, développée pour les tatoueurs, les perceurs corporels et les gérants de studios. Elle fonctionne intégralement dans le navigateur web de l'utilisateur, sans nécessiter de serveur applicatif, de base de données distante ou de connectivité réseau permanente.

### Pile technologique
- **Structure HTML :** HTML5 sémantique avec attributs ARIA pour l'accessibilité et attributs cibles `data-i18n`.
- **Feuilles de style :** CSS3 natif exploitant les variables CSS (propriétés personnalisées) pour la gestion dynamique des thèmes clair et sombre, l'adaptation responsive et les règles `@media print`.
- **Logique applicative :** JavaScript moderne ECMAScript 6+ (ES6+) natif, encapsulé dans une fonction anonyme à exécution immédiate (IIFE) ; zéro dépendance logicielle externe.
- **Moteur d'internationalisation :** Système i18n local (`js/i18n.js`) avec modules de dictionnaires dédiés par langue (`js/i18n/*.js`) pour 7 langues intégrales.
- **Persistance :** API Web Storage (`window.localStorage`).
- **Visualisation de données :** Graphique vectoriel SVG inline généré dynamiquement dans le DOM ; aucun recours à Canvas matriciel ou bibliothèques graphiques tierces.
- **Sécurité et conformité CSP :** Respect strict de la directive `script-src 'self'` ; aucun appel vers des CDN, polices distantes ou outils d'analyse externe.

---

## 2. Schémas de données et stockage local

L'ensemble des données applicatives est conservé dans le `localStorage` du navigateur à travers quatre clés distinctes :

### 2.1. `poli-tax-tracker` (Grand livre des dépenses)
Contient un tableau d'écritures comptables sérialisé en JSON :

```typescript
interface ExpenseRecord {
  date: string;          // Format de date ISO (AAAA-MM-JJ)
  category: string;      // Intitulé de la catégorie
  amount: string;        // Montant numérique formaté avec 2 décimales (ex. "45.00")
  supplier?: string;     // Fournisseur, prestataire ou motif de déplacement
  receiptRef?: string;   // Emplacement physique ou référence du justificatif
  desc?: string;         // Précisions, notes ou détail de calcul kilométrique
  mileageDist?: number;  // Distance parcourue (si saisie via l'onglet déplacement)
  createdAt: string;     // Horodatage ISO de création
}
```

### 2.2. `poli-tax-categories` (Liste des catégories)
Contient un tableau de chaînes de caractères personnalisables :

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

### 2.3. `poli-tax-currency` (Symbole monétaire actif)
Stocke le symbole monétaire choisi par l'utilisateur (`£`, `$`, `€`, `CHF`, `kr`, `¥`). Valeur par défaut : `£`.

### 2.4. `poli-tax-lang` (Code de langue actif)
Stocke le code de la langue active de l'interface (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`). Valeur par défaut : langue du navigateur ou `en`.

---

## 3. Algorithmes de calcul et logique métier

### 3.1. Ventilation et filtrage annuel
1. **Filtrage :** Les lignes sont filtrées selon `date.startsWith(selectedYear)`. Lorsque l'option "all" est active, toutes les années enregistrées sont conservées.
2. **Somme totale :** Calculée avec précision flottante :  
   `total = expenses.reduce((somme, item) => somme + parseFloat(item.amount), 0)`.
3. **Répartition par catégorie :** Regroupement associatif : `{ [nomCategorie]: { amount: number, count: number } }`.
4. **Quote-part relative :** Pour chaque catégorie, `pourcentage = (montantCategorie / total) * 100`, arrondi à une décimale.

### 3.2. Calcul des indemnités kilométriques et déplacements
- **Formule :** `Total calculé = (Distance * Barème) + Frais annexes (péages, stationnement, transports)`
- À l'enregistrement, une transaction comptable est générée dans la catégorie des déplacements, consignant la formule détaillée dans le champ `desc`.

### 3.3. Formatage des montants (`fmtMoney`)
Préfixe le symbole monétaire sélectionné, applique deux décimales et insère les séparateurs de milliers via l'expression rationnelle `\B(?=(\d{3})+(?!\d))`.

---

## 4. Composants d'interface et graphiques SVG

### 4.1. Graphique SVG inline par catégorie
- Génère une barre segmentée vectorielle directement dans un conteneur `<svg>`.
- Utilise des motifs de hachures géométriques à fort contraste (lignes diagonales, pointillés, aplats) garantissant une lisibilité parfaite sur impression papier monochrome et pour les utilisateurs malvoyants.

### 4.2. Adaptation responsive
- **Ordinateurs de bureau (>960px) :** Ligne récapitulative à 4 indicateurs clés, tableau complet et formulaires à double colonne.
- **Tablettes (641px à 960px) :** Grille métrique 2x2, défilement horizontal fluide du tableau avec momentum tactile (`-webkit-overflow-scrolling: touch`).
- **Mobiles (<=640px) :** Le tableau se convertit en cartes empilées via `display: block` et des pseudo-éléments `::before` injectant les libellés (`data-label`), évitant tout défilement horizontal.

---

## 5. Moteur d'internationalisation (`js/i18n.js`)

- **Architecture :** `js/i18n.js` expose un registre global `window.i18n.register(lang, dict)`.
- **Chargement synchrone :** Les fichiers de vocabulaire (`js/i18n/*.js`) sont appelés immédiatement après le moteur principal dans l'ordre du document.
- **Liaison DOM dynamique :** `window.i18n.applyI18n()` parcourt l'ensemble des balises pourvues de `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria-label]` et `[data-i18n-title]`.
- **Interpolation dynamique :** Remplace les paramètres balisés `{param}` (ex. `{year}`, `{date}`, `{count}`, `{dist}`) de façon autonome sans bibliothèque de gabarits.

---

## 6. Moteur d'impression et d'exportation

### 6.1. Feuille de style d'impression (`@media print`)
- Masque automatiquement les contrôles, barres d'outils, boutons d'action et formulaires.
- Force une palette d'encrage noire pure sur fond blanc.
- Émet une synthèse claire pour le cabinet comptable comprenant en-têtes formels, dates de génération et espace pour signature manuelle.

### 6.2. Exportation au format CSV
Construit une chaîne de caractères encodée en UTF-8 via URI de données (`data:text/csv;charset=utf-8,`) et déclenche le téléchargement automatique par création temporaire d'un élément d'ancrage `<a>` dans le DOM.

---

## 7. Sécurité, confidentialité et conformité

- **Politique CSP stricte :** Zéro requête réseau externe, compatibilité totale avec `script-src 'self'`.
- **Confidentialité native :** Les données financières ne quittent jamais le terminal de l'utilisateur ; aucune télémétrie ni pistage.
- **Protection XSS :** Toutes les variables injectées dynamiquement dans le DOM sont aseptisées par la fonction `escHtml()`.
