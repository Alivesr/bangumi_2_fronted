<script setup lang="ts">
import { ref } from "vue";
import type { Subject } from "@/api/models/Subject";
import CollectionView from "./collectionView.vue";

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
            <CollectionView />
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
