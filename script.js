document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menuContainer");
  const orderList = document.getElementById("orderList");
  const orderTotal = document.getElementById("orderTotal");
  let order = {};
  let menuRows = [];

  // Load menu.csv
  fetch("menu.csv")
    .then(res => res.text())
    .then(data => {
      menuRows = Papa.parse(data, { header: true, skipEmptyLines: true }).data;
      renderMenu(menuRows, "Veg"); // default tab
      setupTabs(menuRows);
    });

  // Render menu items
  function renderMenu(rows, type, subCategory = null) {
    menuContainer.innerHTML = "";

    // Filter rows
    const filtered = rows.filter(r => r.Type === type && (!subCategory || r.Category === subCategory));

    // Build sub-tabs
    const categories = [...new Set(rows.filter(r => r.Type === type).map(r => r.Category))];
    const subTabsDiv = document.createElement("div");
    subTabsDiv.id = "subTabs";

    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "sub-tab" + (i === 0 && !subCategory ? " active" : (subCategory === cat ? " active" : ""));
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".sub-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(rows, type, cat);
      });
      subTabsDiv.appendChild(btn);
    });

    menuContainer.appendChild(subTabsDiv);

    // Build each menu item
    filtered.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "menu-item";

      // Food image if available
      let imageHTML = "";
      if (item.ImageURL && item.ImageURL.trim() !== "") {
        imageHTML = `<img src="images/${item.ImageURL}" alt="${item.Name}" class="menu-img">`;
      }

      const left = document.createElement("div");
      left.className = "item-info";
      left.innerHTML = `<strong>${item.Name}</strong><p>${item.Description}</p>`;

      const right = document.createElement("div");
      right.className = "item-actions";
      right.innerHTML = `<span class="price">₹${parseFloat(item.Price).toFixed(2)}</span>`;

      const controls = document.createElement("div");
      controls.className = "item-controls";

      if (order[item.Name]) {
        buildQtyControls(item.Name, controls);
      } else {
        const addBtn = document.createElement("button");
        addBtn.className = "add-btn";
        addBtn.textContent = "Add";
        addBtn.onclick = () => {
          order[item.Name] = { qty: 1, price: parseFloat(item.Price) };
          updateOrder();
          renderMenu(rows, type, subCategory);
        };
        controls.appendChild(addBtn);
      }

      right.appendChild(controls);

      if (imageHTML) {
        itemDiv.innerHTML = imageHTML;
        itemDiv.append(left, right);
      } else {
        itemDiv.append(left, right);
      }

      menuContainer.appendChild(itemDiv);
    });
  }

  // Build quantity controls
  function buildQtyControls(name, container) {
    const minus = document.createElement("button");
    minus.className = "qty-btn";
    minus.textContent = "-";
    minus.onclick = () => {
      order[name].qty--;
      if (order[name].qty <= 0) delete order[name];
      updateOrder();
      rerenderMenu();
    };

    const qty = document.createElement("span");
    qty.className = "qty-display";
    qty.textContent = order[name].qty;

    const plus = document.createElement("button");
    plus.className = "qty-btn";
    plus.textContent = "+";
    plus.onclick = () => {
      order[name].qty++;
      updateOrder();
      rerenderMenu();
    };

    container.append(minus, qty, plus);
  }

  // Update Order Summary
  function updateOrder() {
    orderList.innerHTML = "";
    let total = 0;

    Object.entries(order).forEach(([item, data]) => {
      const li = document.createElement("li");
      li.textContent = `${item} x ${data.qty} = ₹${(data.qty * data.price).toFixed(2)}`;
      orderList.appendChild(li);
      total += data.qty * data.price;
    });

    orderTotal.textContent = total.toFixed(2);
  }

  // Setup top tabs
  function setupTabs(rows) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        let type = btn.id === "tabVeg" ? "Veg" :
                   btn.id === "tabNonVeg" ? "NonVeg" : "General";

        renderMenu(rows, type);
      });
    });
  }

  // Re-render menu preserving tab & sub-tab state
  function rerenderMenu() {
    const activeTab = document.querySelector(".tab-btn.active").id;
    let type = activeTab === "tabVeg" ? "Veg" :
               activeTab === "tabNonVeg" ? "NonVeg" : "General";
    const activeSub = document.querySelector(".sub-tab.active")?.textContent;
    renderMenu(menuRows, type, activeSub);
  }
});
