// store.js — shared store: backend auth/orders + localStorage cart/saved

//API base URL
const PRODUCTION_API = "https://webapp-project-nme2.onrender.com/api";
const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
export const API_BASE = isLocal ? "http://localhost:3000/api" : PRODUCTION_API;

const TOKEN_KEY = "shop_token";
const AUTH_KEY = "shop_current_user";

// ── TOKEN ─────────────────────────────────────────────────
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

// ── CURRENT USER ──────────────────────────────────────────
export function getMe() {
  return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
}
export function setMe(u) { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
export function clearMe() { localStorage.removeItem(AUTH_KEY); }

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: "Bearer " + t } : {};
}

// ── AUTH API ──────────────────────────────────────────────
export async function apiRegister({ name, email, password }) {
  const res = await fetch(API_BASE + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Register failed");
  setToken(data.token);
  setMe(data.user);
  return data.user;
}

export async function apiLogin({ email, password }) {
  const res = await fetch(API_BASE + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  setToken(data.token);
  setMe(data.user);
  return data.user;
}

export function apiLogout() {
  clearToken();
  clearMe();
  window.dispatchEvent(new Event("shopStoreUpdated"));
}

// ── PER-USER LOCAL STORAGE (cart & saved) ─────────────────
function userKey(suffix) {
  const me = getMe();
  return me ? `shop_${suffix}_${me.id}` : null;
}

function readArr(key) {
  if (!key) return [];
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function writeArr(key, arr) {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(arr));
  window.dispatchEvent(new Event("shopStoreUpdated"));
}

// ── SAVED (wishlist) ──────────────────────────────────────
export function getSaved() { return readArr(userKey("saved")); }

export function addToSaved(product) {
  const key = userKey("saved");
  const list = readArr(key);
  if (!list.find(p => p.id === product.id)) list.push(product);
  writeArr(key, list);
}

export function removeFromSaved(productId) {
  const key = userKey("saved");
  writeArr(key, readArr(key).filter(p => p.id !== productId));
}

export function isInSaved(productId) {
  return getSaved().some(p => p.id === productId);
}

// ── CART ──────────────────────────────────────────────────
export function getCart() { return readArr(userKey("cart")); }

/**
 * Сагсанд бараа нэмэх
 * @param {object} product - бүтээгдэхүүний дэлгэрэнгүй
 * @param {number} qty - нэмэх тоо ширхэг (default 1)
 * @param {string|null} size - сонгосон размер (хувцас, гутал)
 *
 * Хэрэв ижил id+size хослолтой бараа сагсанд байгаа бол qty-г нь нэмнэ.
 * Өөр размертай бол шинэ мөр болгож нэмнэ.
 */
export function addToCart(product, qty = 1, size = null) {
  const key = userKey("cart");
  const list = readArr(key);
  const addQty = Math.max(1, parseInt(qty) || 1);

  // Ижил id + ижил size бүхий мөрийг хайна
  const existing = list.find(p => p.id === product.id && (p.size || null) === (size || null));
  if (existing) {
    existing.qty = (existing.qty || 1) + addQty;
  } else {
    list.push({ ...product, qty: addQty, size: size || null });
  }
  writeArr(key, list);
}

/**
 * Сагснаас тодорхой мөрийг устгах. size өгсөн бол ижил size-тай мөрийг л устгана.
 */
export function removeFromCart(productId, size = null) {
  const key = userKey("cart");
  const list = readArr(key);
  const filtered = list.filter(p => {
    if (p.id !== productId) return true;
    if (size === null) return false; // size заагаагүй бол id-аар бүгдийг устгана
    return (p.size || null) !== size;
  });
  writeArr(key, filtered);
}

export function updateCartQty(productId, qty, size = null) {
  const key = userKey("cart");
  const list = readArr(key);
  const item = list.find(p => p.id === productId && (size === null || (p.size || null) === size));
  if (item) { item.qty = Math.max(1, qty); writeArr(key, list); }
}

export function clearCart() { writeArr(userKey("cart"), []); }

export function isInCart(productId, size = null) {
  return getCart().some(p => p.id === productId && (size === null || (p.size || null) === size));
}

export function getCartTotal() {
  return getCart().reduce((sum, p) => sum + p.newPrice * (p.qty || 1), 0);
}

// ── ORDERS (backend) ──────────────────────────────────────
export async function apiFetchOrders() {
  const res = await fetch(API_BASE + "/orders", { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function apiFetchOrder(id) {
  const res = await fetch(API_BASE + "/orders/" + id, { headers: authHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function apiPlaceOrder(payload) {
  const res = await fetch(API_BASE + "/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Order failed");
  return data;
}

// ── UTILITY ───────────────────────────────────────────────
export function formatPrice(n) {
  return (n ?? 0).toLocaleString("mn-MN") + "₮";
}