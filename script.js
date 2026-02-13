// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {

    /* ===============================
       SET CURRENT YEAR
    =============================== */
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }


    /* ===============================
       MOBILE MENU TOGGLE
    =============================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {

        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking normal links
        const navLinks = document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            });
        });

        // Mobile dropdown toggle
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    const dropdown = this.parentElement;
                    dropdown.classList.toggle('active');

                    document.querySelectorAll('.dropdown').forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('active');
                        }
                    });
                }
            });
        });
    }


    /* ===============================
       HEADER SCROLL EFFECT
    =============================== */
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 100);
        });
    }


    /* ===============================
       AUTO HIGHLIGHT CURRENT PAGE
    =============================== */
    let currentPage = window.location.pathname.split('/').pop();

    if (currentPage === '') {
        currentPage = 'index.html';
    }

    const allNavLinks = document.querySelectorAll('.nav-menu a');

    allNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        if (linkHref === currentPage) {
            link.classList.add('active');

            // Highlight parent dropdown if exists
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.classList.add('active');
                }
            }
        }
    });


    /* ===============================
       CONTACT FORM
    =============================== */
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            if (!formData.name || !formData.email || !formData.service || !formData.message) {
                alert('Please fill in all required fields.');
                return;
            }

            alert(`Thank you, ${formData.name}! We'll contact you within 24 hours at ${formData.email} or ${formData.phone}.`);

            quoteForm.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ===============================
       SMOOTH SCROLL
    =============================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {

            const href = this.getAttribute('href');
            if (href === '#' || href.includes('.html#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }

            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    });


    /* ===============================
       IMAGE LAZY LOADING
    =============================== */
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    obs.unobserve(img);
                }
            });
        });

        images.forEach(img => observer.observe(img));
    }


    /* ===============================
       INIT FEATURES
    =============================== */
    initSlideshow();
    handlePageSpecificFeatures();
});



/* =========================================
   SLIDESHOW
========================================= */
function initSlideshow() {

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');

        currentSlide = index;
        resetInterval();
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function startInterval() {
        slideInterval = setInterval(nextSlide, 3000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slideshowContainer.addEventListener('mouseleave', startInterval);
    }

    startInterval();
}



/* =========================================
   PAGE-SPECIFIC FEATURES
========================================= */
function handlePageSpecificFeatures() {

    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'testimonials.html') {
        const cards = document.querySelectorAll('.testimonial-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}
