<script setup lang="ts">
import { type Subject } from "@/api/models/Subject";
import { formatType } from "@/utils/formatType";

interface Props {
  subject: Subject;
  mode: "grid" | "list";
}

interface Emits {
  (e: "click", id: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClick = () => {
  emit("click", props.subject.id);
};
</script>

<template>
  <!-- 网格模式 -->
  <div
    v-if="props.mode === 'grid'"
    @click="handleClick"
    class="group bg-white/80 backdrop-blur border border-gray-200/40 hover:border-blue-300/60 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
  >
    <!-- 封面 -->
    <div class="aspect-[3/4] overflow-hidden bg-gray-100 relative">
      <img
        :src="props.subject.images?.common || props.subject.images?.medium"
        :alt="props.subject.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <!-- 评分角标 -->
      <div
        v-if="props.subject.rating?.score"
        class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"
      >
        <span>{{ props.subject.rating.score.toFixed(1) }}</span>
        <span class="text-yellow-400">★</span>
      </div>
    </div>

    <!-- 信息 -->
    <div class="p-3">
      <h3
        class="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-1"
        :title="props.subject.name_cn || props.subject.name"
      >
        {{ props.subject.name_cn || props.subject.name }}
      </h3>
      <p v-if="props.subject.date" class="text-xs text-gray-400 truncate">
        {{ props.subject.date }}
      </p>
    </div>
  </div>

  <!-- 列表模式 -->
  <div
    v-else
    @click="handleClick"
    class="group bg-white/80 backdrop-blur border border-gray-200/40 border-l-2 border-l-transparent hover:border-l-blue-500 hover:border-gray-300/60 p-4 cursor-pointer transition-all duration-200 hover:bg-white hover:shadow-sm"
  >
    <div class="flex gap-4">
      <!-- 封面图片 -->
      <div class="flex-shrink-0">
        <div class="relative overflow-hidden rounded border border-gray-200">
          <img
            :src="props.subject.images?.large || props.subject.images?.medium"
            :alt="props.subject.name"
            class="w-24 h-32 object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-105"
            loading="lazy"
          />
        </div>
      </div>

      <!-- 条目信息 -->
      <div class="flex-1 min-w-0 flex flex-col py-0.5">
        <!-- 标题行 -->
        <div class="flex items-start gap-3 mb-1">
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2">
              <h3
                class="text-base font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors"
                :title="props.subject.name_cn || props.subject.name"
              >
                {{ props.subject.name_cn || props.subject.name }}
              </h3>
              <!-- 类型标签 -->
              <span
                class="text-[10px] font-medium text-gray-400 uppercase tracking-wide flex-shrink-0"
              >
                {{ formatType(props.subject.type) }}
              </span>
            </div>
            <!-- 原名 -->
            <p
              v-if="props.subject.name_cn && props.subject.name"
              class="text-xs text-gray-400 line-clamp-1 mt-0.5"
              :title="props.subject.name"
            >
              {{ props.subject.name }}
            </p>
          </div>
        </div>

        <!-- 评分和日期 -->
        <div class="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <div
            v-if="props.subject.rating?.score"
            class="flex items-center gap-1.5"
          >
            <span class="text-sm font-bold text-gray-900">{{
              props.subject.rating.score.toFixed(1)
            }}</span>
            <span class="text-yellow-500">★</span>
            <span class="text-[10px]">({{ props.subject.rating.total }})</span>
          </div>
          <span v-if="props.subject.date" class="text-[10px] text-gray-400">
            {{ props.subject.date }}
          </span>
        </div>

        <!-- 简介摘要 -->
        <p
          v-if="props.subject.summary"
          class="text-xs text-gray-500 line-clamp-2 leading-relaxed"
        >
          {{ props.subject.summary }}
        </p>
      </div>
    </div>
  </div>
</template>
