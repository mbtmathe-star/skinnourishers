import { defineConfig } from 'vite';

const sourceTruthOrigin = 'https://www.skinnourishers.online-web.co.za';
const missingCapturedVideos = new Set([
  '/videos/hydra-facial.mp4',
  '/videos/treatment-d2.mp4',
  '/videos/treatment-d3.mp4',
  '/videos/treatment-d4.mp4',
  '/videos/treatment-d5.mp4',
  '/videos/acne-treatment.mp4',
]);

export default defineConfig({
  server: {
    proxy: Object.fromEntries(
      [...missingCapturedVideos].map((path) => [
        path,
        {
          target: sourceTruthOrigin,
          changeOrigin: true,
          secure: true,
        },
      ]),
    ),
  },
});
