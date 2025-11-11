<template>
  <div
    class="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">发现精彩内容</h1>
        <p class="text-lg text-gray-600">
          探索热门动画、高分作品和更多精彩内容
        </p>
      </div>

      <!-- 竖版封面轮播图 -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">热门推荐</h2>
          <router-link
            to="/anime"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            查看更多 →
          </router-link>
        </div>

        <div v-if="loading" class="relative">
          <div class="flex gap-6 overflow-hidden">
            <div
              v-for="i in 6"
              :key="i"
              class="flex-shrink-0 w-48 aspect-[3/4] bg-gray-200 rounded-xl animate-pulse"
            ></div>
          </div>
        </div>

        <div v-else-if="hotAnime.length > 0" class="relative group">
          <!-- 轮播容器 -->
          <div class="relative max-w-4xl mx-auto">
            <!-- 卡片展示区域 -->
            <div class="flex items-center justify-center gap-6 py-8">
              <div
                v-for="(item, index) in visibleCards"
                :key="`${item.id}-${index}`"
                @click="handleCardClick(index)"
                :class="[
                  'transition-all duration-700 ease-out cursor-pointer shrink-0',
                  getCardClasses(index),
                ]"
              >
                <!-- 立体封面卡片 -->
                <div
                  :class="[
                    'relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl transition-all duration-700',
                    item.originalIndex === currentSlide
                      ? 'ring-4 ring-blue-500/50'
                      : '',
                  ]"
                  :style="{ width: getCardWidth(index) }"
                >
                  <!-- 封面图片 -->
                  <img
                    :src="item.images?.medium || item.images?.common"
                    :alt="item.name_cn || item.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    :fetchpriority="index === 2 ? 'high' : 'low'"
                  />

                  <!-- 遮罩层 - 非中心卡片变暗 -->
                  <div
                    :class="[
                      'absolute inset-0 bg-black transition-opacity duration-500',
                      index === 2 ? 'opacity-0' : 'opacity-60',
                    ]"
                  ></div>

                  <!-- 渐变遮罩 - 始终显示 -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"
                  ></div>

                  <!-- 信息展示 - 只在中心卡片显示 -->
                  <div
                    v-if="index === 2"
                    class="absolute inset-0 p-4 flex flex-col justify-end"
                  >
                    <h3
                      class="text-white font-bold text-base line-clamp-2 mb-2"
                    >
                      {{ item.name_cn || item.name }}
                    </h3>
                    <p
                      v-if="item.summary"
                      class="text-white/90 text-xs line-clamp-2 mb-3"
                    >
                      {{ item.summary }}
                    </p>
                    <div class="flex items-center justify-between">
                      <div
                        v-if="item.rating?.score"
                        class="flex items-center gap-1"
                      >
                        <span class="text-yellow-400 text-sm">★</span>
                        <span class="text-white text-sm font-bold">{{
                          item.rating.score.toFixed(1)
                        }}</span>
                      </div>
                      <span class="text-white/80 text-xs">{{ item.date }}</span>
                    </div>
                    <button
                      @click.stop="goToSubject(item.id)"
                      class="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 !text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      查看详情
                    </button>
                  </div>

                  <!-- 评分标签 -->
                  <div
                    v-if="item.rating?.score"
                    class="absolute top-2 right-2 z-10"
                  >
                    <div
                      class="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                    >
                      {{ item.rating.score.toFixed(1) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 左右控制按钮 -->
          <button
            @click="prevSlide"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 z-20"
          >
            <svg
              class="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            @click="nextSlide"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 z-20"
          >
            <svg
              class="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- 指示器 -->
          <div class="flex justify-center gap-2 mt-8">
            <button
              v-for="(_, index) in hotAnime"
              :key="index"
              @click="goToSlide(index)"
              :class="[
                'h-2 rounded-full transition-all duration-300',
                currentSlide === index
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 w-2 hover:bg-gray-400',
              ]"
            ></button>
          </div>
        </div>
      </div>

      <!-- 高分榜单 -->
      <div class="mb-12" ref="topRatedSectionRef" v-if="showTopRated">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">高分榜单</h2>
          <router-link
            to="/anime"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            查看更多 →
          </router-link>
        </div>

        <div
          v-if="topRatedLoading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl p-4 animate-pulse"
          >
            <div class="flex gap-4">
              <div class="w-16 h-20 bg-gray-200 rounded-lg"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="(item, index) in topRated.slice(0, 6)"
            :key="item.id"
            @click="goToSubject(item.id)"
            class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div class="flex gap-4">
              <!-- 排名和封面 -->
              <div class="flex flex-col items-center">
                <div
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-2',
                    index < 3
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600',
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <div class="w-16 h-20 rounded-lg overflow-hidden shadow-md">
                  <img
                    :src="item.images?.small || item.images?.common"
                    :alt="item.name_cn || item.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <!-- 信息 -->
              <div class="flex-1 min-w-0">
                <h3
                  class="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1"
                >
                  {{ item.name_cn || item.name }}
                </h3>
                <p class="text-sm text-gray-500 mb-2">{{ item.date }}</p>
                <div v-if="item.rating?.score" class="flex items-center gap-2">
                  <div class="flex items-center gap-1">
                    <span class="text-yellow-400 text-sm">★</span>
                    <span class="text-lg font-bold text-gray-900">{{
                      item.rating.score.toFixed(1)
                    }}</span>
                  </div>
                  <span class="text-xs text-gray-500"
                    >({{ item.rating.total }})</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速导航 -->
      <div
        class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl p-8"
        ref="quickNavRef"
        v-if="showQuickNav"
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          快速导航
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <router-link
            to="/anime"
            class="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/40 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all text-center group"
          >
            <div
              class="text-4xl mb-3 group-hover:scale-110 transition-transform"
            >
              🎬
            </div>
            <div class="text-sm font-semibold text-gray-900">动画</div>
          </router-link>

          <router-link
            to="/book"
            class="p-6 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/40 rounded-xl hover:border-green-300 hover:shadow-lg transition-all text-center group"
          >
            <div
              class="text-4xl mb-3 group-hover:scale-110 transition-transform"
            >
              📖
            </div>
            <div class="text-sm font-semibold text-gray-900">书籍</div>
          </router-link>

          <router-link
            to="/game"
            class="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/40 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all text-center group"
          >
            <div
              class="text-4xl mb-3 group-hover:scale-110 transition-transform"
            >
              🎮
            </div>
            <div class="text-sm font-semibold text-gray-900">游戏</div>
          </router-link>

          <router-link
            to="/music"
            class="p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200/40 rounded-xl hover:border-pink-300 hover:shadow-lg transition-all text-center group"
          >
            <div
              class="text-4xl mb-3 group-hover:scale-110 transition-transform"
            >
              🎵
            </div>
            <div class="text-sm font-semibold text-gray-900">音乐</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Service } from "@/api/services/Service";
import type { Subject } from "@/api/models/Subject";

const router = useRouter();

// 数据状态
const hotAnime = ref<Subject[]>([]);
const topRated = ref<Subject[]>([]);
const loading = ref(true);
const topRatedLoading = ref(true); // 独立的高分榜单加载状态
const currentSlide = ref(0);
let autoPlayInterval: number | null = null;

// 延迟渲染控制
const showTopRated = ref(false);
const showQuickNav = ref(false);
const topRatedSectionRef = ref<HTMLElement | null>(null);
const quickNavRef = ref<HTMLElement | null>(null);
let io: IntersectionObserver | null = null;

// 空闲调度（兼容）
const scheduleIdle = (cb: () => void) => {
  if (typeof window !== "undefined" && (window as any).requestIdleCallback) {
    (window as any).requestIdleCallback(cb, { timeout: 1500 });
  } else {
    setTimeout(cb, 150);
  }
};

// 简易缓存
const fetchWithCache = async <T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const { t, v } = JSON.parse(cached);
      if (now - t < ttl) return v as T;
    }
  } catch {}
  const value = await fn();
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: now, v: value }));
  } catch {}
  return value;
};

// 获取热门动画 - 优化：减少数量 + 缓存
const fetchHotAnime = async () => {
  try {
    const res = await fetchWithCache(
      "home.hotAnime:v1",
      10 * 60 * 1000,
      () =>
        Service.getSubjects(
          2,
          undefined,
          undefined,
          undefined,
          "rank",
          undefined,
          undefined,
          10,
          0
        )
    );
    hotAnime.value = (res as any).data || [];
  } catch (error) {
    console.error("获取热门动画失败:", error);
  }
};

// 获取高分作品 - 优化：减少数量 + 缓存
const fetchTopRated = async () => {
  try {
    topRatedLoading.value = true;
    const res = await fetchWithCache(
      "home.topRated:v1",
      10 * 60 * 1000,
      () =>
        Service.getSubjects(
          2,
          undefined,
          undefined,
          undefined,
          "rank",
          undefined,
          undefined,
          6,
          0
        )
    );
    topRated.value = (res as any).data || [];
  } catch (error) {
    console.error("获取高分作品失败:", error);
  } finally {
    topRatedLoading.value = false;
  }
};

// 轮播图控制
const nextSlide = () => {
  if (currentSlide.value < hotAnime.value.length - 1) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0; // 循环回到第一个
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = hotAnime.value.length - 1; // 循环到最后一个
  }
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const handleCardClick = (displayIndex: number) => {
  const clickedCard = visibleCards[displayIndex];

  if (displayIndex === 2) {
    // 如果点击的是中心卡片，跳转到详情页
    goToSubject(clickedCard.id);
  } else {
    // 如果点击的是其他卡片，将其设为中心
    currentSlide.value = clickedCard.originalIndex;
  }
};

const goToSubject = (id: number) => {
  router.push(`/subject/${id}`);
};

// 可见卡片（中心及左右各2个）
const visibleCards = computed(() => {
  const totalCards = hotAnime.value.length;
  if (!totalCards) return [] as any[];
  const list: any[] = [];
  for (let i = -2; i <= 2; i++) {
    let index = currentSlide.value + i;
    while (index < 0) index += totalCards;
    while (index >= totalCards) index -= totalCards;
    const card = hotAnime.value[index];
    if (card) {
      list.push({
        id: card.id,
        name: card.name,
        name_cn: card.name_cn,
        images: card.images,
        summary: card.summary,
        rating: card.rating,
        date: card.date,
        originalIndex: index,
        displayIndex: i + 2,
      });
    }
  }
  return list;
});

// 获取卡片样式类
const getCardClasses = (displayIndex: number) => {
  const centerIndex = 2; // 中心卡片的 displayIndex
  const diff = Math.abs(displayIndex - centerIndex);

  if (diff === 0) {
    // 中心卡片
    return "opacity-100 scale-100 z-20";
  } else if (diff === 1) {
    // 相邻卡片
    return "opacity-80 scale-90 z-10";
  } else {
    // 边缘卡片
    return "opacity-60 scale-75 z-0";
  }
};

// 获取卡片宽度
const getCardWidth = (displayIndex: number) => {
  const centerIndex = 2;
  const diff = Math.abs(displayIndex - centerIndex);

  if (diff === 0) {
    return "240px"; // 中心卡片最大
  } else if (diff === 1) {
    return "200px"; // 相邻卡片中等
  } else {
    return "160px"; // 边缘卡片最小
  }
};

// 开始自动轮播
const startAutoPlay = () => {
  stopAutoPlay();
  autoPlayInterval = window.setInterval(() => {
    nextSlide();
  }, 5000);
};

// 停止自动轮播
const stopAutoPlay = () => {
  if (autoPlayInterval !== null) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

// 页面加载 - 优化：渐进式加载
onMounted(async () => {
  loading.value = true;

  // 优先加载轮播图数据，快速展示首屏内容
  await fetchHotAnime();
  loading.value = false;

  // 启动自动轮播
  startAutoPlay();

  // 延迟加载次要内容（高分榜单），不阻塞首屏
  scheduleIdle(() => {
    fetchTopRated();
  });

  // IntersectionObserver 懒渲染次级区块
  try {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (e.target === topRatedSectionRef.value) showTopRated.value = true;
            if (e.target === quickNavRef.value) showQuickNav.value = true;
            io && io.unobserve(e.target);
          }
        });
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.01 }
    );
    if (topRatedSectionRef.value) io.observe(topRatedSectionRef.value);
    if (quickNavRef.value) io.observe(quickNavRef.value);
  } catch {}

  // 页面可见性控制自动播放
  const onVis = () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };
  document.addEventListener('visibilitychange', onVis);
  // 卸载时移除监听
  (onUnmounted as any)(() => document.removeEventListener('visibilitychange', onVis));
});

// 组件卸载时清理
onUnmounted(() => {
  stopAutoPlay();
  if (io) {
    try { io.disconnect(); } catch {}
    io = null;
  }
});
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
