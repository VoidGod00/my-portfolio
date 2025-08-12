// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    emailjs.init("3DDXlmpTK1SAiiZ-c");
    // Initialize all functionality
    initMobileNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initActiveNavigation();
    addScrollToTop();
});


//Email button funtion
function sendEmailJS(formData) {
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'), 
        message: formData.get('message'),
        to_email: 'sniyazi102938@outlook.com' // Replace with your email
    };

    return emailjs.send('service_97ml128', 'template_55lnhzq', templateParams);
}

// Mobile Navigation
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Fixed Smooth Scrolling
function initSmoothScrolling() {
    // Handle internal navigation links only
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.hero-cta a[href^="#"]');
    
    const allInternalLinks = [...navLinks, ...heroButtons];
    
    allInternalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Handle external links separately (GitHub links, etc.)
    const externalLinks = document.querySelectorAll('a[href^="http"], a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for external links - let them work normally
            const href = this.getAttribute('href');
            if (href && (href.startsWith('http') || href.startsWith('https'))) {
                // Ensure external links open in new tab
                this.setAttribute('target', '_blank');
                this.setAttribute('rel', 'noopener noreferrer');
            }
        });
    });
}

// Scroll Animations - Updated for new skills structure
function initScrollAnimations() {
    // Intersection Observer for skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 100);
                });
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px'
    });

    skillCategories.forEach(category => {
        const skillItems = category.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
        skillObserver.observe(category);
    });

    // Fade in animations for sections
    const sections = document.querySelectorAll('section:not(.hero)');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        sectionObserver.observe(section);
    });

    // Hero section is always visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }

    // Project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 200);
                
                projectObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-30px'
    });

    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        projectObserver.observe(card);
    });
}

// Active Navigation
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Add CSS for active nav link
    if (!document.querySelector('#active-nav-styles')) {
        const style = document.createElement('style');
        style.id = 'active-nav-styles';
        style.textContent = `
            .nav-link.active {
                color: var(--cyan-accent) !important;
            }
            .nav-link.active::after {
                width: 100% !important;
            }
        `;
        document.head.appendChild(style);
    }

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', debounce(updateActiveNav, 10));
    updateActiveNav(); // Initial call
}

// Contact Form - Updated with EmailJS integration
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();

        // Clear any existing error styling
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });

        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            // Highlight empty fields
            if (!name) document.getElementById('name').style.borderColor = '#ef4444';
            if (!email) document.getElementById('email').style.borderColor = '#ef4444';
            if (!message) document.getElementById('message').style.borderColor = '#ef4444';
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            document.getElementById('email').style.borderColor = '#ef4444';
            return;
        }

        // Get submit button
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Send email using EmailJS
        sendEmailJS(formData)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                showNotification(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
                form.reset();
            })
            .catch(function(error) {
                console.error('Email sending failed:', error);
                showNotification('Oops! Something went wrong. Please try again later or contact me directly.', 'error');
            })
            .finally(function() {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
    });
}
// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not present
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                min-width: 300px;
                padding: 16px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                transform: translateX(110%);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: var(--font-montserrat);
            }
            
            .notification-success {
                background: linear-gradient(135deg, #10b981, #059669);
                border: 1px solid #34d399;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                border: 1px solid #f87171;
            }
            
            .notification-info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                border: 1px solid #60a5fa;
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                line-height: 1.4;
            }
            
            .notification-content i:first-child {
                font-size: 18px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .notification-content span {
                flex: 1;
                font-size: 14px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                flex-shrink: 0;
                transition: background-color 0.2s;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Auto remove after 6 seconds
    const autoRemoveTimeout = setTimeout(() => {
        removeNotification(notification);
    }, 6000);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(autoRemoveTimeout);
        removeNotification(notification);
    });
    
    function removeNotification(notif) {
        notif.classList.remove('show');
        setTimeout(() => {
            if (notif.parentNode) {
                notif.remove();
            }
        }, 400);
    }
}

// Navbar background on scroll
window.addEventListener('scroll', debounce(function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 25, 47, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.borderBottom = '1px solid rgba(100, 255, 218, 0.2)';
    } else {
        navbar.style.background = 'rgba(10, 25, 47, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.borderBottom = '1px solid rgba(100, 255, 218, 0.1)';
    }
}, 10));

// Add scroll to top functionality
function addScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--cyan-accent);
        color: var(--navy-primary);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 15px rgba(100, 255, 218, 0.4);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }, 10));
}

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Contact item hover effects
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Skill category hover effects
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            const skillItems = this.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(5px)';
                }, index * 50);
            });
        });
        
        category.addEventListener('mouseleave', function() {
            const skillItems = this.querySelectorAll('.skill-item');
            skillItems.forEach(item => {
                item.style.transform = 'translateX(0)';
            });
        });
    });
});

// Enhanced typing effect for hero title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--cyan-accent)';
    
    let index = 0;
    function typeChar() {
        if (index < originalText.length) {
            heroTitle.textContent += originalText.charAt(index);
            index++;
            setTimeout(typeChar, 80);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    setTimeout(typeChar, 1000);
}

// Initialize typing effect and hero animations after page load
window.addEventListener('load', function() {
    setTimeout(initTypingEffect, 2000);
    
    // Add initial animations for hero elements with updated selectors
    const heroLeftElements = document.querySelectorAll('.hero-left .profile-image');
    const heroRightElements = document.querySelectorAll('.hero-right .hero-name, .hero-right .hero-tagline, .hero-right .availability-status, .hero-right .hero-cta');
    
    // Animate profile image from left
    heroLeftElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, index * 200 + 300);
    });
    
    // Animate text content from right
    heroRightElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200 + 600);
    });
});

// Utility function for debouncing
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

// Add copy functionality for contact info
document.addEventListener('click', function(e) {
    const emailLink = e.target.closest('a[href^="mailto:"]');
    const phoneLink = e.target.closest('a[href^="tel:"]');
    
    if (emailLink) {
        e.preventDefault();
        const email = emailLink.href.replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            showNotification('Email address copied to clipboard!', 'success');
        }).catch(() => {
            window.location.href = emailLink.href;
        });
    }
    
    if (phoneLink) {
        e.preventDefault();
        const phone = phoneLink.href.replace('tel:', '');
        navigator.clipboard.writeText(phone).then(() => {
            showNotification('Phone number copied to clipboard!', 'success');
        }).catch(() => {
            window.location.href = phoneLink.href;
        });
    }
});

// Performance optimizations
window.addEventListener('load', function() {
    // Preload Font Awesome icons
    const iconPreload = document.createElement('link');
    iconPreload.rel = 'preload';
    iconPreload.as = 'font';
    iconPreload.type = 'font/woff2';
    iconPreload.crossOrigin = 'anonymous';
    document.head.appendChild(iconPreload);
});

// Handle profile image fallback
document.addEventListener('DOMContentLoaded', function() {
    const profilePhoto = document.querySelector('.profile-photo');
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    
    if (profilePhoto) {
        profilePhoto.addEventListener('error', function() {
            this.style.display = 'none';
            if (profilePlaceholder) {
                profilePlaceholder.style.display = 'flex';
            }
        });
        
        profilePhoto.addEventListener('load', function() {
            this.style.display = 'block';
            if (profilePlaceholder) {
                profilePlaceholder.style.display = 'none';
            }
        });
    }
});

// Skill category reveal animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const categoryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate category header first
                const categoryHeader = entry.target.querySelector('.category-header');
                if (categoryHeader) {
                    setTimeout(() => {
                        categoryHeader.style.opacity = '1';
                        categoryHeader.style.transform = 'translateX(0)';
                    }, 200);
                }
                
                categoryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    skillCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        
        const categoryHeader = category.querySelector('.category-header');
        if (categoryHeader) {
            categoryHeader.style.opacity = '0';
            categoryHeader.style.transform = 'translateX(-20px)';
            categoryHeader.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        }
        
        categoryObserver.observe(category);
    });
});