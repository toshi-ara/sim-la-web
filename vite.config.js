import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'

const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/sim-la-web/';

export default defineConfig({
  base: repoName,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        "name": "Simulator for Local Anesthetic agents",
        "short_name": "SimLA",
        "start_url": repoName,
        "scope": repoName,
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#317EFB",
        "icons": [
          {
            "src": "assets/favicon.ico",
            "sizes": "16x16 32x32 48x48 64x64 128x128 256x256",
            "type": "image/x-icon"
          },
          {
            "src": "icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "assets/back1.png",
            "sizes": "497x301",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "assets/back2.png",
            "sizes": "497x301",
            "type": "image/png",
            "purpose": "any"
          }
        ]
      }
    })
  ],
});
