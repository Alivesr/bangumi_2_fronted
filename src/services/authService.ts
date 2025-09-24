// 认证服务 - 处理与后端的认证交互
class AuthService {
  private baseURL = "/api";

  // 刷新 token
  async refreshToken(sessionId: string) {
    try {
      const response = await fetch(`${this.baseURL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error("刷新 token 失败");
      }

      return await response.json();
    } catch (error) {
      console.error("Token 刷新失败:", error);
      throw error;
    }
  }

  // 登出（调用后端接口）
  async logout(sessionId: string) {
    try {
      await fetch(`${this.baseURL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
    } catch (error) {
      console.error("登出失败:", error);
    }
  }
}

export const authService = new AuthService();
