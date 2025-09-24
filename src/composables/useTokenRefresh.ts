// Token 自动刷新 composable
import { ref, onUnmounted } from "vue";
import useAuthStore from "@/stores/auth";
import { authService } from "@/services/authService";

export function useTokenRefresh() {
  const authStore = useAuthStore();
  const refreshInterval = ref<NodeJS.Timeout | null>(null);

  // 手动刷新 token
  const refreshToken = async () => {
    try {
      const storedToken = localStorage.getItem("bangumi_token");
      if (!storedToken) {
        throw new Error("没有找到存储的 token");
      }

      const tokenData = JSON.parse(storedToken);
      if (!tokenData.session_id) {
        throw new Error("没有找到 session_id");
      }

      const newTokenData = await authService.refreshToken(tokenData.session_id);

      // 更新 store
      authStore.setToken(newTokenData.access_token);
      authStore.setExpiresAt(newTokenData.expires_at);

      // 更新 localStorage
      const updatedTokenData = {
        ...tokenData,
        access_token: newTokenData.access_token,
        expires_at: newTokenData.expires_at,
      };
      localStorage.setItem("bangumi_token", JSON.stringify(updatedTokenData));

      console.log("Token 刷新成功");
      return true;
    } catch (error) {
      console.error("Token 刷新失败:", error);
      authStore.clearAuthState();
      return false;
    }
  };

  // 启动自动刷新
  const startAutoRefresh = () => {
    if (!authStore.isLoggedIn) return;

    refreshInterval.value = setInterval(() => {
      if (!authStore.isLoggedIn) {
        stopAutoRefresh();
        return;
      }

      // 如果剩余时间少于 5 分钟，自动刷新
      if (authStore.remainingTime < 300) {
        refreshToken();
      }
    }, 60000); // 每分钟检查一次
  };

  // 停止自动刷新
  const stopAutoRefresh = () => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value);
      refreshInterval.value = null;
    }
  };

  // 组件卸载时清理
  onUnmounted(() => {
    stopAutoRefresh();
  });

  return {
    refreshToken,
    startAutoRefresh,
    stopAutoRefresh,
  };
}
