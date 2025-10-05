<script setup lang="ts">
import { ref } from "vue";

interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
  visiblePages: (number | string)[];
  loading?: boolean;
}

interface Emits {
  (e: "pageChange", page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();
const jumpPage = ref<number | null>(null);

// 方法
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("pageChange", page);
  }
};

const handleJumpToPage = () => {
  if (
    jumpPage.value &&
    jumpPage.value >= 1 &&
    jumpPage.value <= props.totalPages
  ) {
    handlePageChange(jumpPage.value);
    jumpPage.value = null;
  }
};
</script>

<template>
  <div class="mt-8">
    <!-- 分页导航 -->
    <div class="flex items-center justify-center">
      <nav class="flex items-center space-x-1" aria-label="分页导航">
        <!-- 首页 -->
        <button
          @click="handlePageChange(1)"
          :disabled="currentPage <= 1 || loading"
          class="relative hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white/80 backdrop-blur border border-gray-200/40 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :class="{ 'hover:scale-105': !loading && currentPage > 1 }"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          <span class="sr-only">首页</span>
        </button>

        <!-- 上一页 -->
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage <= 1 || loading"
          class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white/80 backdrop-blur border border-gray-200/40 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :class="{ 'hover:scale-105': !loading && currentPage > 1 }"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span class="sr-only">上一页</span>
        </button>

        <!-- 页码 -->
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            @click="handlePageChange(page as number)"
            :disabled="loading"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200',
              currentPage === page
                ? 'z-10 bg-blue-600 text-white border border-blue-600 shadow-lg'
                : 'text-gray-700 bg-white/80 backdrop-blur border border-gray-200/40 hover:bg-gray-50 hover:scale-105',
            ]"
          >
            {{ page }}
          </button>
          <span
            v-else
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur border border-gray-200/40"
          >
            ...
          </span>
        </template>

        <!-- 快速跳转 -->
        <div class="hidden md:flex items-center mx-2 space-x-1">
          <input
            type="number"
            :min="1"
            :max="totalPages"
            v-model.number="jumpPage"
            @keyup.enter="handleJumpToPage"
            class="w-12 px-1 py-1 text-xs text-center border border-gray-200/40 rounded bg-white/80 backdrop-blur focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            placeholder="页"
          />
          <button
            @click="handleJumpToPage"
            :disabled="
              loading || !jumpPage || jumpPage < 1 || jumpPage > totalPages
            "
            class="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            →
          </button>
        </div>

        <!-- 下一页 -->
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage >= totalPages || loading"
          class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white/80 backdrop-blur border border-gray-200/40 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :class="{
            'hover:scale-105': !loading && currentPage < totalPages,
          }"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span class="sr-only">下一页</span>
        </button>

        <!-- 末页 -->
        <button
          @click="handlePageChange(totalPages)"
          :disabled="currentPage >= totalPages || loading"
          class="relative hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white/80 backdrop-blur border border-gray-200/40 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          :class="{
            'hover:scale-105': !loading && currentPage < totalPages,
          }"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span class="sr-only">末页</span>
        </button>
      </nav>
    </div>
  </div>
</template>
