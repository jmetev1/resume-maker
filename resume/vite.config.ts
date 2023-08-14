import { defineConfig } from 'vite'
// import eslint from 'vite-plugin-eslint';

export default defineConfig({
  define: {
    global: {},
  },
  // plugins: [
  // react(),
  // eslint()],
  server: {
    port: 3001,
    // open: '/pastvisits',
    proxy: {
      // // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      // '/foo': 'http://localhost:4567',
      // // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      // '/api': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
      // // with RegEx: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      // '^/fallback/.*': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/fallback/, ''),
      // },
      // // Using the proxy instance
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/reload': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
      },
    },
  },
})
