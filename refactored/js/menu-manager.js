const MenuManager = {
  data: { veg: {}, nonveg: {}, general: {} },
  currentTab: 'veg',
  currentCategory: null,

  async loadMenuData() {
    try {
      const rows = await CSVParser.loadCSV(CONSTANTS.CSV_URL);
      this._organizeData(rows);
      return true;
    } catch (error) {
      console.error('Failed to load menu:', error);
      Utils.showNotification('Failed to load menu. Please refresh the page.', 'error');
      return false;
    }
  },

  _organizeData(rows) {
    rows.forEach((row) => {
      const type = (row.Type || '').toLowerCase();
      const category = row.Category || 'Misc';

      if (!this.data[type]) this.data[type] = {};
      if (!this.data[type][category]) this.data[type][category] = [];

      this.data[type][category].push(row);
    });
  },

  getCategories(tabType) {
    return Object.keys(this.data[tabType] || {}).sort();
  },

  getItems(tabType, category) {
    return this.data[tabType]?.[category] || [];
  },

  getCategoryTabs(tabType) {
    const categories = this.getCategories(tabType);
    return categories.map((cat) => ({
      name: cat,
      count: this.getItems(tabType, cat).length,
    }));
  },

  setCurrentTab(tab) {
    this.currentTab = tab;
    const categories = this.getCategories(tab);
    this.currentCategory = categories[0] || null;
  },

  setCurrentCategory(category) {
    this.currentCategory = category;
  },
};
