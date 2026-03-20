const slider = document.querySelector(".categories");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

rightBtn.addEventListener("click", () => {
  slider.scrollBy({
    left: 350,
    behavior: "smooth"
  });
});

leftBtn.addEventListener("click", () => {
  slider.scrollBy({
    left: -350,
    behavior: "smooth"
  });
});

function openMenu() {
  document.getElementById("categoryMenu").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeMenu() {
  document.getElementById("categoryMenu").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

const searchInput = document.getElementById("categorySearch");

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const items = document.querySelectorAll(".menu-item");

  items.forEach(item => {
    const text = item.textContent.toLowerCase();

    if (text.includes(value)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});