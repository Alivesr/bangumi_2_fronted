<script setup lang="ts">
import { ref } from "vue";
import type { Subject } from "@/api/models/Subject";
import type { WikiV0 } from "@/api/models/WikiV0";

const props = defineProps<{
  subject?: Subject;
}>();

// 记录每个条目的展开状态
const expandedItems = ref<Record<string, boolean>>({});

const formatInfoboxValue = (value: WikiV0[] | string): string => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        const v = entry?.values ?? "";
        const k = entry?.keys ?? "";
        return k ? `${k}: ${v}` : v;
      })
      .filter(Boolean)
      .join("、");
  }
  return value ?? "";
};

// 判断内容是否过长（超过100个字符）
const isContentLong = (value: WikiV0[] | string): boolean => {
  const formatted = formatInfoboxValue(value);
  return formatted.length > 50;
};

// 切换展开/收起状态
const toggleExpand = (key: string) => {
  expandedItems.value[key] = !expandedItems.value[key];
};

// 检查是否展开
const isExpanded = (key: string): boolean => {
  return expandedItems.value[key] || false;
};
</script>

<template>
  <div class="w-64 flex-shrink-0" style="min-width: 16rem">
    <div class="h-96 rounded-xl overflow-hidden shadow-lg">
      <img
        :src="props.subject?.images.medium"
        alt="subject"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    <!-- 基本信息（放在图片正下方） -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">基本信息</h3>
      <div class="flex flex-col gap-3">
        <div
          v-for="item in props.subject?.infobox"
          :key="item.key"
          class="flex flex-col gap-1 py-2 border-b border-gray-100 last:border-b-0"
        >
          <div class="font-semibold text-gray-700">
            {{ item.key }}
          </div>
          <div class="text-gray-600 text-sm leading-relaxed">
            <!-- 内容区域 -->
            <div
              :class="[
                'transition-all duration-200',
                !isExpanded(item.key) && isContentLong(item.value)
                  ? 'line-clamp-3'
                  : '',
              ]"
            >
              {{ formatInfoboxValue(item.value) }}
            </div>
            <!-- 展开/收起按钮 -->
            <button
              v-if="isContentLong(item.value)"
              @click="toggleExpand(item.key)"
              class="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
            >
              <span>{{ isExpanded(item.key) ? "收起" : "展开" }}</span>
              <svg
                class="w-3 h-3 transition-transform duration-200"
                :class="{ 'rotate-180': isExpanded(item.key) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
