const Utils = {
  sanitize(str) {
    if (!str) return '';
    let clean = str.replace(/[<>&"']/g, (char) => {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return map[char];
    });
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean;
  },

  isValidPhoneNumber(number) {
    return CONSTANTS.PHONE_REGEX.test(number.replace(/\D/g, ''));
  },

  isValidRoomNumber(room) {
    const roomNum = parseInt(room);
    return CONSTANTS.VALID_ROOM_RANGES.some(
      (range) => roomNum >= range.floor + 1 && roomNum <= range.floor + range.rooms
    );
  },

  encodeForWhatsApp(text) {
    return encodeURIComponent(text);
  },

  decodeFromWhatsApp(text) {
    return decodeURIComponent(text);
  },

  formatCurrency(amount) {
    return parseFloat(amount).toFixed(2);
  },

  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  lazyLoadImage(img) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(img);
    } else {
      img.src = img.dataset.src;
    }
  },

  showNotification(message, type = 'success', duration = CONSTANTS.NOTIFICATION_DURATION) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
      notification.classList.remove('show');
    }, duration);
  },

  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

const Debounced = {
  updateMenuQty: Utils.debounce(() => {}, CONSTANTS.DEBOUNCE_DELAY),
};
