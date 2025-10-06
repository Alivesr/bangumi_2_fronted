<template>
  <div
    class="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 轮播图区域 -->
      <div class="mb-8">
        <div
          v-if="loading"
          class="relative h-80 bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl animate-pulse"
        ></div>
        <div v-else-if="hotAnime.length > 0" class="relative group">
          <div
            class="relative h-80 rounded-xl overflow-hidden bg-white/80 backdrop-blur border border-gray-200/40"
          >
            <div
              v-for="(item, index) in hotAnime"
              :key="item.id"
              :class="[
                'absolute inset-0 transition-opacity duration-500',
                currentSlide === index ? 'opacity-100' : 'opacity-0',
              ]"
            >
              <img
                :src="item.images?.large || item.images?.common"
                :alt="item.name_cn || item.name"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
              ></div>

              <div class="absolute bottom-0 left-0 right-0 p-6">
                <div class="max-w-2xl">
                  <div class="flex items-center gap-2 mb-2">
                    <span
                      v-if="item.rating?.score"
                      class="px-2 py-0.5 bg-blue-600 text-white text-sm font-semibold rounded"
                    >
                      {{ item.rating.score.toFixed(1) }}
                    </span>
                    <span class="text-white/80 text-sm">{{ item.date }}</span>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-2">
                    {{ item.name_cn || item.name }}
                  </h3>
                  <p
                    v-if="item.summary"
                    class="text-white/90 text-sm line-clamp-2 mb-3"
                  >
                    {{ item.summary }}
                  </p>
                  <button
                    @click="goToSubject(item.id)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 控制按钮 -->
          <button
            @click="prevSlide"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              class="w-5 h-5"
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
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              class="w-5 h-5"
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
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            <button
              v-for="(_, index) in hotAnime"
              :key="index"
              @click="goToSlide(index)"
              :class="[
                'h-1.5 rounded-full transition-all',
                currentSlide === index ? 'bg-white w-6' : 'bg-white/50 w-1.5',
              ]"
            ></button>
          </div>
        </div>
      </div>

      <!-- 主体内容 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：排行榜 -->
        <div class="lg:col-span-2">
          <div
            class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">高分榜单</h2>
              <router-link
                to="/anime"
                class="text-blue-600 hover:text-blue-700 text-sm transition-colors"
              >
                查看更多 →
              </router-link>
            </div>

            <div v-if="loading" class="space-y-3">
              <div
                v-for="i in 10"
                :key="i"
                class="h-20 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(item, index) in topRated"
                :key="item.id"
                @click="goToSubject(item.id)"
                class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
              >
                <!-- 排名 -->
                <div
                  :class="[
                    'flex-shrink-0 w-8 h-8 rounded flex items-center justify-center font-bold text-sm',
                    index < 3
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  {{ index + 1 }}
                </div>

                <!-- 封面 -->
                <div
                  class="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-gray-100"
                >
                  <img
                    :src="item.images?.small || item.images?.common"
                    :alt="item.name_cn || item.name"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- 信息 -->
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors"
                  >
                    {{ item.name_cn || item.name }}
                  </h3>
                  <p class="text-sm text-gray-500 truncate">{{ item.date }}</p>
                </div>

                <!-- 评分 -->
                <div v-if="item.rating?.score" class="flex-shrink-0 text-right">
                  <div class="text-lg font-bold text-gray-900">
                    {{ item.rating.score.toFixed(1) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ item.rating.total }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：快速导航 -->
        <div class="space-y-6">
          <div
            class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl p-6"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-4">快速导航</h2>
            <div class="grid grid-cols-2 gap-3">
              <router-link
                to="/anime"
                class="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/40 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-center group"
              >
                <div
                  class="text-3xl mb-2 group-hover:scale-110 transition-transform"
                >
                  🎬
                </div>
                <div class="text-sm font-semibold text-gray-900">动画</div>
              </router-link>

              <router-link
                to="/book"
                class="p-4 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/40 rounded-lg hover:border-green-300 hover:shadow-sm transition-all text-center group"
              >
                <div
                  class="text-3xl mb-2 group-hover:scale-110 transition-transform"
                >
                  📖
                </div>
                <div class="text-sm font-semibold text-gray-900">书籍</div>
              </router-link>

              <router-link
                to="/game"
                class="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/40 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all text-center group"
              >
                <div
                  class="text-3xl mb-2 group-hover:scale-110 transition-transform"
                >
                  🎮
                </div>
                <div class="text-sm font-semibold text-gray-900">游戏</div>
              </router-link>

              <router-link
                to="/music"
                class="p-4 bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200/40 rounded-lg hover:border-pink-300 hover:shadow-sm transition-all text-center group"
              >
                <div
                  class="text-3xl mb-2 group-hover:scale-110 transition-transform"
                >
                  🎵
                </div>
                <div class="text-sm font-semibold text-gray-900">音乐</div>
              </router-link>
            </div>
        </div>

          <div
            class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-xl p-6"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-4">搜索</h2>
            <router-link
              to="/search"
              class="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition-colors"
            >
              开始探索
            </router-link>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Service } from "@/api/services/Service";
import type { Subject } from "@/api/models/Subject";

const router = useRouter();

// 数据状态
const hotAnime = ref<Subject[]>([]);
const topRated = ref<Subject[]>([]);
const loading = ref(true);
const currentSlide = ref(0);

// 获取热门动画
const fetchHotAnime = async () => {
  try {
    const res = await Service.getSubjects(
      2,
      undefined,
      undefined,
      undefined,
      "rank",
      undefined,
      undefined,
      6,
      0
    );
    hotAnime.value = res.data || [];
  } catch (error) {
    console.error("获取热门动画失败:", error);
  }
};

// 获取高分作品
const fetchTopRated = async () => {
  try {
    const res = await Service.getSubjects(
      2,
      undefined,
      undefined,
      undefined,
      "rank",
      undefined,
      undefined,
      10,
      0
    );
    topRated.value = res.data || [];
  } catch (error) {
    console.error("获取高分作品失败:", error);
  }
};

// 轮播图控制
const nextSlide = () => {
  if (hotAnime.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % hotAnime.value.length;
  }
};

const prevSlide = () => {
  if (hotAnime.value.length > 0) {
    currentSlide.value =
      (currentSlide.value - 1 + hotAnime.value.length) % hotAnime.value.length;
  }
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const goToSubject = (id: number) => {
  router.push(`/subject/${id}`);
};

// 页面加载
onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchHotAnime(), fetchTopRated()]);
  loading.value = false;

  // 自动轮播
  setInterval(nextSlide, 5000);
});
</script>
