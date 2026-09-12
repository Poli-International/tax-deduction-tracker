# Registo de Deduções Fiscais para Tatuadores: Documentação Técnica

**Idioma:** Português (pt)  
**Editor:** Poli International Co., Ltd.  
**Versão:** 2.0.0  
**Licença:** MIT  

---

## 1. Visão Geral da Arquitetura

O **Registo de Deduções Fiscais para Tatuadores** é uma aplicação web de página única (SPA) executada exclusivamente no lado do cliente, desenvolvida para tatuadores, body piercers e proprietários de estúdios. Opera integralmente no navegador do utilizador, sem necessidade de servidores de retaguarda, bases de dados remotas ou conectividade contínua à Internet.

### Pilha Tecnológica
- **Marcação:** HTML5 semântico com papéis ARIA de acessibilidade e atributos de tradução `data-i18n`.
- **Folhas de Estilo:** CSS3 puro utilizando propriedades personalizadas (variáveis CSS) para alternância dinâmica entre temas claro e escuro, esquema responsivo e regras especializadas de impressão `@media print`.
- **Lógica de Execução:** JavaScript moderno nativo ECMAScript 6+ (ES6+) encapsulado numa expressão funcional imediatamente invocada (IIFE); sem dependências externas ou pacotes pesados.
- **Motor de Internacionalização:** Subsistema i18n local (`js/i18n.js`) com módulos de dicionário dedicados por idioma (`js/i18n/*.js`) cobrindo 7 idiomas integrais.
- **Armazenamento:** API Web Storage do navegador (`window.localStorage`).
- **Visualização de Dados:** Gráficos vetoriais SVG inline gerados diretamente no Document Object Model (DOM); sem renderização de mapas de bits em Canvas ou bibliotecas gráficas de terceiros.
- **Segurança e Content Security Policy (CSP):** Conformidade rigorosa com a diretiva `script-src 'self'`; sem carregamento de fontes externas, CDN ou serviços de telemetria.

---

## 2. Esquemas de Dados e Armazenamento Local

Todos os registos contabilísticos são guardados localmente no `localStorage` do cliente através de quatro chaves independentes:

### 2.1. `poli-tax-tracker` (Diário de Despesas)
Armazena uma matriz de registos de despesas serializada em formato JSON:

```typescript
interface ExpenseRecord {
  date: string;          // Data em formato ISO (AAAA-MM-DD)
  category: string;      // Designação da categoria contabilística
  amount: string;        // Valor numérico com 2 casas decimais (ex.: "45.00")
  supplier?: string;     // Fornecedor, prestador de serviços ou motivo da deslocação
  receiptRef?: string;   // Localização física ou código digital do comprovativo
  desc?: string;         // Notas descritivas ou parâmetros do cálculo de quilometragem
  mileageDist?: number;  // Distância percorrida em quilómetros ou milhas
  createdAt: string;     // Carimbo de data/hora ISO de criação
}
```

### 2.2. `poli-tax-categories` (Lista de Categorias)
Armazena uma matriz de sequências de texto contendo os nomes das categorias personalizáveis:

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

### 2.3. `poli-tax-currency` (Símbolo Monetário Ativo)
Armazena a moeda escolhida pelo utilizador (`£`, `$`, `€`, `CHF`, `kr`, `¥`). Valor predefinido: `£`.

### 2.4. `poli-tax-lang` (Código de Idioma Ativo)
Armazena o código do idioma ativo na interface (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`). Valor predefinido: idioma do navegador ou `en`.

---

## 3. Algoritmos de Cálculo e Regras Contabilísticas

### 3.1. Totalização e Filtragem Anual
1. **Filtro de Ano:** Seleção de registos com base em `date.startsWith(selectedYear)`. Com a opção "all" ativa, mantêm-se todos os exercícios fiscais.
2. **Total Acumulado:** Soma em vírgula flutuante:  
   `total = expenses.reduce((soma, item) => soma + parseFloat(item.amount), 0)`.
3. **Agrupamento por Categoria:** Mapeamento associativo: `{ [nomeCategoria]: { amount: number, count: number } }`.
4. **Quota-Parte Percentual:** Para cada categoria, `percentagem = (valorCategoria / total) * 100`, arredondada a uma casa decimal.

### 3.2. Cálculo de Quilometragem e Deslocações
- **Fórmula:** `Total Calculado = (Distância * Tarifa por Unidade) + Despesas Adicionais (portagens, estacionamento, transportes)`
- Ao gravar, gera-se um lançamento na categoria de viagens que guarda a fórmula detalhada no campo `desc`.

### 3.3. Formatação de Valores (`fmtMoney`)
Prefixa o símbolo monetário selecionado, fixa duas casas decimais e insere separadores de milhares através da expressão regular `\B(?=(\d{3})+(?!\d))`.

---

## 4. Componentes da Interface e Gráficos SVG

### 4.1. Gráfico SVG Inline por Categoria
- Renderiza uma barra horizontal segmentada diretamente no elemento `<svg>`.
- Utiliza tramas geométricas de alto contraste (diagonais, pontilhados, preenchimentos densos) que garantem excelente visibilidade em impressões monocromáticas e para utilizadores com discromatopsia.

### 4.2. Adaptação a Diferentes Dispositivos
- **Computador (>960px):** 4 cartões de métricas na linha principal, tabela contabilística integral e formulários com colunas paralelas.
- **Tablet (641px a 960px):** Grelha métrica 2x2 e tabela com deslocamento horizontal suave via toque (`-webkit-overflow-scrolling: touch`).
- **Dispositivos Móveis (<=640px):** A tabela transforma-se em cartões empilhados através de `display: block` e pseudo-elementos `::before` que projetam os títulos das colunas (`data-label`), eliminando a necessidade de deslocamento lateral.

---

## 5. Arquitetura de Internacionalização (`js/i18n.js`)

- **Estrutura:** `js/i18n.js` expõe o método de registo `window.i18n.register(lang, dict)`.
- **Carregamento Síncrono:** Os ficheiros de vocabulário (`js/i18n/*.js`) são carregados imediatamente a seguir ao motor principal na ordem do documento.
- **Ligação Dinâmica ao DOM:** O método `window.i18n.applyI18n()` atualiza os elementos marcados com `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria-label]` e `[data-i18n-title]`.
- **Interpolação em Tempo de Execução:** Suporta substituição de marcadores `{token}` (ex.: `{year}`, `{date}`, `{count}`, `{dist}`) sem recurso a motores de modelos externos.

---

## 6. Módulo de Impressão e Exportação

### 6.1. Folha de Estilo de Impressão (`@media print`)
- Oculta formulários, barras de ferramentas, botões de ação e campos de pesquisa.
- Assegura contraste absoluto com texto preto sobre fundo branco puro.
- Emite uma folha formal de síntese para a contabilidade com cabeçalhos estruturados, datas de emissão e espaço para assinatura manuscrita.

### 6.2. Exportação para Ficheiro CSV
Gera sequências de texto codificadas em UTF-8 através de URIs de dados (`data:text/csv;charset=utf-8,`) e inicia a transferência criando temporariamente um elemento `<a>` no DOM, desalocado em seguida.

---

## 7. Segurança, Privacidade e Conformidade

- **Diretiva CSP Rigorosa:** Zéro pedidos de rede a servidores externos; total conformidade com `script-src 'self'`.
- **Privacidade Nativa:** Os dados financeiros nunca saem do navegador do utilizador; não existem registos de telemetria nem rastreio.
- **Proteção Contra XSS:** Todos os valores inseridos pelo utilizador são limpos preventivamente através da função `escHtml()`.
