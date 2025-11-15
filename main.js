function initInfiniteScroller(sliderSelector) {
    const slider = document.querySelector(sliderSelector);
    if (!slider) return;

    let itemSetWidth = 0;
    let isDown = false;
    let startX;
    let scrollLeft_var;

    const items = Array.from(slider.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        slider.appendChild(clone);
    });

    function setInitialPosition() {
        requestAnimationFrame(() => {
            let originalWidth = 0;
            items.forEach(item => {
                originalWidth += item.offsetWidth + parseInt(getComputedStyle(item).marginRight);
            });
            itemSetWidth = originalWidth;
            if (itemSetWidth > 0 && !isDown) slider.scrollLeft = itemSetWidth;
        });
    }

    setInitialPosition();
    window.addEventListener('resize', setInitialPosition);

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft_var = slider.scrollLeft;
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft_var - walk;
    });

    slider.addEventListener('scroll', () => {
        if (itemSetWidth === 0) return;

        if (slider.scrollLeft < 1 && !isDown) {
            requestAnimationFrame(() => slider.scrollLeft = itemSetWidth);
            return;
        }

        if (slider.scrollLeft >= itemSetWidth * 2 - slider.clientWidth - 1) {
            const newScroll = slider.scrollLeft - itemSetWidth;
            slider.scrollLeft = newScroll;
            if (isDown) scrollLeft_var = newScroll;
        }

        if (slider.scrollLeft <= 0) {
            const newScroll = slider.scrollLeft + itemSetWidth;
            slider.scrollLeft = newScroll;
            if (isDown) scrollLeft_var = newScroll;
        }
    });
}

initInfiniteScroller('.scroller-container');
initInfiniteScroller('.competitions-scroller');

const hiddenElements = document.querySelectorAll('.hidden-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

hiddenElements.forEach((el) => observer.observe(el));

const marqueeContent1 = document.querySelector('#marquee-content-1');
const marqueeContent2 = document.querySelector('#marquee-content-2');

if (marqueeContent1 && marqueeContent2) {
    let baseOffset2 = -marqueeContent2.offsetWidth / 2;

    const handleScrollMarquee = () => {
        const scrollPos = window.scrollY;
        const speed = 0.2;
        const moveLeft = scrollPos * -speed;
        const moveRight = scrollPos * speed;

        requestAnimationFrame(() => {
            marqueeContent1.style.transform = `translateX(${moveLeft}px)`;
            marqueeContent2.style.transform = `translateX(${baseOffset2 + moveRight}px)`;
        });
    };

    window.addEventListener('scroll', handleScrollMarquee);
    window.addEventListener('resize', () => {
        setTimeout(() => {
            baseOffset2 = -marqueeContent2.offsetWidth / 2;
        }, 100);
    });
}

const modalOverlay = document.getElementById('modal-overlay');
const modalContainer = document.getElementById('modal-container');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDetails = document.getElementById('modal-details');
const allCompetitionCards = document.querySelectorAll('.competitions-scroller .competition-card');

function openModal(image, title, details) {
    modalImage.src = image;
    modalTitle.textContent = title;
    modalDetails.textContent = details;
    modalOverlay.classList.add('visible');
    modalContainer.classList.add('visible');
}

function closeModal() {
    modalOverlay.classList.remove('visible');
    modalContainer.classList.remove('visible');
}

allCompetitionCards.forEach(card => {
    card.addEventListener('click', () => {
        if (window.getSelection().toString() === '') {
            const image = card.dataset.image;
            const title = card.dataset.title;
            const details = card.dataset.details;
            openModal(image, title, details);
        }
    });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

const typewriterElement = document.querySelector('.hero-title.typewriter');
let charIndex = 0;
let textToType = '';
if (typewriterElement) textToType = typewriterElement.getAttribute('data-text');

function typeCharacter() {
    if (charIndex < textToType.length) {
        typewriterElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeCharacter, 150);
    } else {
        setTimeout(() => {
            typewriterElement.textContent = '';
            charIndex = 0;
            typeCharacter();
        }, 5000);
    }
}

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.style.display = 'none', 500);
    }

    if (typewriterElement) setTimeout(typeCharacter, 1000);
    if (linkFound) activateNavLinkOnScroll();
});

const backToTopBtn = document.getElementById('back-to-top-btn');
window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        if (window.scrollY > 300) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    }
});

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav-links');

if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.innerHTML = mobileNav.classList.contains('active')
            ? '<i class="fa-solid fa-times"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });
}

const mainNavLinks = document.querySelectorAll('nav.main-nav a[href^="#"]');
const sections = [];
let linkFound = false;

mainNavLinks.forEach(link => {
    if (link.getAttribute('href').length > 1) {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
            sections.push(section);
            linkFound = true;
        }
    }
});

function activateNavLinkOnScroll() {
    let currentSectionId = '';
    const headerElement = document.getElementById('main-header');
    const headerHeight = headerElement ? headerElement.offsetHeight + 20 : 80;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop - headerHeight;
        if (window.scrollY >= sectionTop) {
            currentSectionId = section.id;
            break;
        }
    }

    const allNavLinks = document.querySelectorAll('.main-nav a[href^="#"], .mobile-nav a[href^="#"]');

    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

if (linkFound) window.addEventListener('scroll', activateNavLinkOnScroll);

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        requestAnimationFrame(() => {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });
    });

    const interactiveElements = document.querySelectorAll('a, button, .team-card, .competition-card, .scroll-item, .find-us-card, .category-card, .resource-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseout', () => {
            cursorOutline.classList.remove('hover');
        });
    });
}
