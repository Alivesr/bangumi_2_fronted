<script setup lang="ts">
import { Service } from "@/api/services/Service";
import { ref, onMounted } from "vue";
import type { CalendarItem } from "@/api/models/CalenderItem";
import PicView from "@/pages/Calendar/picview.vue";
import Squares from "@/icon/squares.svg";
import List from "@/icon/list.svg";
const calendarList = ref<CalendarItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const viewType = ref("grid");

// 获取今天对应的星期几
const getTodayWeekday = () => {
  const today = new Date();
  const weekday = today.getDay();
  console.log(weekday, "getTodayWeekday"); // 0=周日, 1=周一, ..., 6=周六
  return weekday;
};

// 重新排列日历列表，从今天开始按周顺序排列
const getReorderedCalendarList = () => {
  if (viewType.value === "grid") {
    return calendarList.value;
  }

  const todayWeekday = getTodayWeekday();
  const reorderedList = [];

  // 从今天开始，按周顺序排列（今天、明天、后天...）
  for (let i = 0; i < 7; i++) {
    const targetWeekday = (todayWeekday + i) % 7;
    const dayItem = calendarList.value.find(
      (day) => day.weekday?.id === targetWeekday
    );
    if (dayItem) {
      reorderedList.push(dayItem);
    }
  }

  return reorderedList;
};

// 加载数据
const loadCalendar = async () => {
  try {
    loading.value = true;
    error.value = null;
    const res = await Service.getCalendar();
    calendarList.value = res;
  } catch (err) {
    error.value = "加载失败，请稍后重试";
    console.error("Failed to load calendar:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCalendar();
});
</script>
<template>
  <div class="w-full">
    <div class="w-full sm:px-6 lg:px-6 py-8 max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="flex items-center justify-between mb-10">
        <div class="text-center flex-1">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">每周放送</h1>
          <p class="text-gray-600">按星期查看精彩内容</p>
        </div>

        <!-- 视图切换按钮 -->
        <div class="flex bg-gray-100 rounded-lg p-1 mt-10">
          <button
            @click="viewType = 'grid'"
            :class="[
              'flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200',
              viewType === 'grid'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            <!-- 网格图标 -->
            <Squares />
          </button>
          <button
            @click="viewType = 'list'"
            :class="[
              'flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200',
              viewType === 'list'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            <!-- 列表图标 -->
            <List />
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div
          class="w-10 h-10 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        ></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm p-6"
      >
        <div class="text-red-500 mb-3">
          <svg
            class="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadCalendar"
          class="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          重新加载
        </button>
      </div>

      <!-- 星期日历 -->

      <div v-else class="space-y-6">
        <!-- 星期内容 -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7"
          v-if="viewType === 'grid'"
        >
          <div
            v-for="(day, index) in calendarList"
            :key="day.weekday?.id ?? index"
            class="rounded-xl overflow-hidden transition-all duration-200 flex flex-col"
          >
            <!-- 星期标题 -->
            <div class="px-0 py-3 text-center">
              <div
                class="inline-block bg-gray-800 text-white text-sm font-bold px-3 py-2 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-200 w-42"
              >
                {{ day.weekday?.cn }}
              </div>
            </div>

            <!-- 内容区域 -->
            <div class="flex flex-wrap gap-2 justify-center">
              <PicView v-for="item in day.items" :key="item.id" :item="item" />
            </div>
          </div>
        </div>
        <!-- 列表形式 -->
        <div v-else class="flex flex-col gap-2">
          <div v-for="day in getReorderedCalendarList()" :key="day.weekday?.id">
            <div class="px-0 py-3 text-left">
              <div
                class="inline-block bg-gray-800 text-white text-sm text-center font-bold px-3 py-2 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-200 w-42"
              >
                {{ day.weekday?.cn }}
              </div>
            </div>
            <div class="flex flex-wrap gap-2 flex-start">
              <PicView v-for="item in day.items" :key="item.id" :item="item" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
