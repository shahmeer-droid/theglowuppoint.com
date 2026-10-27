// ========== CART STORAGE FUNCTIONS ==========
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ========== ADD TO CART (by Product ID) ==========
function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  let cart = getCart();
  let existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.newPrice,
      img: product.image,
      qty: qty
    });
  }

  saveCart(cart);
  renderCart();
  openCart();
}

// ========== CART PANEL OPEN/CLOSE ==========
function openCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function toggleCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
}

// ========== RENDER CART CONTENTS ==========
function renderCart() {
  const cart = getCart();
  const countEl = document.getElementById('cart-count');

  if (countEl) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = totalQty;
  }

  const container = document.getElementById('cartItemsContainer');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return; // Agar cart panel is page par nahi hai

  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-msg">Your cart is empty 🛒</p>';
  } else {
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      container.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>Rs. ${itemTotal}</p>
            <div class="qty-controls">
              <button onclick="changeQty(${index}, -1)">-</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${index}, 1)">+</button>
              <span class="remove-item" onclick="removeItem(${index})">Remove</span>
            </div>
          </div>
        </div>
      `;
    });
  }

  if (totalEl) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    totalEl.textContent = 'Rs. ' + total;
  }
}

function changeQty(index, change) {
  let cart = getCart();
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function goToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  window.location.href = "checkout.html";
}

// ========== ORDER MESSAGE GENERATOR ==========
function generateOrderMessage() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return null;
  }
  let message = "Hi! I want to order these items:\n\n";
  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `• ${item.name} x${item.qty} = Rs. ${itemTotal}\n`;
  });
  message += `\nTotal: Rs. ${total}`;
  return message;
}

function checkoutWhatsApp() {
  const message = generateOrderMessage();
  if (!message) return;
  window.open(`https://wa.me/923333747558?text=${encodeURIComponent(message)}`, '_blank');
}

function checkoutEmail() {
  const message = generateOrderMessage();
  if (!message) return;
  
  const subject = "New Order - Glow Up Point";
  const body = encodeURIComponent(message);
  
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=theglowuppoint@gmail.com&su=${encodeURIComponent(subject)}&body=${body}`;
  
 window.open(gmailLink, '_blank');
}

function checkoutCall() {
  if (getCart().length === 0) { alert('Your cart is empty!'); return; }
  window.location.href = "tel:+923333747558";
}

function checkoutSMS() {
  const message = generateOrderMessage();
  if (!message) return;
  window.location.href = `sms:+923333747558?body=${encodeURIComponent(message)}`;
}

function copyOrder() {
  const message = generateOrderMessage();
  if (!message) return;
  navigator.clipboard.writeText(message).then(() => {
    alert("Order Details Have Been Copied! ✅");
  }).catch(() => {
    alert("Couldn’t Copy. Please Copy It Manually.:\n\n" + message);
  });
}

// ========== MOBILE MENU ==========
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('active');
}

// Page load hote hi cart render karein
document.addEventListener('DOMContentLoaded', renderCart);