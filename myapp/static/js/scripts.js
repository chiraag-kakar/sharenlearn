const navBtn = document.querySelector(".nav-btn");
const navList = document.querySelector(".nav-list");
navBtn.addEventListener("click", function () {
  navList.classList.toggle("view");
});
