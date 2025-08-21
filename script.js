    document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menuContainer");
  const orderList = document.getElementById("orderList");
  const orderTotal = document.getElementById("orderTotal");
  let order = {};

  // Load menu.csv
  fetch("menu.csv")
    .then(res => res.text())
    .then(data => {
      const rows = Papa.parse(data, { header: true }).data;
      renderMenu(rows, "Veg");
      setupTabs(rows);
    });

  // Render menu
  function renderMenu(rows, type, subCategory = null) {
    menuContainer.innerHTML = "";

    const filtered = rows.filter(r => r.Type === type && (!subCategory || r.Category === subCategory));

    // Sub Tabs
    const categories = [...new Set(rows.filter(r => r.Type === type).map(r => r.Category))];
    const subTabsDiv = document.createElement("div");
    subTabsDiv.id = "subTabs";

    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "sub-tab" + (i === 0 && !subCategory ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".sub-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(rows, type, cat);
      });
      subTabsDiv.appendChild(btn);
    });

    menuContainer.appendChild(subTabsDiv);

    filtered.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "menu-item";

      const left = document.createElement("div");
      left.className = "item-info";
      left.innerHTML = `<strong>${item.Name}</strong><br><small>${item.Description}</small>`;

      const right = document.createElement("div");
      right.className = "item-actions";
      right.innerHTML = `<span class="price">₹${parseFloat(item.Price).toFixed(2)}</span>`;

      const controls = document.createElement("div");
      controls.className = "item-controls";

      if (order[item.Name]) {
        buildQtyControls(item.Name, controls, item.Price);
      } else {
        const addBtn = document.createElement("button");
        addBtn.className = "add-btn";
        addBtn.textContent = "Add";
        addBtn.onclick = () => {
          order[item.Name] = 1;
          updateOrder(item.Name, item.Price);
          renderMenu(rows, type, subCategory);
        };
        controls.appendChild(addBtn);
      }

      right.appendChild(controls);
      itemDiv.append(left, right);
      menuContainer.appendChild(itemDiv);
    });
  }

  // Build qty controls
  function buildQtyControls(name, container, price) {
    const minus = document.createElement("button");
    minus.className = "qty-btn";
    minus.textContent = "-";
    minus.onclick = () => {
      order[name]--;
      if (order[name] <= 0) delete order[name];
      updateOrder(name, price);
      renderMenuRows();
    };

    const qty = document.createElement("span");
    qty.className = "qty-display";
    qty.textContent = order[name];

    const plus = document.createElement("button");
    plus.className = "qty-btn";
    plus.textContent = "+";
    plus.onclick = () => {
      order[name]++;
      updateOrder(name, price);
      renderMenuRows();
    };

    container.append(minus, qty, plus);
  }

  // Update order summary
  function updateOrder(name, price) {
    orderList.innerHTML = "";
    let total = 0;
    Object.entries(order).forEach(([item, qty]) => {
      const li = document.createElement("li");
      li.textContent = `${item} x ${qty}`;
      orderList.appendChild(li);
      total += qty * parseFloat(price);
    });
    orderTotal.textContent = total.toFixed(2);
  }

  // Tabs
  function setupTabs(rows) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(rows, btn.textContent.trim());
      });
    });
  }

  // Fix re-render qty state
  function renderMenuRows() {
    const activeTab = document.querySelector(".tab-btn.active").textContent.trim();
    const activeSub = document.querySelector(".sub-tab.active")?.textContent;
    fetch("menu.csv")
      .then(res => res.text())
      .then(data => {
        const rows = Papa.parse(data, { header: true }).data;
        renderMenu(rows, activeTab, activeSub);
      });
  }
});
