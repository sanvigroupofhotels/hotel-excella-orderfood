const CONSTANTS = {
  VALID_ROOM_RANGES: [
    { floor: 100, rooms: 6 },
    { floor: 200, rooms: 6 },
    { floor: 300, rooms: 6 },
    { floor: 400, rooms: 6 },
  ],
  PHONE_REGEX: /^[6-9]\d{9}$/,
  GST_RATE: 0.05,
  DEBOUNCE_DELAY: 300,
  NOTIFICATION_DURATION: 3000,
  WHATSAPP_NUMBER: '919985908131',
  CSV_URL: '../menu.csv',
  STORAGE_KEYS: {
    ORDER: 'hotel_excella_order',
    GUEST_INFO: 'hotel_excella_guest_info',
  },
  MENU_TYPES: {
    VEG: 'veg',
    NON_VEG: 'nonveg',
    GENERAL: 'general',
  },
};
