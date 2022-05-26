import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default ({mode}) =>{
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [vue()],
    server:{
      proxy:{
        '^/api/*': {
          target:process.env.VITE_DEV_BASE_URL,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build:{
      outDir: '../intellifin-rerouting/dist/public'
    }
  })
}
