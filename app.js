// CV Liam Abraham — petits effets « terminal »
const root = document.documentElement;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Entrée du hero au chargement
requestAnimationFrame(() => root.classList.add("ready"));

// 2. Bordure sous la barre de nav dès qu'on scrolle
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// 3. Halo vert qui suit la souris sur les cartes
document.querySelectorAll(".spot").forEach((el) => {
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// 4. Texte « Pourquoi moi » qui s'allume mot par mot en scrollant
const reveal = document.querySelector("[data-reveal]");
if (reveal) {
  const words = [];
  const wrap = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) return frag.append(part);
          const s = document.createElement("span");
          s.className = "w";
          s.textContent = part;
          words.push(s);
          frag.append(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) wrap(child);
    });
  };
  wrap(reveal);
  const update = () => {
    const r = reveal.getBoundingClientRect();
    const start = innerHeight * 0.85;
    const end = innerHeight * 0.35;
    const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.6)));
    const n = calm ? words.length : Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < n));
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
}

// 5. Les terminaux des projets « tapent » leurs lignes quand ils apparaissent
document.querySelectorAll("[data-type-lines]").forEach((pre) => {
  const lines = pre.innerHTML.trim().split("\n");
  pre.innerHTML = lines.map((l) => `<span class="ln">${l}</span>`).join("\n") + ' <span class="caret"></span>';
  const spans = pre.querySelectorAll(".ln");
  const play = () => spans.forEach((s, i) => setTimeout(() => s.classList.add("on"), calm ? 0 : 250 + i * 380));
  new IntersectionObserver((entries, io) => {
    if (entries[0].isIntersecting) { play(); io.disconnect(); }
  }, { threshold: 0.4 }).observe(pre);
});

// 6. Flux « En ce moment » : une ligne remonte en haut toutes les 3 s, comme un flux live
const feed = document.querySelector("[data-feed]");
if (feed && !calm) {
  let paused = false;
  feed.addEventListener("pointerenter", () => (paused = true));
  feed.addEventListener("pointerleave", () => (paused = false));
  setInterval(() => {
    if (paused || document.hidden) return;
    const last = feed.lastElementChild;
    last.classList.remove("is-new");
    feed.prepend(last);
    void last.offsetWidth;
    last.classList.add("is-new");
  }, 3000);
}

// 7. Dock flottant : la section visible est surlignée
const links = [...document.querySelectorAll("[data-dock]")];
const targets = { top: document.querySelector(".hero"), projets: document.getElementById("projets"), experience: document.getElementById("experience"), contact: document.getElementById("contact") };
const setActive = () => {
  const y = innerHeight * 0.45;
  let current = "top";
  for (const [id, el] of Object.entries(targets)) if (el && el.getBoundingClientRect().top < y) current = id;
  links.forEach((a) => a.classList.toggle("is-active", a.dataset.dock === current));
};
addEventListener("scroll", setActive, { passive: true });
setActive();

// 8. Vidéos de sport : lecture seulement quand elles sont à l'écran (et jamais si l'utilisateur veut moins d'animations)
if (!calm) {
  const vio = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()));
  }, { threshold: 0.25 });
  document.querySelectorAll("video[data-autoplay]").forEach((v) => vio.observe(v));
}

// 9. Année du footer
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
