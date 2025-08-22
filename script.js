
    <script>
      (() => {
        const menuContainer = document.getElementById('menuContainer');
        const orderItemsContainer = document.getElementById('orderItems');
        const totalPriceEl = document.getElementById('totalPrice');
        const confirmBtn = document.getElementById('confirmBtn');
      
        const guestNameInput = document.getElementById('guestName');
        const roomNumberInput = document.getElementById('roomNumber');
        const guestWhatsAppInput = document.getElementById('guestWhatsApp');
      
        const langSelect = document.getElementById('languageSelect');
        const textElements = {
          en: {
            guestInfoTitle: 'Guest Information',
            guestNameLabel: 'Guest Name',
            roomNumberLabel: 'Room Number',
            guestWhatsAppLabel: 'WhatsApp Number',
            menuTitle: 'Menu',
            orderSummaryTitle: 'Order Summary',
            selectedItemsTitle: 'Selected Items',
            noItemsSelected: 'No items selected',
            confirmOrder: 'Confirm Order',
            confirmOrderAria: 'Confirm Order and Send via WhatsApp',
            loadingMenu: 'Loading menu…',
            menuEmpty: 'Menu is empty or failed to load.',
            errorLoadingMenu: 'Error loading menu:',
            helpBtnLabel: 'Help / FAQ',
            faqTitle: 'Help & FAQ',
            faqContent: `
              <p><strong>How to order?</strong> Fill your guest details and select quantities for desired menu items. Then click <em>Confirm Order</em> to send your order to reception via WhatsApp.</p>
              <p><strong>Is the menu vegetarian or non-vegetarian?</strong> Use the Veg and Non Veg tabs to view corresponding items.</p>
      	<p><strong>How long does delivery take?</strong> The estimated delivery is minimum 30 mins and maximum upto 45 mins - we shall try to get you the opted food at the earliest that we can.</p>
      	<p><strong>Can I modify my order?</strong> Yes, update quantities anytime before confirming your order. Once the order is confirmed by you, its considered billed.</p>
      	<p><strong>Need further help?</strong> Contact reception @ <span style="font-weight: bold; background-color: orange;">7702483811</span>.</p>
      	<p><strong>Have Complaints or Escaltions?</strong> Contact Management @ <span style="font-weight: bold; background-color: orange;">9985908131</span>.</p>
                 `
          },
      hi: {
            guestInfoTitle: 'अतिथि जानकारी',
            guestNameLabel: 'अतिथि का नाम',
            roomNumberLabel: 'कमरे का नंबर',
            guestWhatsAppLabel: 'व्हाट्सएप नंबर',
            menuTitle: 'मेन्यू',
            orderSummaryTitle: 'ऑर्डर सारांश',
            selectedItemsTitle: 'चयनित आइटम',
            noItemsSelected: 'कोई आइटम चयनित नहीं है',
            confirmOrder: 'ऑर्डर पुष्टि करें',
            confirmOrderAria: 'ऑर्डर की पुष्टि करें और व्हाट्सएप के माध्यम से भेजें',
            loadingMenu: 'मेन्यू लोड हो रहा है…',
            menuEmpty: 'मेन्यू खाली है या लोड नहीं हो सका।',
            errorLoadingMenu: 'मेन्यू लोड करने में त्रुटि:',
            helpBtnLabel: 'सहायता / FAQ',
            faqTitle: 'सहायता और सामान्य प्रश्न',
            faqContent: `
    <p><strong>ऑर्डर कैसे करें?</strong> अपने अतिथि विवरण भरें और वांछित मेनू आइटम्स की मात्रा चुनें। फिर <em>Confirm Order</em> पर क्लिक करें ताकि आपका ऑर्डर WhatsApp के माध्यम से रिसेप्शन को भेजा जा सके।</p>
    <p><strong>क्या मेनू शाकाहारी है या मांसाहारी?</strong> संबंधित आइटम्स देखने के लिए Veg और Non Veg टैब्स का उपयोग करें।</p>
    <p><strong>डिलीवरी में कितना समय लगता है?</strong> अनुमानित डिलीवरी समय न्यूनतम 30 मिनट और अधिकतम 45 मिनट है – हम यथासंभव जल्दी भोजन पहुंचाने की कोशिश करेंगे।</p>
    <p><strong>क्या मैं अपना ऑर्डर संशोधित कर सकता हूँ?</strong> हाँ, ऑर्डर की पुष्टि से पहले कभी भी मात्रा अपडेट कर सकते हैं। एक बार पुष्टि हो जाने पर, ऑर्डर बिल किया हुआ माना जाएगा।</p>
    <p><strong>अधिक सहायता चाहिए?</strong> रिसेप्शन से संपर्क करें @ <span style="font-weight: bold; background-color: orange;">7702483811</span>.</p>
    <p><strong>शिकायतें या शिकायतें हैं?</strong> प्रबंधन से संपर्क करें @ <span style="font-weight: bold; background-color: orange;">9985908131</span>.</p>

            `
          },
      te: {
        guestInfoTitle: 'అతిథి సమాచారం',
        guestNameLabel: 'అతిథి పేరు',
        roomNumberLabel: 'గదినంబర్',
        guestWhatsAppLabel: 'వాట్సాప్ నంబర్',
        menuTitle: 'మెనూ',
        orderSummaryTitle: 'ఆర్డర్ సారాంశం',
        selectedItemsTitle: 'ఎంచుకున్న అంశాలు',
        noItemsSelected: 'ఏ అంశాలు ఎంచుకోలేదు',
        confirmOrder: 'ఆర్డర్ నిర్ధారించండి',
        confirmOrderAria: 'ఆర్డర్‌ను నిర్ధారించి వాట్సాప్ ద్వారా పంపండి',
        loadingMenu: 'మెనూ లోడ్ అవుతోంది…',
        menuEmpty: 'మెనూ ఖాళీగా ఉంది లేదా లోడ్ కాలేదు.',
        errorLoadingMenu: 'మెనూ లోడ్ చేయడంలో లోపం:',
        helpBtnLabel: 'సహాయం / FAQ',
        faqTitle: 'సహాయం మరియు తరచుగా అడిగే ప్రశ్నలు',
        faqContent: `
    <p><strong>ఎలా ఆర్డర్ చేయాలి?</strong> మీ అతిథి వివరాలు నమోదు చేసి, కావలసిన మెను ఐటమ్స్‌కి పరిమాణాలు ఎంచుకోండి. తరువాత <em>Confirm Order</em> క్లిక్ చేసి మీ ఆర్డర్‌ను WhatsApp ద్వారా రిసెప్షన్‌కి పంపించండి.</p>
    <p><strong>మెను శాకాహారమా లేక మాంసాహారమా?</strong> Veg మరియు Non Veg ట్యాబ్స్ ఉపయోగించి సంబంధిత ఐటమ్స్‌ను చూడండి.</p>
    <p><strong>డెలివరీకి ఎంత సమయం పడుతుంది?</strong> అంచనా డెలివరీ సమయం కనీసం 30 నిమిషాలు మరియు గరిష్ఠంగా 45 నిమిషాలు – మేము వీలైనంత త్వరగా మీ ఆర్డర్‌ను అందించేందుకు ప్రయత్నిస్తాము.</p>
    <p><strong>నా ఆర్డర్‌ను మార్చగలనా?</strong> అవును, ఆర్డర్‌ను కన్ఫర్మ్ చేయడానికి ముందు ఎప్పుడైనా పరిమాణాలను మార్చవచ్చు. ఒకసారి కన్ఫర్మ్ చేసిన తర్వాత, అది బిల్లుగా పరిగణించబడుతుంది.</p>
    <p><strong>ఇంకా సహాయం కావాలా?</strong> రిసెప్షన్‌ను సంప్రదించండి @ <span style="font-weight: bold; background-color: orange;">7702483811</span>.</p>
    <p><strong>ఫిర్యాదులు లేదా ఎస్కలేషన్లు ఉన్నాయా?</strong> మేనేజ్‌మెంట్‌ను సంప్రదించండి @ <span style="font-weight: bold; background-color: orange;">9985908131</span>.</p>
  
        `
      },
  ta: {
        guestInfoTitle: 'விருந்தினர் தகவல்',
        guestNameLabel: 'விருந்தினர் பெயர்',
        roomNumberLabel: 'அறை எண்',
        guestWhatsAppLabel: 'வாட்ஸ்அப் எண்',
        menuTitle: 'மெனு',
        orderSummaryTitle: 'ஆர்டர் சுருக்கம்',
        selectedItemsTitle: 'தேர்ந்தெடுக்கப்பட்ட பொருட்கள்',
        noItemsSelected: 'எதுவும் தேர்ந்தெடுக்கப்படவில்லை',
        confirmOrder: 'ஆர்டரை உறுதிப்படுத்தவும்',
        confirmOrderAria: 'ஆர்டரை உறுதிப்படுத்தி வாட்ஸ்அப்பில் அனுப்பவும்',
        loadingMenu: 'மெனு ஏற்றப்படுகிறது…',
        menuEmpty: 'மெனு காலியாக உள்ளது அல்லது ஏற்ற முடியவில்லை.',
        errorLoadingMenu: 'மெனு ஏற்றுவதில் பிழை:',
        helpBtnLabel: 'உதவி / கேள்விகள்',
        faqTitle: 'உதவி மற்றும் அடிக்கடி கேட்கப்படும் கேள்விகள்',
        faqContent: `
    <p><strong>எப்படி ஆர்டர் செய்வது?</strong> உங்கள் விருந்தினர் விவரங்களை நிரப்பி, தேவையான உணவுப் பொருட்களின் அளவுகளை தேர்வு செய்யவும். பிறகு <em>Confirm Order</em> கிளிக் செய்து உங்கள் ஆர்டரை WhatsApp மூலம் ரிசெப்ஷனுக்கு அனுப்பவும்.</p>
    <p><strong>மெனு சைவமா அல்லது அசைவமா?</strong> Veg மற்றும் Non Veg தாவல்களை பயன்படுத்தி தொடர்புடைய பொருட்களை பார்வையிடவும்.</p>
    <p><strong>விநியோகம் எவ்வளவு நேரம் எடுக்கும்?</strong> கணிக்கப்பட்ட விநியோக நேரம் குறைந்தது 30 நிமிடங்கள் மற்றும் அதிகபட்சம் 45 நிமிடங்கள் – விரைவாக உணவை வழங்க முயற்சிக்கப்படும்.</p>
    <p><strong>நான் என் ஆர்டரை மாற்ற முடியுமா?</strong> ஆம், ஆர்டர் உறுதிப்படுத்தும் முன் எப்போது வேண்டுமானாலும் அளவுகளை மாற்றலாம். ஒருமுறை உறுதிப்படுத்தப்பட்ட பிறகு, அது பில்லாகக் கருதப்படும்.</p>
    <p><strong>மேலும் உதவி தேவைப்படுகிறதா?</strong> ரிசெப்ஷனை தொடர்பு கொள்ளவும் @ <span style="font-weight: bold; background-color: orange;">7702483811</span>.</p>
    <p><strong>புகார்கள் அல்லது மேலதிக நடவடிக்கைகள் உள்ளதா?</strong> மேலாளரை தொடர்பு கொள்ளவும் @ <span style="font-weight: bold; background-color: orange;">9985908131</span>.</p>
  
`
      }
          
        };
      
        // Elements to translate
        const translateMap = {
          guestInfoTitle: document.getElementById('guestInfoTitle'),
          guestNameLabel: document.getElementById('guestNameLabel'),
          roomNumberLabel: document.getElementById('roomNumberLabel'),
          guestWhatsAppLabel: document.getElementById('guestWhatsAppLabel'),
          menuTitle: document.getElementById('menuTitle'),
          orderSummaryTitle: document.getElementById('orderSummaryTitle'),
          selectedItemsTitle: document.getElementById('selectedItemsTitle'),
          confirmBtn: confirmBtn,
          helpBtn: document.getElementById('helpBtn'),
          faqModalTitle: document.getElementById('faqTitle'),
          faqModalContent: document.getElementById('faqDesc')
        };
      
        function applyLanguage(lang) {
          const txt = textElements[lang];
          if (!txt) return;
          translateMap.guestInfoTitle.textContent = txt.guestInfoTitle;
          translateMap.guestNameLabel.textContent = txt.guestNameLabel + ' *';
          translateMap.roomNumberLabel.textContent = txt.roomNumberLabel + ' *';
          translateMap.guestWhatsAppLabel.textContent = txt.guestWhatsAppLabel + ' *';
          translateMap.menuTitle.textContent = txt.menuTitle;
          translateMap.orderSummaryTitle.textContent = txt.orderSummaryTitle;
          translateMap.selectedItemsTitle.textContent = txt.selectedItemsTitle;
          translateMap.confirmBtn.textContent = txt.confirmOrder;
          translateMap.confirmBtn.setAttribute('aria-label', txt.confirmOrderAria);
          translateMap.helpBtn.textContent = txt.helpBtnLabel;
          translateMap.faqModalTitle.textContent = txt.faqTitle;
          translateMap.faqModalContent.innerHTML = txt.faqContent;
      
          guestNameInput.placeholder = lang === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name';
          roomNumberInput.placeholder = lang === 'hi' ? 'अपना कमरा नंबर दर्ज करें' : 'Enter your room number';
          guestWhatsAppInput.placeholder = lang === 'hi' ? '+919876543210' : '+1234567890';
        }
        applyLanguage(langSelect.value);
        langSelect.addEventListener('change', e => {
          applyLanguage(e.target.value);
        });
      
        function sanitizeId(name) {
          return name.replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase();
        }
        function validateGuestInfo() {
          const nameValid = guestNameInput.value.trim().length > 0;
          const roomValid = roomNumberInput.value.trim().length > 0;
          const whatsappValid = /^\+?[0-9]{7,15}$/.test(guestWhatsAppInput.value.trim());
          return nameValid && roomValid && whatsappValid;
        }
        function updateConfirmButtonState() {
          const hasItems = Object.keys(currentOrder).length > 0;
          const guestOk = validateGuestInfo();
          confirmBtn.disabled = !(hasItems && guestOk);
          confirmBtn.setAttribute('aria-disabled', confirmBtn.disabled.toString());
        }
        function parseCSV(text) {
          const lines = text.trim().split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          const rows = lines.slice(1);
          return rows.map(line => {
            const values = [];
            let inQuotes = false;
            let value = "";
            for(let i=0; i<line.length; i++) {
              const char = line[i];
              if (char === '"' && line[i+1] === '"') {
                value += '"';
                i++;
              } else if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(value.trim());
                value = "";
              } else {
                value += char;
              }
            }
            values.push(value.trim());
            const obj = {};
            headers.forEach((h, idx) => {
              obj[h] = values[idx] || "";
            });
            return obj;
          });
        }
      
        let menuData = {
          veg: { Soups: [], Starters: [], 'Tandoor Starters': [], Breads: [], Curries:[], Rices: [], Biryanis: [] },
          nonveg: { Soups: [], Starters: [], 'Tandoor Starters': [], Curries:[], Rices: [], Biryanis: [], 'Sea Food': [] },
          general: { 'Cold Beverages': [], 'Hot Beverages': [], Sides:[] }
        };
      
        let currentOrder = {};
        let currentTab = 'veg';
        const tabVegBtn = document.getElementById('tabVeg');
        const tabNonVegBtn = document.getElementById('tabNonVeg');
        const tabGeneralBtn = document.getElementById('tabGeneral');
      
      <!-- start renderMenu      
      
      function renderMenu() {
      const data = menuData[currentTab];
      if (!data || Object.values(data).every(cat => cat.length === 0)) {
      menuContainer.innerHTML = `<p style="font-style: italic; color: #777;">${textElements[langSelect.value].menuEmpty}</p>`;
      return;
      }
      
      let html = '';
      for (const category of Object.keys(data)) {
      html += `<div class="category" data-category="${category}"><h3>${category}</h3>`;
      const items = data[category] || [];
      if (items.length === 0) {
      html += `<p style="font-style: italic; color: #aaa;">No items in this category.</p>`;
      } else {
      items.forEach(item => {
      const qty = currentOrder[item.Name]?.qty || 0;
      const thumbUrl = item.ImageURL ? encodeURI(item.ImageURL) : '';
      let thumbDiv = '';
      
      if (thumbUrl) {
       thumbDiv = `<img src="${thumbUrl}" alt="${item.Name}" class="menu-image" onerror="this.style.display='none';" />`;
      }
      
      html += `
       <div class="menu-item">
         <div class="item-info" tabindex="0">
           ${thumbDiv}
           <div>
             <div class="item-name">${item.Name}</div>
             <div class="item-desc">${item.Description}</div>
           </div>
         </div>
         <div class="item-price" aria-label="Price">₹${parseFloat(item.Price).toFixed(2)}</div>
         <div class="quantity-selector">
           <label for="qty-${currentTab}-${sanitizeId(item.Name)}" class="sr-only">Quantity for ${item.Name}</label>
           <input type="number" id="qty-${currentTab}-${sanitizeId(item.Name)}" min="0" max="99" step="1" value="${qty}" 
             data-name="${item.Name}" data-category="${item.Category}" data-price="${parseFloat(item.Price)}" data-type="${currentTab}" 
             aria-label="Quantity selector for ${item.Name}" />
         </div>
       </div>`;
      });
      }
      html += `</div>`; // close category div
      }
      
      menuContainer.innerHTML = html;
      
      const qtyInputs = menuContainer.querySelectorAll('input[type="number"]');
      qtyInputs.forEach(input => {
      input.addEventListener('input', onQtyChange);
      });
      }
      // <-- close renderMenu
      
        function onQtyChange(e) {
          let value = e.target.value;
          if (value === '') {
            value = 0;
            e.target.value = 0;
          }
          value = Math.max(0, Math.min(99, parseInt(value)));
          e.target.value = value;
          updateOrder(
            e.target.dataset.name,
            e.target.dataset.category,
            parseFloat(e.target.dataset.price),
            value,
            e.target.dataset.type
          );
        }
        function updateOrder(name, category, price, qty, type) {
          if (qty > 0) {
            let desc = '';
            const items = menuData[type][category];
            if (items) {
              const item = items.find(i => i.Name === name);
              desc = item ? item.Description : '';
            }
            currentOrder[name] = { category, price, qty, description: desc, type };
          } else {
            delete currentOrder[name];
          }
          renderOrderSummary();
          updateConfirmButtonState();
        }
        function renderOrderSummary() {
          orderItemsContainer.innerHTML = '';
          if (Object.keys(currentOrder).length === 0) {
            orderItemsContainer.innerHTML = `<p>${textElements[langSelect.value].noItemsSelected}</p>`;
            totalPriceEl.textContent = 'Total: ₹0.00';
            return;
          }
          let total = 0;
          for (const name in currentOrder) {
            const item = currentOrder[name];
            total += item.price * item.qty;
            const itemEl = document.createElement('div');
            itemEl.classList.add('order-item');
            itemEl.innerHTML = `<span>${name} × ${item.qty}</span> <span>₹${(item.price * item.qty).toFixed(2)}</span>`;
            orderItemsContainer.appendChild(itemEl);
          }
          totalPriceEl.textContent = `Total: ₹${total.toFixed(2)}`;
        }
      
      <!--Tab switching function -->
      function switchTab(newTab) {
        if (newTab === currentTab) return;
        currentTab = newTab;
        // Reset all tabs
        [tabVegBtn, tabNonVegBtn, tabGeneralBtn].forEach(tab => {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
          tab.setAttribute('tabindex', '-1');
        });
      
        // Activate the selected tab
        let activeTabBtn;
        if (currentTab === 'veg') activeTabBtn = tabVegBtn;
        else if (currentTab === 'nonveg') activeTabBtn = tabNonVegBtn;
        else activeTabBtn = tabGeneralBtn;
      
        activeTabBtn.classList.add('active');
        activeTabBtn.setAttribute('aria-selected', 'true');
        activeTabBtn.setAttribute('tabindex', '0');
        activeTabBtn.focus();
      
        renderMenu();
      }
         
        tabVegBtn.addEventListener('click', () => switchTab('veg'));
        tabNonVegBtn.addEventListener('click', () => switchTab('nonveg'));
        tabGeneralBtn.addEventListener('click', () => switchTab('general'));
        const tabs = [tabVegBtn, tabNonVegBtn, tabGeneralBtn ];
        tabs.forEach((tab, idx) => {
          tab.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              let newIdx = idx + (e.key === 'ArrowRight' ? 1 : -1);
              if (newIdx < 0) newIdx = tabs.length - 1;
              if (newIdx >= tabs.length) newIdx = 0;
              tabs[newIdx].focus();
              switchTab(newIdx === 0 ? 'veg' : newIdx === 1 ? 'nonveg' : 'general');
            }
          });
        });

  <!--Tab switching function -->


      const receptionWhatsAppNumber = "9985908131";    
      
      confirmBtn.addEventListener('click', () => {
        if (!validateGuestInfo()) {
          alert(langSelect.value === 'hi' ? 'कृपया अतिथि जानकारी सही से भरें।' : 'Please fill out all guest information correctly.');
          return;
        }
        if (Object.keys(currentOrder).length === 0) {
          alert(langSelect.value === 'hi' ? 'कृपया कम से कम एक मेन्यू आइटम चुनें।' : 'Please select at least one menu item.');
          return;
        }
      
    
      
 // Prepare WhatsApp message starts
        const guestName = guestNameInput.value.trim();
        const roomNumber = roomNumberInput.value.trim();
        const guestWhatsApp = guestWhatsAppInput.value.trim();
      
        let message = `New Food Order%0A`;
        message += `Guest: ${guestName}%0A`;
        message += `Room: ${roomNumber}%0A`;
        message += `Guest WhatsApp #: ${guestWhatsApp}%0A%0A`;
        message += `Items:%0A`;
      
        let total = 0;
        for (const name in currentOrder) {
          const item = currentOrder[name];
          const lineTotal = (item.price * item.qty).toFixed(2);
          total += parseFloat(lineTotal);
          message += `${name} × ${item.qty} - ₹${lineTotal}%0A`;
        }
      
        message += `%0ATotal: ₹${total.toFixed(2)}`;
      
        // Open WhatsApp chat
        const waUrl = `https://wa.me/919985908131?text=${message}`;
        window.open(waUrl, '_blank');
      });
  // Prepare WhatsApp message ends
    

      
         
      window.addEventListener('DOMContentLoaded', () => {
      fetch('menu.csv')
      .then(response => {
      if (!response.ok) {
      throw new Error(textElements[langSelect.value].errorLoadingMenu + response.status);
      }
      return response.text();
      })
      .then(csvText => {
      const parsed = parseCSV(csvText);
      
      // Initialize menuData structure
      menuData.veg = {
      Soups: [],
      Starters: [],
      'Tandoor Starters': [],
      Breads: [],
      Curries: [],
      Rices: [],
      Biryanis: []
      };
      menuData.nonveg = {
      Soups: [],
      Starters: [],
      'Tandoor Starters': [],
      Curries: [],
      Rices: [],
      Biryanis: [],
      'Sea Food': []
      };
      menuData.general = {
      'Cold Beverages': [],
      'Hot Beverages': [],
      Sides: []
      };
      
      parsed.forEach(row => {
      if (!row.Type || !row.Category || !row.Name || !row.Price) return;
      if (isNaN(parseFloat(row.Price))) return;
      
      const type = row.Type.toLowerCase();
      const category = row.Category;
      
      if (menuData[type] && menuData[type][category]) {
       menuData[type][category].push({
         Name: row.Name,
         Description: row.Description || '',
         Price: parseFloat(row.Price).toFixed(2),
         ImageURL: row.ImageURL ? `images/${row.ImageURL}` : ''
       });
      }
      });
      
      currentTab = 'veg';
      renderMenu();
      currentOrder = {};
      renderOrderSummary();
      updateConfirmButtonState();
      menuContainer.setAttribute('tabindex', '0');
      })
      .catch(err => {
      menuContainer.innerHTML = `<p style="color: red;">${textElements[langSelect.value].errorLoadingMenu} ${err.message}</p>`;
      });
      });
      
            
        [guestNameInput, roomNumberInput, guestWhatsAppInput].forEach(input => {
          input.addEventListener('input', updateConfirmButtonState);
        });
      
        const helpBtn = document.getElementById('helpBtn');
        const faqModal = document.getElementById('faqModal');
        const faqModalClose = document.getElementById('faqModalClose');
      
        helpBtn.addEventListener('click', () => {
          faqModal.style.display = 'block';
          faqModal.setAttribute('aria-hidden', 'false');
          faqModal.focus();
          helpBtn.setAttribute('aria-expanded', 'true');
        });
      
        faqModalClose.addEventListener('click', closeFaq);
        faqModal.addEventListener('click', e => {
          if(e.target === faqModal) closeFaq();
        });
        faqModal.addEventListener('keydown', e => {
          if(e.key === 'Escape') closeFaq();
        });
      
        function closeFaq() {
          faqModal.style.display = 'none';
          faqModal.setAttribute('aria-hidden', 'true');
          helpBtn.setAttribute('aria-expanded', 'false');
          helpBtn.focus();
        }
      
      })();
    </script>


<!-- Menu Loading Script including Sub Tabs -->

  <!-- Type Tabs -->
  <div class="tab-buttons">
    <button onclick="selectType('veg')">Veg</button>
    <button onclick="selectType('nonveg')">Non Veg</button>
    <button onclick="selectType('general')">General</button>
  </div>

  <!-- Category Subtabs -->
  <div class="category-buttons" id="categoryTabs"></div>

  <!-- Menu Items -->
  <div id="menuContainer">Loading menu…</div>

<script>
    // ✅ ADDED: CSV Parsing Function
    function parseCSV(text) {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',');
      return lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((header, i) => {
          row[header.trim()] = values[i] ? values[i].trim() : '';
        });
        return row;
      });
    }

    // ✅ ADDED: Menu Data Structure
    const menuData = {
      veg: {
        Soups: [], Starters: [], 'Tandoor Starters': [], Breads: [],
        Curries: [], Rices: [], Biryanis: []
      },
      nonveg: {
        Soups: [], Starters: [], 'Tandoor Starters': [],
        Curries: [], Rices: [], Biryanis: [], 'Sea Food': []
      },
      general: {
        'Cold Beverages': [], 'Hot Beverages': [], Sides: []
      }
    };

    let currentType = 'veg';
    let currentCategory = '';

    // ✅ ADDED: Fetch and Parse CSV
    fetch('menu.csv')
      .then(response => response.text())
      .then(csvText => {
        const parsed = parseCSV(csvText);
        parsed.forEach(row => {
          if (!row.Type || !row.Category || !row.Name || !row.Price) return;
          const type = row.Type.toLowerCase();
          const category = row.Category;
          if (menuData[type] && menuData[type][category]) {
            menuData[type][category].push({
              Name: row.Name,
              Description: row.Description || '',
              Price: parseFloat(row.Price).toFixed(2)
            });
          }
        });
        selectType('veg'); // default
      });

    // ✅ ADDED: Type Selection
    function selectType(type) {
      currentType = type;
      updateCategoryTabs(type);
      const categories = Object.keys(menuData[type]);
      if (categories.length > 0) {
        showCategory(categories[0]);
      }
    }

    // ✅ ADDED: Category Tabs
    function updateCategoryTabs(type) {
      const container = document.getElementById('categoryTabs');
      container.innerHTML = '';
      Object.keys(menuData[type]).forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category;
        btn.onclick = () => showCategory(category);
        container.appendChild(btn);
      });
    }

    // ✅ ADDED: Render Menu Items
    function showCategory(categoryName) {
      currentCategory = categoryName;
      const items = menuData[currentType][categoryName];
      const container = document.getElementById('menuContainer');
      container.innerHTML = '';
      if (!items || items.length === 0) {
        container.textContent = 'No items found in this category.';
        return;
      }
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `<h4>${item.Name} - ₹${item.Price}</h4><p>${item.Description}</p>`;
        container.appendChild(div);
      });
    }
  </script>

   <!-- Menu Loading Script including Sub Tabs --> 

<!-- Payment intiation Script -->
    <script>
      document.getElementById('confirmOrderBtn').addEventListener('click', async () => {
        const transactionId = 'order_' + Date.now(); // Unique transaction ID
        const amount = 10000; // ₹100 in paise
        const redirectUrl = 'payment-callback.html'; // Replace with your actual callback URL
      
        try {
          const response = await fetch('/createPayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ transactionId, amount, redirectUrl })
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          console.log('Payment payload:', data);
      
          // You can now use data.payload and data.checksum to initiate PhonePe payment
          alert('Payment initiated successfully!');
        } catch (error) {
          console.error('Error initiating payment:', error);
          alert('Error initiating payment: ' + error.message);
        }
      });
    </script>
<!-- Payment intiation Script -->


<!-- Menu Loading Script including Sub Tabs -->
