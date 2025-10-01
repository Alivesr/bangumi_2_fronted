import { OpenAPI } from "./core/OpenAPI";
import useAuthStore from "@/stores/auth";

// 配置 OpenAPI 自动携带 token
export function setupApiAuth() {
  // 设置 TOKEN 解析器，每次请求时动态获取 token
  OpenAPI.TOKEN = async () => {
    const authStore = useAuthStore();
    return authStore.token || "";
  };
}

// 初始化 API 认证配置
setupApiAuth();
