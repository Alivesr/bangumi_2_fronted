<script setup lang="ts">
import { Service } from "@/api/services/Service";
import { type UserSubjectCollection } from "@/api/models/UserSubjectCollection";
import { type SubjectCollectionType } from "@/api/models/SubjectCollectionType";
import { ref, onMounted, computed } from "vue";
import useAuthStore from "@/stores/auth";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
const route = useRoute();

const subjectId = Number(route.params.id);
const collection = ref<UserSubjectCollection | null>(null);
const loading = ref<boolean>(false);
const showModal = ref<boolean>(false);
const selectedType = ref<SubjectCollectionType | null>(null);
const selectedRate = ref<number>(0);
const comment = ref<string>("");
const tags = ref<string[]>([]);

// 收藏状态配置
const collectionTypes = [
  {
    id: 1,
    name: "想看",
    color: "blue",
    bgClass: "bg-blue-50 hover:bg-blue-100",
    textClass: "text-blue-600",
    gradientClass: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "看过",
    color: "green",
    bgClass: "bg-green-50 hover:bg-green-100",
    textClass: "text-green-600",
    gradientClass: "from-green-500 to-green-600",
  },
  {
    id: 3,
    name: "在看",
    color: "yellow",
    bgClass: "bg-yellow-50 hover:bg-yellow-100",
    textClass: "text-yellow-600",
    gradientClass: "from-yellow-500 to-yellow-600",
  },
  {
    id: 4,
    name: "搁置",
    color: "gray",
    bgClass: "bg-gray-200 hover:bg-gray-300",
    textClass: "text-gray-700",
    gradientClass: "from-gray-500 to-gray-600",
  },
  {
    id: 5,
    name: "抛弃",
    color: "red",
    bgClass: "bg-red-50 hover:bg-red-100",
    textClass: "text-red-600",
    gradientClass: "from-red-500 to-red-600",
  },
];

const isCollected = computed(() => !!collection.value);

const currentStatus = computed(() => {
  if (!collection.value?.type) return null;
  return collectionTypes.find((t) => t.id === collection.value?.type);
});

// 获取用户收藏状态
const fetchCollection = async () => {
  if (!authStore.isLoggedIn || !authStore.userInfo?.username) {
    return;
  }

  try {
    loading.value = true;
    const res = await Service.getUserCollection(
      authStore.userInfo.username,
      subjectId
    );
    collection.value = res;
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err?.status === 404) {
      collection.value = null;
    } else {
      console.error("获取收藏状态失败:", error);
    }
  } finally {
    loading.value = false;
  }
};

// 打开弹窗
const openModal = () => {
  if (!authStore.isLoggedIn) {
    return;
  }

  selectedType.value = collection.value?.type || null;
  selectedRate.value = collection.value?.rate || 0;
  comment.value = collection.value?.comment || "";
  tags.value = collection.value?.tags || [];

  showModal.value = true;
};

// 修改收藏状态
const updateCollection = async () => {
  if (!authStore.isLoggedIn || !selectedType.value) {
    return;
  }

  try {
    loading.value = true;
    await Service.postUserCollection(subjectId, {
      type: selectedType.value,
      rate: selectedRate.value || undefined,
      comment: comment.value || undefined,
      tags: tags.value.length > 0 ? tags.value : undefined,
    });
    await fetchCollection();
    showModal.value = false;
  } catch (error) {
    console.error("修改收藏状态失败:", error);
  } finally {
    loading.value = false;
  }
};

// 设置评分
const setRate = (rate: number) => {
  selectedRate.value = selectedRate.value === rate ? 0 : rate;
};

onMounted(() => {
  fetchCollection();
});
</script>

<template>
  <div class="relative">
    <!-- 未登录状态 -->
    <button
      v-if="!authStore.isLoggedIn"
      class="group relative overflow-hidden px-4 py-2 bg-white/90 backdrop-blur border border-gray-200/60 text-gray-700 text-xs font-medium rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
      @click="$router.push('/auth')"
    >
      <div class="flex items-center gap-1.5">
        <svg
          class="w-3.5 h-3.5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>收藏</span>
      </div>
    </button>

    <!-- 已登录但未收藏 -->
    <button
      v-else-if="!isCollected && !loading"
      class="group relative overflow-hidden px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200"
      @click="openModal"
    >
      <div
        class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
      ></div>
      <div class="relative flex items-center gap-1.5">
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>收藏</span>
      </div>
    </button>

    <!-- 已收藏状态 -->
    <button
      v-else-if="isCollected && !loading"
      :class="[
        'group relative px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-[1.02]',
        currentStatus?.bgClass,
        currentStatus?.textClass,
      ]"
      @click="openModal"
    >
      <div class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ currentStatus?.name }}</span>
        <span
          v-if="collection?.rate"
          class="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/50 rounded-full text-[10px]"
        >
          <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <span class="font-bold">{{ collection.rate }}</span>
        </span>
      </div>
    </button>

    <!-- 加载中 -->
    <div
      v-else
      class="px-4 py-2 bg-white/90 backdrop-blur border border-gray-200/60 rounded-lg"
    >
      <div class="flex items-center gap-1.5">
        <div
          class="w-3.5 h-3.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        ></div>
        <div class="w-12 h-3.5 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>

    <!-- 收藏状态编辑弹窗 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showModal = false"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="showModal"
            class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <!-- 标题栏 -->
            <div
              class="relative px-5 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100"
            >
              <h3 class="text-base font-bold text-gray-900">收藏管理</h3>
              <p class="text-xs text-gray-500 mt-0.5">记录你的观影体验</p>
              <button
                @click="showModal = false"
                class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
              <!-- 收藏状态选择 -->
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-2"
                  >观看状态</label
                >
                <div class="flex gap-2">
                  <button
                    v-for="type in collectionTypes"
                    :key="type.id"
                    @click="selectedType = type.id as SubjectCollectionType"
                    :class="[
                      'relative flex-1 overflow-hidden px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs',
                      selectedType === type.id
                        ? `${type.bgClass} ${type.textClass}`
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
                    ]"
                    :disabled="loading"
                  >
                    {{ type.name }}
                    <div
                      v-if="selectedType === type.id"
                      class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center"
                    >
                      <svg
                        :class="['w-2.5 h-2.5', type.textClass]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- 评分 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-bold text-gray-900">评分</label>
                  <span
                    v-if="selectedRate > 0"
                    class="text-xs font-semibold text-blue-600"
                  >
                    {{ selectedRate }} 分
                  </span>
                </div>
                <div
                  class="flex items-center justify-center gap-0.5 p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100"
                >
                  <button
                    v-for="star in 10"
                    :key="star"
                    @click="setRate(star)"
                    :class="[
                      'group relative w-7 h-7 transition-all duration-200',
                      star <= selectedRate ? 'scale-105' : 'hover:scale-105',
                    ]"
                    :disabled="loading"
                  >
                    <svg
                      class="w-full h-full transition-colors duration-200"
                      :class="
                        star <= selectedRate
                          ? 'text-yellow-400'
                          : 'text-gray-300 group-hover:text-yellow-200'
                      "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 简评 -->
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-2"
                  >短评</label
                >
                <div class="relative">
                  <textarea
                    v-model="comment"
                    rows="3"
                    placeholder="分享你的观看感受..."
                    maxlength="200"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none text-xs transition-all"
                    :disabled="loading"
                  ></textarea>
                  <div
                    class="absolute bottom-2 right-2 text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded"
                  >
                    {{ comment.length }}/200
                  </div>
                </div>
              </div>

              <!-- 标签 -->
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-2"
                  >标签</label
                >
                <div class="space-y-2">
                  <div v-if="tags.length > 0" class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(tag, index) in tags"
                      :key="index"
                      class="group inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-medium rounded-md border border-blue-200 hover:border-blue-300 transition-all"
                    >
                      {{ tag }}
                      <button
                        @click="tags.splice(index, 1)"
                        class="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
                        :disabled="loading"
                      >
                        <svg
                          class="w-2.5 h-2.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="输入标签后按回车添加"
                    @keyup.enter="(e) => {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value && !tags.includes(value) && tags.length < 10) {
                        tags.push(value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-xs transition-all"
                    :disabled="loading"
                  />
                  <p class="text-[10px] text-gray-500">
                    按回车添加标签，最多 10 个
                  </p>
                </div>
              </div>
            </div>

            <!-- 底部按钮 -->
            <div
              class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2"
            >
              <button
                @click="showModal = false"
                class="flex-1 px-4 py-2 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium text-xs rounded-lg transition-all hover:shadow-sm"
                :disabled="loading"
              >
                取消
              </button>
              <button
                @click="updateCollection"
                :disabled="loading || !selectedType"
                class="flex-1 px-4 py-2 font-semibold text-xs rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-[1.02]"
              >
                <span
                  v-if="loading"
                  class="flex items-center justify-center gap-1.5"
                >
                  <div
                    class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  ></div>
                  保存中...
                </span>
                <span v-else>保存</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>
