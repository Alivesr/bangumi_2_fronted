<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { type Subject } from "@/api/models/Subject";
import { type Episode } from "@/api/models/Episode";
import { Service } from "@/api/services/Service";

const props = defineProps<{
  subject?: Subject;
}>();

const eps = ref<Episode[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const hoveredEpisode = ref<Episode | null>(null);

// 计算属性：按集数排序的剧集
const sortedEps = computed(() => {
  return [...eps.value].sort((a, b) => (a.sort || 0) - (b.sort || 0));
});

// 计算属性：总集数
const totalEps = computed(() => {
  return sortedEps.value.length;
});

const getEps = async () => {
  if (!props.subject?.id) return;

  try {
    loading.value = true;
    error.value = null;
    const res = await Service.getEpisodes(props.subject.id);
    eps.value = res.data || [];
  } catch (err) {
    console.error("获取剧集信息失败:", err);
    error.value = "获取剧集信息失败";
    eps.value = [];
  } finally {
    loading.value = false;
  }
};

const handleMouseEnter = (episode: Episode) => {
  hoveredEpisode.value = episode;
};

const handleMouseLeave = () => {
  hoveredEpisode.value = null;
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return "未定";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateString;
  }
};

onMounted(() => {
  getEps();
});
</script>

<template>
  <div
    class="bg-white/80 backdrop-blur border border-gray-200/40 p-6 rounded-lg"
  >
    <!-- 标题和统计信息 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">剧集列表</h3>
      <span v-if="totalEps > 0" class="text-sm text-gray-500">
        共 {{ totalEps }} 集
      </span>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
      ></div>
      <span class="ml-2 text-gray-600">加载中...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-2">{{ error }}</div>
      <button
        @click="getEps"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        重试
      </button>
    </div>

    <!-- 无数据状态 -->
    <div v-else-if="totalEps === 0" class="text-center py-8 text-gray-500">
      暂无剧集信息
    </div>

    <!-- 剧集列表 -->
    <div v-else class="relative">
      <!-- 剧集网格 -->
      <div
        class="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2"
      >
        <div
          v-for="episode in sortedEps"
          :key="episode.id"
          class="relative group"
          @mouseenter="handleMouseEnter(episode)"
          @mouseleave="handleMouseLeave"
        >
          <!-- 剧集按钮 -->
          <button
            class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border border-blue-300 flex items-center justify-center text-sm font-medium text-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :class="{
              'ring-2 ring-blue-500 ring-offset-2':
                hoveredEpisode?.id === episode.id,
            }"
          >
            {{ episode.sort || episode.ep || "?" }}
          </button>

          <!-- 悬停提示 -->
          <div
            v-if="hoveredEpisode?.id === episode.id"
            class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap"
          >
            <div class="font-medium">{{ episode.name_cn || episode.name }}</div>
            <div
              v-if="episode.name_cn && episode.name !== episode.name_cn"
              class="text-gray-300"
            >
              {{ episode.name }}
            </div>
            <div class="text-gray-400">{{ formatDate(episode.airdate) }}</div>
            <!-- 箭头 -->
            <div
              class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
            ></div>
          </div>
        </div>
      </div>

      <!-- 剧集详情卡片 -->
    </div>
  </div>
</template>
