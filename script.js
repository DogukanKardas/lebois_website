document.addEventListener('DOMContentLoaded', () => {
    // Apply Configuration from Admin
    applyConfig();

    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Toggle Mobile Menu
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close Mobile Menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = 'none'; 
            }
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value,
                status: 'New'
            };

            const submissions = JSON.parse(localStorage.getItem('lebois_submissions') || '[]');
            submissions.push(formData);
            localStorage.setItem('lebois_submissions', JSON.stringify(submissions));

            alert('Request received. Our engineering team will analyze your requirements.');
            contactForm.reset();
        });
    }
});

function applyConfig() {
    const config = JSON.parse(localStorage.getItem('lebois_config'));
    if (!config) return; // Use defaults if no config

    // SEO
    if (config.title) document.title = config.title;

    // Hero Section
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && config.heroTitle) heroTitle.innerHTML = config.heroTitle.replace(/\n/g, '<br>');
    
    const heroDesc = document.getElementById('hero-desc');
    if (heroDesc && config.heroDesc) heroDesc.textContent = config.heroDesc;

    // Contact Info
    const emailEl = document.getElementById('contact-email');
    if (emailEl && config.email) emailEl.textContent = config.email;
    
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl && config.phone) phoneEl.textContent = config.phone;
    
    const addrEl = document.getElementById('contact-address');
    if (addrEl && config.address) addrEl.textContent = config.address;

    // Social Links
    const linkInEl = document.getElementById('social-linkedin');
    if (linkInEl && config.linkedin) linkInEl.href = config.linkedin;
    
    const ghEl = document.getElementById('social-github');
    if (ghEl && config.github) ghEl.href = config.github;

    // Google Analytics Injection
    if (config.ga && !window.gaInjected) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.ga}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', config.ga);
        window.gaInjected = true;
    }

    // Note: Vanta effect toggling is handled inside the specific page scripts
    // or we can attach a global flag to window
    // Default to FALSE if config is missing (based on user request), or use stored value
    if (config) {
        window.leboisVantaEnabled = config.vanta === true;
    } else {
        window.leboisVantaEnabled = false; // Default OFF
    }
}
