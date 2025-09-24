<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const error = ref("");
const success = ref(false);
const countdown = ref(5);
const errorMessage = ref("");

const handleAuthCallback = () => {
  const isErrorPage = route.path === "/auth/error";
  const urlParams = route.query;

  if (isErrorPage) {
    // 错误页面处理
    const errorMsg = urlParams.error as string;
    if (errorMsg) {
      error.value = errorMsg;
      errorMessage.value = errorMsg;
    } else {
      error.value = "未知错误";
      errorMessage.value = "未知错误";
    }
    loading.value = false;
    return;
  }

  // 成功页面处理 - 提取 token_data
  const tokenDataStr = urlParams.token_data as string;

  if (!tokenDataStr) {
    error.value = "未找到认证数据";
    errorMessage.value = "未找到认证数据";
    loading.value = false;
    return;
  }

  try {
    // 解析 token 数据
    const tokenData = JSON.parse(decodeURIComponent(tokenDataStr));
    console.log("解析的 token 数据:", tokenData);

    // 验证必要字段
    if (
      !tokenData.access_token ||
      !tokenData.user_id ||
      !tokenData.session_id
    ) {
      throw new Error("认证数据不完整");
    }

    // 保存到本地存储
    localStorage.setItem("bangumi_token", JSON.stringify(tokenData));

    // 清除 URL 中的敏感参数
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("token_data");
    window.history.replaceState({}, "", newUrl.toString());

    success.value = true;
    loading.value = false;

    // 开始倒计时
    startCountdown();
  } catch (err) {
    console.error("❌ Token 解析失败:", err);
    error.value = err instanceof Error ? err.message : "Token 解析失败";
    errorMessage.value = err instanceof Error ? err.message : "Token 解析失败";
    loading.value = false;
  }
};

// 倒计时功能
const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.push("/");
    }
  }, 1000);
};

onMounted(() => {
  handleAuthCallback();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div
      class="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4"
    >
      <div class="p-8">
        <div class="flex justify-center mb-6">
          <div
            v-if="loading"
            class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <div
              class="w-8 h-8 border-t-2 border-gray-500 border-solid rounded-full animate-spin"
            ></div>
          </div>
          <div
            v-else-if="success"
            class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div
            v-else-if="error"
            class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>

        <div class="text-center">
          <h2 v-if="loading" class="text-2xl font-bold text-gray-800 mb-2">
            正在处理登录
          </h2>
          <h2 v-else-if="success" class="text-2xl font-bold text-gray-800 mb-2">
            登录成功！
          </h2>
          <h2 v-else-if="error" class="text-2xl font-bold text-gray-800 mb-2">
            登录失败
          </h2>

          <p v-if="loading" class="text-gray-600 mb-6">
            正在验证您的身份，请稍候...
          </p>
          <p v-else-if="success" class="text-gray-600 mb-6">
            您已成功登录Bangumi账户。页面将在
            {{ countdown }} 秒后自动跳转到首页。
          </p>
          <p v-else-if="error" class="text-gray-600 mb-6">
            {{ errorMessage }}
          </p>

          <div v-if="success" class="mb-6">
            <div class="bg-gray-100 rounded-lg p-4">
              <p class="text-sm text-gray-700">
                <span class="font-medium">提示：</span>
                您现在可以访问所有个性化功能，包括收藏、评分和评论。
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <button
              v-if="success || error"
              @click="router.push('/')"
              class="px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
            >
              立即跳转到首页
            </button>
            <button
              v-if="error"
              @click="router.push('/')"
              class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
