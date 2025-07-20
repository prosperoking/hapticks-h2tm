import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default ({mode}) =>{
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [vue()],
    define:{
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false"
    },
    server:{
      watch:{
        usePolling: true,
      },
      proxy:{
        '^/api/*': {
          target:process.env.VITE_DEV_BASE_URL+"api",
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '^/admin/queue/*': {
          target:process.env.VITE_DEV_BASE_URL+"admin",
          rewrite: (path) => path.replace(/^\/admin/, '')
        }
      }
    },
    build:{
      outDir: '../intellifin-rerouting/dist/public'
    }
  })
}
