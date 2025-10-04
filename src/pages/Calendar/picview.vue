<script setup lang="ts">
import type { CalendarItem } from "@/api/models/CalenderItem";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  item: NonNullable<CalendarItem["items"]>[number] | undefined;
}>();

const handleClick = () => {
  if (props.item?.id) {
    router.push(`/subject/${props.item.id}`);
  }
};
</script>

<template>
  <div class="rounded-xl">
    <div
      @click="handleClick"
      class="relative w-42 h-62 rounded-[5px] overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-102"
    >
      <img
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        :src="item?.images?.large"
        :alt="item?.name_cn"
      />
      <!-- 渐变遮罩层 -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <!-- 名字文字 -->
      <div
        class="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center"
      >
        <div
          class="bg-black/60 backdrop-blur-sm text-white text-xs font-medium leading-tight px-2 py-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-center w-full flex items-center justify-center overflow-hidden"
        >
          <span class="truncate">{{ item?.name_cn || item?.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
