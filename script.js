const filterButtons = document.querySelectorAll(".filter-button");
const mountainCards = document.querySelectorAll(".mountain-card");
const searchInput = document.querySelector("#mountain-search");
const emptyState = document.querySelector("#empty-state");
const bookingDialog = document.querySelector("#booking-dialog");
const bookingForm = document.querySelector("#booking-form");
const bookingMountain = document.querySelector("#booking-mountain");
const bookingMapFrame = document.querySelector("#booking-map-frame");
const bookingDate = document.querySelector("#booking-date");
const formMessage = document.querySelector("#form-message");
const toast = document.querySelector("#toast");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const footerContactLink = document.querySelector("#footer-contact-link");
const whatsappNumber = "628888888";

let activeFilter = "semua";
let toastTimeout;

footerContactLink.href = `https://wa.me/${whatsappNumber}`;

const mountainLocations = {
  "Gunung Semeru": "Gunung Semeru, Lumajang, Jawa Timur",
  "Gunung Arjuno": "Gunung Arjuno, Malang, Jawa Timur",
  "Gunung Panderman": "Gunung Panderman, Batu, Jawa Timur",
  "Gunung Butak": "Gunung Butak, Jawa Timur",
};

function updateBookingMap() {
  const mountain = bookingMountain.value;
  const location = mountainLocations[mountain];
  bookingMapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  bookingMapFrame.title = `Peta lokasi ${mountain}`;
}

bookingMountain.addEventListener("change", updateBookingMap);
updateBookingMap();

const heroSlides = document.querySelectorAll(".hero-slide");
const heroImages = Array.from(mountainCards, (card) =>
  window.getComputedStyle(card.querySelector(".mountain-photo")).backgroundImage,
);
let activeHeroImage = 0;
heroSlides[0].style.backgroundImage = heroImages[0];
heroSlides[1].style.backgroundImage = heroImages[1];
window.setInterval(() => {
  const nextHeroImage = (activeHeroImage + 1) % heroImages.length;
  const nextSlide = Array.from(heroSlides).find((slide) => !slide.classList.contains("is-active"));
  const activeSlide = document.querySelector(".hero-slide.is-active");

  nextSlide.style.backgroundImage = heroImages[nextHeroImage];
  nextSlide.classList.add("is-active");
  activeSlide.classList.remove("is-active");
  activeHeroImage = nextHeroImage;
}, 6000);

function updateMountainList() {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  let visibleCount = 0;

  mountainCards.forEach((card) => {
    const matchesFilter = activeFilter === "semua" || card.dataset.level === activeFilter;
    const matchesSearch = card.dataset.name.includes(query);
    const isVisible = matchesFilter && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
}

function showToast(message) {
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    updateMountainList();
  });
  button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
});

searchInput.addEventListener("input", updateMountainList);

function openBooking(mountain) {
  bookingMountain.value = mountain;
  updateBookingMap();
  formMessage.hidden = true;
  formMessage.textContent = "";
  bookingDialog.showModal();
}

document.querySelectorAll(".book-button").forEach((button) => {
  button.addEventListener("click", () => openBooking(button.dataset.mountain));
});

document.querySelectorAll('a[href="#gunung"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (bookingDialog.open) bookingDialog.close();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => bookingDialog.close());
bookingDialog.addEventListener("click", (event) => {
  if (event.target === bookingDialog) bookingDialog.close();
});

const today = new Date();
const localToday = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");
bookingDate.min = localToday;

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const departureDate = new Date(`${formData.get("date")}T00:00:00`);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(departureDate);
  const message = [
    "Halo LangkahRimba, saya ingin booking porter.",
    "",
    `Nama customer: ${formData.get("customer")}`,
    `Gunung: ${formData.get("mountain")}`,
    `Tanggal berangkat: ${formattedDate}`,
    `Jumlah pendaki: ${formData.get("people")} orang`,
    "",
    "Mohon info ketersediaan porter, rincian layanan, dan harga terbaru. Terima kasih!",
  ].join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  formMessage.replaceChildren(
    document.createTextNode("WhatsApp terbuka dengan template pesan booking. Jika tidak terbuka, "),
  );
  const fallbackLink = document.createElement("a");
  fallbackLink.href = whatsappUrl;
  fallbackLink.target = "_blank";
  fallbackLink.rel = "noopener noreferrer";
  fallbackLink.textContent = "klik di sini untuk melanjutkan";
  formMessage.append(fallbackLink, document.createTextNode("."));
  formMessage.hidden = false;
});

document.querySelectorAll(".join-button").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const isJoined = button.classList.toggle("is-joined");
    button.setAttribute("aria-pressed", String(isJoined));
    button.innerHTML = isJoined
      ? 'Tergabung <span aria-hidden="true">✓</span>'
      : 'Gabung <span aria-hidden="true">↗</span>';
    showToast(
      isJoined
        ? `Kamu bergabung ke ${button.dataset.community} di pratinjau ini.`
        : `Kamu keluar dari ${button.dataset.community} di pratinjau ini.`,
    );
  });
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  mainNav.classList.toggle("is-open", !isExpanded);
  menuToggle.setAttribute("aria-label", isExpanded ? "Buka menu" : "Tutup menu");
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu");
    mainNav.classList.remove("is-open");
  });
});
