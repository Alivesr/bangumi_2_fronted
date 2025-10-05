<script setup lang="ts">
import { Service } from "@/api/services/Service";
import { type Subject } from "@/api/models/Subject";
import { type SubjectType } from "@/api/models/SubjectType";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { formatType } from "@/utils/formatType";

// Props
const props = defineProps<{
  type: SubjectType; // 1:书籍 2:动画 3:音乐 4:游戏 6:三次元
  title?: string; // 自定义标题，不传则使用默认
}>();

const router = useRouter();
const subjects = ref<Subject[]>([]);
const loading = ref(false);
const total = ref(0);
const limit = 24;
const offset = ref(0);
const hasMore = ref(true);

// 获取默认标题
const pageTitle = computed(() => {
  if (props.title) return props.title;
  return formatType(props.type);
});

// 获取条目列表
const getTypeSubjects = async (isLoadMore = false) => {
  if (loading.value) return;

  try {
    loading.value = true;
    const res = await Service.getSubjects(
      props.type,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      limit,
      offset.value
    );

    if (isLoadMore) {
      subjects.value = [...subjects.value, ...(res.data || [])];
    } else {
      subjects.value = res.data || [];
    }

    total.value = res.total || 0;
    hasMore.value = subjects.value.length < total.value;
  } catch (err) {
    console.error("获取条目列表失败:", err);
    subjects.value = [];
  } finally {
    loading.value = false;
  }
};

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return;
  offset.value += limit;
  getTypeSubjects(true);
};

// 跳转到详情页
const goToSubject = (id: number) => {
  router.push(`/subject/${id}`);
};

onMounted(() => {
  getTypeSubjects();
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
          <div v-if="!loading && total > 0" class="text-xs text-gray-500">
            共
            <span class="font-semibold text-gray-700">{{ total }}</span> 个条目
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div
        v-if="loading && subjects.length === 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <div
          v-for="i in 12"
          :key="i"
          class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-lg overflow-hidden animate-pulse"
        >
          <div class="aspect-[3/4] bg-gray-200"></div>
          <div class="p-3 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- 条目网格 -->
      <div v-else-if="subjects.length > 0">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="subject in subjects"
            :key="subject.id"
            @click="goToSubject(subject.id)"
            class="group bg-white/80 backdrop-blur border border-gray-200/40 hover:border-blue-300/60 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <!-- 封面 -->
            <div class="aspect-[3/4] overflow-hidden bg-gray-100 relative">
              <img
                :src="subject.images?.common || subject.images?.medium"
                :alt="subject.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <!-- 评分角标 -->
              <div
                v-if="subject.rating?.score"
                class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"
              >
                <span>{{ subject.rating.score.toFixed(1) }}</span>
                <span class="text-yellow-400">★</span>
              </div>
            </div>

            <!-- 信息 -->
            <div class="p-3">
              <h3
                class="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-1"
                :title="subject.name_cn || subject.name"
              >
                {{ subject.name_cn || subject.name }}
              </h3>
              <p v-if="subject.date" class="text-xs text-gray-400 truncate">
                {{ subject.date }}
              </p>
            </div>
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div v-if="hasMore" class="flex justify-center mt-8">
          <button
            @click="loadMore"
            :disabled="loading"
            class="px-6 py-3 bg-white/80 backdrop-blur border border-gray-200/40 hover:border-blue-300/60 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              加载中...
            </span>
            <span v-else>加载更多</span>
          </button>
        </div>

        <!-- 已加载完成提示 -->
        <div v-else class="text-center py-8 text-sm text-gray-400">
          已加载全部 {{ total }} 个条目
        </div>
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
</template>
