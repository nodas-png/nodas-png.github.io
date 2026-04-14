const portfolioData = {
    aboutMe: "I am a software developer with a strong passion for crafting elegant, efficient, and scalable digital solutions. I enjoy blending technical logic with creative design to build responsive and engaging user experiences.",
    commits: [
        { year: "2025 - 2026", desc: "Through the Panhellenic exams, I placed 22nd among 180 other successful candidates in my department at the National and Kapodistrian University of Athens, where I am currently studying" },
        { year: "2023 - 2024", desc: "Started front-end development on my path to full-stack, and built a website for a villa company in Crete" },
        { year: "2022", desc: "Began launching and maintaining FiveM servers & later focused on freelance script development" },
        { year: "2021", desc: "Launched my first mobile game on the Google Play Store made in Unity" },
        { year: "2020", desc: "Initial commit. Began the journey into software development through developing games in Unity and Unreal Engine, at the age of 13" }
    ]
};

document.getElementById('about-text').innerHTML = portfolioData.aboutMe;
document.getElementById('commit-list').innerHTML = portfolioData.commits.map(commit => `
    <div class="commit-item">
        <div class="commit-icon"><i class="fa-solid fa-code-commit"></i></div>
        <div class="commit-details">
            <div class="commit-year">${commit.year}</div>
            <div class="commit-desc">${commit.desc}</div>
        </div>
    </div>
`).join('');

const canvas = document.getElementById('dots-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let dots = [];

const spacing = 18;
const hoverRadius = 150;
const pullStrength = 0.30;

const mouse = { x: -1000, y: -1000 };

class Dot {
    constructor(x, y) {
        this.baseX = x; 
        this.baseY = y;
        this.x = x;     
        this.y = y;
    }

    update() {
        const dx = mouse.x - this.baseX;
        const dy = mouse.y - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetX = this.baseX;
        let targetY = this.baseY;
        let alpha = 0.35; 

        if (distance < hoverRadius) {
            let linearForce = (hoverRadius - distance) / hoverRadius;
            const force = Math.pow(linearForce, 1.5);
            
            targetX = this.baseX + dx * force * pullStrength;
            targetY = this.baseY + dy * force * pullStrength;
            
            alpha = 0.35 + (force * 1.1);
        }

        this.x += (targetX - this.x) * 0.1;
        this.y += (targetY - this.y) * 0.1;

        ctx.fillStyle = `rgba(118, 118, 118, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    
    dots = [];
    
    for (let x = -spacing; x < width + spacing; x += spacing) {
        for (let y = -spacing; y < height + spacing; y += spacing) {
            dots.push(new Dot(x, y));
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for(let i = 0; i < dots.length; i++) {
        dots[i].update();
    }
    
    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

init();
animate();

document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));

            const targetId = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`.navbar a[data-target="${targetId}"]`);

            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});