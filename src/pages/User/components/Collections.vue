<script setup lang="ts">
import { Service } from "@/api/services/Service";
import type { SubjectCollectionType } from "@/api/models/SubjectCollectionType";
import type { UserSubjectCollection } from "@/api/models/UserSubjectCollection";

import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";

const collections = ref<UserSubjectCollection[]>([]);
const route = useRoute();
const router = useRouter();
const username = route.params.id as string;
const loading = ref(false);
// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const type = ref<SubjectCollectionType | undefined>(undefined);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value) || 1;
});

const fetchData = async (page = 1) => {
  loading.value = true;
  try {
    const offset = (page - 1) * pageSize.value;
    const res = await Service.getUserCollectionsByUsername(
      username,
      undefined,
      type.value,
      pageSize.value,
      offset
    );
    collections.value = res.data || [];
    total.value = res.total || 0;
    currentPage.value = page;
  } catch (error) {
    console.error("获取收藏列表失败:", error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  fetchData(page);
};

// 页码输入框
const inputPage = ref<number | undefined>(undefined);

// 处理跳转到指定页面
const handleJumpToPage = () => {
  if (
    inputPage.value &&
    inputPage.value >= 1 &&
    inputPage.value <= totalPages.value
  ) {
    handlePageChange(inputPage.value);
    inputPage.value = undefined; // 清空输入框
  } else {
    inputPage.value = undefined; // 无效输入时清空
  }
};

// 收藏状态配置
const collectionTypes = [
  { id: 1, name: "想看", color: "blue" },
  { id: 2, name: "看过", color: "green" },
  { id: 3, name: "在看", color: "yellow" },
  { id: 4, name: "搁置", color: "gray" },
  { id: 5, name: "抛弃", color: "red" },
];

// 获取收藏状态配置
const getCollectionTypeConfig = (typeId: number) => {
  return (
    collectionTypes.find((t) => t.id === typeId) || {
      id: 0,
      name: "未知",
      color: "gray",
    }
  );
};

// 常用样式类
const COMMON_CLASSES = {
  button:
    "px-4 py-2 text-sm rounded-full cursor-pointer transition-all duration-200 font-medium hover:-translate-y-0.5 hover:shadow-md",
  card: "group bg-white rounded-lg overflow-hidden hover:bg-gray-50 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg",
  tag: "absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-medium transition-all duration-200",
  title:
    "text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors duration-200",
  date: "text-xs text-gray-500 mb-2 transition-colors duration-200",
  star: "text-xs transition-colors duration-200",
};

// 生成按钮样式类
const getButtonClasses = (
  typeId: number,
  currentType: number | undefined,
  color: string
) => {
  if (currentType === typeId) {
    return `${COMMON_CLASSES.button} bg-${color}-500 text-white shadow-sm`;
  }

  return `${COMMON_CLASSES.button} bg-gray-100 text-gray-700 hover:bg-${color}-100 hover:text-${color}-600`;
};

const handleClick = async (collectionType: string) => {
  // 更新类型并重置页码
  type.value = parseInt(collectionType) as SubjectCollectionType;
  currentPage.value = 1;
  // 使用统一的fetchData方法获取数据
  await fetchData(1);
};

onMounted(() => {
  handleClick("1");
});
</script>

<template>
  <div class="w-full">
    <!-- 顶部导航标签 -->
    <div class="flex gap-6 mb-6 border-b border-gray-200 pb-2">
      <div
        class="text-base text-blue-600 font-medium border-b-2 border-blue-600 pb-2 cursor-pointer transition-all duration-200"
      >
        收藏
      </div>
      <div
        class="text-base text-gray-500 hover:text-blue-500 cursor-pointer transition-all duration-200 pb-2 hover:-translate-y-0.5"
      >
        时间线
      </div>
      <div
        class="text-base text-gray-500 hover:text-blue-500 cursor-pointer transition-all duration-200 pb-2 hover:-translate-y-0.5"
      >
        讨论
      </div>
      <div
        class="text-base text-gray-500 hover:text-blue-500 cursor-pointer transition-all duration-200 pb-2 hover:-translate-y-0.5"
      >
        关注
      </div>
    </div>

    <!-- 收藏状态筛选 -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <div
        v-for="collectionType in collectionTypes"
        :key="collectionType.id"
        :class="getButtonClasses(collectionType.id, type, collectionType.color)"
        @click="handleClick(collectionType.id.toString())"
      >
        {{ collectionType.name }}
      </div>
    </div>

    <!-- 加载动画 -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-10">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
      <div class="text-gray-500 text-sm mt-2">正在加载...</div>
    </div>

    <!-- 收藏内容展示 -->
    <div
      v-else-if="collections.length > 0"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
    >
      <div
        v-for="collection in collections"
        :key="collection.subject_id"
        @click="router.push(`/subject/${collection.subject_id}`)"
        :class="COMMON_CLASSES.card"
      >
        <div class="aspect-[2/3] overflow-hidden relative">
          <img
            :src="collection.subject?.images?.common"
            :alt="collection.subject?.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
          />
          <!-- 收藏状态标签 -->
          <div
            v-if="collection.type"
            :class="[
              COMMON_CLASSES.tag,
              `bg-${
                getCollectionTypeConfig(collection.type).color
              }-500 text-white`,
            ]"
          >
            {{ getCollectionTypeConfig(collection.type).name }}
          </div>
        </div>
        <div class="p-3">
          <h3 :class="COMMON_CLASSES.title">
            {{ collection.subject?.name_cn || collection.subject?.name }}
          </h3>
          <p :class="COMMON_CLASSES.date">
            {{ collection.subject?.date }}
          </p>
          <!-- 评分 -->
          <div
            v-if="collection.rate && collection.rate > 0"
            class="flex items-center"
          >
            <div class="flex text-yellow-400">
              <span
                v-for="i in 5"
                :key="i"
                :class="[
                  COMMON_CLASSES.star,
                  i <= collection.rate ? 'text-yellow-400' : 'text-gray-300',
                ]"
              >
                ★
              </span>
            </div>
            <span class="text-xs text-gray-500 ml-1"
              >{{ collection.rate }}分</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-16 text-gray-500">
      <div class="flex justify-center mb-4">
        <svg
          class="w-16 h-16 text-gray-300 transition-colors duration-300 hover:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          ></path>
        </svg>
      </div>
      <p class="text-lg">暂无收藏内容</p>
      <p class="text-sm mt-1">快去发现你喜欢的作品吧！</p>
    </div>
    <!-- 页码切换 -->
    <div
      v-if="!loading && totalPages > 1"
      class="flex justify-center items-center mt-10 mb-8 gap-3"
    >
      <!-- 上一页按钮 -->
      <button
        class="group flex items-center gap-2 px-5 py-2.5 bg-white text-gray-600 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600 shadow-sm hover:shadow-md"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
      >
        <svg
          class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        <span class="font-medium">上一页</span>
      </button>

      <!-- 页码信息 -->
      <div class="flex items-center gap-2">
        <!-- 页码输入框 -->
        <div
          class="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <span class="text-sm text-gray-500 mr-2">第</span>
          <input
            v-model.number="inputPage"
            @keyup.enter="handleJumpToPage"
            @blur="handleJumpToPage"
            type="number"
            :min="1"
            :max="totalPages"
            class="w-12 text-center font-semibold text-blue-600 bg-transparent border-none outline-none focus:ring-0 transition-colors duration-200"
            :placeholder="currentPage.toString()"
          />
          <span class="text-sm text-gray-500 mx-2">页</span>
          <div class="w-px h-4 bg-gray-300 mx-2"></div>
          <span class="text-sm text-gray-500 mr-1">共</span>
          <span class="font-semibold text-gray-700">{{ totalPages }}</span>
          <span class="text-sm text-gray-500 ml-1">页</span>
        </div>
      </div>

      <!-- 下一页按钮 -->
      <button
        class="group flex items-center gap-2 px-5 py-2.5 bg-white text-gray-600 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600 shadow-sm hover:shadow-md"
        :disabled="currentPage >= totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        <span class="font-medium">下一页</span>
        <svg
          class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>
