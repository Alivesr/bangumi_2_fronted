<script setup lang="ts">
import type { Subject } from "@/api/models/Subject";
import type { v0_subject_relation } from "@/api/models/v0_subject_relation";
import { Service } from "@/api/services/Service";
import { ref, watch } from "vue";

const props = defineProps<{
  subject?: Subject;
}>();

const relatedSubjects = ref<v0_subject_relation[]>([]);
const loading = ref(false);

const getRelatedSubjectsBySubjectId = async () => {
  if (!props.subject?.id) return;

  try {
    loading.value = true;
    const res = await Service.getRelatedSubjectsBySubjectId(props.subject.id);
    relatedSubjects.value = res;
  } catch (err) {
    console.error("获取关联条目失败:", err);
    relatedSubjects.value = [];
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.subject?.id,
  (newId) => {
    if (newId) {
      getRelatedSubjectsBySubjectId();
    }
  },
  { immediate: true }
);
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
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          ></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-800">关联条目</h3>
      </div>
      <span class="text-sm text-gray-500">
        {{ relatedSubjects.length }} 个关联
      </span>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="i in 12"
        :key="i"
        class="flex gap-3 p-3 rounded-lg border border-gray-100 animate-pulse"
      >
        <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- 关联条目列表 -->
    <div
      v-else-if="relatedSubjects.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="item in relatedSubjects.slice(0, 12)"
        :key="item.id"
        class="group flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-all duration-200 border border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-sm bg-white"
      >
        <img
          :src="item.images?.small"
          :alt="item.name"
          class="w-16 h-16 object-cover object-top rounded-md flex-shrink-0"
          loading="lazy"
        />
        <div class="flex flex-col min-w-0 flex-1">
          <div
            class="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors"
            :title="item.name_cn || item.name"
          >
            {{ item.name_cn || item.name }}
          </div>
          <div
            v-if="item.name_cn && item.name"
            class="text-xs text-gray-500 mt-1 truncate"
            :title="item.name"
          >
            {{ item.name }}
          </div>
          <div v-if="item.relation" class="text-xs text-blue-600 mt-1 truncate">
            {{ item.relation }}
          </div>
        </div>
      </div>
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
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        ></path>
      </svg>
      <p class="text-sm">暂无关联条目</p>
    </div>
  </div>
</template>
