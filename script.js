'use strict';

// Page navigation
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        const targetPage = this.dataset.navLink;

        // Deactivate all pages and links
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(navLink => navLink.classList.remove('active'));

        // Activate the target page and link
        document.querySelector(`[data-page="${targetPage}"]`).classList.add('active');
        this.classList.add('active');

        window.scrollTo(0, 0);

        // Re-trigger skill animation when the resume page is shown
        if (targetPage === 'resume') {
            animateSkills();
        }
    });
});

// Portfolio filtering
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const projectItems = document.querySelectorAll('[data-filter-item]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const selectedCategory = this.innerText.toLowerCase();

        // Deactivate all filter buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Activate clicked button
        this.classList.add('active');

        // Filter project items
        projectItems.forEach(item => {
            const itemCategory = item.dataset.category.toLowerCase();
            if (selectedCategory === 'all' || itemCategory.includes(selectedCategory)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
});

// Contact form validation
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

formInputs.forEach(input => {
    input.addEventListener('input', function () {
        // Enable or disable the submit button based on form validity
        if (form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else {
            formBtn.setAttribute('disabled', '');
        }
    });
});

// Animated Skills Circle
function animateSkills() {
    const skillContainers = document.querySelectorAll('.skill-circle-container');
    skillContainers.forEach(container => {
        const progressCircle = container.querySelector('.skill-circle-progress');
        const percentageSpan = container.querySelector('.skill-percentage');
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const percent = container.dataset.percent;
        const offset = circumference - (percent / 100) * circumference;

        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        
        // Reset animation before playing
        progressCircle.style.strokeDashoffset = circumference;
        
        // Timeout to allow the browser to apply the reset before starting the animation
        setTimeout(() => {
            progressCircle.style.strokeDashoffset = offset;
        }, 100);

        // Animate the percentage text
        let currentPercent = 0;
        const interval = setInterval(() => {
            if (currentPercent >= percent) {
                clearInterval(interval);
                percentageSpan.textContent = `${percent}%`; // Ensure final value is exact
                return;
            }
            currentPercent++;
            percentageSpan.textContent = `${currentPercent}%`;
        }, 1500 / percent); // Animate text over 1.5 seconds
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // The 'about' page is active by default, so no need to call animateSkills() here.
    // It will be called when the user navigates to the 'resume' page.
});

// Three.js background animation
let scene, camera, renderer, stars;

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        alpha: true // Make canvas transparent
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create star particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 6000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        // Position stars in a sphere-like distribution
        const radius = 300 * Math.random();
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Star material
    let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        transparent: true
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    // Start animation loop
    animate();
}

// Animation loop
function animate() {
    // Rotate stars for a dynamic effect
    stars.rotation.y += 0.0002;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

// Initialize Three.js scene
initThreeJS();
