<script setup lang="ts">
import { ref, computed, watch } from "vue";

// 筛选选项类型定义
export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: "select" | "year" | "tags"; // 筛选类型
  options?: FilterOption[]; // select 类型的选项
  multiple?: boolean; // 是否支持多选（用于 tags）
}

// 筛选值类型
type FilterValue = string | number | undefined;

// Props
const props = defineProps<{
  filters: FilterGroup[]; // 筛选配置
  modelValue?: Record<string, FilterValue>; // v-model 绑定的筛选值
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, FilterValue>): void;
}>();

// 内部状态
const filterValues = ref<Record<string, FilterValue>>(props.modelValue || {});
const expandedGroups = ref<Record<string, boolean>>({});

// 当前年份
const currentYear = new Date().getFullYear();

// 生成年份选项（最近20年）
const yearOptions = computed(() => {
  const years: FilterOption[] = [{ label: "全部", value: "" }];
  for (let i = 0; i <= 20; i++) {
    const year = currentYear - i;
    years.push({ label: `${year}年`, value: year });
  }
  return years;
});

// 切换分组展开状态
const toggleGroup = (key: string) => {
  expandedGroups.value[key] = !expandedGroups.value[key];
};

// 检查分组是否展开
const isGroupExpanded = (key: string) => {
  return expandedGroups.value[key] ?? true; // 默认展开
};

// 更新筛选值
const updateFilter = (key: string, value: FilterValue) => {
  filterValues.value[key] = value;
  emit("update:modelValue", { ...filterValues.value });
};

// 清空所有筛选
const clearFilters = () => {
  filterValues.value = {};
  emit("update:modelValue", {});
};

// 检查是否有激活的筛选
const hasActiveFilters = computed(() => {
  return Object.values(filterValues.value).some(
    (v) => v !== "" && v !== null && v !== undefined
  );
});

// 监听 props.modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      filterValues.value = { ...newVal };
    }
  },
  { deep: true }
);
</script>

<template>
  <div
    class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-lg p-3"
  >
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-2xl font-semibold text-gray-700 uppercase tracking-wide">
        筛选
      </h3>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        清空
      </button>
    </div>

    <!-- 筛选组 -->
    <div class="space-y-3">
      <div
        v-for="group in filters"
        :key="group.key"
        class="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
      >
        <!-- 分组标题 -->
        <button
          @click="toggleGroup(group.key)"
          class="w-full flex items-center justify-between mb-2 text-[11px] font-semibold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide"
        >
          <span>{{ group.label }}</span>
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isGroupExpanded(group.key) }"
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

        <!-- 筛选内容 -->
        <div v-show="isGroupExpanded(group.key)">
          <!-- Select 类型 - 网格按钮布局 -->
          <template v-if="group.type === 'select' && group.options">
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="option in group.options"
                :key="option.value"
                @click="updateFilter(group.key, option.value)"
                :class="[
                  'px-2.5 py-1 text-xs rounded-md border transition-all duration-150',
                  filterValues[group.key] === option.value
                    ? 'bg-blue-600 text-white border-blue-600 font-medium'
                    : 'text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white',
                ]"
              >
                {{ option.label }}
              </button>
            </div>
          </template>

          <!-- Year 类型 -->
          <template v-if="group.type === 'year'">
            <select
              :value="filterValues[group.key] || ''"
              @change="
                updateFilter(
                  group.key,
                  ($event.target as HTMLSelectElement).value
                )
              "
              class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            >
              <option
                v-for="option in yearOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </template>

          <!-- Tags 类型 (可扩展) -->
          <template v-if="group.type === 'tags' && group.options">
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="option in group.options"
                :key="option.value"
                @click="updateFilter(group.key, option.value)"
                :class="[
                  'px-2.5 py-1 text-xs rounded-md border transition-all duration-150',
                  filterValues[group.key] === option.value
                    ? 'bg-blue-600 text-white border-blue-600 font-medium'
                    : 'text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white',
                ]"
              >
                {{ option.label }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
