// main.js - Scripts principaux du site

// Variables globales
let currentSlide = 0;
let slideInterval;
let currentTestimonial = 0;
let testimonialInterval;
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.slideshow-indicator');
const heroLoader = document.querySelector('.hero-loader');
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
const header = document.querySelector('header');

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le slideshow principal
    preloadImages().then(initSlideshow).catch(initSlideshow);
    
    // Initialiser les animations au scroll
    initScrollAnimations();
    
    // Initialiser les témoignages
    initTestimonials();
    
    // Créer les effets visuels supplémentaires pour les services
    enhanceServiceSection();
    
    // Ajouter les interactions de service
    initServiceInteractions();
    
    // Initialiser l'animation de compteur pour la section statistiques
    initCounterAnimation();
});

// Effet de scroll pour la navigation
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Vérifier les animations au scroll
    checkIfInView();
});

// Fonction pour masquer le loader et afficher la première slide
function initSlideshow() {
    // Masquer le loader avec transition
    if (heroLoader) {
        heroLoader.style.opacity = '0';
        
        // Une fois la transition terminée, cacher complètement le loader
        setTimeout(() => {
            heroLoader.style.display = 'none';
            
            // S'assurer que la première slide est visible
            slides.forEach((slide, index) => {
                if (index === 0) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Démarrer le slideshow
            slideInterval = setInterval(nextSlide, 7000);
        }, 500);
    }
}

// Préchargement des images des slides
function preloadImages() {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = slides.length * 2; // Bg + logo par slide
        
        // Si pas d'images, résoudre immédiatement
        if (totalImages === 0) {
            resolve();
            return;
        }
        
        // Pour chaque slide, précharger l'image de fond et le logo
        slides.forEach(slide => {
            // Image de fond
            const bgElement = slide.querySelector('.slide-bg');
            if (bgElement) {
                const style = window.getComputedStyle(bgElement);
                const bgImage = style.backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    const url = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                    const img = new Image();
                    img.onload = img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) resolve();
                    };
                    img.src = url;
                } else {
                    loadedCount++;
                }
            }
            
            // Logo
            const logo = slide.querySelector('.slide-logo img');
            if (logo && logo.src) {
                const img = new Image();
                img.onload = img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) resolve();
                };
                img.src = logo.src;
            } else {
                loadedCount++;
            }
        });
        
        // Sécurité: si le chargement prend trop de temps, résoudre quand même
        setTimeout(resolve, 5000);
    });
}

// Afficher une slide spécifique
function showSlide(index) {
    // Masquer toutes les slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Enlever la classe active de tous les indicateurs
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Afficher la slide actuelle et son indicateur
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Passer à la slide suivante
function nextSlide() {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }
    showSlide(nextIndex);
}

// Initialiser les animations au scroll
function initScrollAnimations() {
    // Masquer initialement tous les éléments animés
    animatedElements.forEach(element => {
        element.style.visibility = 'hidden';
    });
    
    // Configurer les clics sur les indicateurs de slides
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            slideInterval = setInterval(nextSlide, 7000);
        });
    });
    
    // Vérifier les éléments visibles au chargement
    checkIfInView();
}

// Vérifier si un élément est visible dans la fenêtre
function checkIfInView() {
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.visibility = 'visible';
        }
    });
    
    // Vérifier si la section de statistiques est visible pour lancer l'animation des compteurs
    checkCounterSection();
}

// Initialiser les témoignages
function initTestimonials() {
    testimonialInterval = setInterval(nextTestimonial, 8000);
    
    // Configurer les clics sur les points de témoignages
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            showTestimonial(index);
            testimonialInterval = setInterval(nextTestimonial, 8000);
        });
    });
    
    // Initialiser le premier témoignage
    showTestimonial(0);
}

// Afficher un témoignage spécifique
function showTestimonial(index) {
    // Masquer tous les témoignages
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Enlever la classe active de tous les points
    testimonialDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Afficher le témoignage actuel et son point
    currentTestimonial = index;
    testimonialSlides[currentTestimonial].classList.add('active');
    testimonialDots[currentTestimonial].classList.add('active');
}

// Passer au témoignage suivant
function nextTestimonial() {
    let nextIndex = currentTestimonial + 1;
    if (nextIndex >= testimonialSlides.length) {
        nextIndex = 0;
    }
    showTestimonial(nextIndex);
}

// Ajouter des effets visuels supplémentaires
function enhanceServiceSection() {
    const servicesSection = document.querySelector('.services');
    if (!servicesSection) return;
    
    // Créer un effet de particules en arrière-plan
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-background');
    servicesSection.appendChild(particlesContainer);
    
    // Ajouter des particules
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Position aléatoire
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Taille aléatoire
        const size = Math.random() * 5 + 1;
        
        // Vitesse aléatoire
        const duration = Math.random() * 20 + 10;
        
        // Appliquer les styles
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialiser les interactions de service
function initServiceInteractions() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Animation au survol
        card.addEventListener('mouseenter', function() {
            // Animation pour l'icône
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = 'pulse 1.5s infinite';
                }, 10);
            }
            
            // Animation pour les fonctionnalités
            const features = this.querySelectorAll('.service-features li');
            features.forEach((feature, index) => {
                feature.style.transition = `transform 0.3s ease ${index * 0.1}s`;
                feature.style.transform = 'translateX(5px)';
            });
        });
        
        // Réinitialiser les animations quand le curseur quitte la carte
        card.addEventListener('mouseleave', function() {
            // Réinitialiser l'animation de l'icône
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.animation = '';
            }
            
            // Réinitialiser la position des fonctionnalités
            const features = this.querySelectorAll('.service-features li');
            features.forEach(feature => {
                feature.style.transform = 'translateX(0)';
            });
        });
        
        // Effet 3D au mouvement de la souris
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculer la rotation en fonction de la position du curseur
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limiter la rotation à max 3 degrés
            const rotateX = ((y - centerY) / centerY) * 3;
            const rotateY = ((centerX - x) / centerX) * 3;
            
            // Appliquer la transformation
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        // Réinitialiser la transformation 3D
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// NOUVELLE FONCTION: Initialiser l'animation de compteur pour les statistiques
function initCounterAnimation() {
    // Sélectionner tous les éléments de chiffres
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Ajouter une classe pour suivre si l'animation a déjà été jouée
    statNumbers.forEach(number => {
        number.setAttribute('data-animated', 'false');
        
        // Stocker la valeur finale dans un attribut data
        const finalValue = number.textContent;
        number.setAttribute('data-final', finalValue);
        
        // Réinitialiser à 0 (on garde le + si présent)
        const hasPlus = finalValue.includes('+');
        const hasSlash = finalValue.includes('/');
        
        // Pour les valeurs avec slash (comme 24/7), on ne les anime pas
        if (!hasSlash) {
            number.textContent = hasPlus ? '0+' : '0';
        }
    });
}

// Fonction pour vérifier si la section de compteurs est visible
function checkCounterSection() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isVisible = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 && 
        rect.bottom >= 0
    );
    
    if (isVisible) {
        animateCounters();
    }
}

// Animation des chiffres version luxe
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.luxury-stat-number');
    
    // Observer d'intersection pour déclencher l'animation quand la section est visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Déclencher l'animation pour tous les numéros une fois visible
                setTimeout(() => {
                    animateLuxuryNumbers();
                }, 300);
                
                // Ne plus observer une fois déclenché
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observer la section de statistiques
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Préparer les chiffres pour l'animation
    statNumbers.forEach(number => {
        // Extraire le texte et les parties (chiffre, plus, slash)
        const numberText = number.textContent;
        
        // Pour les valeurs avec slash comme 24/7
        if (numberText.includes('/')) {
            const parts = numberText.split('/');
            const firstPart = parseInt(parts[0]);
            // Créer les éléments pour l'animation
            number.innerHTML = `0<span class="special-separator">/</span>${parts[1]}`;
            number.setAttribute('data-target', firstPart);
            number.setAttribute('data-type', 'slash');
            number.setAttribute('data-second', parts[1]);
        } 
        // Pour les valeurs avec plus comme 120+
        else if (numberText.includes('+')) {
            const value = parseInt(numberText.replace('+', ''));
            number.innerHTML = `0<span class="plus-sign">+</span>`;
            number.setAttribute('data-target', value);
            number.setAttribute('data-type', 'plus');
        } 
        // Pour les valeurs simples comme 24
        else {
            const value = parseInt(numberText);
            number.textContent = '0';
            number.setAttribute('data-target', value);
            number.setAttribute('data-type', 'simple');
        }
    });
});

// Fonction pour animer les compteurs de luxe
function animateLuxuryNumbers() {
    const statNumbers = document.querySelectorAll('.luxury-stat-number');
    
    statNumbers.forEach((number, index) => {
        // Ajouter un délai entre chaque animation
        setTimeout(() => {
            // Marquer comme animé visuellement
            number.classList.add('animated');
            
            const target = parseInt(number.getAttribute('data-target'));
            const type = number.getAttribute('data-type');
            let startValue = 0;
            
            // Déterminer la vitesse d'animation selon la valeur cible
            const duration = 2000; // 2 secondes
            const frameRate = 30; // 30 FPS
            const totalFrames = duration / (1000 / frameRate);
            const increment = Math.ceil(target / totalFrames);
            
            // Animation du compteur
            const counter = setInterval(() => {
                startValue += increment;
                
                if (startValue >= target) {
                    clearInterval(counter);
                    startValue = target;
                }
                
                // Mettre à jour l'affichage selon le type de nombre
                if (type === 'slash') {
                    const secondPart = number.getAttribute('data-second');
                    number.innerHTML = `${startValue}<span class="special-separator">/</span>${secondPart}`;
                } else if (type === 'plus') {
                    number.innerHTML = `${startValue}<span class="plus-sign">+</span>`;
                } else {
                    number.textContent = startValue;
                }
            }, 1000 / frameRate);
        }, index * 150); // Délai progressif pour chaque chiffre
    });
}

// Initialiser le slideshow
showSlide(0);