/**
 * Antonio De Gaetano — Portfolio & Profile Scripts
 * Modern Web Guidance: <meta name="color-scheme"> two-state toggle,
 * scroll-target-group: auto + aria-current sync with IntersectionObserver fallback,
 * CV filtering, Project filtering, and Mobile navigation.
 */

document.addEventListener("DOMContentLoaded", () => {
  initColorSchemeToggle();
  initMobileNav();
  initCvTabs();
  initProjectFilters();
  initScrollSpy();
});

function initColorSchemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (!themeToggle || !meta) return;

  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const getSystemScheme = () => (darkQuery.matches ? "dark" : "light");

  const getEffectiveScheme = () => {
    const content = meta.getAttribute("content") || "light dark";
    if (content === "light" || content === "dark") return content;
    return getSystemScheme();
  };

  const syncAriaLabel = () => {
    const effective = getEffectiveScheme();
    themeToggle.setAttribute(
      "aria-label",
      effective === "dark" ? "Switch to light color scheme" : "Switch to dark color scheme"
    );
  };

  syncAriaLabel();

  themeToggle.addEventListener("click", () => {
    const target = getEffectiveScheme() === "dark" ? "light" : "dark";
    const system = getSystemScheme();

    if (target === system) {
      meta.setAttribute("content", "light dark");
      try { localStorage.removeItem("color-scheme"); } catch (e) {}
    } else {
      meta.setAttribute("content", target);
      try { localStorage.setItem("color-scheme", target); } catch (e) {}
    }
    syncAriaLabel();
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "color-scheme") {
      meta.setAttribute("content", e.newValue === "light" || e.newValue === "dark" ? e.newValue : "light dark");
      syncAriaLabel();
    }
  });

  darkQuery.addEventListener("change", syncAriaLabel);
}

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

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
      mobileToggle.focus();
    }
  });
}

function initCvTabs() {
  const tabButtons = document.querySelectorAll(".cv-tab-btn");
  const timelineItems = document.querySelectorAll(".ledger-item");
  const printCvBtn = document.getElementById("printCvBtn");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filter = btn.getAttribute("data-tab");
      timelineItems.forEach((item) => {
        const types = (item.getAttribute("data-type") || "").split(" ");
        item.hidden = !(filter === "all" || types.includes(filter));
      });
    });
  });

  if (printCvBtn) {
    printCvBtn.addEventListener("click", () => window.print());
  }
}

function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filter = btn.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const tags = (card.getAttribute("data-category") || "").split(" ");
        card.hidden = !(filter === "all" || tags.includes(filter));
      });
    });
  });
}

function initScrollSpy() {
  const navLinks = document.querySelectorAll("nav a.nav-link");
  const sections = document.querySelectorAll("main section[id]");
  if (!navLinks.length || !sections.length) return;

  if (CSS.supports("scroll-target-group: auto")) {
    const syncAriaCurrent = () => {
      const currentLink = document.querySelector("nav a.nav-link:target-current");
      navLinks.forEach((link) => {
        link.setAttribute("aria-current", link === currentLink ? "true" : "false");
      });
    };
    syncAriaCurrent();
    document.addEventListener("scrollend", syncAriaCurrent);
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              const isActive = link.getAttribute("href") === `#${id}`;
              link.classList.toggle("target-current", isActive);
              link.setAttribute("aria-current", String(isActive));
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }
}
