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
  <div
    class="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 搜索信息头部 -->
      <div class="mb-5">
        <div class="flex items-end gap-3 mb-2">
          <h1 class="text-2xl font-bold text-gray-900">搜索</h1>
          <span class="text-lg font-medium text-blue-600 pb-0.5">{{
            keyword
          }}</span>
        </div>
        <div v-if="!loading && total > 0" class="text-xs text-gray-500">
          找到
          <span class="font-semibold text-gray-700">{{ total }}</span>
          个相关结果
        </div>
      </div>

      <!-- 主体区域：左侧筛选 + 右侧列表 -->
      <div class="flex gap-4">
        <!-- 左侧类型筛选 -->
        <aside class="w-36 flex-shrink-0">
          <div class="sticky top-16 space-y-1 border-r border-gray-200/60 pr-4">
            <button
              v-for="option in typeOptions"
              :key="option.label"
              @click="selectType(option.value)"
              :class="[
                'w-full text-left px-3 py-2 text-sm font-medium transition-all duration-150 relative',
                selectedType === option.value
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900',
              ]"
            >
              <div
                v-if="selectedType === option.value"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-r"
              ></div>
              {{ option.label }}
            </button>
          </div>
        </aside>

        <!-- 右侧搜索结果列表 -->
        <div class="flex-1">
          <!-- 加载状态 -->
          <div v-if="loading" class="space-y-3">
            <div
              v-for="i in 8"
              :key="i"
              class="bg-white/80 backdrop-blur border border-gray-200/40 border-l-2 border-l-gray-300 p-4 animate-pulse"
            >
              <div class="flex gap-4">
                <div class="w-24 h-32 bg-gray-200 rounded flex-shrink-0"></div>
                <div class="flex-1 space-y-2 pt-0.5">
                  <div class="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-full"></div>
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
              class="group bg-white/80 backdrop-blur border border-gray-200/40 border-l-2 border-l-transparent hover:border-l-blue-500 hover:border-gray-300/60 p-4 cursor-pointer transition-all duration-200 hover:bg-white hover:shadow-sm"
            >
              <div class="flex gap-4">
                <!-- 封面图片 -->
                <div class="flex-shrink-0">
                  <div
                    class="relative overflow-hidden rounded border border-gray-200"
                  >
                    <img
                      :src="subject.images?.large || subject.images?.medium"
                      :alt="subject.name"
                      class="w-24 h-32 object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                <!-- 条目信息 -->
                <div class="flex-1 min-w-0 flex flex-col py-0.5">
                  <!-- 标题行 -->
                  <div class="flex items-start gap-3 mb-1">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-baseline gap-2">
                        <h3
                          class="text-base font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors"
                          :title="subject.name_cn || subject.name"
                        >
                          {{ subject.name_cn || subject.name }}
                        </h3>
                        <!-- 类型标签 -->
                        <span
                          class="text-[10px] font-medium text-gray-400 uppercase tracking-wide flex-shrink-0"
                        >
                          {{ formatType(subject.type) }}
                        </span>
                      </div>
                      <!-- 原名 -->
                      <p
                        v-if="subject.name_cn && subject.name"
                        class="text-xs text-gray-400 line-clamp-1 mt-0.5"
                        :title="subject.name"
                      >
                        {{ subject.name }}
                      </p>
                    </div>
                  </div>

                  <!-- 评分和日期 -->
                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-2"
                  >
                    <div
                      v-if="subject.rating?.score"
                      class="flex items-center gap-1.5"
                    >
                      <span class="text-sm font-bold text-gray-900">{{
                        subject.rating.score.toFixed(1)
                      }}</span>
                      <span class="text-yellow-500">★</span>
                      <span class="text-[10px]"
                        >({{ subject.rating.total }})</span
                      >
                    </div>
                    <span
                      v-if="subject.date"
                      class="text-[10px] text-gray-400"
                      >{{ subject.date }}</span
                    >
                  </div>

                  <!-- 简介摘要 -->
                  <p
                    v-if="subject.summary"
                    class="text-xs text-gray-500 line-clamp-2 leading-relaxed"
                  >
                    {{ subject.summary }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
            v-else
            class="bg-white/60 backdrop-blur border border-gray-200/40 border-l-2 border-l-gray-300 p-16 flex flex-col items-center justify-center"
          >
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">没有找到结果</h3>
            <p class="text-sm text-gray-400">换个关键词试试？</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
