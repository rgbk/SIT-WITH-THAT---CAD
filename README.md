<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15y4B2tJj3YENwAgI9GmDNf6rHgZcggJz

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Pages

Node.js 22: run `npm ci`, then `npm run build`. Preview with `npm run preview`.
The deploy workflow publishes only `dist/` on pushes to `main`.
Pages source must be GitHub Actions. The Vite base is `/SIT-WITH-THAT---CAD/`.

## Foil preview

The initial view shows the closed printed front. Front view resets the camera;
Foil detail brings the type closer. Deboss impression controls a recessed bump
map on the paper surface (a visual approximation, not die-cut geometry).
Foil reflectance, roughness and impression use the same live text mask.
Rectangular studio lights create reflections that change as the cover rotates.
