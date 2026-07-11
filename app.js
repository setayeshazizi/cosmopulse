// Create animated stars
function createStars() {
  const container = document.getElementById("starsContainer");
  const numberOfStars = 200;

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.width = Math.random() * 3 + "px";
    star.style.height = star.style.width;
    star.style.setProperty("--duration", Math.random() * 3 + 2 + "s");
    star.style.setProperty("--delay", Math.random() * 3 + "s");
    container.appendChild(star);
  }
}

// Counter animation
function startCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 50;

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText.replace(/,/g, "");
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc).toLocaleString();
        setTimeout(updateCount, 25);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    updateCount();
  });
}

// Navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.getElementById("mainNav");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// Automatic navbar active state based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        // این خط رو درست کردم - بک‌تیک فراموش شده بود
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });

  if (window.scrollY < 200) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#home") {
        link.classList.add("active");
      }
    });
  }
}

// 3D Slider Logic
let currentSlide = 0;
const cards = document.querySelectorAll(".slider-card");
const positions = ["far-left", "left", "center", "right", "far-right"];
let autoplayInterval;
const AUTOPLAY_DELAY = 3000;

function updateSlider() {
  cards.forEach((card, index) => {
    let offset = index - currentSlide;

    if (offset < -2) offset += cards.length;
    if (offset > 2) offset -= cards.length;

    const positionIndex = offset + 2;
    if (positionIndex >= 0 && positionIndex < positions.length) {
      card.setAttribute("data-position", positions[positionIndex]);
    }
  });

  const progressBar = document.getElementById("autoplayProgress");
  if (progressBar) {
    progressBar.style.animation = "none";
    progressBar.offsetHeight;
    progressBar.style.animation = "progressAnimation 3s linear infinite";
  }
}

function navigateSlider(direction) {
  stopAutoplay();
  if (direction === "next") {
    currentSlide = (currentSlide + 1) % cards.length;
  } else {
    currentSlide = (currentSlide - 1 + cards.length) % cards.length;
  }
  updateSlider();
  startAutoplay();
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") navigateSlider("prev");
  if (e.key === "ArrowRight") navigateSlider("next");
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

const sliderContainer = document.getElementById("planetSlider");

sliderContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  stopAutoplay();
});

sliderContainer.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  startAutoplay();
});

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    navigateSlider("next");
  }
  if (touchEndX > touchStartX + swipeThreshold) {
    navigateSlider("prev");
  }
}

// Particle effect on hover
function createParticle(e, card) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = e.clientX - card.getBoundingClientRect().left + "px";
  particle.style.top = e.clientY - card.getBoundingClientRect().top + "px";
  particle.style.width = "4px";
  particle.style.height = "4px";
  particle.style.background = "var(--neon-cyan)";
  particle.style.borderRadius = "50%";
  particle.style.boxShadow = "0 0 10px var(--neon-cyan)";

  card.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 3000);
}

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (Math.random() > 0.7) {
      createParticle(e, card);
    }
  });
});

// Auto-play with pause on hover
function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    navigateSlider("next");
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

sliderContainer.addEventListener("mouseenter", stopAutoplay);
sliderContainer.addEventListener("mouseleave", startAutoplay);

// ============================================
// همه چی توی یه DOMContentLoaded
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Stars
  createStars();

  // Slider
  updateSlider();
  startAutoplay();

  // Scroll events
  window.addEventListener("scroll", () => {
    handleNavbarScroll();
    updateActiveNavLink();
  });

  updateActiveNavLink();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Counter animation on scroll
  const statsSection = document.getElementById("stats");
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(statsSection);
  }

  // Contact Form
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const inputs = this.querySelectorAll(
        "input[required], textarea[required]",
      );
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = "rgba(239, 68, 68, 0.5)";
        } else {
          input.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }
      });

      if (isValid && successMessage) {
        successMessage.classList.remove("d-none");
        this.reset();
        setTimeout(() => {
          successMessage.classList.add("d-none");
        }, 4000);
      }
    });
  }

  // Scroll to Top Button
  const scrollToTopBtn = document.getElementById("scrollToTop");
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = document.getElementById("newsletterEmail");
      if (emailInput && emailInput.value) {
        alert(`Welcome aboard, space explorer! 🚀`);
        newsletterForm.reset();
      }
    });
  }
});
