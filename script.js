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
let width, height, dots = [];
const spacing = 18, hoverRadius = 150, pullStrength = 0.30;
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
        let targetX = this.baseX, targetY = this.baseY, alpha = 0.35;

        if (distance < hoverRadius) {
            const force = Math.pow((hoverRadius - distance) / hoverRadius, 1.5);
            targetX += dx * force * pullStrength;
            targetY += dy * force * pullStrength;
            alpha += force * 1.1;
        }

        this.x += (targetX - this.x) * 0.1;
        this.y += (targetY - this.y) * 0.1;

        ctx.fillStyle = `rgba(118, 118, 118, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initCanvas() {
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

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    dots.forEach(dot => dot.update());
    requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', initCanvas);
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
document.addEventListener('mouseout', () => { mouse.x = -1000; mouse.y = -1000; });

initCanvas();
animateCanvas();

const sections = Array.from(document.querySelectorAll('section'));
const navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById(link.getAttribute('data-target'))?.scrollIntoView({ behavior: 'smooth' });
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`.navbar a[data-target="${entry.target.id}"]`)?.classList.add('active');
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));

let isWheeling = false;
window.addEventListener('wheel', e => {
    e.preventDefault();
    if (isWheeling) return;

    let currentIndex = sections.findIndex(sec => {
        const top = sec.getBoundingClientRect().top;
        return top >= -50 && top <= window.innerHeight / 2;
    });

    if (currentIndex === -1) currentIndex = 0;
    const nextIndex = e.deltaY > 0 ? currentIndex + 1 : currentIndex - 1;

    if (sections[nextIndex]) {
        isWheeling = true;
        sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => isWheeling = false, 800);
    }
}, { passive: false });

const nameElement = document.querySelector('.name-desc');
const targetText = nameElement.textContent;
nameElement.textContent = '';
let charIndex = 0;

function typeWriter() {
    if (charIndex < targetText.length) {
        nameElement.textContent += targetText.charAt(charIndex++);
        setTimeout(typeWriter, 50);
    }
}

setTimeout(typeWriter, 500);