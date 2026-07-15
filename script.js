const heartLayer = document.querySelector(".heart-layer");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const albumCards = document.querySelectorAll(".memory-card");
const lightbox = document.querySelector("#photo-lightbox");
const lightboxPhoto = document.querySelector(".lightbox-photo");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
const bouquetStage = document.querySelector(".bouquet-stage");
const boomLayer = document.querySelector(".boom-layer");
let activeAlbumCard = null;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 80, 420)}ms`;
  revealObserver.observe(element);
});

function createHeart() {
  if (!heartLayer || reduceMotion) return;

  const heart = document.createElement("span");
  const size = Math.floor(Math.random() * 14) + 10;
  const colors = ["#e84a7a", "#ff7d70", "#ff9bb7", "#d99a3d"];

  heart.className = "heart";
  heart.style.setProperty("--heart-left", `${Math.random() * 100}vw`);
  heart.style.setProperty("--heart-size", `${size}px`);
  heart.style.setProperty("--heart-duration", `${Math.random() * 4 + 5}s`);
  heart.style.setProperty("--heart-drift", `${Math.random() * 120 - 60}px`);
  heart.style.setProperty("--heart-color", colors[Math.floor(Math.random() * colors.length)]);

  heartLayer.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove(), { once: true });
}

if (!reduceMotion) {
  for (let index = 0; index < 16; index += 1) {
    window.setTimeout(createHeart, index * 180);
  }

  window.setInterval(createHeart, 420);
}

function openLightbox(card) {
  if (!lightbox || !lightboxPhoto || !lightboxTitle || !lightboxCaption) return;

  const image = card.querySelector("img");
  activeAlbumCard = card;
  lightboxPhoto.src = card.dataset.full;
  lightboxPhoto.alt = image ? image.alt : card.dataset.title;
  lightboxTitle.textContent = card.dataset.title;
  lightboxCaption.textContent = card.dataset.caption;
  lightbox.removeAttribute("inert");
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.setAttribute("inert", "");
  document.body.style.overflow = "";

  window.setTimeout(() => {
    if (!lightbox.classList.contains("is-open") && lightboxPhoto) {
      lightboxPhoto.src = "";
    }
  }, 220);

  if (activeAlbumCard) {
    activeAlbumCard.focus();
  }
}

albumCards.forEach((card) => {
  card.addEventListener("click", () => openLightbox(card));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxBackdrop?.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});

function bloomFlowers() {
  if (!boomLayer || reduceMotion) return;

  const colors = ["#ff6f9e", "#ff8a70", "#ffd86f", "#f4567f", "#8ed3a8", "#ffc2d5"];
  const pieces = 26;
  const origin = bouquetStage.getBoundingClientRect();
  const originX = origin.width / 2;
  const originY = origin.height / 2 - 20;
  const maxDistance = Math.min(origin.width, origin.height);

  for (let index = 0; index < pieces; index += 1) {
    const piece = document.createElement("span");
    const angle = (Math.PI * 2 * index) / pieces;
    const distance = Math.floor(Math.random() * (maxDistance * 0.3)) + maxDistance * 0.18;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - Math.random() * 120;

    piece.className = "bloom-piece";
    piece.style.setProperty("--origin-x", `${originX}px`);
    piece.style.setProperty("--origin-y", `${originY}px`);
    piece.style.setProperty("--piece-x", `${x}px`);
    piece.style.setProperty("--piece-y", `${y}px`);
    piece.style.setProperty("--piece-size", `${Math.floor(Math.random() * 16) + 20}px`);
    piece.style.setProperty("--piece-rotate", `${Math.floor(Math.random() * 180)}deg`);
    piece.style.setProperty("--piece-color", colors[Math.floor(Math.random() * colors.length)]);
    piece.style.animationDelay = `${Math.random() * 160}ms`;

    boomLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}

bouquetStage?.addEventListener("click", bloomFlowers);
