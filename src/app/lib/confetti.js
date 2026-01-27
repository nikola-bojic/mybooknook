/**
 * Triggers a circular confetti burst from the given element's center.
 * @param {HTMLElement} el - DOM element to use as origin (e.g. event.currentTarget)
 */
export async function triggerConfettiFromElement(el) {
	if (!el || typeof el.getBoundingClientRect !== 'function') return;
	const rect = el.getBoundingClientRect();
	const x = (rect.left + rect.width / 2) / window.innerWidth;
	const y = (rect.top + rect.height / 2) / window.innerHeight;

	const { default: confetti } = await import('canvas-confetti');

	const opts = {
		particleCount: 42,
		spread: 360,
		angle: 90,
		origin: { x, y },
		startVelocity: 22,
		colors: ['#f8b4d9', '#e879a5', '#c084fc', '#fcd34d', '#fef3c7', '#a78bfa'],
		shapes: ['circle', 'square'],
		ticks: 95,
		gravity: 0.55,
		scalar: 0.82,
		drift: 0,
	};
	confetti(opts);
	setTimeout(() => {
		confetti({ ...opts, particleCount: 22, startVelocity: 18 });
	}, 80);
	setTimeout(() => {
		confetti({ ...opts, particleCount: 12, startVelocity: 14 });
	}, 160);
}
