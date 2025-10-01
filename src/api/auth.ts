import { OpenAPI } from "./core/OpenAPI";
import useAuthStore from "@/stores/auth";

// 配置 OpenAPI 自动携带 token
export function setupApiAuth() {
  // 设置 TOKEN 解析器，每次请求时动态获取 token
  OpenAPI.TOKEN = async (options) => {
    const authStore = useAuthStore();

    // 检查是否需要认证的请求
    // 某些公开接口可能不需要 token
    const needsAuth =
      options?.url?.includes("/me") ||
      options?.url?.includes("/collection") ||
      options?.method === "POST" ||
      options?.method === "PUT" ||
      options?.method === "DELETE";

    if (needsAuth && authStore.token) {
      return authStore.token;
    }

    return ""; // 返回空字符串，不添加 Authorization 头
  };
}

// 初始化 API 认证配置
setupApiAuth();
