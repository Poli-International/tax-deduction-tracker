# Registro de Deducciones Fiscales para Tatuadores: Documentación Técnica

**Idioma:** Español (es)  
**Editor:** Poli International Co., Ltd.  
**Versión:** 2.0.0  
**Licencia:** MIT  

---

## 1. Visión general de la arquitectura

El **Registro de Deducciones Fiscales para Tatuadores** es una aplicación web de página única (SPA) que se ejecuta exclusivamente en el cliente. Ha sido diseñada para tatuadores, anilladores corporales y titulares de estudios. La herramienta opera de forma completamente autónoma en el navegador web del usuario, sin necesidad de servidores de aplicaciones, bases de datos remotas ni conexión continua a Internet.

### Pila tecnológica
- **Estructura HTML:** HTML5 semántico con roles ARIA de accesibilidad y atributos de localización `data-i18n`.
- **Hojas de estilo:** CSS3 nativo mediante propiedades personalizadas (variables CSS) para cambio dinámico entre modo claro y oscuro, diseño adaptativo y reglas específicas de impresión `@media print`.
- **Lógica de ejecución:** JavaScript moderno ECMAScript 6+ (ES6+) nativo encapsulado en una expresión de función invocada inmediatamente (IIFE); cero dependencias o marcos pesados externos.
- **Motor de internacionalización:** Subsistema i18n local (`js/i18n.js`) acompañado de módulos de diccionarios específicos por idioma (`js/i18n/*.js`) con cobertura para 7 idiomas completos.
- **Almacenamiento persistente:** API Web Storage del navegador (`window.localStorage`).
- **Visualización gráfica:** Gráficos vectoriales SVG incrustados en el DOM; sin renderizado de mapas de bits en Canvas ni librerías gráficas de terceros.
- **Seguridad y Content Security Policy (CSP):** Conformidad estricta con la política `script-src 'self'`; sin carga de tipografías externas, hojas de estilo remotas, CDN o balizas de rastreo.

---

## 2. Esquemas de datos y almacenamiento local

Toda la información contable se almacena de forma privada en el `localStorage` del cliente bajo cuatro claves bien diferenciadas:

### 2.1. `poli-tax-tracker` (Libro diario de gastos)
Almacena una matriz de registros contables serializada en formato JSON:

```typescript
interface ExpenseRecord {
  date: string;          // Fecha en formato ISO (AAAA-MM-DD)
  category: string;      // Denominación de la categoría contable
  amount: string;        // Importe numérico formateado con 2 decimales (p. ej. "45.00")
  supplier?: string;     // Proveedor, beneficiario o motivo del viaje
  receiptRef?: string;   // Ubicación física o referencia digital del comprobante
  desc?: string;         // Notas descriptivas o desglose del cómputo de kilometraje
  mileageDist?: number;  // Distancia recorrida (en caso de registro de kilometraje)
  createdAt: string;     // Marca temporal ISO de creación del apunte
}
```

### 2.2. `poli-tax-categories` (Listado de categorías)
Almacena una matriz de cadenas con los nombres de las categorías configurables:

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

### 2.3. `poli-tax-currency` (Símbolo de divisa activa)
Almacena el símbolo monetario elegido por el usuario (`£`, `$`, `€`, `CHF`, `kr`, `¥`). Valor predeterminado: `£`.

### 2.4. `poli-tax-lang` (Código de idioma activo)
Almacena el código lingüístico de la interfaz (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`). Valor predeterminado: idioma del navegador o `en`.

---

## 3. Algoritmos de cálculo y lógica operativa

### 3.1. Tabulación y filtrado anual
1. **Filtrado temporal:** Selección de registros mediante `date.startsWith(selectedYear)`. Si se elige "all", se conservan todos los ejercicios registrados.
2. **Suma total:** Acumulación aritmética con coma flotante:  
   `total = expenses.reduce((acumulado, apunte) => acumulado + parseFloat(apunte.amount), 0)`.
3. **Agrupación por categorías:** Mapeo asociativo: `{ [nombreCategoria]: { amount: number, count: number } }`.
4. **Porcentaje proporcional:** Para cada categoría, `porcentaje = (importeCategoria / total) * 100`, redondeado a un decimal.

### 3.2. Cálculo de desplazamientos y kilometraje
- **Fórmula:** `Total calculado = (Distancia * Tarifa por unidad) + Gastos accesorios (peajes, aparcamientos, transportes)`
- Al confirmar el formulario, se añade un apunte a la categoría de desplazamientos que guarda la fórmula exacta en el campo `desc`.

### 3.3. Formateo de importes monetarios (`fmtMoney`)
Añade como prefijo la divisa seleccionada, fija dos posiciones decimales e intercala separadores de miles mediante la expresión regular `\B(?=(\d{3})+(?!\d))`.

---

## 4. Componentes visuales y gráficos vectoriales SVG

### 4.1. Gráfico SVG en línea por categoría
- Representa un diagrama de barras apiladas directamente en un elemento contenedor `<svg>`.
- Incorpora tramas geométricas de alto contraste (rayados diagonales, punteados, tramas continuas) que aseguran perfecta legibilidad en impresiones monocromáticas de bajo consumo y para usuarios con daltonismo.

### 4.2. Diseño adaptable a distintos dispositivos
- **Escritorio (>960px):** 4 tarjetas de resumen métrico en hilera, tabla contable íntegra y formularios de entrada a doble columna.
- **Tableta (641px a 960px):** Cuadrícula métrica 2x2 y tabla desplazable horizontalmente con inercia táctil (`-webkit-overflow-scrolling: touch`).
- **Móvil (<=640px):** La tabla pasa a estructurarse como tarjetas verticales apiladas usando `display: block` y pseudo-elementos `::before` con el atributo `data-label`, evitando cualquier desbordamiento lateral.

---

## 5. Arquitectura de internacionalización (`js/i18n.js`)

- **Estructura base:** `js/i18n.js` inicializa el registro global `window.i18n.register(lang, dict)`.
- **Carga secuencial:** Los archivos de traducción (`js/i18n/*.js`) se incluyen sincrónicamente respetando el orden del documento.
- **Enlace dinámico al DOM:** `window.i18n.applyI18n()` actualiza las etiquetas con `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria-label]` y `[data-i18n-title]`.
- **Sustitución de variables:** Soporte nativo para marcadores de posición `{token}` (p. ej. `{year}`, `{date}`, `{count}`, `{dist}`) sin intermediación de librerías externas de plantillas.

---

## 6. Módulo de impresión y exportación documental

### 6.1. Hoja de estilo para impresión (`@media print`)
- Oculta paneles de navegación, formularios de registro, barras de filtrado y botones de acción.
- Optimiza el gasto de tóner forzando un contraste puro de texto negro sobre fondo blanco.
- Emite una hoja de síntesis formal para la asesoría contable con encabezados institucionales, fechas de generación y línea de firma manuscrita.

### 6.2. Descarga de archivos CSV
Convierte los datos a cadenas UTF-8 mediante URI de datos (`data:text/csv;charset=utf-8,`) y desencadena la descarga creando dinámicamente un enlace `<a>` que se elimina de memoria tras la operación.

---

## 7. Seguridad, privacidad y cumplimiento normativo

- **CSP restrictivo:** Cero peticiones de red hacia servidores remotos; compatibilidad completa con `script-src 'self'`.
- **Privacidad desde el diseño:** La información de los gastos no se transfiere a ningún servicio en la nube y permanece custodiada únicamente en el navegador del usuario.
- **Mitigación de ataques XSS:** Todos los valores dinámicos inyectados en la interfaz se sanean previamente con la función `escHtml()`.
