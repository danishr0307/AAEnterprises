# Aarohi & Vihaan – Wedding Invitation (React + Tailwind CSS)

## Run it
    npm install
    npm run dev      # http://localhost:5173
    npm run build    # production build in /dist

## Structure
- src/App.jsx – page state, opening gate, scroll effects, wiring
- src/index.css – Tailwind layers, theme tokens (4 skins), reusable classes
- src/lib – i18n.js (EN / हिं / मरा), date.js, utils.js
- src/hooks – useInvitation (state + localStorage), useMusic (Web Audio), useToast
- src/components – Gate, TopBar, Hero, SaveDate (scratch card), Countdown, Story,
  Events, Venue, Gallery, Rsvp, Wishes, Footer, Drawer, Particles, ui
- tailwind.config.js – colours mapped to CSS variables, fonts, keyframes

## Customising
- Default names / date / venue / WhatsApp number: src/hooks/useInvitation.js (DEF)
- Texts in all 3 languages: src/lib/i18n.js
- New skin: add a :root[data-skin='name'] block in src/index.css and an entry in
  SKINS in src/components/Drawer.jsx
