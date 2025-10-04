<script setup lang="ts">
import { Service } from "@/api/services/Service";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Subject } from "@/api/models/Subject";
import type { SubjectType } from "@/api/models/SubjectType";
import { formatType } from "@/utils/formatType";

const route = useRoute();
const router = useRouter();
const keyword = ref(route.params.keyword as string);
const searchSubjects = ref<Subject[]>([]);
const loading = ref(false);
const total = ref(0);

// 从路由query中读取type参数
// 0或未传递表示全部(undefined)，否则使用传入的类型，默认为动画(2)
const getInitType = (): SubjectType | undefined => {
  if (!route.query.type) return 2 as SubjectType; // 默认动画
  const typeNum = Number(route.query.type);
  return typeNum === 0 ? undefined : (typeNum as SubjectType);
};
const selectedType = ref<SubjectType | undefined>(getInitType());

// 类型筛选选项
const typeOptions = [
  { value: undefined, label: "全部" },
  { value: 2 as SubjectType, label: "动画" },
  { value: 1 as SubjectType, label: "书籍" },
  { value: 4 as SubjectType, label: "游戏" },
  { value: 3 as SubjectType, label: "音乐" },
  { value: 6 as SubjectType, label: "三次元" },
];

const getSearch = async () => {
  if (!keyword.value?.trim()) {
    searchSubjects.value = [];
    return;
  }

  try {
    loading.value = true;
    const res = await Service.searchSubjects(30, 0, {
      keyword: keyword.value,
      filter: selectedType.value ? { type: [selectedType.value] } : undefined,
    });
    searchSubjects.value = res.data || [];
    total.value = res.total || 0;
  } catch (err) {
    console.error("搜索失败:", err);
    searchSubjects.value = [];
  } finally {
    loading.value = false;
  }
};

// 切换类型筛选
const selectType = (type: SubjectType | undefined) => {
  selectedType.value = type;
  getSearch();
};

// 跳转到条目详情
const goToSubject = (id: number) => {
  router.push(`/subject/${id}`);
};

// 监听路由变化（关键词和类型）
watch(
  [() => route.params.keyword, () => route.query.type],
  ([newKeyword, newType]) => {
    keyword.value = newKeyword as string;
    // 更新选中的类型
    const typeNum = newType ? Number(newType) : 2;
    selectedType.value = typeNum === 0 ? undefined : (typeNum as SubjectType);
    getSearch();
  }
);

onMounted(() => {
  getSearch();
});
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索信息头部 -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">搜索结果</h1>
        <div class="flex items-center gap-2 text-gray-600">
          <span>关键词:</span>
          <span class="font-semibold text-blue-600">{{ keyword }}</span>
          <span v-if="!loading && total > 0" class="text-sm text-gray-500">
            (共找到 {{ total }} 个结果)
          </span>
        </div>
      </div>

      <!-- 主体区域：左侧筛选 + 右侧列表 -->
      <div class="flex gap-6">
        <!-- 左侧类型筛选 -->
        <aside class="w-48 flex-shrink-0">
          <div
            class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-16"
          >
            <h3
              class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              筛选类型
            </h3>
            <div class="space-y-1">
              <button
                v-for="option in typeOptions"
                :key="option.label"
                @click="selectType(option.value)"
                :class="[
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  selectedType === option.value
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent',
                ]"
              >
                <span class="flex-1 text-left">{{ option.label }}</span>
                <span
                  v-if="selectedType === option.value"
                  class="text-blue-600"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </aside>

        <!-- 右侧搜索结果列表 -->
        <div class="flex-1 max-w-4xl">
          <!-- 加载状态 -->
          <div v-if="loading" class="space-y-3">
            <div
              v-for="i in 8"
              :key="i"
              class="bg-white rounded-lg p-5 shadow-sm border border-gray-100 animate-pulse"
            >
              <div class="flex gap-5">
                <div
                  class="w-28 h-40 bg-gray-200 rounded-md flex-shrink-0"
                ></div>
                <div class="flex-1 space-y-3 pt-1">
                  <div class="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                  <div class="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 搜索结果列表 -->
          <div v-else-if="searchSubjects.length > 0" class="space-y-3">
            <div
              v-for="subject in searchSubjects"
              :key="subject.id"
              @click="goToSubject(subject.id)"
              class="group bg-white rounded-lg p-5 shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50/20"
            >
              <div class="flex gap-5">
                <!-- 封面图片 -->
                <div class="flex-shrink-0">
                  <div class="relative overflow-hidden rounded-md shadow-sm">
                    <img
                      :src="subject.images?.large || subject.images?.medium"
                      :alt="subject.name"
                      class="w-28 h-40 object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                <!-- 条目信息 -->
                <div class="flex-1 min-w-0 flex flex-col py-1">
                  <!-- 标题行 -->
                  <div class="flex items-start justify-between gap-3 mb-2">
                    <div class="flex-1 min-w-0">
                      <h3
                        class="text-lg font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors"
                        :title="subject.name_cn || subject.name"
                      >
                        {{ subject.name_cn || subject.name }}
                      </h3>
                      <!-- 原名 -->
                      <p
                        v-if="subject.name_cn && subject.name"
                        class="text-sm text-gray-500 line-clamp-1 mt-1 leading-relaxed"
                        :title="subject.name"
                      >
                        {{ subject.name }}
                      </p>
                    </div>

                    <!-- 类型标签 -->
                    <span
                      class="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full flex-shrink-0"
                    >
                      {{ formatType(subject.type) }}
                    </span>
                  </div>

                  <!-- 评分和统计信息 -->
                  <div class="flex items-center gap-4 mb-2.5">
                    <div
                      v-if="subject.rating?.score"
                      class="flex items-center gap-1.5"
                    >
                      <svg
                        class="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                      <span class="text-base font-semibold text-gray-900">
                        {{ subject.rating.score.toFixed(1) }}
                      </span>
                      <span class="text-sm text-gray-500">
                        ({{ subject.rating.total || 0 }})
                      </span>
                    </div>

                    <!-- 发布日期 -->
                    <div
                      v-if="subject.date"
                      class="flex items-center gap-1 text-sm text-gray-500"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>{{ subject.date }}</span>
                    </div>
                  </div>

                  <!-- 简介摘要 -->
                  <p
                    v-if="subject.summary"
                    class="text-sm text-gray-600 line-clamp-2 leading-relaxed"
                  >
                    {{ subject.summary }}
                  </p>
                  <p v-else class="text-sm text-gray-400 italic">暂无简介</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
            v-else
            class="bg-white rounded-xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center"
          >
            <svg
              class="w-20 h-20 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              没有找到相关结果
            </h3>
            <p class="text-sm text-gray-500">试试其他关键词或筛选条件吧</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
