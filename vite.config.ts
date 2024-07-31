import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: '192.168.1.156', // Specify the IP address to bind to
  //   port: 8080, // 
  //   open: true, // Automatically open the browser (optional)
  // },
});
