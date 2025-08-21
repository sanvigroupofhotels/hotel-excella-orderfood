document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menuContainer");
  const tabs = document.querySelectorAll(".tab-btn");
  let currentType = "Veg";
  let menuData = {};

  // Fetch & parse CSV
  fetch("menu.csv")
    .then(res => res.text())
    .then(text => {
      menuData = parseCSV(text);
      renderMenu(currentType);
    });

  // Parse CSV safely (handles quotes with commas)
  function parseCSV(text) {
    const rows = text.trim().split("\n").map(r => {
      const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
      return [...r.matchAll(regex)].map(m => m[0].replace(/(^"|"$)/g, ""));
    });
    const headers = rows[0];
    const data = {};
    rows.slice(1).forEach(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      if (!data[obj.Type]) data[obj.Type] = {};
      if (!data[obj.Type][obj.Category]) data[obj.Type][obj.Category] = [];
      data[obj.Type][obj.Category].push(obj);
    });
    return data;
  }

  // Render Menu
  function renderMenu(type) {
    currentType = type;
    tabs.forEach(t => t.classList.remove("active"));
    document.getElementById("tab" + type.replace(" ", "")).classList.add("active");

    if (!menuData[type]) {
      menuContainer.innerHTML = "<p>No items available.</p>";
      return;
    }

    const categories = Object.keys(menuData[type]);
    let html = `<div class="category-tabs">`;
    categories.forEach((cat, idx) => {
      html += `<button class="${idx === 0 ? "active" : ""}" data-cat="${cat}">${cat}</button>`;
    });
    html += `</div><div id="itemsContainer"></div>`;
    menuContainer.innerHTML = html;

    const catBtns = menuContainer.querySelectorAll(".category-tabs button");
    catBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        catBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderItems(type, btn.getAttribute("data-cat"));
      });
    });

    renderItems(type, categories[0]); // default first category
  }

  function renderItems(type, category) {
    const items = menuData[type][category];
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";
    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "menu-item";
      div.innerHTML = `
        <div class="item-info">
          <h4>${item.Name}</h4>
          <p>${item.Description}</p>
        </div>
        <div class="item-price">₹${parseFloat(item.Price).toFixed(2)}</div>
        <div class="add-btn"><button>Add</button></div>
      `;
      const addBtn = div.querySelector(".add-btn button");
      addBtn.addEventListener("click", () => toggleQty(div, item));
      container.appendChild(div);
    });
  }

  function toggleQty(div, item) {
    const addDiv = div.querySelector(".add-btn");
    addDiv.className = "qty-control";
    addDiv.innerHTML = `
      <button>-</button>
      <span>1</span>
      <button>+</button>
    `;
    const minus = addDiv.querySelector("button:first-child");
    const plus = addDiv.querySelector("button:last-child");
    const qtySpan = addDiv.querySelector("span");

    let qty = 1;
    minus.addEventListener("click", () => {
      qty--;
      if (qty <= 0) {
        addDiv.className = "add-btn";
        addDiv.innerHTML = `<button>Add</button>`;
        addDiv.querySelector("button").addEventListener("click", () => toggleQty(div, item));
      } else {
        qtySpan.textContent = qty;
      }
    });
    plus.addEventListener("click", () => {
      qty++;
      qtySpan.textContent = qty;
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => renderMenu(tab.textContent.trim()));
  });
});
