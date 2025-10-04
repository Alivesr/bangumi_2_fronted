<script setup lang="ts">
import type { Subject } from "@/api/models/Subject";

const props = defineProps<{
  subject?: Subject;
}>();

// 为标签生成颜色 - 平衡配色方案
const getTagColor = (index: number) => {
  const colors = [
    {
      bg: "bg-blue-50",
      text: "text-blue-700",
      hover: "hover:bg-blue-100",
      border: "border-blue-100",
    },
    {
      bg: "bg-purple-50",
      text: "text-purple-700",
      hover: "hover:bg-purple-100",
      border: "border-purple-100",
    },
    {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      hover: "hover:bg-emerald-100",
      border: "border-emerald-100",
    },
    {
      bg: "bg-amber-50",
      text: "text-amber-700",
      hover: "hover:bg-amber-100",
      border: "border-amber-100",
    },
    {
      bg: "bg-rose-50",
      text: "text-rose-700",
      hover: "hover:bg-rose-100",
      border: "border-rose-100",
    },
    {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      hover: "hover:bg-cyan-100",
      border: "border-cyan-100",
    },
    {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      hover: "hover:bg-indigo-100",
      border: "border-indigo-100",
    },
    {
      bg: "bg-teal-50",
      text: "text-teal-700",
      hover: "hover:bg-teal-100",
      border: "border-teal-100",
    },
  ];
  return colors[index % colors.length];
};
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-4">
    <!-- 标题区域 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          ></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-800">标签</h3>
      </div>
      <span class="text-sm text-gray-500">
        {{ props.subject?.tags?.length || 0 }} 个标签
      </span>
    </div>

    <!-- 标签内容 -->
    <div
      v-if="props.subject?.tags && props.subject.tags.length > 0"
      class="flex flex-wrap gap-2"
    >
      <button
        v-for="(tag, index) in props.subject.tags"
        :key="tag.name"
        :class="[
          'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer',
          'hover:shadow-md hover:scale-105 active:scale-95',
          getTagColor(index).bg,
          getTagColor(index).text,
          getTagColor(index).hover,
          getTagColor(index).border,
        ]"
        @click="() => {}"
      >
        <span class="mr-1.5">#</span>
        <span>{{ tag.name }}</span>
        <span v-if="tag.count" class="ml-1.5 text-xs opacity-75">
          {{ tag.count }}
        </span>
      </button>
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-8 text-gray-400"
    >
      <svg
        class="w-12 h-12 mb-2 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        ></path>
      </svg>
      <p class="text-sm">暂无标签</p>
    </div>
  </div>
</template>
