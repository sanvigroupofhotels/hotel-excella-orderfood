document.addEventListener("DOMContentLoaded", () => {
  const menuTabs = document.querySelectorAll("#menuTabs button");
  const menuContainer = document.getElementById("menuContainer");
  const categoryTabs = document.getElementById("categoryTabs");
  const orderList = document.getElementById("orderList");
  const orderTotal = document.getElementById("orderTotal");
  const confirmOrderBtn = document.getElementById("confirmOrder");

  let currentTab = "Veg";
  let currentCategory = null;
  let menuData = [];
  let order = {};

  // Parse CSV safely (handles commas inside quotes)
  function parseCSV(data) {
    const rows = data.trim().split(/\r?\n/);
    return rows.map(row => {
      const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
      return [...row.matchAll(regex)].map(m => m[0].replace(/(^"|"$)/g, ""));
    });
  }

  // Load menu.csv
  fetch("menu.csv")
    .then(res => res.text())
    .then(text => {
      const rows = parseCSV(text);
      const headers = rows.shift();
      menuData = rows.map(r => {
        let item = {};
        headers.forEach((h, i) => (item[h.trim()] = r[i]));
        return item;
      });
      renderMenu();
      renderCategories();
    });

  // Render categories based on current tab
  function renderCategories() {
    const items = menuData.filter(i => i.Type === currentTab);
    const cats = [...new Set(items.map(i => i.Category))];
    categoryTabs.innerHTML = "";
    cats.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        currentCategory = cat;
        renderMenu();
        highlightCategory(cat);
      });
      categoryTabs.appendChild(btn);
    });
  }

  function highlightCategory(cat) {
    categoryTabs.querySelectorAll("button").forEach(b =>
      b.classList.toggle("active", b.textContent === cat)
    );
  }

  // Render menu items
  function renderMenu() {
    const items = menuData.filter(
      i =>
        i.Type === currentTab &&
        (!currentCategory || i.Category === currentCategory)
    );
    menuContainer.innerHTML = "";
    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "menu-item";

      div.innerHTML = `
        <div class="item-info">
          <div class="item-name">${item.Name}</div>
          <div class="item-desc">${item.Description}</div>
        </div>
        <div class="item-price">₹${parseFloat(item.Price).toFixed(2)}</div>
      `;

      const addBtn = document.createElement("button");
      addBtn.className = "add-btn";
      addBtn.textContent = "Add";
      addBtn.addEventListener("click", () => addToOrder(item, addBtn));

      div.appendChild(addBtn);
      menuContainer.appendChild(div);
    });
  }

  // Add to order
  function addToOrder(item, btn) {
    if (!order[item.Name]) order[item.Name] = { ...item, qty: 0 };
    order[item.Name].qty++;
    updateOrder();
    btn.textContent = `${order[item.Name].qty}`;
  }

  // Update order summary
  function updateOrder() {
    orderList.innerHTML = "";
    let total = 0;
    for (let key in order) {
      const item = order[key];
      if (item.qty > 0) {
        const li = document.createElement("li");
        li.textContent = `${item.Name} x ${item.qty}`;
        orderList.appendChild(li);
        total += item.qty * parseFloat(item.Price);
      }
    }
    orderTotal.textContent = total.toFixed(2);
  }

  // Tab switching
  menuTabs.forEach(tab =>
    tab.addEventListener("click", () => {
      menuTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentTab = tab.textContent;
      currentCategory = null;
      renderCategories();
      renderMenu();
    })
  );

  // Confirm order
  confirmOrderBtn.addEventListener("click", () => {
    const guest = document.getElementById("guestName").value;
    const room = document.getElementById("roomNo").value;
    const wa = document.getElementById("Whatsappnum").value;
    if (!guest || !room || !wa) {
      alert("Please fill guest details.");
      return;
    }
    let msg = `Order from ${guest}, Room ${room}:\n`;
    for (let key in order) {
      const item = order[key];
      if (item.qty > 0) {
        msg += `${item.Name} x ${item.qty} = ₹${(
          item.qty * parseFloat(item.Price)
        ).toFixed(2)}\n`;
      }
    }
    msg += `Total: ₹${orderTotal.textContent}`;
    const phone = "919985908131";
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  });
});
