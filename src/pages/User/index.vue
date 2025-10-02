<script lang="ts" setup>
import { Service } from "@/api/services/Service";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Collections from "@/pages/User/components/Collections.vue";
import { type User } from "@/api/models/User";

const route = useRoute();
const userId = ref("");
const userInfo = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

userId.value = (route.params.id as string) ?? "";

const getUser = async () => {
  try {
    loading.value = true;
    error.value = null;
    const res = await Service.getMyself();
    userInfo.value = res as User;
    console.log(res);
  } catch (err) {
    error.value = "获取用户信息失败";
    console.error("获取用户信息失败:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getUser();
});
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="max-w-6xl mx-auto px-4 py-6 w-full">
      <div v-if="loading" class="text-center py-16 text-lg">加载中...</div>

      <div v-else-if="error" class="text-center py-16 text-lg text-red-500">
        {{ error }}
      </div>

      <div v-else-if="userInfo" class="bg-white rounded-lg p-6 mb-6">
        <div
          class="flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          <!-- 头像 -->
          <div class="flex justify-center">
            <img
              :src="userInfo.avatar.large"
              alt="用户头像"
              class="w-32 h-32 rounded-xl border-2 border-gray-200 object-cover"
            />
          </div>

          <div class="text-center md:text-left w-full">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ userInfo.nickname }}
            </h1>
            <p class="text-lg text-gray-600 mb-4">@{{ userInfo.username }}</p>

            <div
              v-if="userInfo.sign"
              class="border-t border-gray-200 pt-4 mt-4"
            >
              <p class="font-medium text-gray-800 mb-2">签名:</p>
              <p class="italic text-gray-600">{{ userInfo.sign }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16 text-lg">未找到用户信息</div>

      <!-- 收藏内容 -->
      <div class="bg-white rounded-lg p-6">
        <Collections />
      </div>
    </div>
  </div>
</template>
