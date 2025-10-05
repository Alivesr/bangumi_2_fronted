<script setup lang="ts">
export type ViewMode = "grid" | "list";

interface Props {
  modelValue: ViewMode;
}

interface Emits {
  (e: "update:modelValue", value: ViewMode): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const updateMode = (mode: ViewMode) => {
  emit("update:modelValue", mode);
};
</script>

<template>
  <div
    class="flex items-center bg-white/80 backdrop-blur border border-gray-200/40 rounded-lg p-1"
  >
    <button
      @click="updateMode('grid')"
      :class="[
        'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all duration-200',
        modelValue === 'grid'
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100',
      ]"
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
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
      网格
    </button>
    <button
      @click="updateMode('list')"
      :class="[
        'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all duration-200',
        modelValue === 'list'
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100',
      ]"
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
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
      列表
    </button>
  </div>
</template>
