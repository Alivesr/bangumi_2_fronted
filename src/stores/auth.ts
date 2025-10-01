import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type User } from "@/api/models/User";

const useAuthStore = defineStore("auth", () => {
  const token = ref("");
  const userId = ref<number | null>(null);
  const expiresAt = ref<number>(0);
  const userInfo = ref<User | null>(null); // 存储完整的用户详细信息

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
  function setUserInfo(newUserInfo: User) {
    userInfo.value = newUserInfo;
    // 同时更新本地存储
    try {
      const storedToken = localStorage.getItem("bangumi_token");
      if (storedToken) {
        const tokenData = JSON.parse(storedToken);
        tokenData.user_info = newUserInfo;
        localStorage.setItem("bangumi_token", JSON.stringify(tokenData));
      }
    } catch (error) {
      console.error("保存用户信息到本地存储失败:", error);
    }
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

          // 恢复用户详细信息
          if (tokenData.user_info) {
            userInfo.value = tokenData.user_info;
          }

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
    userInfo.value = null; // 清除用户详细信息
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
      userInfo: userInfo.value,
      expiresAt: expiresAt.value,
      isLoggedIn: isLoggedIn.value,
      isTokenExpired: isTokenExpired.value,
      remainingTime: remainingTime.value,
    };
  }

  // 获取用户详细信息（如果不存在则从 API 获取）
  async function fetchUserInfoIfNeeded() {
    if (!userInfo.value && token.value) {
      try {
        const { Service } = await import("@/api/services/Service");
        const userData = await Service.getMyself();
        setUserInfo(userData as User);
        return userData;
      } catch (error) {
        console.error("获取用户信息失败:", error);
        return null;
      }
    }
    return userInfo.value;
  }

  return {
    token,
    userId,
    userInfo,
    expiresAt,
    isLoggedIn,
    isTokenExpired,
    remainingTime,
    setToken,
    setUserId,
    setExpiresAt,
    setUserInfo,
    restoreAuthState,
    clearAuthState,
    logout,
    getUserInfo,
    fetchUserInfoIfNeeded,
  };
});

export default useAuthStore;
