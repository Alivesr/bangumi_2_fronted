<script setup lang="ts">
import type { Subject } from "@/api/models/Subject";
import type { v0_subject_relation } from "@/api/models/v0_subject_relation";
import { Service } from "@/api/services/Service";
import { ref, watch, computed } from "vue";

const props = defineProps<{
  subject?: Subject;
}>();

const relatedSubjects = ref<v0_subject_relation[]>([]);
const loading = ref(false);
const filterRelation = ref<string>("all");
const showFilterDropdown = ref(false);

// 所有唯一的关系类型
const relationTypes = computed(() => {
  const types = new Set(relatedSubjects.value.map((item) => item.relation));
  return Array.from(types);
});

// 筛选后的条目列表
const filteredSubjects = computed(() => {
  if (filterRelation.value === "all") {
    return relatedSubjects.value;
  }
  return relatedSubjects.value.filter(
    (item) => item.relation === filterRelation.value
  );
});

// 显示的条目列表（始终只显示前12个）
const displayedSubjects = computed(() => {
  return filteredSubjects.value.slice(0, 12);
});

// 筛选器选项
const filterOptions = computed(() => {
  return [
    { value: "all", label: "全部" },
    ...relationTypes.value.map((type) => ({ value: type, label: type })),
  ];
});

// 当前选中的筛选器标签
const currentFilterLabel = computed(() => {
  const option = filterOptions.value.find(
    (opt) => opt.value === filterRelation.value
  );
  return option ? option.label : "全部";
});

// 切换下拉菜单
const toggleFilterDropdown = (event: Event) => {
  event.stopPropagation();
  showFilterDropdown.value = !showFilterDropdown.value;
};

// 选择筛选类型
const selectFilterType = (value: string) => {
  filterRelation.value = value;
  showFilterDropdown.value = false;
};

// 关闭下拉菜单
const closeDropdown = () => {
  showFilterDropdown.value = false;
};

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

// 根据关系类型获取标签样式
const getRelationBadgeStyle = (relation: string) => {
  const lowerRelation = relation.toLowerCase();

  if (lowerRelation.includes("续集") || lowerRelation.includes("sequel")) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    };
  } else if (
    lowerRelation.includes("前传") ||
    lowerRelation.includes("prequel")
  ) {
    return {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    };
  } else if (
    lowerRelation.includes("番外") ||
    lowerRelation.includes("side story")
  ) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    };
  } else if (lowerRelation.includes("主篇") || lowerRelation.includes("main")) {
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    };
  } else {
    return {
      bg: "bg-gray-100",
      text: "text-gray-600",
      border: "border-gray-200",
    };
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
  <div class="bg-white rounded-xl p-6 shadow-md mt-4" @click="closeDropdown">
    <!-- 标题区域 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
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
        <!-- 筛选器 -->
        <div class="relative" @click.stop>
          <button
            @click="toggleFilterDropdown"
            class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-transparent rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <span>{{ currentFilterLabel }}</span>
            <svg
              class="w-4 h-4 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': showFilterDropdown }"
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

          <!-- 下拉菜单 -->
          <div
            v-if="showFilterDropdown"
            class="absolute top-full left-0 mt-1 min-w-32 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div class="py-1 max-h-64 overflow-y-auto">
              <button
                v-for="option in filterOptions"
                :key="option.value"
                @click="selectFilterType(option.value)"
                :class="[
                  'w-full text-left px-3 py-2 text-sm transition-colors duration-200 whitespace-nowrap',
                  filterRelation === option.value
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600',
                ]"
              >
                {{ option.label }}
                <span v-if="option.value === 'all'" class="text-gray-400 ml-1">
                  ({{ relatedSubjects.length }})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">
          {{ filteredSubjects.length }} 个关联
        </span>
        <router-link
          v-if="filteredSubjects.length > 12"
          :to="`/subject/${props.subject?.id}/relations`"
          class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          查看全部
        </router-link>
      </div>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      <div
        v-for="i in 12"
        :key="i"
        class="flex gap-3 p-3 rounded-lg bg-gray-50 animate-pulse"
      >
        <div class="w-14 h-14 bg-gray-200 rounded-md flex-shrink-0"></div>
        <div class="flex-1 space-y-2 pt-0.5">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- 关联条目列表 -->
    <div
      v-else-if="relatedSubjects.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      <div
        v-for="item in displayedSubjects"
        :key="item.id"
        class="group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 border border-gray-100 cursor-pointer hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30 bg-white"
      >
        <div class="flex-shrink-0">
          <div class="relative overflow-hidden rounded-md">
            <img
              :src="item.images?.small"
              :alt="item.name"
              class="w-14 h-14 object-cover object-top transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
        <div class="flex flex-col min-w-0 flex-1 pt-0.5">
          <div class="flex items-start gap-2 mb-1">
            <div class="flex-1 min-w-0">
              <h4
                class="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors leading-tight line-clamp-2"
                :title="item.name_cn || item.name"
              >
                {{ item.name_cn || item.name }}
              </h4>
              <p
                v-if="item.name_cn && item.name"
                class="text-xs text-gray-500 mt-0.5 leading-tight line-clamp-1"
                :title="item.name"
              >
                {{ item.name }}
              </p>
            </div>
            <span
              v-if="item.relation"
              :class="[
                'px-2 py-0.5 text-xs font-medium rounded-md flex-shrink-0 border whitespace-nowrap',
                getRelationBadgeStyle(item.relation).bg,
                getRelationBadgeStyle(item.relation).text,
                getRelationBadgeStyle(item.relation).border,
              ]"
            >
              {{ item.relation }}
            </span>
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
