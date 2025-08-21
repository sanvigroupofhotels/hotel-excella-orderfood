// ---------------------- CSV PARSER ----------------------
function parseCSV(text) {
  const rows = [];
  let current = '';
  let insideQuotes = false;
  let row = [];

  for (let char of text) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      row.push(current.trim());
      current = '';
    } else if (char === '\n' && !insideQuotes) {
      row.push(current.trim());
      rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (current) row.push(current.trim());
  if (row.length) rows.push(row);

  return rows;
}

let menuData = [];

// ---------------------- LOAD MENU ----------------------
fetch("menu.csv")
  .then(res => res.text())
  .then(text => {
    const rows = parseCSV(text);
    const headers = rows.shift();
    menuData = rows.map(r => {
      let obj = {};
      headers.forEach((h, i) => (obj[h.trim()] = r[i] || ""));
      return obj;
    });
    renderMenu("veg"); // default Veg
  });

// ---------------------- RENDER MENU ----------------------
function renderMenu(type) {
  const menuContainer = document.getElementById("menuContainer");
  menuContainer.innerHTML = "";

  // normalize type for filtering
  let items = menuData.filter(item => {
    const normalizedType = (item.Type || "")
      .toLowerCase()
      .replace(/[\s-]/g, "");
    return normalizedType === type.toLowerCase();
  });

  if (!items.length) {
    menuContainer.innerHTML = "<p>No items available.</p>";
    return;
  }

  // group by Category
  const categories = {};
  items.forEach(item => {
    const cat = item.Category || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  // category tabs
  const categoryTabs = document.createElement("div");
  categoryTabs.className = "category-tabs";
  menuContainer.appendChild(categoryTabs);

  const categoryContainer = document.createElement("div");
  categoryContainer.className = "category-container";
  menuContainer.appendChild(categoryContainer);

  let first = true;
  Object.keys(categories).forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => {
      document
        .querySelectorAll(".category-tabs button")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCategoryItems(categories[cat], categoryContainer);
    };
    if (first) {
      btn.classList.add("active"); // default highlight
      renderCategoryItems(categories[cat], categoryContainer);
      first = false;
    }
    categoryTabs.appendChild(btn);
  });
}

// ---------------------- RENDER CATEGORY ITEMS ----------------------
function renderCategoryItems(items, container) {
  container.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";

    const left = document.createElement("div");
    left.className = "menu-info";
    left.innerHTML = `<h4>${item.Name}</h4><p>${item.Description}</p>`;

    const right = document.createElement("div");
    right.className = "menu-action";
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = `₹${parseFloat(item.Price).toFixed(2)}`;

    const btn = document.createElement("button");
    btn.className = "add-btn";
    btn.textContent = "Add";

    btn.onclick = () => handleAdd(btn, item);

    right.appendChild(price);
    right.appendChild(btn);

    card.appendChild(left);
    card.appendChild(right);
    container.appendChild(card);
  });
}

// ---------------------- HANDLE ADD / QTY ----------------------
function handleAdd(btn, item) {
  btn.remove();

  const qtyWrapper = document.createElement("div");
  qtyWrapper.className = "qty-control";

  const minus = document.createElement("button");
  minus.textContent = "−";
  const plus = document.createElement("button");
  plus.textContent = "+";
  const qty = document.createElement("span");
  qty.textContent = "1";

  qtyWrapper.appendChild(minus);
  qtyWrapper.appendChild(qty);
  qtyWrapper.appendChild(plus);

  btn.parentElement.appendChild(qtyWrapper);

  updateOrder(item, 1);

  plus.onclick = () => {
    let q = parseInt(qty.textContent) + 1;
    qty.textContent = q;
    updateOrder(item, 1);
  };

  minus.onclick = () => {
    let q = parseInt(qty.textContent) - 1;
    if (q <= 0) {
      qtyWrapper.remove();
      const newBtn = document.createElement("button");
      newBtn.className = "add-btn";
      newBtn.textContent = "Add";
      newBtn.onclick = () => handleAdd(newBtn, item);
      btn.parentElement.appendChild(newBtn);
      updateOrder(item, -1, true);
    } else {
      qty.textContent = q;
      updateOrder(item, -1);
    }
  };
}

// ---------------------- ORDER SUMMARY ----------------------
let order = {};

function updateOrder(item, change, removeAll = false) {
  const key = item.Name;
  if (!order[key]) {
    order[key] = { ...item, qty: 0 };
  }

  if (removeAll) {
    order[key].qty = 0;
  } else {
    order[key].qty += change;
  }

  if (order[key].qty <= 0) {
    delete order[key];
  }

  renderOrderSummary();
}

function renderOrderSummary() {
  const list = document.getElementById("orderList");
  const totalEl = document.getElementById("orderTotal");
  list.innerHTML = "";
  let total = 0;

  Object.values(order).forEach(it => {
    const li = document.createElement("li");
    li.textContent = `${it.Name} x ${it.qty}`;
    list.appendChild(li);
    total += it.qty * parseFloat(it.Price);
  });

  totalEl.textContent = total.toFixed(2);
}

// ---------------------- TAB SWITCH ----------------------
document.getElementById("tabVeg").onclick = () => {
  setActiveTab("tabVeg");
  renderMenu("veg");
};
document.getElementById("tabNonVeg").onclick = () => {
  setActiveTab("tabNonVeg");
  renderMenu("nonveg");
};
document.getElementById("tabGeneral").onclick = () => {
  setActiveTab("tabGeneral");
  renderMenu("general");
};

function setActiveTab(id) {
  document
    .querySelectorAll("#menuTabs .tab-btn")
    .forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
