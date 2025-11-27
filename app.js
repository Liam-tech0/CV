const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector("nav ul");
const cards = document.querySelectorAll(".card");
const yearPlaceholder = document.getElementById("year");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

cards.forEach((card) => observer.observe(card));

navToggle.addEventListener("click", () => {
  navList.classList.toggle("open");
});

document.querySelectorAll("nav a").forEach((link) =>
  link.addEventListener("click", () => navList.classList.remove("open"))
);

yearPlaceholder.textContent = new Date().getFullYear();

