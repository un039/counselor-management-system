import { createApp } from 'vue'
import './style.css'
import './assets/main.scss'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './api/mock'
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import {createPinia} from "pinia";

// 移除Pinia持久化插件
const app = createApp(App)
// 全局注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia()
app.use(pinia)

app.use(router) // 使用路由
app.use(ElementPlus,{ locale: zhCn }) // 全局使用组件，中文
app.mount('#app')
