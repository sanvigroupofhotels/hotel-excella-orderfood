document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const menuContainer  = document.getElementById('menuContainer');
  const orderList      = document.getElementById('orderList');
  const orderTotalEl   = document.getElementById('orderTotal');
  const tabVeg         = document.getElementById('tabVeg');
  const tabNonVeg      = document.getElementById('tabNonVeg');
  const tabGeneral     = document.getElementById('tabGeneral');

  // App state
  let rows = [];
  let currentType = 'Veg';
  let currentCategory = null;
  const order = {}; // { name: { qty, price } }

  // -------- CSV parsing (handles commas inside quotes) ----------
  function splitCSVLine(line) {
    const out = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i+1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        out.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  }
  function parseCSV(text) {
    const lines = text.replace(/\r/g, '').trim().split('\n').filter(Boolean);
    const headers = splitCSVLine(lines[0]).map(h => h.trim());
    return lines.slice(1).map(line => {
      const vals = splitCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => obj[h] = (vals[i] ?? '').trim());
      return obj;
    });
  }
  function toNumber(val) {
    return Number(String(val || '').replace(/[^\d.]/g, '')) || 0;
  }

  // -------- Fetch & init ----------
  fetch('menu.csv')
    .then(r => r.text())
    .then(csv => {
      rows = parseCSV(csv).filter(r => r.Name); // expect columns: Name, Description, Price, Type, Category
      setupMainTabs();
      renderMenu();
    })
    .catch(err => {
      console.error('CSV load error:', err);
      menuContainer.textContent = 'Failed to load menu.';
    });

  // -------- Tabs ----------
  function setupMainTabs() {
    const allTabs = [tabVeg, tabNonVeg, tabGeneral];
    allTabs.forEach(btn => {
      btn.classList.remove('active');
      btn.addEventListener('click', () => {
        allTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentType = (btn.id === 'tabVeg') ? 'Veg' : (btn.id === 'tabNonVeg') ? 'Non Veg' : 'General';
        currentCategory = null;  // reset sub-category
        renderMenu();
      });
    });
    // default active
    tabVeg.classList.add('active');
  }

  // -------- Render Menu (type + category) ----------
  function renderMenu() {
    menuContainer.innerHTML = '';

    // Sub-tabs (categories)
    const cats = [...new Set(rows.filter(r => r.Type === currentType)
                              .map(r => r.Category).filter(Boolean))];

    if (!currentCategory) currentCategory = cats[0] || null;

    const subTabs = document.createElement('div');
    subTabs.id = 'subTabs';
    cats.forEach(cat => {
      const b = document.createElement('button');
      b.className = 'sub-tab' + (cat === currentCategory ? ' active' : '');
      b.textContent = cat;
      b.onclick = () => {
        currentCategory = cat;
        renderMenu();
      };
      subTabs.appendChild(b);
    });
    if (cats.length) menuContainer.appendChild(subTabs);

    // Items for current filter
    const items = rows.filter(r =>
      r.Type === currentType && (!currentCategory || r.Category === currentCategory)
    );

    if (!items.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No items in this category.';
      menuContainer.appendChild(empty);
      return;
    }

    items.forEach(item => {
      const priceNum = toNumber(item.Price);

      const card = document.createElement('div');
      card.className = 'menu-item';

      const left = document.createElement('div');
      left.className = 'item-info';
      left.innerHTML = `<strong>${item.Name}</strong><small>${item.Description}</small>`;

      const right = document.createElement('div');
      right.className = 'item-actions';

      const priceEl = document.createElement('span');
      priceEl.className = 'price';
      priceEl.textContent = `₹${priceNum.toFixed(2)}`;

      const controls = document.createElement('div');
      controls.className = 'item-controls';

      // If already in order, show qty controls; else Add button
      if (order[item.Name]?.qty > 0) {
        buildQtyControls(item.Name, priceNum, controls);
      } else {
        const addBtn = document.createElement('button');
        addBtn.className = 'add-btn';
        addBtn.textContent = 'Add';
        addBtn.onclick = () => {
          order[item.Name] = { qty: 1, price: priceNum };
          updateOrderSummary();
          renderMenu(); // refresh to show - qty +
        };
        controls.appendChild(addBtn);
      }

      right.append(priceEl, controls);
      card.append(left, right);
      menuContainer.appendChild(card);
    });
  }

  function buildQtyControls(name, price, container) {
    container.innerHTML = '';
    const minus = document.createElement('button');
    minus.className = 'qty-btn';
    minus.textContent = '−';
    minus.onclick = () => {
      order[name].qty -= 1;
      if (order[name].qty <= 0) delete order[name];
      updateOrderSummary();
      renderMenu();
    };

    const qty = document.createElement('span');
    qty.className = 'qty-display';
    qty.textContent = order[name].qty;

    const plus = document.createElement('button');
    plus.className = 'qty-btn';
    plus.textContent = '+';
    plus.onclick = () => {
      order[name].qty += 1;
      updateOrderSummary();
      renderMenu();
    };

    container.append(minus, qty, plus);
  }

  // -------- Order Summary ----------
  function updateOrderSummary() {
    orderList.innerHTML = '';
    let total = 0;

    Object.entries(order).forEach(([name, { qty, price }]) => {
      const li = document.createElement('li');
      li.textContent = `${name} × ${qty}`;
      orderList.appendChild(li);
      total += qty * price;
    });

    orderTotalEl.textContent = total.toFixed(2);
  }
});
