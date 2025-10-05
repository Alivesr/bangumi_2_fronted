<script setup lang="ts">
import { computed, watch, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { type SubjectType } from "@/api/models/SubjectType";
import { formatType } from "@/utils/formatType";
import { useSubjectCategories } from "@/composables/useSubjectCategories";
import { usePagination } from "@/composables/usePagination";
import { useSubjectData } from "@/composables/useSubjectData";
import SubjectFilter, {
  type FilterGroup,
} from "@/components/SubjectFilter.vue";
import ViewModeToggle, { type ViewMode } from "@/components/ViewModeToggle.vue";
import SubjectCard from "@/components/SubjectCard.vue";
import SubjectSkeleton from "@/components/SubjectSkeleton.vue";
import Pagination from "@/components/Pagination.vue";

// Props
const props = defineProps<{
  type: SubjectType;
  title?: string;
}>();

const router = useRouter();
const viewMode = ref<ViewMode>("grid");

// 使用 composables
const { subjects, loading, total, filterValues, fetchSubjects } =
  useSubjectData({
    type: props.type,
  });

const {
  currentPage,
  totalPages,
  visiblePages,
  skeletonCount,
  offset,
  goToPage,
  resetToFirstPage,
} = usePagination(total);

const categoryOptions = useSubjectCategories(props.type);

// 计算属性
const pageTitle = computed(() => {
  return props.title || formatType(props.type);
});

const filterConfig = computed<FilterGroup[]>(() => {
  const baseFilters: FilterGroup[] = [
    {
      key: "sort",
      label: "排序方式",
      type: "select",
      options: [
        { label: "默认排序", value: "" },
        { label: "评分最高", value: "rank" },
        { label: "最多收藏", value: "heat" },
        { label: "最新发布", value: "date" },
      ],
    },
  ];

  // 添加分类筛选（仅音乐类型没有分类）
  if (props.type !== 3) {
    baseFilters.push({
      key: "category",
      label: "分类",
      type: "select",
      options: categoryOptions,
    });
  }

  // 添加年份筛选
  baseFilters.push({
    key: "year",
    label: "发布年份",
    type: "year",
  });

  return baseFilters;
});

// 方法
const handlePageChange = (page: number) => {
  if (goToPage(page)) {
    fetchSubjects(offset.value);
  }
};

const handleSubjectClick = (id: number) => {
  router.push(`/subject/${id}`);
};

// 监听器
watch(
  filterValues,
  () => {
    resetToFirstPage();
    fetchSubjects(0);
  },
  { deep: true }
);

// 生命周期
onMounted(() => {
  fetchSubjects(0);
});
</script>

<template>
  <div
    class="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 标题区域 -->
      <div class="mb-5">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
          <div class="flex items-center gap-4">
            <!-- 视图切换按钮 -->
            <ViewModeToggle v-model="viewMode" />
            <!-- 统计信息 -->
            <div v-if="!loading && total > 0" class="text-xs text-gray-500">
              共
              <span class="font-semibold text-gray-700">{{ total }}</span>
              个条目
            </div>
          </div>
        </div>
      </div>

      <!-- 主体区域：左侧筛选 + 右侧内容 -->
      <div class="flex gap-5">
        <!-- 左侧筛选器 -->
        <aside class="w-60 flex-shrink-0 hidden lg:block">
          <div class="sticky top-20">
            <SubjectFilter v-model="filterValues" :filters="filterConfig" />
          </div>
        </aside>

        <!-- 右侧内容区 -->
        <div class="flex-1 min-w-0">
          <!-- 加载状态 -->
          <SubjectSkeleton
            v-if="loading"
            :mode="viewMode"
            :count="skeletonCount"
          />

          <!-- 条目显示 -->
          <div v-else-if="subjects.length > 0">
            <div
              :class="[
                'gap-4',
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                  : 'space-y-3',
              ]"
            >
              <SubjectCard
                v-for="subject in subjects"
                :key="subject.id"
                :subject="subject"
                :mode="viewMode"
                @click="handleSubjectClick"
              />
            </div>

            <!-- 分页组件 -->
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :total="total"
              :visible-pages="visiblePages"
              :loading="loading"
              @page-change="handlePageChange"
            />
          </div>

          <!-- 空状态 -->
          <div
            v-else
            class="bg-white/60 backdrop-blur border border-gray-200/40 rounded-lg p-16 flex flex-col items-center justify-center"
          >
            <div class="text-6xl mb-4">📚</div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">暂无条目</h3>
            <p class="text-sm text-gray-400">该分类下暂时没有内容</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
