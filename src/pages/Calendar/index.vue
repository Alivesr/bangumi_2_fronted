<script setup lang="ts">
import { Service } from "@/api/services/Service";
import { ref, onMounted } from "vue";
import type { CalendarItem } from "@/api/models/CalenderItem";

const calendarList = ref<CalendarItem[]>([]);
onMounted(async () => {
  const res: CalendarItem[] = await Service.getCalendar();
  calendarList.value = res;
});
</script>
<template>
  <div class="w-full min-h-screen bg-gray-50">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">每日放送</h1>

      <div class="grid gap-6">
        <div
          v-for="day in calendarList"
          :key="day.weekday?.id"
          class="bg-white rounded-2xl shadow-md p-6"
        >
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            {{ day.weekday?.cn }} ({{ day.weekday?.en }})
          </h2>

          <div
            v-if="day.items && day.items.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="item in day.items"
              :key="item.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start space-x-3">
                <img
                  v-if="item.images?.medium"
                  :src="item.images.medium"
                  :alt="item.name_cn || item.name"
                  class="w-16 h-20 object-cover rounded"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-medium text-gray-900 truncate">
                    {{ item.name_cn || item.name }}
                  </h3>
                  <p
                    v-if="item.name && item.name !== item.name_cn"
                    class="text-sm text-gray-600 truncate"
                  >
                    {{ item.name }}
                  </p>
                  <p
                    v-if="item.summary"
                    class="text-sm text-gray-500 mt-2 line-clamp-2"
                  >
                    {{ item.summary }}
                  </p>
                  <div
                    class="mt-2 flex items-center space-x-4 text-xs text-gray-500"
                  >
                    <span v-if="item.air_date">{{ item.air_date }}</span>
                    <span v-if="item.rating?.score"
                      >评分: {{ item.rating.score }}</span
                    >
                    <span v-if="item.eps_count">共{{ item.eps_count }}话</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-gray-500 text-center py-8">暂无放送内容</div>
        </div>
      </div>
    </div>
  </div>
</template>
