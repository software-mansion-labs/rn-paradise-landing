// @ts-check
import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },

  site: "https://paradise.swmansion.com",
  base: "/",
  env: {
    schema: {
      PUBLIC_RECAPTCHA_SITE_KEY: envField.string({
        access: "public",
        context: "server",
      }),
    },
  },
  experimental: {
    fonts: [
      {
        cssVariable: "--font-aeonik",
        name: "Aeonik",
        provider: "local",
        variants: [
          {
            src: ["./public/fonts/aeonik/aeonik-light.otf"],
            style: "normal",
            weight: 300,
          },
          {
            src: ["./public/fonts/aeonik/aeonik-regular.otf"],
            style: "normal",
            weight: 400,
          },
          {
            src: ["./public/fonts/aeonik/aeonik-medium.otf"],
            style: "normal",
            weight: 500,
          },
        ],
      },
      {
        cssVariable: "--font-cookie",
        name: "Cookie",
        provider: "local",
        variants: [
          {
            src: ["./public/fonts/cookie/cookie-regular.ttf"],
            style: "normal",
            weight: 400,
          },
        ],
      },
    ],
  },
});
