<script setup lang="ts">
import { ref } from "vue";
import type { Subject } from "@/api/models/Subject";

const props = defineProps<{
  subject?: Subject;
}>();

const isExpanded = ref(false);
const maxLength = 300;

const needsExpansion = () => {
  return (props.subject?.summary?.length || 0) > maxLength;
};

const displayedSummary = () => {
  if (!props.subject?.summary) return "暂无简介";
  if (isExpanded.value || !needsExpansion()) {
    return props.subject.summary;
  }
  return props.subject.summary.slice(0, maxLength) + "...";
};

const toggleExpansion = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="bg-white/80 backdrop-blur border border-gray-200/40 p-6">
    <!-- 标题区域 -->
    <div class="flex items-center mb-4">
      <svg
        class="w-5 h-5 text-gray-600 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-800">简介</h3>
    </div>

    <!-- 简介内容 -->
    <div class="relative">
      <div
        v-if="props.subject?.summary"
        class="text-gray-700 leading-relaxed whitespace-pre-line text-base"
        :class="{ 'line-clamp-6': !isExpanded && needsExpansion() }"
      >
        {{ displayedSummary() }}
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-12 text-gray-400"
      >
        <svg
          class="w-16 h-16 mb-3 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <p class="text-sm">暂无简介信息</p>
      </div>

      <!-- 展开/收起按钮 -->
      <div v-if="needsExpansion()" class="mt-4 flex justify-center">
        <button
          @click="toggleExpansion"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        >
          <span>{{ isExpanded ? "收起" : "展开全部" }}</span>
          <svg
            class="w-4 h-4 ml-1 transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
