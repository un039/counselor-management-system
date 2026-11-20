import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlusStyle from 'unplugin-element-plus/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 为显式 import 的 ElMessage / ElMessageBox 等自动补齐样式
    ElementPlusStyle({}),
    // 模板中的 el-* 组件与 v-loading 指令按需引入
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'css', directives: true })],
      dts: false
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      // 前端所有 /api 请求转发到后端服务（server 目录，端口 3001）
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      }
    }
  }
})
