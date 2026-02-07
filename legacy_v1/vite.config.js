import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                about: 'about.html',
                shipping: 'shipping.html',
                order: 'order.html'
            }
        }
    }
})
