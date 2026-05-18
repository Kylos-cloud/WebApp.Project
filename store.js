// ============================================================
// store.js — shared localStorage store for cart & saved items
// Import this in both hadgalsan.html and basket.html
// ============================================================

const USERS_KEY = "shop_users";
const AUTH_KEY  = "shop_current_user";

export function getMe() {
  return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
}

export function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUserData() {
  const me = getMe();
  if (!me) return null;
  const users = getAllUsers();
  return users.find(u => u.id === me.id) || null;
}

function patchUser(fn) {
  const me = getMe();
  if (!me) return;
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === me.id);
  if (idx === -1) return;
  fn(users[idx]);
  saveAllUsers(users);
  window.dispatchEvent(new Event("shopStoreUpdated"));
}

// ── SAVED (wishlist) ─────────────────────────────────────
export function getSaved() {
  return getUserData()?.saved || [];
}

export function addToSaved(product) {
  patchUser(user => {
    if (!user.saved) user.saved = [];
    if (!user.saved.find(p => p.id === product.id)) {
      user.saved.push(product);
    }
  });
}

export function removeFromSaved(productId) {
  patchUser(user => {
    user.saved = (user.saved || []).filter(p => p.id !== productId);
  });
}

export function isInSaved(productId) {
  return getSaved().some(p => p.id === productId);
}

// ── CART ────────────────────────────────────────────────
export function getCart() {
  return getUserData()?.cart || [];
}

export function addToCart(product) {
  patchUser(user => {
    if (!user.cart) user.cart = [];
    const existing = user.cart.find(p => p.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      user.cart.push({ ...product, qty: 1 });
    }
  });
}

export function removeFromCart(productId) {
  patchUser(user => {
    user.cart = (user.cart || []).filter(p => p.id !== productId);
  });
}

export function updateCartQty(productId, qty) {
  patchUser(user => {
    const item = (user.cart || []).find(p => p.id === productId);
    if (item) item.qty = Math.max(1, qty);
  });
}

export function isInCart(productId) {
  return getCart().some(p => p.id === productId);
}

export function getCartTotal() {
  return getCart().reduce((sum, p) => sum + p.newPrice * (p.qty || 1), 0);
}

// ── ORDERS ──────────────────────────────────────────────
export function getOrders() {
  const data = getUserData();
  if (!data) return [];
  const orders = data.orders;
  if (!Array.isArray(orders)) return [];
  return orders;
}

export function addOrder(order) {
  patchUser(user => {
    if (!Array.isArray(user.orders)) user.orders = [];
    user.orders.unshift(order);
  });
}

export function getOrderById(orderId) {
  return getOrders().find(o => o.id === orderId) || null;
}

export function formatPrice(n) {
  return n.toLocaleString("mn-MN") + "₮";
}