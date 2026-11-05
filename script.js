/**
 * SkillCraft Navigation Menu Website
 * Project: Interactive Navigation Menu Website
 * Author: Aditya Wadnere
 * Assignment: College Web Development Assignment
 * Stack: HTML5, CSS3 & Vanilla JavaScript (Strictly 3 Files)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. Element Selectors & Global State
    // =========================================================================
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenuWrapper = document.getElementById('nav-menu-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    // Hero live metric badges
    const heroActiveSecDisplay = document.getElementById('hero-active-sec-display');
    const heroScrollDisplay = document.getElementById('hero-scroll-display');

    // Contact form elements
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const charCounter = document.getElementById('char-counter');
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.getElementById('submit-btn');

    // Gallery & Lightbox elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');

    // =========================================================================
    // 2. Fixed Navbar & Scroll Reactive Background
    // =========================================================================
    const handleScrollEffects = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar background transition on scroll (> 40px)
        if (scrollPosition > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Floating Back-to-Top button visibility (> 320px)
        if (scrollPosition > 320) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Live scroll position update in Hero Widget
        if (heroScrollDisplay) {
            heroScrollDisplay.textContent = `${Math.round(scrollPosition)} px`;
        }

        // Real-time Active Section Spy
        updateActiveSection(scrollPosition);
    };

    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    // Initialize on page load
    handleScrollEffects();

    // =========================================================================
    // 3. Active Section Detection (ScrollSpy)
    // =========================================================================
    function updateActiveSection(scrollPosition) {
        let currentSectionId = '';
        const navOffset = navbar.offsetHeight + 60;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navOffset;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Edge case: if reached the absolute bottom of page, activate Contact
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 40) {
            currentSectionId = 'contact';
        }

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === currentSectionId) {
                    link.classList.add('active');
                }
            });

            // Update Hero section display widget
            if (heroActiveSecDisplay) {
                const formattedName = currentSectionId.charAt(0).toUpperCase() + currentSectionId.slice(1);
                heroActiveSecDisplay.textContent = formattedName;
            }
        }
    }

    // =========================================================================
    // 4. Smooth Scrolling for Navigation Links & Action Buttons
    // =========================================================================
    const smoothScrollAnchors = document.querySelectorAll('a[href^="#"]');

    smoothScrollAnchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();

                // Close mobile menu drawer if open
                closeMobileMenu();

                // Compute exact offset scroll
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active link immediately for instant feedback
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    });

    // Scroll to Top Button Click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // =========================================================================
    // 5. Responsive Mobile Hamburger Menu
    // =========================================================================
    function toggleMobileMenu() {
        const isOpen = hamburgerBtn.classList.toggle('active');
        navMenuWrapper.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
    }

    function closeMobileMenu() {
        if (hamburgerBtn.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            navMenuWrapper.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    }

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navMenuWrapper.classList.contains('active') &&
            !navMenuWrapper.contains(e.target) &&
            !hamburgerBtn.contains(e.target)
        ) {
            closeMobileMenu();
        }
    });

    // Close on resize if expanded beyond mobile
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            closeMobileMenu();
        }
    });

    // =========================================================================
    // 6. Scroll-Driven Reveal Animations (IntersectionObserver)
    // =========================================================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Unobserve after initial reveal for optimal performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // =========================================================================
    // 7. Interactive Gallery Filtering & Lightbox Modal
    // =========================================================================
    // Filter Items
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            const title = item.getAttribute('data-title') || 'Gallery Preview';
            const desc = item.getAttribute('data-desc') || '';

            lightboxImg.src = img.src;
            lightboxImg.alt = title;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;

            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Lightbox
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    // Escape Key Listener for Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
            closeMobileMenu();
        }
    });

    // =========================================================================
    // 8. Contact Form Client-Side Validation & Feedback
    // =========================================================================
    // Character Counter for Message Textarea
    if (messageInput && charCounter) {
        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;
            charCounter.textContent = `${length} / 500`;

            if (length > 500) {
                charCounter.style.color = 'var(--color-error)';
            } else {
                charCounter.style.color = 'var(--text-muted)';
            }
        });
    }

    // Input Validation Helpers
    const setFieldError = (input, errorSpanId, message) => {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        const errorSpan = document.getElementById(errorSpanId);
        if (errorSpan) errorSpan.textContent = message;
    };

    const clearFieldError = (input, errorSpanId) => {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        const errorSpan = document.getElementById(errorSpanId);
        if (errorSpan) errorSpan.textContent = '';
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    };

    // Live Validation on Blur / Input
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim().length >= 2) {
                clearFieldError(nameInput, 'name-error');
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (isValidEmail(emailInput.value.trim())) {
                clearFieldError(emailInput, 'email-error');
            }
        });
    }

    if (subjectInput) {
        subjectInput.addEventListener('input', () => {
            if (subjectInput.value.trim().length >= 4) {
                clearFieldError(subjectInput, 'subject-error');
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim().length >= 10 && messageInput.value.length <= 500) {
                clearFieldError(messageInput, 'message-error');
            }
        });
    }

    // Form Submit Event Handler
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            formAlert.className = 'form-alert';
            formAlert.textContent = '';

            // Validate Name
            const nameVal = nameInput.value.trim();
            if (!nameVal) {
                setFieldError(nameInput, 'name-error', 'Please enter your name.');
                isValid = false;
            } else if (nameVal.length < 2) {
                setFieldError(nameInput, 'name-error', 'Name must be at least 2 characters.');
                isValid = false;
            } else {
                clearFieldError(nameInput, 'name-error');
            }

            // Validate Email
            const emailVal = emailInput.value.trim();
            if (!emailVal) {
                setFieldError(emailInput, 'email-error', 'Please enter your email address.');
                isValid = false;
            } else if (!isValidEmail(emailVal)) {
                setFieldError(emailInput, 'email-error', 'Please provide a valid email address (e.g., name@domain.com).');
                isValid = false;
            } else {
                clearFieldError(emailInput, 'email-error');
            }

            // Validate Subject
            const subjectVal = subjectInput.value.trim();
            if (!subjectVal) {
                setFieldError(subjectInput, 'subject-error', 'Please provide a subject.');
                isValid = false;
            } else if (subjectVal.length < 4) {
                setFieldError(subjectInput, 'subject-error', 'Subject must be at least 4 characters.');
                isValid = false;
            } else {
                clearFieldError(subjectInput, 'subject-error');
            }

            // Validate Message
            const messageVal = messageInput.value.trim();
            if (!messageVal) {
                setFieldError(messageInput, 'message-error', 'Please write your message.');
                isValid = false;
            } else if (messageVal.length < 10) {
                setFieldError(messageInput, 'message-error', 'Message must be at least 10 characters long.');
                isValid = false;
            } else if (messageVal.length > 500) {
                setFieldError(messageInput, 'message-error', 'Message exceeds 500 characters limit.');
                isValid = false;
            } else {
                clearFieldError(messageInput, 'message-error');
            }

            // If validation fails, focus first invalid input
            if (!isValid) {
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) firstInvalid.focus();
                formAlert.className = 'form-alert error';
                formAlert.textContent = 'Please correct the highlighted fields before submitting.';
                return;
            }

            // Simulated Submission State with Spinner
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // Display personalized success message
                formAlert.className = 'form-alert success';
                formAlert.innerHTML = `<strong>Thank you, ${nameVal}!</strong> Your message regarding "<em>${subjectVal}</em>" has been submitted successfully. Aditya Wadnere will get back to you shortly.`;

                // Reset form fields and validation classes
                contactForm.reset();
                [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
                    inp.classList.remove('is-valid', 'is-invalid');
                });
                if (charCounter) charCounter.textContent = '0 / 500';

                // Scroll alert into view comfortably
                formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });
    }

    // =========================================================================
    // 9. Interactive Project Action Buttons (Demo / Source notifications)
    // =========================================================================
    const demoBtns = document.querySelectorAll('.demo-btn');
    demoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectName = btn.getAttribute('data-project') || 'Project';
            const actionType = btn.textContent.includes('Demo') ? 'live demo' : 'source code repository';
            
            // Temporary button animation feedback
            const originalText = btn.textContent;
            btn.textContent = 'Opening Preview...';
            btn.style.borderColor = 'var(--accent-cyan)';
            btn.style.color = 'var(--accent-cyan)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.borderColor = '';
                btn.style.color = '';
                alert(`[${projectName}] ~ Demonstrating ${actionType}.\n\nThis project is part of Aditya Wadnere's portfolio showcase for the Web Development Assignment.`);
            }, 350);
        });
    });

    // Console Greeting for Reviewers
    console.log(
        '%c ADITYA WADNERE %c Interactive Navigation Menu Website %c Web Dev Assignment 2026 ',
        'background: #7c3aed; color: #fff; padding: 4px 8px; font-weight: bold; border-radius: 4px 0 0 4px;',
        'background: #0f172a; color: #38bdf8; padding: 4px 8px;',
        'background: #10b981; color: #000; padding: 4px 8px; font-weight: bold; border-radius: 0 4px 4px 0;'
    );
});
