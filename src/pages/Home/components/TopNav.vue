<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// 计算当前激活的导航项
const activeNav = computed(() => {
  const path = route.path;
  if (path === "/") return "home";
  if (path.startsWith("/anime")) return "anime";
  if (path.startsWith("/book")) return "book";
  if (path.startsWith("/game")) return "game";
  if (path.startsWith("/music")) return "music";
  if (path.startsWith("/calendar")) return "calendar";
  return "home";
});

// 导航项数据
const navItems = [
  { id: "home", name: "首页", path: "/" },
  { id: "anime", name: "动画", path: "/anime" },
  { id: "book", name: "书籍", path: "/book" },
  { id: "music", name: "音乐", path: "/music" },
  { id: "game", name: "游戏", path: "/game" },
  { id: "calendar", name: "三次元", path: "/calendar" },
];
</script>

<template>
  <!-- 顶部导航栏 - 与页面等宽 -->
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <div
            class="flex items-center cursor-pointer group"
            @click="router.push('/')"
          >
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
            >
              <span class="text-white font-bold text-lg">B</span>
            </div>
            <span
              class="ml-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
            >
              Bangumi
            </span>
          </div>
        </div>

        <!-- 桌面端导航菜单 -->
        <div class="hidden md:flex items-center space-x-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="router.push(item.path)"
            :class="[
              'px-4 py-2 rounded-full transition-all duration-200 font-medium',
              activeNav === item.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
            ]"
          >
            {{ item.name }}
          </button>
        </div>

        <!-- 搜索框 -->
        <div class="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div class="relative w-full">
            <input
              type="text"
              placeholder="搜索番剧、书籍、游戏..."
              class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <button
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 右侧按钮 -->
        <div class="flex items-center space-x-3">
          <button
            @click="router.push('/calendar')"
            :class="[
              'hidden md:flex items-center px-4 py-2 rounded-full transition-all duration-200 font-medium',
              activeNav === 'calendar'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
            ]"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            每日放送
          </button>

          <button
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
          >
            登录
          </button>

          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                :d="
                  isMobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                "
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端导航菜单 -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden border-t border-gray-200 bg-white"
      >
        <div class="max-w-7xl mx-auto px-2 pt-2 pb-3 space-y-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="
              router.push(item.path);
              closeMobileMenu();
            "
            :class="[
              'block w-full text-left px-4 py-3 rounded-full transition-all duration-200 font-medium',
              activeNav === item.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
            ]"
          >
            {{ item.name }}
          </button>
          <div class="pt-2 border-t border-gray-200">
            <button
              @click="
                router.push('/calendar');
                closeMobileMenu();
              "
              :class="[
                'block w-full text-left px-4 py-3 rounded-full transition-all duration-200 font-medium',
                activeNav === 'calendar'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
              ]"
            >
              每日放送
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
