         (() => {
           const translations = {
             en: { guestInfo:"Guest Information", name:"Name:", room:"Room Number:", whatsapp:"Whatsapp Number:", menu:"Menu", veg:"Veg", nonveg:"Non Veg", general:"General", orderSummary:"Order Summary", total:"Total:", confirm:"Confirm Order", faq:"FAQ", faqTitle:"Frequently Asked Questions", close:"Close", faqs:`<p><strong>How to order?</strong> Fill your guest details and select quantities...</p>` }
           };
           const langSelect = document.getElementById('langSelect');
           const faqText = document.getElementById('faqText');
			function applyTranslations(lang) {
			  document.querySelectorAll('[data-translate]').forEach(el => {
				const key = el.getAttribute('data-translate');
				if (translations[lang] && translations[lang][key]) {
				  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
					// update placeholder
					el.setAttribute("placeholder", translations[lang][key]);
				  } else if (el.tagName === "BUTTON") {
					// update button text
					el.textContent = translations[lang][key];
				  } else {
					// update normal text content
					el.textContent = translations[lang][key];
				  }
				}
			  });

			  // FAQ translations
			  faqText.innerHTML = translations[lang].faqs;
			}         
           const menuContainer = document.getElementById('menuContainer');
           const tabVegBtn = document.getElementById('tabVeg');
           const tabNonVegBtn = document.getElementById('tabNonVeg');
           const tabGeneralBtn = document.getElementById('tabGeneral');
           const orderList = document.getElementById('orderList');
           const orderTotalEl = document.getElementById('orderTotal');
           const confirmOrderBtn = document.getElementById('confirmOrder');
           const guestNameEl = document.getElementById('guestName');
           const roomNoEl = document.getElementById('roomNo');
           const whatsappEl = document.getElementById('Whatsappnum');
         
           let menuData = { veg:{}, nonveg:{}, general:{} };
           let currentTab = 'veg';
           let currentOrder = {};
         
		function parseCSV(text) {
		  const lines = text.trim().split('\n');
		  const headers = lines[0].split(',').map(h => h.trim());

		  return lines.slice(1).map(line => {
			const values = [];
			let match;
			const regex = /("([^"]*)"|[^,]+)/g; // match quoted "..." or unquoted text

			while ((match = regex.exec(line)) !== null) {
			  if (match[2] !== undefined) {
				values.push(match[2]); // inside quotes
			  } else {
				values.push(match[1]);
			  }
			}

			const obj = {};
			headers.forEach((h, i) => obj[h] = values[i] ? values[i].trim() : "");
			return obj;
		  });
		}

         
           function renderMenu() {
             const data = menuData[currentTab];
             if (!data || Object.keys(data).length === 0) { menuContainer.innerHTML = '<p>No items</p>'; return; }
             let tabsHtml = '<div class="category-tabs">';
             for (const category of Object.keys(data)) {
               tabsHtml += `<button data-category="${category}" onclick="showCategory('${category}')">${category}</button>`;
             }
             tabsHtml += '</div><div id="categoryContent"></div>';
             menuContainer.innerHTML = tabsHtml;
             const firstCategory = Object.keys(data)[0];
             if (firstCategory) showCategory(firstCategory);
           }
         
           window.showCategory = function(category) {
             const items = menuData[currentTab][category] || [];
             const container = document.getElementById('categoryContent');
             container.innerHTML = '';
             items.forEach(item => {
               const qty = currentOrder[item.Name]?.qty || 0;
               container.innerHTML += `
                 <div class="menu-item">
                   <div class="item-info"><div class="item-name">${item.Name}</div><div>${item.Description}</div></div>
                   <div class="item-price">₹${item.Price}</div>
                   <div class="quantity-selector" id="qty-${item.Name.replace(/\s+/g,'_')}">
         			  ${qty > 0 
         				? `<button class="dec-btn" data-name="${item.Name}" data-price="${item.Price}">-</button>
         				   <span class="qty-val">${qty}</span>
         				   <button class="inc-btn" data-name="${item.Name}" data-price="${item.Price}">+</button>`
         				: `<button class="add-btn" data-name="${item.Name}" data-price="${item.Price}">Add</button>`}
         			</div>
                 </div>`;
			// Highlight active sub tab
				document.querySelectorAll('.category-tabs button').forEach(btn => {
				  if (btn.getAttribute('data-category') === category) {
					btn.classList.add('active');
				  } else {
					btn.classList.remove('active');
				  }
				});
         	// Add button → starts qty = 1
         		container.querySelectorAll('.add-btn').forEach(btn => {
         		  btn.addEventListener('click', () => {
         			const name = btn.dataset.name;
         			const price = parseFloat(btn.dataset.price);
         			currentOrder[name] = { qty: 1, price };
         			updateOrderSummary();
         			showCategory(category); // re-render controls
         		  });
         		});
         
         	// Increment button
         		container.querySelectorAll('.inc-btn').forEach(btn => {
         		  btn.addEventListener('click', () => {
         			const name = btn.dataset.name;
         			currentOrder[name].qty++;
         			updateOrderSummary();
         			showCategory(category);
         		  });
         		});
         
         	// Decrement button
         		container.querySelectorAll('.dec-btn').forEach(btn => {
         		  btn.addEventListener('click', () => {
         			const name = btn.dataset.name;
         			currentOrder[name].qty--;
         			if (currentOrder[name].qty <= 0) delete currentOrder[name];
         			updateOrderSummary();
         			showCategory(category);
         		  });
         		});
             });
             container.querySelectorAll('input[type="number"]').forEach(input => input.addEventListener('input', onQtyChange));
           };
         
           function onQtyChange(e) {
             const input = e.target;
             const name = input.dataset.name;
             const price = parseFloat(input.dataset.price);
             const qty = parseInt(input.value) || 0;
             if (qty > 0) currentOrder[name] = { qty, price };
             else delete currentOrder[name];
             updateOrderSummary();
           }
         
           function updateOrderSummary() {
             orderList.innerHTML = '';
             let total = 0;
             for (const [name, item] of Object.entries(currentOrder)) {
               const lineTotal = item.qty * item.price;
               total += lineTotal;
               orderList.innerHTML += `<li>${name} x ${item.qty} = ₹${lineTotal}</li>`;
             }
             orderTotalEl.textContent = total.toFixed(2);
           }
         
           // Tab switching
           function switchActive(activeBtn) {
             [tabVegBtn, tabNonVegBtn, tabGeneralBtn].forEach(btn => btn.classList.remove('active'));
             activeBtn.classList.add('active');
           }
           tabVegBtn.addEventListener('click', () => { currentTab = 'veg'; switchActive(tabVegBtn); renderMenu(); });
           tabNonVegBtn.addEventListener('click', () => { currentTab = 'nonveg'; switchActive(tabNonVegBtn); renderMenu(); });
           tabGeneralBtn.addEventListener('click', () => { currentTab = 'general'; switchActive(tabGeneralBtn); renderMenu(); });
         
           // Load menu.csv
           fetch('menu.csv')
             .then(r => r.text())
             .then(text => {
               const rows = parseCSV(text);
               rows.forEach(row => {
                 const type = row.Type.toLowerCase();
                 const category = row.Category || "Misc";
                 if (!menuData[type][category]) menuData[type][category] = [];
                 menuData[type][category].push(row);
               });
               renderMenu();
             });
         
           confirmOrderBtn.addEventListener('click', () => {
             let orderDetails = Object.entries(currentOrder).map(([name, item]) => `${name} x ${item.qty}`).join(', ');
             let total = orderTotalEl.textContent;
             let msg = `Guest: ${guestNameEl.value}, Room: ${roomNoEl.value}, WhatsApp: ${whatsappEl.value}. Order: ${orderDetails}. Total: ₹${total}`;
             window.open(`https://wa.me/919985908131?text=${encodeURIComponent(msg)}`);
           });
         
           document.getElementById('faqBtn').onclick = () => { document.getElementById('faqModal').style.display = 'flex'; };
           document.getElementById('closeFaq').onclick = () => { document.getElementById('faqModal').style.display = 'none'; };
         })();