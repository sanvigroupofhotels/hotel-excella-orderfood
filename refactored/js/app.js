class FoodOrderingApp {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      UIManager.init();
      FormValidator.init();

      console.log('Loading menu data...');
      const menuLoaded = await MenuManager.loadMenuData();
      if (!menuLoaded) {
        throw new Error('Failed to load menu');
      }

      console.log('Initializing UI...');
      MenuManager.setCurrentTab(CONSTANTS.MENU_TYPES.VEG);
      UIManager.renderMenu();

      OrderManager.load();
      FormValidator.load();
      UIManager.updateOrderSummary();

      this._attachEventListeners();
      this.initialized = true;

      console.log('App initialized successfully');
    } catch (error) {
      console.error('App initialization failed:', error);
      Utils.showNotification('Failed to initialize app. Please refresh the page.', 'error', 5000);
    }
  }

  _attachEventListeners() {
    UIManager.els.tabVeg.addEventListener('click', () => UIManager.switchTab('veg'));
    UIManager.els.tabNonVeg.addEventListener('click', () => UIManager.switchTab('nonveg'));
    UIManager.els.tabGeneral.addEventListener('click', () => UIManager.switchTab('general'));

    UIManager.els.cartButton.addEventListener('click', () => UIManager.scrollToOrderSummary());

    document.getElementById('guestForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleOrderSubmission();
    });

    UIManager.els.clearOrder.addEventListener('click', () => this._handleClearCart());

    document.addEventListener('beforeunload', () => {
      OrderManager.save();
      FormValidator.save();
    });
  }

  _handleOrderSubmission() {
    if (!FormValidator.validateAll()) {
      Utils.showNotification('Please fix the errors above', 'error');
      return;
    }

    if (OrderManager.isEmpty()) {
      Utils.showNotification('Please add at least one item to your order', 'warning');
      return;
    }

    const { guestName, roomNumber, guestWhatsApp } = FormValidator.getValues();
    const subtotal = OrderManager.getSubtotal();
    const gst = OrderManager.getGST();
    const total = OrderManager.getTotal();

    const orderText = OrderManager.toJSON();
    const message = `Guest: ${guestName}\nRoom: ${roomNumber}\nWhatsApp: ${guestWhatsApp}\n\nOrder:\n${orderText}\n\nSubtotal: ₹${subtotal.toFixed(
      2
    )}\nGST (5%): ₹${gst.toFixed(2)}\nTotal: ₹${total.toFixed(2)}`;

    const encodedMessage = Utils.encodeForWhatsApp(message);
    const whatsappUrl = `https://wa.me/${CONSTANTS.WHATSAPP_NUMBER}?text=${encodedMessage}`;

    UIManager.disableConfirmButton();

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      Utils.showNotification('Order sent to WhatsApp!', 'success');

      setTimeout(() => {
        OrderManager.clear();
        UIManager.updateOrderSummary();
        UIManager.showCategory(MenuManager.currentCategory);
        UIManager.enableConfirmButton();

        setTimeout(() => {
          UIManager.els.confirmOrder.focus();
        }, 100);
      }, 1000);
    }, 300);

    FormValidator.save();
  }

  _handleClearCart() {
    if (OrderManager.isEmpty()) {
      Utils.showNotification('Cart is already empty', 'warning');
      return;
    }

    const confirmed = confirm('Are you sure you want to clear your cart?');
    if (!confirmed) return;

    OrderManager.clear();
    UIManager.updateOrderSummary();
    UIManager.showCategory(MenuManager.currentCategory);
    Utils.showNotification('Cart cleared', 'success');
  }
}

const app = new FoodOrderingApp();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
