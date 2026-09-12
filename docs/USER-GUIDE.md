# Tattoo Artist Tax Deduction Tracker: User Guide (V2)

[English](#english) • [Français](#français) • [Italiano](#italiano) • [Deutsch](#deutsch) • [Español](#español) • [Nederlands](#nederlands) • [Português](#português)

---

<a id="english"></a>
## English

### Overview

The **Tattoo Artist Tax Deduction Tracker** is a client-side utility published by Poli International for tattoo artists, body piercers, and studio owners. It enables fast, accurate recording of business expenses throughout the year in categories an accountant recognises.

All records remain exclusively in your web browser (`localStorage`); no records or financial figures are transmitted to any remote server.

### 1. Logging a Standard Expense

1. **Date**: Incurred date (defaults to today).
2. **Category**: Select the relevant business expense classification from your custom list.
3. **Amount**: Enter the numerical cost in your selected currency.
4. **Supplier / Payee** *(optional)*: Merchant or provider name (e.g. Inkjecta, Barber DTS, Landlord).
5. **Receipt Reference** *(optional)*: Record where the physical or digital receipt is kept (e.g. `Folder #3`, `Email Receipt #4092`, `March 2026 Envelope`, `Paper Binder`). This serves as an immediate reference without needing photo uploads.
6. **Description / Notes** *(optional)*: Specific item details or notes.
7. Click **Add Expense**.

### 2. Logging Travel & Mileage

1. Click the **Travel & Mileage Log** tab above the form.
2. **Trip Date**: Date of travel.
3. **Trip Purpose / Destination**: Business travel reason (e.g. `Guest spot in Leeds`, `Wholesaler supply run`, `Tattoo convention transit`).
4. **Distance**: Mileage or kilometres traveled.
5. **Vehicle Rate per Unit**: Your business vehicle reimbursement rate (user-specified; enter your vehicle mileage rate).
6. **Tolls / Parking / Transit** *(optional)*: Out-of-pocket tolls, parking meters, or public transit fares.
7. **Receipt / Ticket Reference** *(optional)*: Odometer photo note, parking ticket number, or transit ticket reference.
8. Review the real-time **Calculated Travel Deduction Total**.
9. Click **Log Travel & Mileage** to record the item into your running ledger.

### 3. Reviewing the Year Summary

- **Year Filter**: Use the top dropdown to view entries for a specific tax year or "All Recorded Years".
- **Summary Cards**:
  - **Total Recorded Expenses**: Sum of all recorded expenses in the period.
  - **Entries Logged**: Total count of entries.
  - **Travel & Mileage**: Cumulative travel expenses and total recorded distance.
  - **Top Category**: Your largest expenditure category and its percentage share.
- **Annual Category Summary Table**: Aggregates entries, totals, and percentages by category.
- **Inline SVG Chart**: Visual representation of category distribution with high-contrast hatching for print and accessibility.

### 4. Exporting & Printing for Your Accountant

#### Print Year Summary
Click **Print Summary** in the top toolbar. The tool applies clean `@media print` formatting, hiding interface controls and outputting an accountant-ready summary sheet with totals, category breakdowns, and audit notices.

#### Export CSV Options
- **Export Summary CSV**: Downloads `tax-category-summary-[year].csv` containing aggregated category totals and percentages.
- **Export Full Log (CSV)**: Downloads `tax-deductions-[year].csv` containing every logged transaction including receipt references and descriptions.

### 5. Customising Expense Categories

Because expense categories differ between regions and accounting systems, you can customise the category list:
1. Click **Categories** (⚙️) in the toolbar.
2. **Add**: Type a new category name and click **Add**.
3. **Rename**: Click **Rename** beside any category to adjust its label.
4. **Delete**: Click **Delete** to remove an unused category.
5. **Reset to Defaults**: Restores standard studio categories.

### 6. Currency & Language Selection

- **Currency**: Use the **Currency** dropdown in the top toolbar to choose `£` (GBP), `$` (USD/CAD/AUD), `€` (EUR), `CHF` (Swiss Franc), `kr` (SEK/NOK/DKK), or `¥` (JPY). All totals, forms, and charts update immediately.
- **Language**: Use the **Language** dropdown to switch the interface instantly between English, French, Italian, German, Spanish, Dutch, and Portuguese.

### 7. Record-Keeping Notice

This application is strictly a record-keeping aid to organize expenses for your accountant. It does not provide tax, legal, or financial advice, nor does it determine or verify deductibility. Consult a qualified professional tax advisor or accountant before submitting any filings.

---

<a id="français"></a>
## Français

### Vue d'ensemble

Le **Suivi des Déductions Fiscales pour Tatoueurs** est un outil en ligne purement local publié par Poli International à destination des tatoueurs, perceurs corporels et gérants de studio. Il permet un enregistrement rapide et structuré de l'ensemble des frais professionnels de l'année, ventilés dans des catégories immédiatement compréhensibles par votre expert-comptable.

Toutes les données restent strictement stockées dans votre navigateur (`localStorage`); aucun chiffre ni renseignement financier n'est transmis à un quelconque serveur externe.

### 1. Enregistrer une dépense standard

1. **Date**: Date de la dépense (définie par défaut sur aujourd'hui).
2. **Catégorie**: Sélectionnez la catégorie de dépense professionnelle adéquate dans votre liste personnalisée.
3. **Montant**: Saisissez le coût chiffré dans la devise choisie.
4. **Fournisseur / Bénéficiaire** *(facultatif)*: Nom du commerçant ou prestataire (ex. Inkjecta, Barber DTS, Propriétaire du local).
5. **Référence de justificatif** *(facultatif)*: Indiquez l'emplacement de classement physique ou numérique de la facturette (ex. `Classeur #3`, `Email Facture #4092`, `Pochette Mars 2026`). Cela permet un repérage immédiat lors du bilan sans avoir à importer de photos lourdes.
6. **Description / Notes** *(facultatif)*: Précisions sur les fournitures ou prestations.
7. Cliquez sur **Ajouter la dépense**.

### 2. Enregistrer les déplacements et indemnités kilométriques

1. Cliquez sur l'onglet **Journal des Déplacements & Indemnités Kilométriques** au-dessus du formulaire.
2. **Date du trajet**: Date du déplacement.
3. **Motif / Destination**: Raison professionnelle du trajet (ex. `Guest à Lyon`, `Réapprovisionnement fournisseur`, `Déplacement convention de tatouage`).
4. **Distance**: Kilomètres ou miles parcourus.
5. **Barème kilométrique par unité**: Votre barème de remboursement de véhicule professionnel (défini par l'utilisateur).
6. **Péages / Stationnement / Transports** *(facultatif)*: Frais réels annexes de parking, péage autoroutier ou titre de transport en commun.
7. **Référence justificatif / Billet** *(facultatif)*: Numéro de ticket de péage, photo de compteur ou référence de billet.
8. Vérifiez le **Total calculé de la déduction de déplacement** en temps réel.
9. Cliquez sur **Enregistrer le déplacement** pour l'ajouter à votre grand livre de compte.

### 3. Consulter le récapitulatif annuel

- **Filtre Année**: Choisissez une année d'imposition précise ou "Toutes les années enregistrées".
- **Cartes récapitulatives**:
  - **Total des dépenses enregistrées**: Somme intégrale des dépenses sur la période.
  - **Écritures enregistrées**: Nombre total de lignes comptabilisées.
  - **Déplacements & Kilométrage**: Total cumulé des frais de déplacement et distances parcourues.
  - **Catégorie principale**: Votre poste de dépenses le plus important et son pourcentage relatif.
- **Tableau annuel par catégorie**: Totaux ventilés et parts relatives prêtes pour la clôture comptable.
- **Graphique vectoriel SVG intégré**: Visualisation claire avec hachures à fort contraste, adaptées à l'impression noir et blanc et à l'accessibilité visuelle.

### 4. Exporter et imprimer pour votre comptable

#### Imprimer le récapitulatif annuel
Cliquez sur **Imprimer le récapitulatif** dans la barre d'outils. Une feuille de synthèse épurée conforme `@media print` masque les menus et contrôles pour imprimer une fiche comptable claire et nette.

#### Téléchargements CSV
- **Exporter le récapitulatif CSV**: Télécharge `tax-category-summary-[annee].csv` avec les sous-totaux par catégorie.
- **Exporter tout le journal (CSV)**: Télécharge `tax-deductions-[annee].csv` contenant chaque transaction détaillée avec notes et références de justificatifs.

### 5. Personnaliser les catégories de dépenses

1. Cliquez sur **Catégories** (⚙️) dans la barre supérieure.
2. **Ajouter**: Saisissez un nouvel intitulé et validez avec **Ajouter**.
3. **Renommer**: Modifiez l'intitulé d'une catégorie existante.
4. **Supprimer**: Retirez les postes de dépenses inutiles.
5. **Rétablir les catégories par défaut**: Restaure la configuration standard du studio.

### 6. Sélection de la devise et de la langue

- **Devise**: Sélectionnez `£` (GBP), `$` (USD/CAD/AUD), `€` (EUR), `CHF` (Franc suisse), `kr` (SEK/NOK/DKK) ou `¥` (JPY).
- **Langue**: Basculez instantanément l'interface entre le français, l'anglais, l'italien, l'allemand, l'espagnol, le néerlandais et le portugais.

### 7. Avis de tenue de registres

Cette application est un simple instrument de tenue de registre pour faciliter le classement de vos justificatifs auprès de votre expert-comptable. Elle ne constitue en aucun cas un conseil fiscal, juridique ou financier et ne valide pas l'éligibilité des déductions. Consultez toujours un professionnel de la fiscalité qualifié.

---

<a id="italiano"></a>
## Italiano

### Panoramica

Il **Registro delle Deduzioni Fiscali per Tatuatori** è uno strumento operativo lato client creato da Poli International per tatuatori, piercer e titolari di studi. Consente la registrazione precisa e immediata dei costi di gestione dello studio durante l'anno fiscale in categorie riconosciute dal commercialista.

Tutti i dati rimangono memorizzati nel browser (`localStorage`); nessun dato finanziario viene trasmesso a server remoti.

### 1. Registrazione di una spesa standard

1. **Data**: Data del documento di spesa (impostata di default a oggi).
2. **Categoria**: Selezionare la categoria contabile dall'elenco personalizzato.
3. **Importo**: Inserire la cifra numerica nella valuta selezionata.
4. **Fornitore / Beneficiario** *(facoltativo)*: Nome del fornitore o prestatore (es. Inkjecta, Barber DTS, Locatore).
5. **Riferimento ricevuta** *(facultativo)*: Annotare la collocazione fisica o digitale della fattura o scontrino (es. `Raccoglitore #3`, `Email Fattura #4092`, `Busta Marzo 2026`).
6. **Descrizione / Note** *(facultativo)*: Dettagli sulle forniture o prestazioni.
7. Fare clic su **Aggiungi spesa**.

### 2. Registrazione di viaggi e chilometraggio

1. Selezionare la scheda **Registro Viaggi & Chilometraggio**.
2. **Data viaggio**: Giorno della trasferta.
3. **Motivo / Destinazione**: Scopo professionale (es. `Guest spot a Milano`, `Forniture all'ingrosso`, `Convention di tatuaggi`).
4. **Distanza**: Chilometri o miglia percorsi.
5. **Tariffa chilometrica per unità**: Indennità chilometrica deducibile stabilita per il veicolo.
6. **Pedaggi / Parcheggio / Mezzi pubblici** *(facultativo)*: Spese vive documentate.
7. **Riferimento scontrino / Biglietto** *(facultativo)*: Nota contachilometri, ticket autostradale o biglietto.
8. Controllare il totale calcolato in tempo reale e cliccare su **Registra viaggio e chilometraggio**.

### 3. Riepilogo annuale e reportistica

- **Filtro Anno**: Visualizzazione specifica per anno d'imposta o storico completo.
- **Riepilogo analitico**: Totale spese registrate, numero di voci, importo viaggi e categoria di spesa prevalente.
- **Grafico SVG integrato**: Visualizzazione delle quote percentuali ad alto contrasto per stampa e accessibilità.

### 4. Esportazione e stampa per il commercialista

- **Stampa riepilogo**: Formato pronto per la stampa cartacea o PDF tramite foglio di stile dedicato.
- **Esportazione CSV**: File di riepilogo per categoria o registro completo di ogni singola scrittura contabile.

### 5. Categorie, Valuta e Lingua

- **Personalizzazione categorie**: Aggiunta, ridenominazione, eliminazione e ripristino valori standard.
- **Valute**: Supporto rapido per GBP (£), USD ($), EUR (€), CHF, corone scandinave (kr) e Yen (¥).
- **Lingue**: Navigazione in 7 lingue native (Italiano, Inglese, Francese, Tedesco, Spagnolo, Olandese, Portoghese).

### 6. Avviso contabile

Questa applicazione è uno strumento gestionale di archiviazione dati contabili e non fornisce consulenza fiscale, legale o tributaria. Si consiglia sempre di sottoporre i riepiloghi al proprio commercialista abilitato.

---

<a id="deutsch"></a>
## Deutsch

### Übersicht

Der **Betriebsausgaben-Rechner für Tattoo-Künstler** ist ein reines clientseitiges Werkzeug von Poli International für Tätowierer, Piercer und Studiobetreiber. Das Tool ermöglicht die schnelle und ordentliche Erfassung laufender Betriebsausgaben während des gesamten Steuerjahres in buchhalterisch anerkannten Kategorien.

Alle Buchungen verbleiben ausschließlich im lokalen Speicher Ihres Browsers (`localStorage`). Es werden keinerlei Finanzdaten an externe Server übertragen.

### 1. Standard-Betriebsausgabe erfassen

1. **Datum**: Belegdatum (voreingestellt auf das aktuelle Tagesdatum).
2. **Kategorie**: Betriebsausgabenkategorie aus der individuellen Kategorieliste auswählen.
3. **Betrag**: Ausgabenbetrag in der gewählten Währung eingeben.
4. **Lieferant / Zahlungsempfänger** *(optional)*: Händler, Großhändler oder Vermieter (z. B. Inkjecta, Barber DTS, Studio-Vermieter).
5. **Beleg-Referenz** *(optional)*: Physischer oder digitaler Ablageort des Belegs (z. B. `Ordner #3`, `Rechnungs-E-Mail #4092`, `Belegumschlag März 2026`). Ersetzt speicherintensive Foto-Uploads durch präzise Auffindbarkeit.
6. **Beschreibung / Notizen** *(optional)*: Artikeldetails oder Leistungsbeschreibung.
7. Auf **Ausgabe erfassen** klicken.

### 2. Reise- und Kilometerprotokoll führen

1. Den Reiter **Reise- & Kilometerprotokoll** oberhalb des Formulars öffnen.
2. **Reisedatum**: Tag der betrieblichen Fahrt.
3. **Reisezweck / Ziel**: Betrieblicher Grund (z. B. `Guest Spot in Berlin`, `Großhandels-Einkauf`, `Tattoo Convention Transit`).
4. **Distanz**: Gefahrene Kilometer oder Meilen.
5. **Fahrzeugpauschale pro Einheit**: Individuell angesetzte Kilometerpauschale.
6. **Maut / Parken / Öffentlicher Nahverkehr** *(optional)*: Angefallene Nebenkosten.
7. **Beleg- / Ticket-Referenz** *(optional)*: Parkscheinnummer, Tachofoto-Notiz oder Fahrkarte.
8. Berechneten Gesamtabzug prüfen und mit **Reise & Kilometer erfassen** buchen.

### 3. Jahresübersicht und Kategoriendiagramm

- **Jahresfilter**: Gezielte Auswertung nach einzelnen Steuerjahren oder Gesamtüberblick über alle erfassten Jahre.
- **Kennzahlen-Karten**: Erfasste Ausgaben gesamt, Anzahl der Buchungen, Reisekosten und ausgabenstärkste Kategorie.
- **Integrierte SVG-Grafik**: Zweifarbige, kontrastreiche Schraffur für barrierefreie Ablesbarkeit und sparsamen Ausdruck.

### 4. Export und Druck für die Steuerberatung

- **Jahresübersicht drucken**: Über die Drucktaste wird ein übersichtlicher, auf das Wesentliche reduzierter Auszug für die Buchhaltung gedruckt.
- **CSV-Export**: Wahlweise als aggregierte Kategorienübersicht oder als vollständiges Journal aller Einzelposten.

### 5. Kategorien, Währung und Sprache

- **Kategorienverwaltung**: Kategorien frei anlegen, umbenennen, löschen oder auf Studio-Standardwerte zurücksetzen.
- **Währungen**: GBP (£), USD ($), EUR (€), CHF, skandinavische Kronen (kr) und JPY (¥).
- **Mehrsprachigkeit**: 7 vollständige Landessprachen wählbar (Deutsch, Englisch, Französisch, Italienisch, Spanisch, Niederländisch, Portugiesisch).

### 6. Hinweis zur Aufzeichnungspflicht

Dieses Werkzeug dient ausschließlich der geordneten rechnerischen Vorbereitung Ihrer Buchhaltungsbelege für Ihre Steuerberatung. Es stellt keine Steuer-, Rechts- oder Finanzberatung dar und prüft nicht die steuerliche Abzugsfähigkeit im Einzelfall. Konsultieren Sie vor Abgabe Ihrer Steuererklärung stets einen qualifizierten Steuerberater.

---

<a id="español"></a>
## Español

### Descripción general

El **Registro de Deducciones Fiscales para Tatuadores** es una herramienta digital de ejecución en navegador publicada por Poli International para tatuadores, anilladores corporales y titulares de estudios. Facilita el registro sistemático de los gastos operativos del estudio a lo largo del ejercicio fiscal en categorías reconocidas por asesores contables y fiscales.

Toda la información queda almacenada de forma privada en su navegador (`localStorage`); no se transmite ningún dato a servidores externos.

### 1. Registrar un gasto comercial estándar

1. **Fecha**: Fecha del comprobante o factura (por defecto la fecha de hoy).
2. **Categoría**: Seleccione la categoría contable de su lista personalizada.
3. **Importe**: Introduzca la cifra en la divisa seleccionada.
4. **Proveedor / Beneficiario** *(opcional)*: Nombre de la tienda o proveedor (p. ej. Inkjecta, Barber DTS, Arrendador).
5. **Referencia de recibo** *(opcional)*: Ubicación del comprobante físico o digital (p. ej. `Carpeta #3`, `Email Factura #4092`, `Sobre Marzo 2026`).
6. **Descripción / Notas** *(opcional)*: Detalle de los consumibles o servicios adquiridos.
7. Pulse en **Añadir gasto**.

### 2. Registro de viajes y kilometraje

1. Abra la pestaña **Registro de Viajes & Kilometraje**.
2. **Fecha del viaje**: Fecha del traslado.
3. **Motivo / Destino**: Justificación profesional (p. ej. `Guest spot en Barcelona`, `Compra de material al por mayor`, `Convención de tatuaje`).
4. **Distancia**: Kilómetros o millas recorridos.
5. **Tarifa de vehículo por unidad**: Tarifa por kilómetro aplicable según su vehículo y normativa local.
6. **Peajes / Aparcamiento / Tránsito** *(opcional)*: Gastos directos de transporte.
7. **Referencia de recibo / Billete** *(opcional)*: Nota de ticket, comprobante de peaje o foto del cuentakilómetros.
8. Compruebe el total calculado y pulse **Registrar viaje y kilometraje**.

### 3. Resumen anual y exportación para su gestor contable

- **Filtro de año**: Análisis por ejercicio impositivo específico o histórico completo.
- **Tarjetas de resumen**: Total de gastos registrados, número de apuntes contables, gastos de viaje y categoría predominante.
- **Imprimir resumen**: Vista de impresión depurada (`@media print`) lista para entregar a su asesor fiscal.
- **Descargas CSV**: Archivo con el desglose por categorías o libro diario íntegro con notas y referencias.

### 4. Categorías, Divisas e Idiomas

- **Gestor de categorías**: Añadir, renombrar, suprimir o restaurar categorías estándar del estudio.
- **Divisas**: Libra (£), Dólar ($), Euro (€), Franco suizo (CHF), Coronas (kr) y Yen (¥).
- **Idiomas disponibles**: 7 idiomas completos (Español, Inglés, Francés, Italiano, Alemán, Neerlandés, Portugués).

### 5. Aviso contable

Esta herramienta es un apoyo organizativo y de registro documental para su gestoría. No constituye asesoramiento fiscal, legal ni financiero. Consulte siempre con un profesional contable o asesor fiscal titulado antes de presentar sus declaraciones impositivas.

---

<a id="nederlands"></a>
## Nederlands

### Overzicht

De **Aftrekposten- en Uitgavenbeheerder voor Tatoeëerders** is een browsergebaseerde tool van Poli International voor tatoeëerders, piercers en studio-eigenaren. Hiermee houdt u gedurende het gehele boekjaar snel en ordelijk al uw bedrijfskosten bij in categorieën die uw boekhouder direct herkent.

Alle gegevens worden lokaal in uw webbrowser opgeslagen (`localStorage`). Er worden geen cijfers of persoonsgegevens naar externe servers verzonden.

### 1. Een standaard bedrijfsuitgave registreren

1. **Datum**: Factuurdatum (standaard ingesteld op vandaag).
2. **Categorie**: Kies de gewenste kostenpost uit uw lijst.
3. **Bedrag**: Voer het aankoopbedrag in de gekozen valuta in.
4. **Leverancier / Begunstigde** *(optioneel)*: Naam van de groothandel, winkel of verhuurder (bijv. Inkjecta, Barber DTS, Verhuurder studio).
5. **Bon-referentie** *(optioneel)*: Vindplaats van het fysieke of digitale aankoopbewijs (bijv. `Map #3`, `Factuurmail #4092`, `Envelop Maart 2026`).
6. **Omschrijving / Notities** *(optioneel)*: Specificatie van de aangeschafte materialen.
7. Klik op **Uitgave toevoegen**.

### 2. Reis- en kilometerregistratie bijhouden

1. Klik op het tabblad **Reis- & Kilometerlogboek**.
2. **Reisdatum**: Datum van de zakelijke rit.
3. **Doel / Bestemming**: Zakelijke aanleiding (bijv. `Gastplek in Rotterdam`, `Inkooprit groothandel`, `Tattoo conventie`).
4. **Afstand**: Aantal gereden kilometers of mijlen.
5. **Vergoeding per eenheid**: Uw zakelijke kilometervergoeding per eenheid.
6. **Tol / Parkeren / Openbaar Vervoer** *(optioneel)*: Bijkomende zakelijke reiskosten.
7. **Bon- / Kaartreferentie** *(optioneel)*: Nummer van parkeerkaartje of foto van kilometerteller.
8. Controleer het berekende bedrag en klik op **Reis & kilometers registreren**.

### 3. Jaaroverzicht en rapportage

- **Jaarfilter**: Selecteer een specifiek belastingjaar of bekijk alle geregistreerde jaren.
- **Overzichtskaarten**: Totaal geregistreerde uitgaven, aantal posten, reiskosten en grootste uitgavencategorie.
- **Ingebouwde SVG-grafiek**: Duidelijke weergave met hoog contrast voor optimale toegankelijkheid en printkwaliteit.

### 4. Afdrukken en CSV-export voor de boekhouder

- **Samenvatting afdrukken**: Professionele afdrukweergave zonder storende menuknoppen.
- **CSV-export**: Download het categoriesamenvattingsbestand of het volledige journaal met alle transacties en bonreferenties.

### 5. Categorieën, Valuta en Taal

- **Categoriebeheer**: Gemakkelijk toevoegen, hernoemen, verwijderen en terugzetten naar studiostandaarden.
- **Valutakeuze**: GBP (£), USD ($), EUR (€), CHF, Scandinavische kronen (kr) en Yen (¥).
- **Taalkeuze**: Direct wisselbaar tussen Nederlands, Engels, Frans, Italiaans, Duits, Spaans en Portugees.

### 6. Kennisgeving betreffende administratieplicht

Deze applicatie is uitsluitend een administratief hulpmiddel om de uitgaven van uw onderneming netjes te ordenen voor uw boekhouder of accountant. Het verstrekt geen fiscaal, juridisch of financieel advies. Raadpleeg altijd een erkende belastingconsulent of accountant voor het indienen van belastingaangiften.

---

<a id="português"></a>
## Português

### Visão Geral

O **Registo de Deduções Fiscais para Tatuadores** é uma ferramenta de gestão local publicada pela Poli International para tatuadores, body piercers e proprietários de estúdios. Permite o registo rápido e estruturado de todas as despesas operacionais ao longo do ano fiscal em categorias reconhecidas pela contabilidade.

Todos os registos permanecem salvaguardados no seu navegador (`localStorage`); nenhum dado ou valor financeiro é transmitido para servidores remotos.

### 1. Registar uma despesa padrão

1. **Data**: Data do comprovativo (por defeito a data atual).
2. **Categoria**: Selecione a categoria adequada na sua lista personalizada.
3. **Valor**: Insira o montante na moeda em utilização.
4. **Fornecedor / Beneficiário** *(opcional)*: Nome da empresa ou prestador (ex. Inkjecta, Barber DTS, Senhorio).
5. **Referência do recibo** *(opcional)*: Localização física ou digital da fatura (ex. `Pasta #3`, `Email Fatura #4092`, `Envelope Março 2026`).
6. **Descrição / Notas** *(opcional)*: Detalhes dos materiais ou serviços adquiridos.
7. Clique em **Adicionar despesa**.

### 2. Registar deslocações e quilometragem

1. Abra o separador **Registo de Deslocações & Quilometragem**.
2. **Data da viagem**: Data da deslocação profissional.
3. **Objetivo / Destino**: Motivo do trajeto (ex. `Guest spot em Lisboa`, `Deslocação a grossista`, `Convenção de tatuagem`).
4. **Distância**: Quilómetros ou milhas percorridos.
5. **Taxa de veículo por unidade**: Tarifa por quilómetro aplicável à sua atividade.
6. **Portagens / Estacionamento / Transportes** *(opcional)*: Despesas diretas de transporte e portagem.
7. **Referência do bilhete / Recibo** *(opcional)*: Nota de recibo de portagem, talão de parque ou foto do conta-quilómetros.
8. Verifique o total calculado e clique em **Registar deslocação e quilometragem**.

### 3. Resumo anual e relatórios para a contabilidade

- **Filtro de Ano**: Filtragem por ano fiscal específico ou histórico completo.
- **Cartões de resumo**: Total de despesas registadas, número de registos, total de deslocações e categoria de maior despesa.
- **Gráfico vetorial SVG integrado**: Visualização gráfica com preenchimento em linhas de alto contraste para leitura e impressão nítidas.

### 4. Exportação e impressão para o contabilista

- **Imprimir resumo**: Formatação limpa de impressão (`@media print`) pronta para entrega documental.
- **Exportação CSV**: Ficheiro com totais consolidados por categoria ou livro diário integral de despesas.

### 5. Categorias, Moeda e Idioma

- **Gestor de categorias**: Adicione, renomeie, remova ou restaure categorias padrão do estúdio.
- **Moedas**: Libra (£), Dólar ($), Euro (€), Franco suíço (CHF), Coroas (kr) e Iene (¥).
- **Idiomas disponíveis**: 7 idiomas nativos completos (Português, Inglês, Francês, Italiano, Alemão, Espanhol, Neerlandês).

### 6. Aviso de manutenção de registos

Esta aplicação é estritamente um auxiliar de registo administrativo e contabilístico para organizar despesas para o seu contabilista. Não fornece consultoria fiscal, jurídica ou financeira, nem valida a elegibilidade de deduções. Consulte sempre um contabilista certificado ou consultor fiscal antes de submeter declarações oficiais.
