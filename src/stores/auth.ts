import { defineStore } from "pinia";
import { ref, computed } from "vue";

const useAuthStore = defineStore("auth", () => {
  const token = ref("");
  const userId = ref<number | null>(null);
  const expiresAt = ref<number>(0);

  // 计算属性：token 是否过期
  const isTokenExpired = computed(() => {
    if (!expiresAt.value) return true;
    return Date.now() >= expiresAt.value;
  });

  // 计算属性：是否已登录（包含过期检查）
  const isLoggedIn = computed(() => {
    return !!token.value && !!userId.value && !isTokenExpired.value;
  });

  // 计算属性：剩余时间（秒）
  const remainingTime = computed(() => {
    if (!expiresAt.value) return 0;
    const remaining = Math.max(0, expiresAt.value - Date.now());
    return Math.floor(remaining / 1000);
  });

  function setToken(newToken: string) {
    token.value = newToken;
  }

  function setUserId(newUserId: number | null) {
    userId.value = newUserId;
  }

  function setExpiresAt(newExpiresAt: number) {
    expiresAt.value = newExpiresAt;
  }

  // 从 localStorage 恢复认证状态
  function restoreAuthState() {
    try {
      const storedToken = localStorage.getItem("bangumi_token");
      if (storedToken) {
        const tokenData = JSON.parse(storedToken);

        // 检查 token 是否过期
        if (Date.now() < tokenData.expires_at) {
          token.value = tokenData.access_token;
          userId.value = tokenData.user_id;
          expiresAt.value = tokenData.expires_at;
          return true;
        } else {
          // token 已过期，清除存储
          clearAuthState();
        }
      }
    } catch (error) {
      console.error("恢复认证状态失败:", error);
      clearAuthState();
    }
    return false;
  }

  // 清除认证状态
  function clearAuthState() {
    token.value = "";
    userId.value = null;
    expiresAt.value = 0;
    localStorage.removeItem("bangumi_token");
  }

  // 登出功能
  function logout() {
    clearAuthState();
    console.log("用户已登出");
  }

  function getUserInfo() {
    return {
      token: token.value,
      userId: userId.value,
      expiresAt: expiresAt.value,
      isLoggedIn: isLoggedIn.value,
      isTokenExpired: isTokenExpired.value,
      remainingTime: remainingTime.value,
    };
  }

  return {
    token,
    userId,
    expiresAt,
    isLoggedIn,
    isTokenExpired,
    remainingTime,
    setToken,
    setUserId,
    setExpiresAt,
    restoreAuthState,
    clearAuthState,
    logout,
    getUserInfo,
  };
});

export default useAuthStore;
