const UIManager = {
  els: {
    menuContainer: null,
    orderList: null,
    subtotal: null,
    gst: null,
    orderTotal: null,
    cartButton: null,
    cartBadge: null,
    tabVeg: null,
    tabNonVeg: null,
    tabGeneral: null,
    confirmOrder: null,
    clearOrder: null,
  },

  init() {
    this.els.menuContainer = document.getElementById('menuContainer');
    this.els.orderList = document.getElementById('orderList');
    this.els.subtotal = document.getElementById('subtotal');
    this.els.gst = document.getElementById('gst');
    this.els.orderTotal = document.getElementById('orderTotal');
    this.els.cartButton = document.getElementById('cartButton');
    this.els.cartBadge = this.els.cartButton.querySelector('.cart-badge');
    this.els.tabVeg = document.getElementById('tabVeg');
    this.els.tabNonVeg = document.getElementById('tabNonVeg');
    this.els.tabGeneral = document.getElementById('tabGeneral');
    this.els.confirmOrder = document.getElementById('confirmOrder');
    this.els.clearOrder = document.getElementById('clearOrder');
  },

  renderMenu() {
    const tabs = MenuManager.getCategoryTabs(MenuManager.currentTab);
    const firstTab = tabs[0];

    const categoryTabsHtml = tabs
      .map((tab) => {
        return `<button data-category="${this._escapeHtml(tab.name)}" class="category-btn ${
          tab.name === MenuManager.currentCategory ? 'active' : ''
        }">${this._escapeHtml(tab.name)}</button>`;
      })
      .join('');

    this.els.menuContainer.innerHTML = `
      <div class="category-tabs">${categoryTabsHtml}</div>
      <div id="categoryContent"></div>
    `;

    if (firstTab) {
      this.showCategory(firstTab.name);
    }

    this._attachCategoryTabListeners();
  },

  showCategory(category) {
    MenuManager.setCurrentCategory(category);
    const items = MenuManager.getItems(MenuManager.currentTab, category);
    const container = document.getElementById('categoryContent');

    if (!items || items.length === 0) {
      container.innerHTML = '<p class="empty-message">No items in this category</p>';
      return;
    }

    const itemsHtml = items
      .map((item) => this._renderMenuItem(item))
      .join('');

    container.innerHTML = itemsHtml;
    this._attachMenuItemListeners(items);
    this._updateCategoryTabActive(category);
  },

  _renderMenuItem(item) {
    const name = this._escapeHtml(item.Name);
    const description = this._escapeHtml(item.Description);
    const price = parseFloat(item.Price).toFixed(2);
    const imageFile = item.ImageURL?.trim();
    const imageTag = imageFile
      ? `<img src="../images/${this._escapeHtml(imageFile)}" alt="${name}" class="menu-image" loading="lazy">`
      : '';

    const orderItem = OrderManager.getItem(item.Name);
    const qty = orderItem?.qty || 0;

    const controlsHtml =
      qty > 0
        ? `
      <div class="quantity-selector">
        <button class="dec-btn" data-name="${this._escapeHtml(item.Name)}" data-action="dec" aria-label="Decrease quantity">−</button>
        <span class="qty-val">${qty}</span>
        <button class="inc-btn" data-name="${this._escapeHtml(item.Name)}" data-action="inc" aria-label="Increase quantity">+</button>
      </div>
    `
        : `<button class="add-btn" data-name="${this._escapeHtml(item.Name)}" data-price="${price}" data-action="add" aria-label="Add to cart">Add</button>`;

    return `
      <div class="menu-item">
        ${imageTag}
        <div class="menu-item-details">
          <div class="item-name">${name}</div>
          <div class="item-desc">${description}</div>
        </div>
        <div class="menu-item-controls">
          <div class="item-price" aria-label="Price in rupees">₹${price}</div>
          ${controlsHtml}
        </div>
      </div>
    `;
  },

  _attachMenuItemListeners(items) {
    const container = document.getElementById('categoryContent');

    container.querySelectorAll('.add-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        OrderManager.addItem(name, price);
        this.updateOrderSummary();
        this.showCategory(MenuManager.currentCategory);
        Utils.showNotification(`${name} added to cart`, 'success');
      });
    });

    container.querySelectorAll('.dec-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        OrderManager.decrementQty(name);
        this.updateOrderSummary();
        this.showCategory(MenuManager.currentCategory);
      });
    });

    container.querySelectorAll('.inc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        OrderManager.incrementQty(name);
        this.updateOrderSummary();
        this.showCategory(MenuManager.currentCategory);
      });
    });
  },

  _attachCategoryTabListeners() {
    document.querySelectorAll('.category-tabs button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        this.showCategory(category);
      });
    });
  },

  _updateCategoryTabActive(category) {
    document.querySelectorAll('.category-tabs button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
  },

  updateOrderSummary() {
    const items = OrderManager.getAll();
    const subtotal = OrderManager.getSubtotal();
    const gst = OrderManager.getGST();
    const total = OrderManager.getTotal();

    if (OrderManager.isEmpty()) {
      this.els.orderList.innerHTML = '<li class="empty-message">No items selected</li>';
    } else {
      this.els.orderList.innerHTML = Object.entries(items)
        .map(([name, { qty, price }]) => {
          const lineTotal = qty * price;
          return `
        <li>
          <span class="order-item-name">${this._escapeHtml(name)}</span>
          <div class="order-item-controls">
            <button class="dec-btn" data-name="${this._escapeHtml(name)}" data-action="order-dec" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${qty}</span>
            <button class="inc-btn" data-name="${this._escapeHtml(name)}" data-action="order-inc" aria-label="Increase quantity">+</button>
          </div>
          <span class="order-item-price">₹${lineTotal.toFixed(2)}</span>
        </li>
      `;
        })
        .join('');

      this._attachOrderListeners();
    }

    this.els.subtotal.textContent = Utils.formatCurrency(subtotal);
    this.els.gst.textContent = Utils.formatCurrency(gst);
    this.els.orderTotal.textContent = Utils.formatCurrency(total);

    this.updateCartButton();
    this.els.confirmOrder.disabled = OrderManager.isEmpty();

    OrderManager.save();
  },

  _attachOrderListeners() {
    this.els.orderList.querySelectorAll('.dec-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        OrderManager.decrementQty(name);
        this.updateOrderSummary();
      });
    });

    this.els.orderList.querySelectorAll('.inc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        OrderManager.incrementQty(name);
        this.updateOrderSummary();
      });
    });
  },

  updateCartButton() {
    const count = OrderManager.getTotalCount();
    if (count > 0) {
      this.els.cartButton.classList.add('visible');
      this.els.cartBadge.textContent = count > 99 ? '99+' : count;
    } else {
      this.els.cartButton.classList.remove('visible');
    }
  },

  switchTab(tabName) {
    [this.els.tabVeg, this.els.tabNonVeg, this.els.tabGeneral].forEach(
      (btn) => btn.classList.remove('active')
    );

    const tabMap = {
      veg: this.els.tabVeg,
      nonveg: this.els.tabNonVeg,
      general: this.els.tabGeneral,
    };

    tabMap[tabName].classList.add('active');
    MenuManager.setCurrentTab(tabName);
    this.renderMenu();
  },

  _escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return String(text).replace(/[&<>"']/g, (s) => map[s]);
  },

  scrollToOrderSummary() {
    const section = document.getElementById('orderSummarySection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  disableConfirmButton() {
    this.els.confirmOrder.disabled = true;
    this.els.confirmOrder.textContent = 'Processing...';
  },

  enableConfirmButton() {
    this.els.confirmOrder.disabled = OrderManager.isEmpty();
    this.els.confirmOrder.textContent = 'Confirm Order';
  },
};
