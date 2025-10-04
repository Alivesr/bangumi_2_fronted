<script setup lang="ts">
import type { Subject } from "@/api/models/Subject";
import type { WikiV0 } from "@/api/models/WikiV0";

const props = defineProps<{
  subject?: Subject;
}>();

const formatInfoboxValue = (value: WikiV0[] | string): string => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        const v = entry?.values ?? "";
        const k = entry?.keys ?? "";
        return k ? `${k}: ${v}` : v;
      })
      .filter(Boolean)
      .join("、");
  }
  return value ?? "";
};
</script>

<template>
  <div class="w-64 flex-shrink-0" style="min-width: 16rem">
    <div class="h-96 rounded-xl overflow-hidden shadow-lg">
      <img
        :src="props.subject?.images.medium"
        alt="subject"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    <!-- 基本信息（放在图片正下方） -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">基本信息</h3>
      <div class="flex flex-col gap-3">
        <div
          v-for="item in props.subject?.infobox"
          :key="item.key"
          class="flex flex-col gap-1 py-2 border-b border-gray-100 last:border-b-0"
        >
          <div class="font-medium text-gray-700 text-sm">
            {{ item.key }}
          </div>
          <div class="text-gray-600 text-sm leading-relaxed">
            {{ formatInfoboxValue(item.value) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
