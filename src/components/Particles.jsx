import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { readColors, reduceMotion } from '../lib/utils';

/**
 * Full-screen canvas: ambient falling petals/sparkles + confetti bursts.
 * Call ref.current.burst(x, y, count) to fire confetti.
 */
const Particles = forwardRef(function Particles({ skin }, ref) {
  const canvasRef = useRef(null);
  const col = useRef({ gold: '#c9a24a', gold2: '#f4dc94', petal: '#d98a8a' });
  const api = useRef({});

  useEffect(() => { col.current = readColors(); }, [skin]);
  useImperativeHandle(ref, () => ({ burst: (x, y, n) => api.current.burst && api.current.burst(x, y, n) }), []);

  useEffect(() => {
    const cv = canvasRef.current;
    const cx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, raf;
    const amb = [], conf = [];

    const mk = (init) => {
      const pt = Math.random() < 0.42;
      return {
        x: Math.random() * W, y: init ? Math.random() * H : -20,
        vx: (Math.random() - 0.5) * 0.35, vy: 0.35 + Math.random() * 0.8,
        s: pt ? 5 + Math.random() * 6 : 1 + Math.random() * 1.9,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.035,
        w: Math.random() * 6.28, p: pt, a: 0.3 + Math.random() * 0.5,
      };
    };
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(22, Math.min(58, Math.round(W / 20)));
      while (amb.length < n) amb.push(mk(true));
      amb.length = n;
    };
    api.current.burst = (x, y, n) => {
      const c = col.current;
      const cols = [c.gold, c.gold2, c.petal, '#ffffff'];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.28, v = 3 + Math.random() * 7;
        conf.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3,
          s: 3 + Math.random() * 4, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
          c: cols[i % 4], life: 1, rect: Math.random() < 0.6,
        });
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || (reduceMotion && !conf.length)) return;
      cx.clearRect(0, 0, W, H);
      const c = col.current;
      if (!reduceMotion) {
        amb.forEach((p) => {
          p.w += 0.02; p.x += p.vx + Math.sin(p.w) * 0.35; p.y += p.vy; p.r += p.vr;
          if (p.y > H + 20 || p.x < -30 || p.x > W + 30) Object.assign(p, mk(false));
          cx.save();
          cx.globalAlpha = p.a; cx.translate(p.x, p.y); cx.rotate(p.r);
          if (p.p) {
            cx.fillStyle = c.petal; cx.beginPath(); cx.ellipse(0, 0, p.s, p.s * 0.5, 0, 0, 6.283); cx.fill();
          } else {
            cx.fillStyle = c.gold2; cx.shadowColor = c.gold2; cx.shadowBlur = 8;
            cx.beginPath(); cx.arc(0, 0, p.s, 0, 6.283); cx.fill();
          }
          cx.restore();
        });
      }
      for (let i = conf.length - 1; i >= 0; i--) {
        const p = conf[i];
        p.vy += 0.18; p.vx *= 0.992; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.007;
        if (p.life <= 0 || p.y > H + 30) { conf.splice(i, 1); continue; }
        cx.save();
        cx.globalAlpha = Math.min(1, p.life * 1.6); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
        if (p.rect) cx.fillRect(-p.s, -p.s / 2, p.s * 2, p.s);
        else { cx.beginPath(); cx.arc(0, 0, p.s / 1.5, 0, 6.283); cx.fill(); }
        cx.restore();
      }
    };

    size();
    window.addEventListener('resize', size);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 w-full h-full z-[101] pointer-events-none" />;
});

export default Particles;
