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