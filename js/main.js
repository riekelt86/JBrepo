// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
	toggle.addEventListener('click', () => {
		const open = nav.classList.toggle('is-open');
		toggle.setAttribute('aria-expanded', open);
	});
}

// Sidebar search (a static site has nothing to search, so Jelbert answers)
document.querySelectorAll('.search-form').forEach((form) => {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const q = form.querySelector('input').value.trim();
		let out = form.parentElement.querySelector('.search-result');
		if (!out) {
			out = document.createElement('p');
			out.className = 'search-result';
			form.after(out);
		}
		out.textContent = q
			? `Geen resultaten voor "${q}". Jelbert kon het ook niet vinden op de kaart.`
			: 'Je moet wel iets intypen. Zelfs Jelbert weet dat.';
	});
});

// Slideshow
const hero = document.querySelector('.hero');
if (hero) {
	const slides = [...hero.querySelectorAll('.slide')];
	const dotsWrap = hero.querySelector('.hero-dots');
	const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
	let current = 0;
	let timer;

	const dots = slides.map((slide, i) => {
		const dot = document.createElement('button');
		dot.type = 'button';
		dot.setAttribute('aria-label', `Ga naar slide ${i + 1}`);
		dot.addEventListener('click', () => { show(i); restart(); });
		dotsWrap.appendChild(dot);
		return dot;
	});

	function show(index) {
		current = (index + slides.length) % slides.length;
		slides.forEach((s, i) => {
			s.classList.toggle('is-active', i === current);
			s.setAttribute('aria-hidden', i !== current);
		});
		dots.forEach((d, i) => d.setAttribute('aria-current', i === current));
	}

	function restart() {
		clearInterval(timer);
		if (!reduceMotion) timer = setInterval(() => show(current + 1), 6000);
	}

	hero.querySelector('.hero-prev').addEventListener('click', () => { show(current - 1); restart(); });
	hero.querySelector('.hero-next').addEventListener('click', () => { show(current + 1); restart(); });
	hero.addEventListener('mouseenter', () => clearInterval(timer));
	hero.addEventListener('mouseleave', restart);
	hero.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') { show(current - 1); restart(); }
		if (e.key === 'ArrowRight') { show(current + 1); restart(); }
	});

	// Swipe on touch screens
	let startX = null;
	hero.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
	hero.addEventListener('touchend', (e) => {
		if (startX === null) return;
		const dx = e.changedTouches[0].clientX - startX;
		if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); restart(); }
		startX = null;
	});

	show(0);
	restart();
}
