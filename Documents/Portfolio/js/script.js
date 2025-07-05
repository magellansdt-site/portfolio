document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GESTION DU THÈME SOMBRE/CLAIR ---
    (function manageTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        const body = document.body;
        const iconSun = themeToggle.querySelector('.icon-sun');
        const iconMoon = themeToggle.querySelector('.icon-moon');

        const applyTheme = (theme) => {
            const isDark = theme === 'dark';
            body.classList.toggle('dark-mode', isDark);
            iconSun.style.display = isDark ? 'block' : 'none';
            iconMoon.style.display = isDark ? 'none' : 'block';
        };

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let currentTheme = 'light';
        if (savedTheme) {
            currentTheme = savedTheme;
        } else if (prefersDark) {
            currentTheme = 'dark';
        }
        applyTheme(currentTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            body.classList.add('theme-transition');
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            setTimeout(() => body.classList.remove('theme-transition'), 500);
        });
    })();

    // --- 2. GESTION DU MENU MOBILE (BURGER) ---
    (function manageMobileMenu() {
        const burger = document.querySelector('.burger');
        const navLinks = document.querySelector('.nav-links');
        if (burger && navLinks) {
            burger.addEventListener('click', () => {
                navLinks.classList.toggle('nav-active');
                burger.classList.toggle('toggle');
            });
        }
    })();

   
    // --- 3. ANIMATION D'APPARITION AU DÉFILEMENT ---
    (function animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    })();
    
    // --- 4. FILTRE DYNAMIQUE DES PROJETS (PAGE SERVICES) ---
    (function filterProjects() {
        const filterContainer = document.querySelector('.filter-buttons');
        if (!filterContainer) return;

        const projectCards = document.querySelectorAll('.project-grid .card');
        filterContainer.addEventListener('click', (e) => {
            const targetButton = e.target.closest('button');
            if (!targetButton) return;

            filterContainer.querySelector('.active')?.classList.remove('active');
            targetButton.classList.add('active');

            const filter = targetButton.dataset.filter;
            
            projectCards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                const category = card.dataset.category;
                const matchesFilter = (filter === 'all' || filter === category);

                if (matchesFilter) {
                    card.style.display = 'flex'; // Utiliser flex car les cartes sont en flexbox
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    })();

    // --- 5. GESTION DU FORMULAIRE DE CONTACT FONCTIONNEL ---
    (function handleContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const resultDiv = document.getElementById('form-result');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            resultDiv.innerHTML = "Envoi en cours...";
            resultDiv.style.color = 'var(--text-color)';

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    resultDiv.innerHTML = "Message envoyé avec succès !";
                    resultDiv.style.color = 'var(--secondary-color)';
                } else {
                    resultDiv.innerHTML = jsonResponse.message || "Une erreur s'est produite.";
                    resultDiv.style.color = '#ff4d4d';
                }
            })
            .catch(error => {
                resultDiv.innerHTML = "Une erreur est survenue lors de l'envoi.";
                resultDiv.style.color = '#ff4d4d';
            })
            .then(() => {
                form.reset();
                setTimeout(() => { resultDiv.innerHTML = ''; }, 5000);
            });
        });
    })();

    // --- 6. GESTION DU LIEN ACTIF DANS LA NAVIGATION ---
    (function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const currentPath = window.location.pathname.split('/').pop();
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href').split('/').pop();
            // Gère le cas de la page d'accueil (index.html ou '')
            if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
    })();
});