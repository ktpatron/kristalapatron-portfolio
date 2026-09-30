// --- 1. SANITY API INTEGRATION ---
const PROJECT_ID = 'mpx1virh'; 
const DATASET = 'production';

async function fetchSanityData() {
    // Updated query to sort projects dynamically based on the specific 'order' field in Sanity
    const queries = {
        projects: `*[_type == "project"] | order(order asc) {
            ...,
            "img1": image1.asset->url,
            "img2": image2.asset->url,
            "img3": image3.asset->url,
            "img4": image4.asset->url
        }`,
        experiences: '*[_type == "experience"] | order(order asc)',
        tools: '*[_type == "tool"]',
        certificates: '*[_type == "certificate"] | order(order asc)'
    };

    try {
        const [projRes, expRes, toolRes, certRes] = await Promise.all([
            fetch(`https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${encodeURIComponent(queries.projects)}`),
            fetch(`https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${encodeURIComponent(queries.experiences)}`),
            fetch(`https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${encodeURIComponent(queries.tools)}`),
            fetch(`https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${encodeURIComponent(queries.certificates)}`)
        ]);

        const projects = await projRes.json();
        const experiences = await expRes.json();
        const tools = await toolRes.json();
        const certificates = await certRes.json();

        if (projects.result && projects.result.length > 0) renderProjects(projects.result);
        if (experiences.result && experiences.result.length > 0) renderExperiences(experiences.result);
        if (tools.result && tools.result.length > 0) renderTools(tools.result);
        if (certificates.result && certificates.result.length > 0) renderCertificates(certificates.result);
        
        // Initialize dynamic interactions
        initHoverEffects();
        initProjectFilters();
        initGraphicCarousels(); // For the 3D Cover Flow Carousel
        
    } catch (error) {
        console.error("Sanity fetch error:", error);
    }
}

// --- Render Functions ---
function renderProjects(data) {
    const container = document.querySelector('.projects-list');
    if (!container) return;
    container.innerHTML = ''; 
    
    const ph = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop';

    data.forEach(proj => {
        // Filter out empty image slots to support dynamic image counts
        const availableImages = [proj.img1, proj.img2, proj.img3, proj.img4].filter(img => img != null);
        if (availableImages.length === 0) availableImages.push(ph);

        let projectContentHTML = '';

        // IF GRAPHIC DESIGN: 3D Carousel Format
        if (proj.category === 'graphic-design') {
            let carouselItems = availableImages.map((imgUrl, index) => `
                <div class="carousel-card" data-index="${index}" style="background-image: url('${imgUrl}')">
                    <div class="card-arrow">→</div> 
                </div>
            `).join('');

            projectContentHTML = `
                <div class="graphic-header">
                    <h3>${proj.title}</h3>
                    <p>${proj.subtitle || proj.tags}</p>
                </div>
                <div class="graphic-carousel-container">
                    <div class="graphic-carousel hover-target">
                        ${carouselItems}
                    </div>
                </div>
            `;
        } 
        // IF OTHER CATEGORY: Dynamic Flex Accordion Format
        else {
            let accordionItemsHTML = availableImages.map((imgUrl, index) => `
                <div class="accordion-item" style="background-image: url('${imgUrl}')">
                    <div class="acc-overlay">
                        <div class="gallery-num">${index + 1}</div>
                        <div class="gallery-info">
                            <h3>${proj.title}</h3>
                            <p>${proj.subtitle || proj.tags}</p>
                        </div>
                    </div>
                </div>
            `).join('');

            projectContentHTML = `
                <div class="project-accordion">
                    ${accordionItemsHTML}
                </div>
            `;
        }

        container.innerHTML += `
            <article class="project-item reveal-up hover-target" data-category="${proj.category}">
                ${projectContentHTML}
                <div class="project-meta-bottom">
                    <span class="tags">${proj.tags}</span>
                    <a href="${proj.link || '#'}" class="read-more" target="_blank">READ MORE ↗</a>
                </div>
            </article>
        `;
    });
}

function renderExperiences(data) {
    const container = document.querySelector('.timeline');
    if (!container) return;
    container.innerHTML = '';
    
    data.forEach(exp => {
        // Format description arrays as bullet points
        let descHTML = '';
        if (Array.isArray(exp.description)) {
            const bullets = exp.description.map(item => `<li>${item}</li>`).join('');
            descHTML = `<ul class="timeline-bullets">${bullets}</ul>`;
        } else {
            descHTML = `<p>${exp.description || ''}</p>`;
        }

        container.innerHTML += `
            <div class="timeline-item hover-target">
                <div class="timeline-date">${exp.dateRange}</div>
                <div class="timeline-content">
                    <h3>${exp.role}</h3>
                    <h4>${exp.company}</h4>
                    ${descHTML}
                </div>
            </div>
        `;
    });
}

function renderTools(data) {
    const contents = document.querySelectorAll('.tape-content');
    if (!contents) return;
    const toolString = data.map(t => `<span>${t.name}</span>`).join(' • ');
    contents.forEach(tape => {
        tape.innerHTML = toolString + ' • ' + toolString; 
    });
}

function renderCertificates(data) {
    const container = document.getElementById('cert-container');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(cert => {
        container.innerHTML += `
            <div class="cert-item hover-target">
                <div class="cert-year">${cert.year}</div>
                <div class="cert-details">
                    <h3>${cert.title}</h3>
                    <p>${cert.issuer}</p>
                </div>
                <a href="${cert.link || '#'}" class="cert-link" target="_blank">VIEW ↗</a>
            </div>
        `;
    });
}

// --- 2. INTERACTIVE EFFECTS ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    if(cursorDot) {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    }
    if(cursorGlow) {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    }
});

function initHoverEffects() {
    const hoverTargets = document.querySelectorAll('.hover-target, a, button, .cert-item, .accordion-item, .graphic-carousel');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            if(cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
            if(cursorGlow) {
                cursorGlow.style.transform = 'translate(-50%, -50%) scale(2)';
                cursorGlow.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
        target.addEventListener('mouseleave', () => {
            if(cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            if(cursorGlow) {
                cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorGlow.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

document.addEventListener('mousedown', () => { if(cursorGlow) cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.8)'; });
document.addEventListener('mouseup', () => { if(cursorGlow) cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)'; });

// --- 3. SCROLL REVEAL & VIDEO ---
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

function observeReveals() {
    document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));
}

const bgVideo = document.getElementById('bg-video');
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (bgVideo && bgVideo.paused) bgVideo.play();
    window.clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { if(bgVideo) bgVideo.pause() }, 150);
});

// --- 4. MODAL & FILTERS ---
function initModal() {
    const modal = document.getElementById('contactModal');
    const triggerBtns = document.querySelectorAll('.trigger-modal');
    const closeBtn = document.querySelector('.close-modal');
    const overlay = document.querySelector('.modal-overlay');

    if(!modal) return;

    const openModal = (e) => { e.preventDefault(); modal.classList.add('active'); if(cursorGlow) cursorGlow.style.opacity = '0'; }
    const closeModal = () => { modal.classList.remove('active'); if(cursorGlow) cursorGlow.style.opacity = '1'; }

    triggerBtns.forEach(btn => btn.addEventListener('click', openModal));
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(overlay) overlay.addEventListener('click', closeModal);
}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hidden-project');
                } else {
                    item.classList.add('hidden-project');
                }
            });
        });
    });
}

// --- 5. 3D CAROUSEL PARA SA GRAPHIC DESIGN ---
function initGraphicCarousels() {
    const carousels = document.querySelectorAll('.graphic-carousel');
    
    carousels.forEach(carousel => {
        const cards = Array.from(carousel.querySelectorAll('.carousel-card'));
        if (cards.length === 0) return;

        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next', 'hidden');
                
                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('prev');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('next');
                } else {
                    card.classList.add('hidden'); 
                }
            });
        }

        updateCarousel();

        // Rotate on click
        carousel.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });
    });
}

// --- 6. CONTACT FORM SUBMISSION (GOOGLE APPS SCRIPT) ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    const result = document.getElementById('form-result'); 

    if (!form) return;

    // INSERT YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyQHs7wi03ZVHulKDauc-4vEJ25OmFLO9Qf8cBTgmoiWrkL8lwIOwn74wP8_uwDyg8/exec';

 form.addEventListener('submit', e => {
        e.preventDefault();
        
        result.style.display = 'block';
        result.style.color = 'var(--text-muted)';
        result.innerHTML = 'Sending message...';

        fetch(scriptURL, { 
            method: 'POST', 
            mode: 'no-cors', // Eto yung magic word para hindi ma-block ng browser!
            body: new FormData(form) 
        })
        .then(() => {
            // Dahil naka 'no-cors', hindi natin mababasa ang exact response, pero matik success ito kapag nag-push through
            result.style.color = '#4CAF50'; 
            result.innerHTML = 'Message sent successfully!';
            form.reset(); 
        })
        .catch(error => {
            console.error('Error!', error);
            result.style.color = '#F44336'; 
            result.innerHTML = 'Something went wrong. Please try again.';
        })
        .finally(() => {
            setTimeout(() => {
                result.style.display = 'none';
            }, 5000);
        });
    });
}

// --- INITIALIZE EVERYTHING ---
document.addEventListener('DOMContentLoaded', () => {
    initHoverEffects();
    initModal();
    initProjectFilters();
    observeReveals();
    fetchSanityData(); 
    initContactForm();
});