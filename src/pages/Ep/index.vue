<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Service } from "@/api/services/Service";
import type { EpisodeDetail } from "@/api/models/EpisodeDetail";
import { EpType } from "@/api/models/EpType";

// 导入 SVG 图标
import CalendarIcon from "@/icon/calendar.svg?raw";
import ClockIcon from "@/icon/clock.svg?raw";
import CommentIcon from "@/icon/comment.svg?raw";
import DiscIcon from "@/icon/disc.svg?raw";
import HashIcon from "@/icon/hash.svg?raw";
import InfoIcon from "@/icon/info.svg?raw";
import DocumentIcon from "@/icon/document.svg?raw";
import LinkIcon from "@/icon/link.svg?raw";
import VideoIcon from "@/icon/video.svg?raw";
import ArrowLeftIcon from "@/icon/arrow-left.svg?raw";

const route = useRoute();
const router = useRouter();
const episodeId = Number(route.params.id);
const episode = ref<EpisodeDetail>();
const loading = ref(true);
const error = ref<string | null>(null);

const getEpisodeDetail = async () => {
  try {
    loading.value = true;
    error.value = null;
    const res = await Service.getEpisodeById(episodeId);
    episode.value = res as EpisodeDetail;
  } catch (err) {
    console.error("获取剧集详情失败:", err);
    error.value = "获取剧集详情失败";
  } finally {
    loading.value = false;
  }
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

// 格式化时长
const formatDuration = (duration?: string) => {
  if (!duration) return "未知";
  return duration;
};

// 获取剧集类型标签
const getEpTypeLabel = (type: EpType) => {
  const typeMap = {
    [EpType.MainStory]: "本篇",
    [EpType.SP]: "特别篇",
    [EpType.OP]: "OP",
    [EpType.ED]: "ED",
    [EpType.PV]: "预告/宣传/广告",
    [EpType.MAD]: "MAD",
    [EpType.Other]: "其他",
  };
  return typeMap[type] || "未知";
};

// 获取剧集类型颜色
const getEpTypeColor = (type: EpType) => {
  const colorMap = {
    [EpType.MainStory]: "bg-blue-100 text-blue-800",
    [EpType.SP]: "bg-purple-100 text-purple-800",
    [EpType.OP]: "bg-green-100 text-green-800",
    [EpType.ED]: "bg-orange-100 text-orange-800",
    [EpType.PV]: "bg-yellow-100 text-yellow-800",
    [EpType.MAD]: "bg-pink-100 text-pink-800",
    [EpType.Other]: "bg-gray-100 text-gray-800",
  };
  return colorMap[type] || "bg-gray-100 text-gray-800";
};

onMounted(() => {
  getEpisodeDetail();
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 骨架屏加载状态 -->
      <template v-if="loading">
        <div class="space-y-6">
          <!-- 主卡片骨架屏 -->
          <div
            class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl overflow-hidden"
          >
            <!-- 头部骨架屏 -->
            <div
              class="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-8 border-b border-gray-200"
            >
              <div
                class="flex flex-col lg:flex-row lg:items-start lg:justify-between"
              >
                <div class="flex-1 min-w-0 space-y-4">
                  <div class="flex items-center space-x-3">
                    <div
                      class="h-6 w-16 bg-gray-200 rounded-full animate-pulse"
                    ></div>
                    <div
                      class="h-4 w-20 bg-gray-200 rounded animate-pulse"
                    ></div>
                  </div>
                  <div
                    class="h-8 bg-gray-200 rounded w-3/4 animate-pulse"
                  ></div>
                  <div
                    class="h-5 bg-gray-200 rounded w-1/2 animate-pulse"
                  ></div>
                </div>
                <div class="mt-4 lg:mt-0 lg:ml-6">
                  <div
                    class="h-9 w-24 bg-gray-200 rounded-md animate-pulse"
                  ></div>
                </div>
              </div>
            </div>

            <!-- 内容骨架屏 -->
            <div class="px-6 py-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- 基本信息骨架屏 -->
                <div class="space-y-4">
                  <div class="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div class="space-y-3">
                    <div v-for="i in 4" :key="i" class="space-y-2">
                      <div
                        class="h-3 bg-gray-200 rounded w-20 animate-pulse"
                      ></div>
                      <div
                        class="h-4 bg-gray-200 rounded w-full animate-pulse"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- 简介骨架屏 -->
                <div class="md:col-span-2 lg:col-span-2">
                  <div
                    class="h-5 bg-gray-200 rounded w-16 mb-4 animate-pulse"
                  ></div>
                  <div class="space-y-2">
                    <div
                      class="h-4 bg-gray-200 rounded w-full animate-pulse"
                    ></div>
                    <div
                      class="h-4 bg-gray-200 rounded w-full animate-pulse"
                    ></div>
                    <div
                      class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 相关链接骨架屏 -->
          <div
            class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl p-6"
          >
            <div class="h-5 bg-gray-200 rounded w-16 mb-4 animate-pulse"></div>
            <div class="h-9 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </template>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-16">
        <div
          class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl p-8 max-w-md mx-auto"
        >
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button
            @click="getEpisodeDetail"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            重试
          </button>
        </div>
      </div>

      <!-- 剧集详情 -->
      <div v-else-if="episode" class="space-y-6 animate-fade-in">
        <!-- 主卡片 -->
        <div
          class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl overflow-hidden transition-all duration-300"
        >
          <!-- 头部信息 -->
          <div
            class="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur px-6 py-8 border-b border-gray-200/40"
          >
            <div
              class="flex flex-col lg:flex-row lg:items-start lg:justify-between"
            >
              <!-- 标题区域 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3 mb-3">
                  <span
                    :class="getEpTypeColor(episode.type)"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                  >
                    {{ getEpTypeLabel(episode.type) }}
                  </span>
                  <span
                    v-if="episode.ep"
                    class="text-sm text-gray-500 bg-white/60 backdrop-blur px-2 py-1 rounded-md"
                  >
                    第 {{ episode.ep }} 集
                  </span>
                </div>

                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  {{ episode.name_cn || episode.name }}
                </h1>

                <p
                  v-if="episode.name_cn && episode.name !== episode.name_cn"
                  class="text-lg text-gray-600"
                >
                  {{ episode.name }}
                </p>
              </div>

              <!-- 操作按钮 -->
              <div class="mt-4 lg:mt-0 lg:ml-6 flex space-x-3">
                <button
                  @click="router.push(`/subject/${episode.subject_id}`)"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100/80 backdrop-blur rounded-lg hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  查看条目
                </button>
              </div>
            </div>
          </div>

          <!-- 剧集信息卡片 -->
          <div class="p-6 space-y-6">
            <!-- 基本信息区域 -->
            <div
              class="bg-gradient-to-r from-gray-50 to-white rounded-lg p-5 border border-gray-100"
            >
              <div class="flex items-center mb-4">
                <div class="w-5 h-5 text-blue-600 mr-2" v-html="InfoIcon"></div>
                <h3 class="text-lg font-semibold text-gray-900">基本信息</h3>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <!-- 播出日期 -->
                <div
                  class="bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100 transition-all duration-200"
                >
                  <div class="flex items-center mb-1">
                    <div
                      class="w-4 h-4 text-gray-400 mr-1.5"
                      v-html="CalendarIcon"
                    ></div>
                    <dt class="text-xs font-medium text-gray-500">播出日期</dt>
                  </div>
                  <dd class="text-sm font-semibold text-gray-900">
                    {{ formatDate(episode.airdate) }}
                  </dd>
                </div>

                <!-- 时长 -->
                <div
                  class="bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100 transition-all duration-200"
                >
                  <div class="flex items-center mb-1">
                    <div
                      class="w-4 h-4 text-gray-400 mr-1.5"
                      v-html="ClockIcon"
                    ></div>
                    <dt class="text-xs font-medium text-gray-500">时长</dt>
                  </div>
                  <dd class="text-sm font-semibold text-gray-900">
                    {{ formatDuration(episode.duration) }}
                  </dd>
                </div>

                <!-- 评论数 -->
                <div
                  v-if="episode.comment"
                  class="bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100 transition-all duration-200"
                >
                  <div class="flex items-center mb-1">
                    <div
                      class="w-4 h-4 text-gray-400 mr-1.5"
                      v-html="CommentIcon"
                    ></div>
                    <dt class="text-xs font-medium text-gray-500">评论数</dt>
                  </div>
                  <dd class="text-sm font-semibold text-gray-900">
                    {{ episode.comment }}
                  </dd>
                </div>

                <!-- 碟片数 -->
                <div
                  v-if="episode.disc"
                  class="bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100 transition-all duration-200"
                >
                  <div class="flex items-center mb-1">
                    <div
                      class="w-4 h-4 text-gray-400 mr-1.5"
                      v-html="DiscIcon"
                    ></div>
                    <dt class="text-xs font-medium text-gray-500">碟片数</dt>
                  </div>
                  <dd class="text-sm font-semibold text-gray-900">
                    {{ episode.disc }}
                  </dd>
                </div>

                <!-- 排序 -->
                <div
                  class="bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100 transition-all duration-200"
                >
                  <div class="flex items-center mb-1">
                    <div
                      class="w-4 h-4 text-gray-400 mr-1.5"
                      v-html="HashIcon"
                    ></div>
                    <dt class="text-xs font-medium text-gray-500">排序</dt>
                  </div>
                  <dd class="text-sm font-semibold text-gray-900">
                    {{ episode.sort }}
                  </dd>
                </div>
              </div>
            </div>

            <!-- 简介区域 -->
            <div
              class="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 rounded-lg p-5 border border-indigo-100/50"
            >
              <div class="flex items-center mb-4">
                <div
                  class="w-5 h-5 text-indigo-600 mr-2"
                  v-html="DocumentIcon"
                ></div>
                <h3 class="text-lg font-semibold text-gray-900">剧集简介</h3>
              </div>

              <div
                v-if="episode.desc"
                class="bg-white/60 backdrop-blur rounded-lg p-4 border border-white/50"
              >
                <p
                  class="text-gray-700 leading-relaxed whitespace-pre-wrap text-base"
                >
                  {{ episode.desc }}
                </p>
              </div>

              <!-- 空状态 -->
              <div
                v-else
                class="flex flex-col items-center justify-center py-8 text-gray-400"
              >
                <div
                  class="w-12 h-12 mb-2 opacity-50"
                  v-html="DocumentIcon"
                ></div>
                <p class="text-sm">暂无简介信息</p>
              </div>
            </div>

            <!-- 快速导航 -->
            <div
              class="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg p-5 border border-blue-100/50"
            >
              <div class="flex items-center mb-4">
                <div class="w-5 h-5 text-blue-600 mr-2" v-html="LinkIcon"></div>
                <h3 class="text-lg font-semibold text-gray-900">快速导航</h3>
              </div>

              <div class="flex flex-wrap gap-3">
                <button
                  @click="router.push(`/subject/${episode.subject_id}`)"
                  class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-blue-700 bg-white/80 backdrop-blur rounded-lg border border-blue-200/50 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div class="w-4 h-4 mr-2" v-html="VideoIcon"></div>
                  查看所属条目
                </button>

                <button
                  @click="router.back()"
                  class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur rounded-lg border border-gray-200/50 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <div class="w-4 h-4 mr-2" v-html="ArrowLeftIcon"></div>
                  返回上一页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 悬停效果增强 */
.hover-lift {
  transition: transform 0.2s ease-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* 移动端优化 */
@media (max-width: 640px) {
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
