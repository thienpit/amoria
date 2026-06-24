var state = { currentPage: 'home', orderRef: '' };

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('amoria_cart')) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(c) {
  localStorage.setItem('amoria_cart', JSON.stringify(c));
}

function parsePrice(s) {
  if (!s) return 0;
  return parseInt(s.replace(/[^\d]/g, ''), 10) || 0;
}

function formatPrice(n) {
  return n.toLocaleString('vi-VN') + 'd';
}

function updateCartBadge() {
  var c = getCart(), t = 0;
  for (var i = 0; i < c.length; i++) t += (c[i].qty || 1);
  var b = document.getElementById('cart-badge');
  if (!b) return;
  b.textContent = t;
  if (t > 0) b.classList.add('show');
  else b.classList.remove('show');
}

function showPage(id) {
  var ps = document.querySelectorAll('.page');
  for (var i = 0; i < ps.length; i++) ps[i].classList.remove('active');
  var p = document.getElementById(id);
  if (p) {
    p.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    state.currentPage = id;
  }
  closeCart();
}

function openCart() {
  var d = document.getElementById('cart-drawer');
  var o = document.getElementById('cart-overlay');
  if (d) d.classList.add('open');
  if (o) o.classList.add('open');
  renderCartDrawer();
}

function closeCart() {
  var d = document.getElementById('cart-drawer');
  var o = document.getElementById('cart-overlay');
  if (d) d.classList.remove('open');
  if (o) o.classList.remove('open');
}

function toggleCart() {
  var d = document.getElementById('cart-drawer');
  if (d && d.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
}

function addToCart(product) {
  var c = getCart(), found = null;
  for (var i = 0; i < c.length; i++) {
    if (c[i].id === product.id) {
      found = c[i];
      break;
    }
  }
  if (found) {
    found.qty = (found.qty || 1) + 1;
  } else {
    var item = {};
    for (var k in product) item[k] = product[k];
    item.qty = 1;
    item.checked = true;
    c.push(item);
  }
  saveCart(c);
  updateCartBadge();
  openCart();

  // ── TRACKING: AddToCart ──
  var itemPrice = parsePrice(product.price);
  if (typeof fbq !== 'undefined') {
    var _addToCartData = {
      content_ids: [String(product.id)],
      content_name: product.name,
      content_type: 'product',
      value: itemPrice,
      currency: 'VND'
    };
    fbq('trackSingle', '1035052728860073', 'AddToCart', _addToCartData);
    fbq('trackSingle', '957208667285613', 'AddToCart', _addToCartData);
  }
  if (typeof gtag !== 'undefined') {
    gtag('event', 'add_to_cart', {
      currency: 'VND',
      value: itemPrice,
      items: [{ item_id: String(product.id), item_name: product.name, price: itemPrice, quantity: 1 }]
    });
  }
}

function removeFromCart(id) {
  saveCart(getCart().filter(function (i) { return i.id !== id; }));
  updateCartBadge();
  renderCartDrawer();
}

function updateQty(id, d) {
  var c = getCart();
  for (var i = 0; i < c.length; i++) {
    if (c[i].id === id) {
      c[i].qty = Math.max(1, (c[i].qty || 1) + d);
      break;
    }
  }
  saveCart(c);
  renderCartDrawer();
}

function toggleCheck(id, v) {
  var c = getCart();
  for (var i = 0; i < c.length; i++) {
    if (c[i].id === id) {
      c[i].checked = v;
      break;
    }
  }
  saveCart(c);
  renderCartTotal();
}

function renderCartDrawer() {
  var c = getCart(), el = document.getElementById('cart-items-list');
  if (!el) return;
  if (!c.length) {
    el.innerHTML = '<p class=cart-empty-msg>Giỏ hàng trống</p>';
    renderCartTotal();
    return;
  }
  var h = '';
  for (var i = 0; i < c.length; i++) {
    var it = c[i], qty = it.qty || 1, chk = it.checked !== false ? 'checked' : '';
    h += '<div class=cart-item>' +
      '<input class=cart-item-check type=checkbox ' + chk + ' onchange=toggleCheck(' + it.id + ',this.checked)>' +
      '<img class=cart-item-img src=' + it.img + ' alt=' + it.name + '>' +
      '<div class=cart-item-info><div class=cart-item-name>' + it.name + '</div><div class=cart-item-price>' + it.price + '</div></div>' +
      '<div class=cart-item-right>' +
      '<div class=cart-item-qty>' +
      '<button class=qty-btn onclick=updateQty(' + it.id + ',-1)>-</button>' +
      '<span class=qty-num>' + qty + '</span>' +
      '<button class=qty-btn onclick=updateQty(' + it.id + ',1)>+</button>' +
      '</div>' +
      '<button class=cart-item-del onclick=removeFromCart(' + it.id + ')>Xóa</button>' +
      '</div>' +
      '</div>';
  }
  el.innerHTML = h;
  renderCartTotal();
}

function renderCartTotal() {
  var c = getCart(), t = 0;
  for (var i = 0; i < c.length; i++) {
    if (c[i].checked !== false) t += parsePrice(c[i].price) * (c[i].qty || 1);
  }
  var el = document.getElementById('cart-total-display');
  if (el) el.textContent = formatPrice(t);
}

function checkoutSelected() {
  var c = getCart(), sel = [];
  for (var i = 0; i < c.length; i++) {
    if (c[i].checked !== false) sel.push(c[i]);
  }
  if (!sel.length) {
    alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.');
    return;
  }
  closeCart();
  renderOrderSummary(sel);

  // ── TRACKING: InitiateCheckout ──
  var totalVal = 0;
  for (var j = 0; j < sel.length; j++) totalVal += parsePrice(sel[j].price) * (sel[j].qty || 1);
  if (typeof fbq !== 'undefined') {
    var _checkoutData = {
      value: totalVal,
      currency: 'VND',
      num_items: sel.length,
      content_ids: sel.map(function(p) { return String(p.id); }),
      content_type: 'product'
    };
    fbq('trackSingle', '1035052728860073', 'InitiateCheckout', _checkoutData);
    fbq('trackSingle', '957208667285613', 'InitiateCheckout', _checkoutData);
  }
  if (typeof gtag !== 'undefined') {
    gtag('event', 'begin_checkout', {
      currency: 'VND',
      value: totalVal,
      items: sel.map(function(p) {
        return { item_id: String(p.id), item_name: p.name, price: parsePrice(p.price), quantity: p.qty || 1 };
      })
    });
  }

  showPage('checkout');
}

function renderOrderSummary(items) {
  var el = document.getElementById('order-items');
  var tel = document.getElementById('order-total-price');
  if (!el) return;
  var h = '', t = 0;
  for (var i = 0; i < items.length; i++) {
    var p = items[i], qty = p.qty || 1, line = parsePrice(p.price) * qty;
    t += line;
    h += '<div class=order-item>' +
      '<img src=' + p.img + ' alt=' + p.name + '>' +
      '<div class=order-item-info>' +
      '<h5>' + p.name + (qty > 1 ? ' x' + qty : '') + '</h5>' +
      '<span>' + p.sub + '</span>' +
      '</div>' +
      '<div class=order-item-price>' + formatPrice(line) + '</div>' +
      '</div>';
  }
  el.innerHTML = h;
  if (tel) tel.textContent = formatPrice(t);
}

function confirmOrder(e) {
  e.preventDefault();
  var form = document.getElementById('checkout-form');
  clearFieldErrors(form);

  var nameEl = document.getElementById('inp-name');
  var emailEl = document.getElementById('inp-email');
  var phoneEl = document.getElementById('inp-phone');
  var addrEl = document.getElementById('inp-address');

  var n = nameEl.value.trim();
  var em = emailEl.value.trim();
  var ph = phoneEl.value.trim();
  var ad = addrEl.value.trim();

  var hasError = false;

  if (!n) {
    showFieldError(nameEl, 'Vui lòng nhập tên người nhận.');
    hasError = true;
  }

  if (!em) {
    showFieldError(emailEl, 'Vui lòng nhập địa chỉ email.');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    showFieldError(emailEl, 'Email không hợp lệ (ví dụ: name@example.com).');
    hasError = true;
  }

  if (!ph) {
    showFieldError(phoneEl, 'Vui lòng nhập số điện thoại.');
    hasError = true;
  } else if (!/^0/.test(ph)) {
    showFieldError(phoneEl, 'Số điện thoại phải bắt đầu bằng số 0.');
    hasError = true;
  } else if (!/^[0-9]+$/.test(ph) || ph.length < 10 || ph.length > 11) {
    showFieldError(phoneEl, 'Số điện thoại không hợp lệ (10–11 chữ số).');
    hasError = true;
  }

  if (!ad) {
    showFieldError(addrEl, 'Vui lòng nhập địa chỉ giao hàng.');
    hasError = true;
  }

  if (hasError) {
    var firstError = form.querySelector('.cf-error-msg');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  var payEl = document.querySelector('input[name="payment"]:checked');
  var payMethod = payEl ? payEl.value : 'cash';
  var payLabel = payMethod === 'qr' ? 'Chuyển khoản QR' : 'Tiền mặt (COD)';

  state.orderRef = 'MRV-' + Date.now().toString().slice(-6);
  var orderTime = new Date().toLocaleString('vi-VN');

  var noteEl = document.getElementById('inp-note');
  var noteVal = noteEl ? noteEl.value.trim() : '';
  var c = getCart(), sel = [], total = 0;
  for (var i = 0; i < c.length; i++) {
    if (c[i].checked !== false) {
      sel.push(c[i]);
      total += parsePrice(c[i].price) * (c[i].qty || 1);
    }
  }
  var productNames = sel.map(function (p) { return p.name + (p.qty > 1 ? ' x' + p.qty : ''); }).join(', ');

  var orderObj = {
    ref: state.orderRef,
    name: n, email: em, phone: ph, address: ad,
    note: noteVal,
    payment: payLabel,
    products: productNames,
    items: sel.map(function (p) { return { name: p.name, price: p.price, qty: p.qty || 1, img: p.img }; }),
    total: formatPrice(total),
    timestamp: orderTime
  };

  // Gửi đơn hàng lên Firebase
  if (typeof firebase !== 'undefined' && typeof addDocument === 'function') {
    addDocument(COLLECTIONS.ORDERS, orderObj).then(function () {
      // Lưu đơn hàng vào localStorage để tra cứu
      try {
        var localOrders = JSON.parse(localStorage.getItem('amoria_orders') || '[]');
        localOrders.push(orderObj);
        localStorage.setItem('amoria_orders', JSON.stringify(localOrders));
      } catch (e) {
        console.error('Lỗi lưu đơn hàng vào localStorage:', e);
      }
      handleOrderSuccess(sel, total, orderTime, payLabel);
    }).catch(function (error) {
      console.error('Lỗi lưu đơn hàng:', error);
      alert('❌ Lỗi: ' + error.message);
    });
  } else {
    console.error('❌ Firebase chưa khởi tạo');
    alert('⚠️ Firebase chưa kết nối. Kiểm tra console (F12)');
  }
}

function handleOrderSuccess(sel, total, orderTime, payLabel) {
  var n = document.getElementById('inp-name').value;
  var em = document.getElementById('inp-email').value;
  var ph = document.getElementById('inp-phone').value;
  var ad = document.getElementById('inp-address').value;
  var noteEl = document.getElementById('inp-note');
  var noteVal = noteEl ? noteEl.value.trim() : '';

  // ── TRACKING: Purchase ──
  if (typeof fbq !== 'undefined') {
    var _purchaseData = {
      value: total,
      currency: 'VND',
      content_ids: sel.map(function(p) { return String(p.id); }),
      content_type: 'product',
      num_items: sel.length,
      contents: sel.map(function(p) {
        return { id: String(p.id), quantity: p.qty || 1 };
      })
    };
    fbq('trackSingle', '1035052728860073', 'Purchase', _purchaseData);
    fbq('trackSingle', '957208667285613', 'Purchase', _purchaseData);
  }
  if (typeof gtag !== 'undefined') {
    gtag('event', 'purchase', {
      transaction_id: state.orderRef,
      value: total,
      currency: 'VND',
      items: sel.map(function(p) {
        return { item_id: String(p.id), item_name: p.name, price: parsePrice(p.price), quantity: p.qty || 1 };
      })
    });
  }

  document.getElementById('ty-order-ref').textContent = state.orderRef;
  document.getElementById('ty-name').textContent = n;
  document.getElementById('ty-email').textContent = em;
  document.getElementById('ty-phone').textContent = ph;
  document.getElementById('ty-address').textContent = ad;
  document.getElementById('ty-time').textContent = orderTime;

  var tyPay = document.getElementById('ty-payment');
  if (tyPay) tyPay.textContent = payLabel;

  var tyTotal = document.getElementById('ty-total');
  if (tyTotal) tyTotal.textContent = formatPrice(total);

  var noteRow = document.getElementById('ty-note-row');
  var noteValEl = document.getElementById('ty-note-val');
  if (noteRow && noteValEl) {
    if (noteVal) {
      noteValEl.textContent = noteVal;
      noteRow.style.display = '';
    } else {
      noteRow.style.display = 'none';
    }
  }

  var prodList = document.getElementById('ty-products-list');
  if (prodList) {
    prodList.innerHTML = sel.map(function (p) {
      var qty = p.qty || 1;
      var lineTotal = parsePrice(p.price) * qty;
      return '<div class="ty-product-row">' +
        '<img src="' + p.img + '" alt="' + p.name + '">' +
        '<div class="ty-product-info">' +
        '<div class="ty-product-name">' + p.name + (qty > 1 ? ' <span class="ty-qty-badge">x' + qty + '</span>' : '') + '</div>' +
        '<div class="ty-product-price">' + formatPrice(lineTotal) + '</div>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  saveCart(getCart().filter(function (i) { return i.checked === false; }));
  updateCartBadge();
  showPage('thankyou');
}

window.addEventListener('scroll', function () {
  var nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

function showFormError(form, msg) {
  var old = form.querySelector('.cf-error-msg');
  if (old) old.remove();
  var err = document.createElement('div');
  err.className = 'cf-error-msg';
  err.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>' + msg + '</span>';
  var phoneGroup = form.querySelector('.form-group:last-of-type') || form.querySelector('.form-group');
  if (phoneGroup) phoneGroup.appendChild(err);
}

function showFieldError(inputEl, msg) {
  if (!inputEl) return;
  var group = inputEl.closest('.form-group');
  if (!group) return;
  var old = group.querySelector('.cf-error-msg');
  if (old) old.remove();
  var err = document.createElement('div');
  err.className = 'cf-error-msg';
  err.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>' + msg + '</span>';
  group.appendChild(err);
}

function clearFieldErrors(form) {
  if (!form) return;
  var errs = form.querySelectorAll('.cf-error-msg');
  for (var i = 0; i < errs.length; i++) errs[i].remove();
}

function showFormSuccess(form, msg) {
  var old = form.querySelector('.cf-success-msg');
  if (old) old.remove();
  var suc = document.createElement('div');
  suc.className = 'cf-success-msg';
  suc.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>' + msg + '</span>';
  form.appendChild(suc);
  setTimeout(function () { if (suc.parentNode) suc.remove(); }, 5000);
}

function validatePhone(form, phoneId) {
  var el = document.getElementById(phoneId);
  var ph = el ? el.value.trim() : '';
  if (!ph) {
    showFieldError(el, 'Vui lòng nhập số điện thoại.');
    return null;
  }
  if (!/^0/.test(ph)) {
    showFieldError(el, 'Số điện thoại phải bắt đầu bằng số 0.');
    return null;
  }
  if (!/^[0-9]+$/.test(ph) || ph.length < 10 || ph.length > 11) {
    showFieldError(el, 'Số điện thoại không hợp lệ (10–11 chữ số).');
    return null;
  }
  return ph;
}

function goToLookup(orderRef) {
  showPage('lookup');
  switchLookupTab('ref');
  if (orderRef) {
    var refInput = document.getElementById('lu-ref-input');
    if (refInput) {
      refInput.value = orderRef;
      lookupByRef();
    }
  }
}

function switchLookupTab(tab) {
  var tabRef = document.getElementById('tab-ref');
  var tabPhone = document.getElementById('tab-phone');
  var luRef = document.getElementById('lookup-by-ref');
  var luPhone = document.getElementById('lookup-by-phone');

  if (tabRef) tabRef.classList.toggle('active', tab === 'ref');
  if (tabPhone) tabPhone.classList.toggle('active', tab === 'phone');
  if (luRef) luRef.style.display = tab === 'ref' ? '' : 'none';
  if (luPhone) luPhone.style.display = tab === 'phone' ? '' : 'none';

  var results = document.getElementById('lookup-results');
  if (results) results.innerHTML = '';
}

function lookupByRef() {
  var q = (document.getElementById('lu-ref-input').value || '').trim().toUpperCase();
  if (!q) {
    alert('Vui lòng nhập mã đơn hàng.');
    return;
  }
  var orders = JSON.parse(localStorage.getItem('amoria_orders') || '[]');
  var found = orders.filter(function (o) {
    return o.ref && o.ref.toUpperCase() === q;
  });
  renderLookupResults(found, q);
}

function lookupByPhone() {
  var q = (document.getElementById('lu-phone-input').value || '').trim();
  if (!q) {
    alert('Vui lòng nhập số điện thoại.');
    return;
  }
  var orders = JSON.parse(localStorage.getItem('amoria_orders') || '[]');
  var found = orders.filter(function (o) {
    return o.phone === q;
  });
  renderLookupResults(found, q);
}

function renderLookupResults(orders, query) {
  var el = document.getElementById('lookup-results');
  if (!orders.length) {
    el.innerHTML = '<div class="lookup-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>Không tìm thấy đơn hàng với <strong>"' + query + '"</strong></p></div>';
    return;
  }
  el.innerHTML = orders.map(function (o) {
    return renderOrderCard(o);
  }).join('');
}

function renderOrderCard(o) {
  var isCOD = o.payment && o.payment.indexOf('COD') !== -1;
  var payClass = isCOD ? 'cod' : 'qr';
  var items = o.items || [];
  var itemsHtml = items.map(function (p) {
    return '<div class="lu-product-row"><div class="lu-product-name">' + p.name + (p.qty > 1 ? ' x' + p.qty : '') + '</div><div class="lu-product-price">' + p.price + '</div></div>';
  }).join('') || '<div class="lu-product-row"><div class="lu-product-name">' + (o.products || '') + '</div></div>';
  return '<div class="lookup-card">'
    + '<div class="lookup-card-head">'
    + '<div><div class="lookup-card-ref">' + o.ref + '</div><div class="lookup-card-time">' + o.timestamp + '</div></div>'
    + '<span class="lookup-pay-badge ' + payClass + '">' + o.payment + '</span>'
    + '</div>'
    + '<div class="lookup-card-body">'
    + '<div class="lookup-info-row"><span>Người nhận</span><strong>' + o.name + '</strong></div>'
    + '<div class="lookup-info-row"><span>SĐT</span><span>' + o.phone + '</span></div>'
    + '<div class="lookup-info-row"><span>Email</span><span>' + o.email + '</span></div>'
    + '<div class="lookup-info-row"><span>Địa chỉ</span><span>' + o.address + '</span></div>'
    + (o.note ? '<div class="lookup-info-row"><span>Ghi chú</span><span>' + o.note + '</span></div>' : '')
    + '</div>'
    + '<div class="lookup-card-products"><div class="lookup-products-title">Sản Phẩm</div>' + itemsHtml + '</div>'
    + '<div class="lookup-card-total"><span>Tổng Cộng</span><strong>' + o.total + '</strong></div>'
    + '</div>';
}

function togglePayment(method) {
  var box = document.getElementById('qr-payment-box');
  var cashLabel = document.getElementById('pay-cash-label');
  var qrLabel = document.getElementById('pay-qr-label');
  if (!box) return;
  if (method === 'qr') {
    box.style.display = 'block';
    var n = (document.getElementById('inp-name') || {}).value || '';
    var ph = (document.getElementById('inp-phone') || {}).value || '';
    var noteEl = document.getElementById('qr-order-note');
    if (noteEl) noteEl.textContent = (n || 'Tên') + ' – ' + (ph || 'SĐT');
    if (qrLabel) qrLabel.classList.add('active');
    if (cashLabel) cashLabel.classList.remove('active');
  } else {
    box.style.display = 'none';
    if (cashLabel) cashLabel.classList.add('active');
    if (qrLabel) qrLabel.classList.remove('active');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  showPage('home');
  updateCartBadge();
  trackVisit();

  var f = document.getElementById('checkout-form');
  if (f) {
    f.addEventListener('submit', confirmOrder);
    var inpPhone = document.getElementById('inp-phone');
    if (inpPhone) {
      inpPhone.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
      });
    }
  }

  var homeCf = document.getElementById('contact-form');
  if (homeCf) {
    homeCf.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFieldErrors(homeCf);
      var nameEl = document.getElementById('cf-name');
      var name = nameEl ? nameEl.value.trim() : '';
      if (!name) {
        showFieldError(nameEl, 'Vui lòng nhập tên của bạn.');
        return;
      }
      var ph = validatePhone(homeCf, 'cf-email');
      if (!ph) return;

      if (typeof firebase !== 'undefined' && typeof addDocument === 'function') {
        addDocument(COLLECTIONS.SUBSCRIPTIONS, {
          phone: ph,
          name: name,
          message: '',
          source: 'Trang Chủ'
        }).then(function () {
          showFormSuccess(homeCf, 'Cảm ơn ' + name + ' đã đăng ký!');
          homeCf.reset();
        }).catch(function (error) {
          showFieldError(nameEl, 'Lỗi: ' + error.message);
        });
      } else {
        showFieldError(nameEl, 'Firebase chưa khởi tạo');
      }
    });
  }

  var pageForm = document.getElementById('contact-page-form');
  if (pageForm) {
    var phoneInput = document.getElementById('cf-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
      });
    }

    pageForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFieldErrors(pageForm);
      var nameEl = document.getElementById('cf-contact-name');
      var phoneEl = document.getElementById('cf-phone');
      var msgEl = document.getElementById('cf-contact-message');
      var name = nameEl ? nameEl.value.trim() : '';
      var msg = msgEl ? msgEl.value.trim() : '';

      if (!name) {
        showFieldError(nameEl, 'Vui lòng nhập tên của bạn.');
        return;
      }
      var validatedPh = validatePhone(pageForm, 'cf-phone');
      if (!validatedPh) return;

      if (typeof firebase !== 'undefined' && typeof addDocument === 'function') {
        addDocument(COLLECTIONS.SUBSCRIPTIONS, {
          phone: validatedPh,
          name: name,
          message: msg,
          source: 'Trang Liên Hệ'
        }).then(function () {
          showFormSuccess(pageForm, 'Cảm ơn ' + name + '! Chúng tôi sẽ liên hệ sớm.');
          pageForm.reset();
        }).catch(function (error) {
          showFieldError(nameEl, 'Lỗi: ' + error.message);
        });
      } else {
        showFieldError(nameEl, 'Firebase chưa khởi tạo');
      }
    });
  }
});

function copyOrderRef() {
  var refEl = document.getElementById('ty-order-ref');
  var btnEl = document.getElementById('ty-copy-btn');
  if (!refEl || !btnEl) return;

  var text = refEl.textContent.trim();

  function showSuccessState() {
    btnEl.classList.add('copied');
    var originalTitle = btnEl.title || 'Sao chép mã';
    btnEl.title = 'Đã sao chép!';

    // Tạo tooltip thông báo "Đã sao chép"
    var tooltip = document.createElement('span');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = 'Đã sao chép!';
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#4caf82';
    tooltip.style.color = '#fff';
    tooltip.style.fontSize = '0.7rem';
    tooltip.style.padding = '0.2rem 0.5rem';
    tooltip.style.borderRadius = '4px';
    tooltip.style.top = '-32px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    tooltip.style.zIndex = '100';

    var parent = btnEl.parentElement;
    if (parent) {
      parent.style.position = 'relative';
      parent.appendChild(tooltip);

      // Kích hoạt animation hiện
      setTimeout(function () {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) translateY(-2px)';
      }, 10);

      // Ẩn và xóa tooltip sau 1.5s
      setTimeout(function () {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(-50%)';
        setTimeout(function () {
          tooltip.remove();
        }, 200);
      }, 1500);
    }

    setTimeout(function () {
      btnEl.classList.remove('copied');
      btnEl.title = originalTitle;
    }, 2000);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showSuccessState).catch(function (err) {
      console.error('Lỗi Clipboard API:', err);
      fallbackCopy();
    });
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    try {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // Tránh cuộn trang
      document.body.appendChild(textarea);
      textarea.select();
      var successful = document.execCommand('copy');
      textarea.remove();
      if (successful) {
        showSuccessState();
      } else {
        alert('Không thể tự động sao chép. Mã của bạn là: ' + text);
      }
    } catch (e) {
      alert('Mã đơn hàng của bạn là: ' + text);
    }
  }
}

function closeSaleBanner() {
  var modal = document.getElementById('sale-banner-modal');
  if (modal) {
    modal.classList.remove('show');
    // sessionStorage.setItem('sale_banner_closed', 'true'); // Tạm tắt để test
  }
  // Chuyển sang trang sản phẩm
  showPage('products');
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function() {
    // if (!sessionStorage.getItem('sale_banner_closed')) {
      // Luôn hiện banner để thông báo trước ngày sale
      var modal = document.getElementById('sale-banner-modal');
      if (modal) modal.classList.add('show');
    // }
  }, 800);
});
