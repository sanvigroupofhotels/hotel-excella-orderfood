const OrderManager = {
  items: {},

  addItem(name, price) {
    price = parseFloat(price);
    if (this.items[name]) {
      this.items[name].qty++;
    } else {
      this.items[name] = { qty: 1, price };
    }
  },

  removeItem(name) {
    delete this.items[name];
  },

  updateQty(name, qty) {
    qty = parseInt(qty) || 0;
    if (qty <= 0) {
      this.removeItem(name);
    } else if (this.items[name]) {
      this.items[name].qty = qty;
    }
  },

  incrementQty(name) {
    if (this.items[name]) {
      this.items[name].qty++;
    }
  },

  decrementQty(name) {
    if (this.items[name]) {
      this.items[name].qty--;
      if (this.items[name].qty <= 0) {
        this.removeItem(name);
      }
    }
  },

  getItem(name) {
    return this.items[name] || null;
  },

  getAll() {
    return this.items;
  },

  getTotalCount() {
    return Object.values(this.items).reduce((sum, item) => sum + item.qty, 0);
  },

  getSubtotal() {
    return Object.values(this.items).reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
  },

  getGST() {
    return this.getSubtotal() * CONSTANTS.GST_RATE;
  },

  getTotal() {
    return this.getSubtotal() + this.getGST();
  },

  isEmpty() {
    return Object.keys(this.items).length === 0;
  },

  clear() {
    this.items = {};
  },

  toJSON() {
    const items = [];
    Object.entries(this.items).forEach(([name, { qty, price }]) => {
      items.push(`${name} x ${qty}`);
    });
    return items.join('\n');
  },

  save() {
    try {
      localStorage.setItem(
        CONSTANTS.STORAGE_KEYS.ORDER,
        JSON.stringify(this.items)
      );
    } catch (e) {
      console.warn('Failed to save order to localStorage');
    }
  },

  load() {
    try {
      const saved = localStorage.getItem(CONSTANTS.STORAGE_KEYS.ORDER);
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load order from localStorage');
    }
  },
};
