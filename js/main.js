/**
 * Antonio De Gaetano - Personal Portfolio & Profile JavaScript
 * Handles Theme Toggling, CV Tabs, Project Filtering, and Mobile Navigation
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initCvTabs();
  initProjectFilters();
  initScrollSpy();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */

function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    document.documentElement.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
  }

  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon();
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      updateThemeIcon();
    }
  });
}

function updateThemeIcon() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  // Fluent UI System Icons: weather_sunny_20_regular / weather_moon_20_regular
  themeToggle.innerHTML = isDark
    ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 3a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 3Zm0 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-1.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm0 3.75a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75ZM17 10a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 17 10ZM4.75 10.75h-1a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 0 1.5ZM14.95 5.05a.75.75 0 0 1 0 1.06l-.7.71a.75.75 0 1 1-1.07-1.06l.71-.71a.75.75 0 0 1 1.06 0ZM6.82 13.18a.75.75 0 0 1 0 1.06l-.71.71a.75.75 0 0 1-1.06-1.06l.7-.71a.75.75 0 0 1 1.07 0Zm8.13 1.77a.75.75 0 0 1-1.06 0l-.71-.7a.75.75 0 1 1 1.06-1.07l.71.71a.75.75 0 0 1 0 1.06ZM6.82 6.82a.75.75 0 0 1-1.06 0l-.71-.71A.75.75 0 1 1 6.1 5.05l.71.7a.75.75 0 0 1 0 1.07Z"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.9 2.02a.75.75 0 0 1 .39 1.01A5.97 5.97 0 0 0 16.97 11a.75.75 0 0 1 .99.98A8 8 0 1 1 8.9 2.04a.75.75 0 0 1 1-.02ZM8.3 3.74a6.5 6.5 0 1 0 7.96 8.96 7.47 7.47 0 0 1-7.96-8.96Z"/></svg>`;

  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

/* ==========================================================================
   2. Mobile Navigation
   ========================================================================== */

function initMobileNav() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!mobileToggle || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
  };

  mobileToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. Interactive Curriculum Vitae (CV) Tabs
   ========================================================================== */

function initCvTabs() {
  const tabButtons = document.querySelectorAll(".cv-tab-btn");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const printCvBtn = document.getElementById("printCvBtn");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-tab");

      timelineItems.forEach((item) => {
        const itemType = item.getAttribute("data-type");
        if (filter === "all" || filter === itemType) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  if (printCvBtn) {
    printCvBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

/* ==========================================================================
   4. Project Filtering
   ========================================================================== */

function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const tags = (card.getAttribute("data-category") || "").split(" ");
        if (filter === "all" || tags.includes(filter)) {
          card.style.display = "flex";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
          }, 50);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   5. ScrollSpy (Active Navigation Link Highlighting)
   ========================================================================== */

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollY = window.scrollY;
    const nearBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40;

    if (nearBottom && sections.length > 0) {
      current = sections[sections.length - 1].getAttribute("id");
    } else {
      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}
