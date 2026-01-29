// DOM Elements
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const currentYear = document.getElementById('currentYear');
const heroParticles = document.getElementById('heroParticles');
const body = document.body;

// Typewriter Effect
const typewriterElement = document.getElementById('typewriter');
const texts = [
    'AI Developer',
    'Web Developer', 
    'Problem Solver',
    'Tech Innovator'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
    }

    setTimeout(typeWriter, typingSpeed);
}

// Create Particles Animation
function createParticles() {
    // Remove existing particles
    while (heroParticles.firstChild) {
        heroParticles.removeChild(heroParticles.firstChild);
    }
    
    const particlesCount = 20; // Reduced for better performance
    const particleSize = 3;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties with better distribution
        const size = particleSize;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 5;
        
        // Apply styles with transform for better performance
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--yellow);
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            opacity: ${Math.random() * 0.2 + 0.1};
            will-change: transform, opacity;
            pointer-events: none;
            z-index: 0;
        `;
        
        heroParticles.appendChild(particle);
        
        // Animate with requestAnimationFrame for better performance
        animateParticle(particle, duration, delay);
    }
}

function animateParticle(particle, duration, delay) {
    const startTime = Date.now() + delay * 1000;
    const amplitude = 50;
    
    function update() {
        const currentTime = Date.now();
        const elapsed = (currentTime - startTime) / 1000;
        
        if (elapsed < 0) {
            requestAnimationFrame(update);
            return;
        }
        
        const progress = (elapsed % duration) / duration;
        const angle = progress * Math.PI * 2;
        
        // Circular motion
        const x = Math.cos(angle) * amplitude;
        const y = Math.sin(angle) * amplitude;
        
        // Fade in/out effect
        const opacity = 0.1 + 0.1 * Math.sin(progress * Math.PI);
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = opacity;
        
        requestAnimationFrame(update);
    }
    
    setTimeout(update, delay * 1000);
}

// Ripple Effect for Buttons
function createRipple(event) {
    // Only create ripple for left mouse button clicks
    if (event.button !== 0) return;
    
    const button = event.currentTarget;
    let ripple = button.querySelector('.btn-ripple');
    
    // Create ripple if it doesn't exist
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        button.appendChild(ripple);
    }
    
    // Get button position
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Position and animate ripple
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.animation = 'none';
    
    // Trigger reflow
    void ripple.offsetWidth;
    
    ripple.style.animation = 'ripple 0.6s ease-out forwards';
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple && ripple.parentNode === button) {
            button.removeChild(ripple);
        }
    }, 600);
}

// Remove blue highlight on mobile tap
function removeTapHighlight(event) {
    // Only prevent default for non-form elements
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
        event.preventDefault();
    }
    
    // Blur active element
    if (document.activeElement) {
        setTimeout(() => {
            document.activeElement.blur();
        }, 0);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();
    
    // Start typewriter effect
    setTimeout(typeWriter, 1000);
    
    // Create particles
    createParticles();
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', createRipple);
        button.addEventListener('touchstart', createRipple);
    });
    
    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-mode');
        
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        
        if (isDark) {
            // Switching to light mode
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            // Switching to dark mode
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
        
        // Recreate particles with new theme
        setTimeout(createParticles, 300);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        // Default to dark mode
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('active');
        
        const icon = mobileMenuBtn.querySelector('i');
        if (isExpanded) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeader();
            });
            ticking = true;
        }
        
        // Prevent horizontal scrolling
        if (window.scrollX !== 0) {
            window.scrollTo(0, window.scrollY);
        }
    });
    
    // Copy to clipboard functionality
    document.querySelectorAll('.contact-item.interactive').forEach(item => {
        item.addEventListener('click', () => {
            const text = item.getAttribute('data-copy');
            
            // Show visual feedback
            const icon = item.querySelector('.contact-icon i');
            const originalIcon = icon.className;
            icon.className = 'fas fa-check';
            icon.style.transform = 'scale(1.2)';
            
            // Copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard:', text);
            }).catch(err => {
                console.error('Failed to copy:', err);
            }).finally(() => {
                setTimeout(() => {
                    icon.className = originalIcon;
                    icon.style.transform = 'scale(1)';
                }, 2000);
            });
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#' || targetId === '#0') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
                
                // Calculate position with header offset
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without pushing to history
                history.replaceState(null, null, targetId);
            }
        });
    });
    
    // Remove focus from buttons when clicked (for mobile)
    document.addEventListener('touchstart', removeTapHighlight);
    document.addEventListener('mousedown', (e) => {
        // Prevent text selection on double click
        if (e.detail > 1) {
            e.preventDefault();
        }
        
        // Remove focus after click
        setTimeout(() => {
            if (document.activeElement && 
                (document.activeElement.tagName === 'BUTTON' || 
                 document.activeElement.classList.contains('btn'))) {
                document.activeElement.blur();
            }
        }, 100);
    });
    
    // Ensure page starts from top and stays there
    function ensureTopPosition() {
        if (window.scrollY !== 0) {
            window.scrollTo(0, 0);
        }
        
        // Clear any hash from URL
        if (window.location.hash) {
            history.replaceState(null, null, window.location.pathname + window.location.search);
        }
    }
    
    // Run on load and hash change
    window.addEventListener('load', ensureTopPosition);
    window.addEventListener('hashchange', ensureTopPosition);
    
    // Prevent scroll on page refresh
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('style')?.match(/animation-delay:\s*([\d.]+)s/) || ['', '0'];
                entry.target.style.animationDelay = delay[1] + 's';
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    document.querySelectorAll('.animate-fade-up').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.4s ease';
    }, 100);
    
    // Initialize body opacity
    document.body.style.opacity = '0';
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createParticles(); // Recreate particles on resize
        }, 250);
    });
    
    // Handle system preference changes
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) { // Only if user hasn't set preference
            if (e.matches) {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause heavy animations if needed
    } else {
        // Page is visible again
    }
});