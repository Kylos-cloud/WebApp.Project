const categories = document.querySelector(".categories");

let isDown = false;
let startX;
let scrollLeft;

categories.addEventListener("mousedown", e => {
  isDown = true;
  startX = e.pageX - categories.offsetLeft;
  scrollLeft = categories.scrollLeft;
});

categories.addEventListener("mouseleave", () => {
  isDown = false;
});

categories.addEventListener("mouseup", () => {
  isDown = false;
});

categories.addEventListener("mousemove", e => {

  if (!isDown) return;

  e.preventDefault();

  const x = e.pageX - categories.offsetLeft;
  const walk = (x - startX) * 2;

  categories.scrollLeft = scrollLeft - walk;

});