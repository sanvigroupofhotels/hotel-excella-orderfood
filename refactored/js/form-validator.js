const FormValidator = {
  fields: {
    guestName: {
      el: null,
      errorEl: null,
      rules: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      validate(value) {
        if (!value.trim()) return 'Guest name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s'-]*$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return '';
      },
    },
    roomNumber: {
      el: null,
      errorEl: null,
      rules: {
        required: true,
        validate: Utils.isValidRoomNumber,
      },
      validate(value) {
        if (!value) return 'Room number is required';
        if (!Utils.isValidRoomNumber(value)) {
          return 'Please enter a valid room number (101-106, 201-206, 301-306, 401-406)';
        }
        return '';
      },
    },
    guestWhatsApp: {
      el: null,
      errorEl: null,
      rules: {
        required: true,
        validate: Utils.isValidPhoneNumber,
      },
      validate(value) {
        if (!value) return 'WhatsApp number is required';
        if (!Utils.isValidPhoneNumber(value)) {
          return 'Please enter a valid 10-digit mobile number (6-9)';
        }
        return '';
      },
    },
  },

  init() {
    Object.keys(this.fields).forEach((fieldName) => {
      const field = this.fields[fieldName];
      field.el = document.getElementById(fieldName);
      field.errorEl = document.getElementById(`${fieldName}Error`);

      if (field.el) {
        field.el.addEventListener('blur', () => this.validateField(fieldName));
        field.el.addEventListener('input', () => {
          if (field.errorEl && field.errorEl.textContent) {
            this.validateField(fieldName);
          }
        });
      }
    });
  },

  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field.el) return true;

    const value = field.el.value;
    const error = field.validate(value);

    if (field.errorEl) {
      field.errorEl.textContent = error;
      field.el.setAttribute('aria-invalid', error ? 'true' : 'false');
    }

    return !error;
  },

  validateAll() {
    let isValid = true;
    Object.keys(this.fields).forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  },

  getValues() {
    return {
      guestName: Utils.sanitize(this.fields.guestName.el?.value || ''),
      roomNumber: Utils.sanitize(this.fields.roomNumber.el?.value || ''),
      guestWhatsApp: Utils.sanitize(this.fields.guestWhatsApp.el?.value || '').replace(/\D/g, ''),
    };
  },

  setValues(data) {
    if (data.guestName) this.fields.guestName.el.value = data.guestName;
    if (data.roomNumber) this.fields.roomNumber.el.value = data.roomNumber;
    if (data.guestWhatsApp) this.fields.guestWhatsApp.el.value = data.guestWhatsApp;
  },

  clear() {
    Object.keys(this.fields).forEach((fieldName) => {
      const field = this.fields[fieldName];
      if (field.el) {
        field.el.value = '';
        field.el.removeAttribute('aria-invalid');
      }
      if (field.errorEl) {
        field.errorEl.textContent = '';
      }
    });
  },

  save() {
    try {
      const values = this.getValues();
      localStorage.setItem(
        CONSTANTS.STORAGE_KEYS.GUEST_INFO,
        JSON.stringify(values)
      );
    } catch (e) {
      console.warn('Failed to save guest info');
    }
  },

  load() {
    try {
      const saved = localStorage.getItem(CONSTANTS.STORAGE_KEYS.GUEST_INFO);
      if (saved) {
        const values = JSON.parse(saved);
        this.setValues(values);
      }
    } catch (e) {
      console.warn('Failed to load guest info');
    }
  },
};
