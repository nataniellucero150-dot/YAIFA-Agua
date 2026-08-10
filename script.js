const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const galleryLightbox = document.getElementById("gallery-lightbox");
const lightboxImage = galleryLightbox.querySelector(".gallery-lightbox-image img");
const lightboxKicker = document.getElementById("gallery-lightbox-kicker");
const lightboxTitle = document.getElementById("gallery-lightbox-title");
const lightboxStatement = document.getElementById("gallery-lightbox-statement");
const lightboxCloseButton = galleryLightbox.querySelector(".gallery-lightbox-close");
let lastGalleryTrigger = null;

requestAnimationFrame(() => document.body.classList.add("page-loaded"));

document.querySelectorAll(".about-values, .purpose-grid, .cycle, .process-list, .benefit-grid, .impact-grid, .gallery-grid").forEach(group => {
    [...group.children].forEach((item, index) => {
        if (item.classList.contains("reveal")) {
            item.style.setProperty("--reveal-delay", `${Math.min(index * 85, 425)}ms`);
        }
    });
});

function closeMenu() {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
}

menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navAnchors.forEach(link => link.addEventListener("click", closeMenu));

document.addEventListener("click", event => {
    if (!event.target.closest(".navbar")) closeMenu();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (!galleryLightbox.hidden) {
            closeGalleryLightbox();
        } else if (navLinks.classList.contains("open")) {
            closeMenu();
            menuButton.focus();
        }
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) closeMenu();
});

function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 24);

    if (!reduceMotion && window.scrollY < window.innerHeight) {
        const shift = Math.min(window.scrollY * .14, 80);
        document.documentElement.style.setProperty("--hero-shift", `${shift}px`);
    }
}

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: .12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

function openGalleryLightbox(trigger) {
    const card = trigger.closest(".cycle-step, .impact-card");
    const image = trigger.querySelector("img");
    const isResearchCard = card.classList.contains("cycle-step");
    const title = isResearchCard
        ? card.querySelector("h3")
        : card.querySelector(".impact-copy h3");
    const statement = isResearchCard
        ? card.querySelector("p")
        : card.querySelector(".impact-copy p");

    lastGalleryTrigger = trigger;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxKicker.textContent = isResearchCard ? "Research & Development" : "Our Impact";
    lightboxTitle.textContent = title?.textContent.trim() || "YAIFA activity";
    lightboxStatement.textContent = statement?.textContent.trim() || "";
    galleryLightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightboxCloseButton.focus();
}

function closeGalleryLightbox() {
    if (galleryLightbox.hidden) return;
    galleryLightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    lastGalleryTrigger?.focus();
}

document.querySelectorAll(".cycle-photo, .impact-photo").forEach(trigger => {
    const card = trigger.closest(".cycle-step, .impact-card");
    const title = card.querySelector("h3")?.textContent.trim() || "image";
    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-label", `Enlarge ${title}`);
    trigger.addEventListener("click", () => openGalleryLightbox(trigger));
    trigger.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openGalleryLightbox(trigger);
        }
    });
});

galleryLightbox.querySelectorAll(".gallery-lightbox-close, .gallery-lightbox-backdrop").forEach(button => {
    button.addEventListener("click", closeGalleryLightbox);
});

galleryLightbox.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    lightboxCloseButton.focus();
});

document.getElementById("year").textContent = new Date().getFullYear();
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
