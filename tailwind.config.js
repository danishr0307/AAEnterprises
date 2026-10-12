/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Every colour points at a CSS variable, so the 4 skins (Ivory Gold,
      // Emerald, Rose, Sapphire) switch just by changing <html data-skin="...">
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        gold: 'var(--gold)',
        gold2: 'var(--gold2)',
        line: 'var(--line)',
        petal: 'var(--petal)',
        door1: 'var(--door1)',
        door2: 'var(--door2)',
        onacc: 'var(--onacc)',
        glow: 'var(--glow)',
      },
      fontFamily: {
        display: ['var(--display)'],
        script: ['var(--script)'],
        sans: ['var(--sans)'],
      },
      keyframes: {
        slowspin: { to: { rotate: '360deg' } },
        sealping: {
          from: { transform: 'scale(.9)', opacity: '.9' },
          to: { transform: 'scale(1.55)', opacity: '0' },
        },
        breathe: { '50%': { opacity: '.45' } },
        sunpulse: { '50%': { transform: 'scale(1.18)', opacity: '.7' } },
        cue: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '80%,100%': { opacity: '0', transform: 'translateY(14px)' },
        },
        rise: { from: { opacity: '0', transform: 'translateY(26px)' } },
        flip: {
          '0%': { transform: 'rotateX(90deg)', opacity: '.2' },
          '100%': { transform: 'none', opacity: '1' },
        },
        flick: {
          from: { transform: 'scale(1,1) skewX(-2deg)' },
          to: { transform: 'scale(.92,1.08) skewX(3deg)' },
        },
        kb: { from: { transform: 'scale(1.02)' }, to: { transform: 'scale(1.14)' } },
        pop: { from: { opacity: '0', transform: 'scale(.92) translateY(12px)' } },
        ringp: {
          from: { transform: 'scale(.3)', opacity: '.9' },
          to: { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        slowspin: 'slowspin 140s linear infinite',
        sealping: 'sealping 2.4s ease-out infinite',
        breathe: 'breathe 2.4s ease-in-out infinite',
        sunpulse: 'sunpulse 5s ease-in-out infinite',
        cue: 'cue 1.8s infinite',
        rise: 'rise 1.1s cubic-bezier(.2,.7,.2,1) both',
        flip: 'flip .55s ease',
        flick: 'flick 1.6s ease-in-out infinite alternate',
        kb: 'kb 9s ease-out both',
        pop: 'pop .6s cubic-bezier(.2,.8,.2,1) both',
        ringp: 'ringp 2.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
