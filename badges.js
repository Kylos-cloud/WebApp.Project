// Live cart, wishlist, and login-state badges for every page.
// Reacts to store mutations (shopStoreUpdated) and cross-tab storage events.
import { getCart, getSaved, getMe } from "./store.js";

function updateBadges() {
  const me         = getMe();
  const cartCount  = me ? getCart().reduce((s, i) => s + (i.qty || 1), 0) : 0;
  const savedCount = me ? getSaved().length : 0;

  setBadge('a[href="basket.html"]',    cartCount);
  setBadge('a[href="hadgalsan.html"]', savedCount);

  // Profile icon: show a green dot when logged in
  document.querySelectorAll(".icon-profile, .bottom-nav-item[href='login.html']").forEach(el => {
    el.classList.toggle("user-logged-in", !!me);
    el.title = me ? (me.name || me.email || "") : "";
  });
}

function setBadge(selector, count) {
  document.querySelectorAll(selector).forEach(el => {
    let badge = el.querySelector(".nav-badge");
    if (count > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "nav-badge";
        el.appendChild(badge);
      }
      badge.textContent = count > 99 ? "99+" : String(count);
    } else if (badge) {
      badge.remove();
    }
  });
}

document.addEventListener("DOMContentLoaded", updateBadges);
window.addEventListener("shopStoreUpdated", updateBadges);
window.addEventListener("storage", updateBadges);
