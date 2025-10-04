<script setup lang="ts">
import { ref, watch } from "vue";
import type { RelatedCharacter, Character, Images } from "@/api";
import { Service } from "@/api/services/Service";
import type { Subject } from "@/api/models/Subject";

const props = defineProps<{
  subject?: Subject;
}>();

const characters = ref<RelatedCharacter[]>([]);
const charactersDetailMap = ref<Record<number, Character>>({});
const loading = ref(false);

// 获取角色图片URL
const getCharacterImageUrl = (
  images: Images | { small?: string } | undefined
) => {
  return images?.small || "/default-character.png";
};

// 根据关系类型获取标签样式
const getRelationBadgeStyle = (relation: string) => {
  const lowerRelation = relation.toLowerCase();

  if (lowerRelation.includes("主角") || lowerRelation.includes("主人公")) {
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    };
  } else if (lowerRelation.includes("配角") || lowerRelation.includes("次要")) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    };
  } else if (
    lowerRelation.includes("客串") ||
    lowerRelation.includes("cameo")
  ) {
    return {
      bg: "bg-gray-100",
      text: "text-gray-600",
      border: "border-gray-200",
    };
  } else {
    return {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    };
  }
};

// 获取角色列表
const getCharacters = async () => {
  if (!props.subject?.id) return;

  try {
    loading.value = true;
    const res = await Service.getRelatedCharactersBySubjectId(props.subject.id);
    characters.value = res;

    console.log(characters.value, "characters");
    // 获取每个角色的详细信息
    await Promise.all(
      res.map((character: RelatedCharacter) => getCharacterDetail(character.id))
    );
  } catch (err) {
    console.error("获取角色信息失败:", err);
    characters.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取角色详细信息
const getCharacterDetail = async (id: number) => {
  try {
    const res = await Service.getCharacterById(id);
    charactersDetailMap.value[id] = res;
    return res;
  } catch (err) {
    console.error(`获取角色 ${id} 详细信息失败:`, err);
    charactersDetailMap.value[id] = {} as Character;
  }
};

// 监听 subject 变化，当 subject 加载完成后获取角色信息
watch(
  () => props.subject?.id,
  (newId) => {
    if (newId) {
      getCharacters();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-4">
    <!-- 标题区域 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg
          class="w-5 h-5 text-gray-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-800">角色</h3>
      </div>
      <span class="text-sm text-gray-500">
        {{ characters.length }} 个角色
      </span>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <div
        v-for="i in 8"
        :key="i"
        class="flex gap-3 p-3 rounded-lg border border-gray-100 animate-pulse"
      >
        <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- 角色列表 -->
    <div
      v-else-if="characters.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <div
        v-for="item in characters.slice(0, 12)"
        :key="item.id"
        class="group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 border border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/50 bg-white"
      >
        <!-- 角色图片 -->
        <div class="flex-shrink-0">
          <img
            :src="getCharacterImageUrl(item.images)"
            :alt="item.name"
            class="w-16 h-16 object-cover object-top rounded-md"
            loading="lazy"
          />
        </div>

        <!-- 角色信息 -->
        <div class="flex flex-col min-w-0 flex-1 pt-0.5">
          <!-- 角色名称和关系标签 -->
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <h4
              class="font-semibold text-gray-800 text-sm truncate flex-1 group-hover:text-blue-600 transition-colors"
              :title="item.name"
            >
              {{ item.name }}
            </h4>
            <span
              :class="[
                'px-2 py-0.5 text-xs font-medium rounded-md flex-shrink-0 border',
                getRelationBadgeStyle(item.relation).bg,
                getRelationBadgeStyle(item.relation).text,
                getRelationBadgeStyle(item.relation).border,
              ]"
            >
              {{ item.relation }}
            </span>
          </div>

          <!-- 声优信息 -->
          <p
            v-if="item.actors?.[0]?.name"
            class="text-xs text-gray-600 truncate"
            :title="item.actors[0].name"
          >
            <span class="text-gray-400">CV:</span> {{ item.actors[0].name }}
          </p>

          <!-- 角色详情 -->
          <p
            v-else-if="charactersDetailMap[item.id]?.infobox?.[0]?.value"
            class="text-xs text-gray-500 truncate"
          >
            {{ charactersDetailMap[item.id]?.infobox?.[0]?.value }}
          </p>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-12 text-gray-400"
    >
      <svg
        class="w-16 h-16 mb-3 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        ></path>
      </svg>
      <p class="text-sm">暂无角色信息</p>
    </div>
  </div>
</template>
