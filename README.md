# Expressions FR — PWA (ready to deploy)

## Ce que contient ce projet
- Vite + React + Tailwind (minimal setup)
- App React (src/App.jsx) — quiz d'expressions françaises
- manifest.json + service-worker.js pour transformer en PWA
- Icônes (public/icons) pour l'installation mobile

## Tester en local
1. Installer les dépendances:
   ```bash
   npm install
   ```
2. Lancer le serveur de dev:
   ```bash
   npm run dev
   ```
3. Ouvrir l'URL indiquée (ex: http://localhost:5173)

## Déployer rapidement sur Vercel (2 options)
- Option A (depuis ton terminal — recommandé si tu as Vercel installé):
  ```bash
  npm run build
  npx vercel
  ```
- Option B (depuis l'interface Vercel):
  - Crée un nouveau projet, connecte ton repo GitHub (ou upload du zip), sélectionne le répertoire.
  - Vercel détecte Vite et déploie automatiquement.
  - Une fois déployé, ouvre le lien depuis ton téléphone et choisis "Ajouter à l'écran d'accueil".

## Notes PWA
- Le service worker inclus est basique (cache-first) — suffisant pour un usage hors-ligne léger.
- Pour production, tu peux améliorer la stratégie de cache et ajouter un contrôle de version plus strict.

Bonne installation ! Si tu veux, je peux:
- Générer un README en français plus détaillé.
- Te donner les étapes pour déployer sur Netlify si tu préfères.
- Déployer pour toi si tu me fournis un token (je ne peux pas le faire sans toi).
