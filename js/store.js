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
// Cart rows are keyed by (productId, variantAttrs). variantAttrs is a JSON
// object like {color:"Black", storage:"128GB"} or null for variant-less products.

export function getCart() { return readArr(userKey("cart")); }

// Stable serialization of a variant attrs object — used to key cart rows.
export function variantKey(attrs) {
  if (!attrs) return "";
  const keys = Object.keys(attrs).sort();
  return keys.map(k => `${k}=${attrs[k]}`).join("|");
}

function sameVariant(a, b) {
  return variantKey(a) === variantKey(b);
}

/**
 * Add to cart.
 * @param {object} product - product object (with id, name, newPrice, image, brand)
 * @param {number} qty
 * @param {object|null} variantAttrs - e.g. {size:"M", color:"Black"} or null
 * @param {number} unitPrice - effective price after priceDelta. Falls back to product.newPrice.
 * @param {string|null} variantImage - per-variant photo (e.g. the chosen color); falls back to product.image.
 */
export function addToCart(product, qty = 1, variantAttrs = null, unitPrice = null, variantImage = null) {
  const key = userKey("cart");
  const list = readArr(key);
  const addQty = Math.max(1, parseInt(qty) || 1);
  const price = unitPrice ?? product.newPrice;
  const image = variantImage || product.image;

  const existing = list.find(p => p.id === product.id && sameVariant(p.variantAttrs, variantAttrs));
  if (existing) {
    existing.qty = (existing.qty || 1) + addQty;
    // Refresh price/image in case priceDelta or variant photo changed
    existing.newPrice = price;
    existing.image = image;
  } else {
    list.push({
      id: product.id,
      name: product.name,
      image,
      brand: product.brand,
      newPrice: price,
      oldPrice: product.oldPrice,
      variantAttrs: variantAttrs || null,
      qty: addQty,
    });
  }
  writeArr(key, list);
}

export function removeFromCart(productId, variantAttrs = null) {
  const key = userKey("cart");
  const list = readArr(key);
  writeArr(key, list.filter(p => !(p.id === productId && sameVariant(p.variantAttrs, variantAttrs))));
}

export function updateCartQty(productId, qty, variantAttrs = null) {
  const key = userKey("cart");
  const list = readArr(key);
  const item = list.find(p => p.id === productId && sameVariant(p.variantAttrs, variantAttrs));
  if (item) { item.qty = Math.max(1, qty); writeArr(key, list); }
}

export function clearCart() { writeArr(userKey("cart"), []); }

export function isInCart(productId, variantAttrs = null) {
  return getCart().some(p => p.id === productId && sameVariant(p.variantAttrs, variantAttrs));
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

// Pretty-print variant attrs for UI: {size:"M", color:"Black"} → "M · Black"
export function formatVariant(attrs) {
  if (!attrs) return "";
  return Object.values(attrs).filter(v => v != null && v !== "").join(" · ");
}
