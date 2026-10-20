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
  
  themeToggle.innerHTML = isDark
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  
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

  mobileToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
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
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}
