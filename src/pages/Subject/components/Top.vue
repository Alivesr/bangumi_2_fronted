<script setup lang="ts">
import { ref } from "vue";
import type { Subject } from "@/api/models/Subject";

const props = defineProps<{
  subject?: Subject;
}>();

const navigateList = [
  "概览",
  "章节",
  "角色",
  "制作人员",
  "吐槽",
  "关联",
  "讨论",
  "讨论版",
  "透视",
];

const activeTab = ref("概览");

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="w-full bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 标题区域 -->
      <div class="py-6">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <!-- 主标题 -->
          <div class="flex-1 min-w-0">
            <div class="text-5xl font-bold text-gray-900 truncate">
              {{ props.subject?.name_cn || props.subject?.name }}
            </div>
            <p
              v-if="props.subject?.name"
              class="mt-1 text-lg text-gray-500 truncate"
            >
              {{ props.subject.name }}
            </p>
          </div>

          <!-- 操作按钮区域 -->
          <div class="mt-4 sm:mt-0 sm:ml-6 flex space-x-3">
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              收藏
            </button>
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                ></path>
              </svg>
              分享
            </button>
          </div>
        </div>
      </div>

      <!-- 导航栏 -->
      <div class="border-t border-gray-200">
        <nav class="flex space-x-8 overflow-x-auto" aria-label="Tabs">
          <button
            v-for="item in navigateList"
            :key="item"
            @click="setActiveTab(item)"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === item
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ item }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
