import { createApp } from "vue";
import "./style.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import useAuthStore from "./stores/auth";
import { useTokenRefresh } from "./composables/useTokenRefresh";
import "./api/auth"; // 初始化 API 认证配置

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// 初始化认证状态
const authStore = useAuthStore();
const restored = authStore.restoreAuthState();

// 如果成功恢复认证状态，启动自动刷新
if (restored) {
  const { startAutoRefresh } = useTokenRefresh();
  startAutoRefresh();
}

app.mount("#app");
