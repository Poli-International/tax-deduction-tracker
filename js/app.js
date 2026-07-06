const KEY = 'poli-tax-tracker';
const expenseDate = document.getElementById('expense-date');
const expenseCategory = document.getElementById('expense-category');
const expenseAmount = document.getElementById('expense-amount');
const expenseSupplier = document.getElementById('expense-supplier');
const expenseDesc = document.getElementById('expense-desc');
const addBtn = document.getElementById('add-btn');
const exportBtn = document.getElementById('export-btn');
const clearBtn = document.getElementById('clear-btn');
const expensesBody = document.getElementById('expenses-body');
const expensesTable = document.getElementById('expenses-table');
const emptyState = document.getElementById('empty-state');
const logCount = document.getElementById('log-count');
const summaryRow = document.getElementById('summary-row');
const breakdownWrap = document.getElementById('breakdown-wrap');

expenseDate.value = new Date().toISOString().slice(0, 10);

function load() { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
function save(e) { localStorage.setItem(KEY, JSON.stringify(e)); }
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtMoney(n) { return '£' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

function render() {
  const expenses = load();
  logCount.textContent = expenses.length ? `${expenses.length} expense${expenses.length === 1 ? '' : 's'}` : '';

  if (!expenses.length) {
    emptyState.style.display = '';
    expensesTable.style.display = 'none';
    summaryRow.style.display = 'none';
    breakdownWrap.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  expensesTable.style.display = '';
  summaryRow.style.display = '';
  breakdownWrap.style.display = '';

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  document.getElementById('total-deductions').textContent = fmtMoney(total);
  document.getElementById('entry-count').textContent = expenses.length;

  const byCategory = {};
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + parseFloat(e.amount);
  });
  const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  document.getElementById('top-category').textContent = topCat ? `${topCat[0]} (${fmtMoney(topCat[1])})` : '—';

  const maxAmt = Math.max(...Object.values(byCategory));
  document.getElementById('category-breakdown').innerHTML = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `
      <div class="cat-row">
        <div class="cat-name">${escHtml(cat)}</div>
        <div class="cat-amount">${fmtMoney(amt)}</div>
        <div class="cat-bar-wrap"><div class="cat-bar" style="width:${Math.round((amt/maxAmt)*100)}%"></div></div>
      </div>`).join('');

  expensesBody.innerHTML = [...expenses].reverse().map((e, i) => {
    const idx = expenses.length - 1 - i;
    return `<tr>
      <td>${escHtml(e.date)}</td>
      <td>${escHtml(e.category)}</td>
      <td class="amount-cell">${fmtMoney(parseFloat(e.amount))}</td>
      <td>${escHtml(e.supplier || '—')}</td>
      <td class="desc-cell" title="${escHtml(e.desc)}">${escHtml(e.desc || '—')}</td>
      <td><button class="del-btn" data-idx="${idx}" title="Delete">×</button></td>
    </tr>`;
  }).join('');
}

addBtn.addEventListener('click', () => {
  const date = expenseDate.value;
  const category = expenseCategory.value;
  const amount = expenseAmount.value.trim();
  if (!date || !category || !amount) { alert('Please fill in Date, Category, and Amount.'); return; }
  if (parseFloat(amount) <= 0) { alert('Amount must be greater than 0.'); return; }
  const expenses = load();
  expenses.push({ date, category, amount, supplier: expenseSupplier.value.trim(), desc: expenseDesc.value.trim() });
  save(expenses);
  expenseCategory.value = '';
  expenseAmount.value = '';
  expenseSupplier.value = '';
  expenseDesc.value = '';
  render();
});

expensesBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.del-btn');
  if (!btn) return;
  if (!confirm('Delete this expense?')) return;
  const idx = parseInt(btn.dataset.idx, 10);
  const expenses = load();
  expenses.splice(idx, 1);
  save(expenses);
  render();
});

exportBtn.addEventListener('click', () => {
  const expenses = load();
  if (!expenses.length) { alert('No expenses to export.'); return; }
  const header = 'Date,Category,Amount,Supplier,Description';
  const rows = expenses.map(e =>
    [e.date, e.category, e.amount, e.supplier, e.desc]
      .map(v => `"${String(v).replace(/"/g,'""')}"`)
      .join(',')
  );
  const csv = [header, ...rows].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'tax-deductions.csv';
  a.click();
});

clearBtn.addEventListener('click', () => {
  if (!confirm('Clear all expense records? This cannot be undone.')) return;
  localStorage.removeItem(KEY);
  render();
});

render();
