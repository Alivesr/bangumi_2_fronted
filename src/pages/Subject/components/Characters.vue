<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { RelatedCharacter, Character, Images } from "@/api";
import { Service } from "@/api/services/Service";
import type { Subject } from "@/api/models/Subject";

const props = defineProps<{
  subject?: Subject;
}>();

const characters = ref<RelatedCharacter[]>([]);
const charactersDetailMap = ref<Record<number, Character>>({});
const loading = ref(false);
const filterType = ref<string>("all");
const showFilterDropdown = ref(false);

// 缓存中文名的 computed map
const chineseNamesMap = computed(() => {
  const map: Record<number, string | null> = {};
  characters.value.forEach((char) => {
    map[char.id] = getChineseNameFromDetail(char.id);
  });
  return map;
});

// 筛选后的角色列表
const filteredCharacters = computed(() => {
  if (filterType.value === "all") {
    return characters.value;
  }
  return characters.value.filter((char) => {
    const type = getRelationType(char.relation);
    return type === filterType.value;
  });
});

// 显示的角色列表（始终只显示前12个）
const displayedCharacters = computed(() => {
  return filteredCharacters.value.slice(0, 12);
});

// 获取角色图片URL
const getCharacterImageUrl = (
  images: Images | { small?: string } | undefined
) => {
  return images?.small || "/default-character.png";
};

// 从角色详情中获取中文名
const getChineseNameFromDetail = (characterId: number) => {
  const detail = charactersDetailMap.value[characterId];
  if (!detail?.infobox) return null;

  // 查找中文名相关的字段
  const chineseNameKeys = [
    "简体中文名",
    "中文名",
    "中文名称",
    "简体名",
    "大陆名",
  ];
  for (const item of detail.infobox) {
    if (item.key && chineseNameKeys.includes(item.key)) {
      return item.value;
    }
  }
  return null;
};

// 角色类型常量
const CharacterRelationType = {
  MAIN: "main", // 主角
  SUPPORTING: "supporting", // 配角
  CAMEO: "cameo", // 客串
  OTHER: "other", // 其他
} as const;

type RelationType =
  (typeof CharacterRelationType)[keyof typeof CharacterRelationType];

// 识别角色关系类型
const getRelationType = (relation: string): RelationType => {
  const lowerRelation = relation.toLowerCase();

  if (lowerRelation.includes("主角") || lowerRelation.includes("主人公")) {
    return CharacterRelationType.MAIN;
  } else if (lowerRelation.includes("配角") || lowerRelation.includes("次要")) {
    return CharacterRelationType.SUPPORTING;
  } else if (
    lowerRelation.includes("客串") ||
    lowerRelation.includes("cameo")
  ) {
    return CharacterRelationType.CAMEO;
  }
  return CharacterRelationType.OTHER;
};

// 角色类型配置
const relationConfig: Record<
  RelationType,
  { priority: number; style: { bg: string; text: string; border: string } }
> = {
  [CharacterRelationType.MAIN]: {
    priority: 1,
    style: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
  },
  [CharacterRelationType.SUPPORTING]: {
    priority: 2,
    style: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  },
  [CharacterRelationType.OTHER]: {
    priority: 3,
    style: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
  },
  [CharacterRelationType.CAMEO]: {
    priority: 4,
    style: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      border: "border-gray-200",
    },
  },
};

// 根据关系类型获取标签样式
const getRelationBadgeStyle = (relation: string) => {
  const type = getRelationType(relation);
  return relationConfig[type].style;
};

// 根据角色关系获取优先级
const getRelationPriority = (relation: string) => {
  const type = getRelationType(relation);
  return relationConfig[type].priority;
};

// 筛选器选项
const filterOptions = [
  { value: "all", label: "全部" },
  { value: CharacterRelationType.MAIN, label: "主角" },
  { value: CharacterRelationType.SUPPORTING, label: "配角" },
  { value: CharacterRelationType.OTHER, label: "其他" },
  { value: CharacterRelationType.CAMEO, label: "客串" },
];

// 当前选中的筛选器标签
const currentFilterLabel = computed(() => {
  const option = filterOptions.find((opt) => opt.value === filterType.value);
  return option ? option.label : "全部";
});

// 切换下拉菜单
const toggleFilterDropdown = (event: Event) => {
  event.stopPropagation();
  showFilterDropdown.value = !showFilterDropdown.value;
};

// 选择筛选类型
const selectFilterType = (value: string) => {
  filterType.value = value;
  showFilterDropdown.value = false;
};

// 关闭下拉菜单
const closeDropdown = () => {
  showFilterDropdown.value = false;
};

// 获取角色列表
const getCharacters = async () => {
  if (!props.subject?.id) return;

  try {
    loading.value = true;
    const res = await Service.getRelatedCharactersBySubjectId(props.subject.id);

    // 按照角色关系排序：主角 > 配角 > 其他 > 客串
    characters.value = res.sort((a, b) => {
      return getRelationPriority(a.relation) - getRelationPriority(b.relation);
    });

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
  <div
    class="bg-white/80 backdrop-blur border border-gray-200/40 p-6 mt-4"
    @click="closeDropdown"
  >
    <!-- 标题区域 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
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
        <!-- 筛选器 -->
        <div class="relative" @click.stop>
          <button
            @click="toggleFilterDropdown"
            class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-transparent rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <span>{{ currentFilterLabel }}</span>
            <svg
              class="w-4 h-4 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': showFilterDropdown }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- 下拉菜单 -->
          <div
            v-if="showFilterDropdown"
            class="absolute top-full left-0 mt-1 w-32 bg-white/95 backdrop-blur border border-gray-200/60 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div class="py-1">
              <button
                v-for="option in filterOptions"
                :key="option.value"
                @click="selectFilterType(option.value)"
                :class="[
                  'w-full text-left px-3 py-2 text-sm transition-colors duration-200',
                  filterType === option.value
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600',
                ]"
              >
                {{ option.label }}
                <span v-if="option.value === 'all'" class="text-gray-400 ml-1">
                  ({{ characters.length }})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">
          {{ filteredCharacters.length }} 个角色
        </span>
        <router-link
          v-if="filteredCharacters.length > 12"
          :to="`/subject/${props.subject?.id}/characters`"
          class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          查看全部
        </router-link>
      </div>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      <div
        v-for="i in 12"
        :key="i"
        class="flex gap-3 p-3 rounded-lg bg-gray-50 animate-pulse"
      >
        <div class="w-14 h-14 bg-gray-200 rounded-md flex-shrink-0"></div>
        <div class="flex-1 space-y-2 pt-0.5">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- 角色列表 -->
    <div
      v-else-if="characters.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      <div
        v-for="item in displayedCharacters"
        :key="item.id"
        class="group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 border border-gray-100 cursor-pointer hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30 bg-white"
      >
        <!-- 角色图片 -->
        <div class="flex-shrink-0">
          <div class="relative overflow-hidden rounded-md">
            <img
              :src="getCharacterImageUrl(item.images)"
              :alt="item.name"
              class="w-14 h-14 object-cover object-top transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        <!-- 角色信息 -->
        <div class="flex flex-col min-w-0 flex-1 pt-0.5">
          <!-- 角色名称和关系标签 -->
          <div class="flex items-start justify-between gap-2 mb-1">
            <div class="flex-1 min-w-0">
              <h4
                class="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors leading-tight"
                :title="chineseNamesMap[item.id] || item.name"
              >
                {{ chineseNamesMap[item.id] || item.name }}
              </h4>
              <!-- 日文名作为副标题 -->
              <p
                v-if="chineseNamesMap[item.id]"
                class="text-xs text-gray-500 truncate mt-0.5 leading-tight"
                :title="item.name"
              >
                {{ item.name }}
              </p>
            </div>
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
            class="text-xs text-gray-600 truncate flex items-center gap-1"
            :title="item.actors[0].name"
          >
            <svg
              class="w-3 h-3 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              ></path>
            </svg>
            <span>{{ item.actors[0].name }}</span>
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
