import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
     tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
     tailwindcss(),
          svgr({
      svgrOptions: {
        icon: true, 
      },
    }),

  ],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    "store": path.resolve(__dirname, "./store"),
    "hooks": path.resolve(__dirname, "./hooks"),
    },
  },
})
