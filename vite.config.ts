import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./certs/cert.key'), // Path to SSL key
      cert: fs.readFileSync('./certs/cert.crt'), // Path to SSL certificate
    },
    host: '192.168.1.156', // Ensure this matches your server host
    port: 5173, // Common port for Vite with HTTPS
    open: true, // Automatically open the browser
  },
});
