<script setup lang="ts">
interface Props {
  mode: "grid" | "list";
  count: number;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    :class="[
      'gap-4',
      props.mode === 'grid'
        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
        : 'space-y-3',
    ]"
  >
    <!-- 网格模式骨架屏 -->
    <template v-if="props.mode === 'grid'">
      <div
        v-for="(_, index) in props.count"
        :key="index"
        class="bg-white/80 backdrop-blur border border-gray-200/40 rounded-lg overflow-hidden animate-pulse"
      >
        <div class="aspect-[3/4] bg-gray-200"></div>
        <div class="p-3 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </template>

    <!-- 列表模式骨架屏 -->
    <template v-else>
      <div
        v-for="(_, index) in props.count"
        :key="index"
        class="bg-white/80 backdrop-blur border border-gray-200/40 border-l-2 border-l-transparent p-4 animate-pulse"
      >
        <div class="flex gap-4">
          <!-- 封面骨架 -->
          <div class="flex-shrink-0">
            <div
              class="w-24 h-32 bg-gray-200 rounded border border-gray-200"
            ></div>
          </div>
          <!-- 信息骨架 -->
          <div class="flex-1 min-w-0 flex flex-col py-0.5 space-y-2">
            <div class="flex items-baseline gap-2">
              <div class="h-5 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-12"></div>
            </div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            <div class="flex items-center gap-3">
              <div class="h-4 bg-gray-200 rounded w-16"></div>
              <div class="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
