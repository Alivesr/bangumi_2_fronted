<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { Service } from "@/api/services/Service";
import type { Subject } from "@/api/models/Subject";
import Top from "@/pages/Subject/components/Top.vue";
import Left from "@/pages/Subject/components/Left.vue";
import Introduction from "@/pages/Subject/components/Introduction.vue";
import Tags from "@/pages/Subject/components/Tags.vue";
import Characters from "@/pages/Subject/components/Characters.vue";
import SubjectRelations from "@/pages/Subject/components/Subject.vue";

const route = useRoute();
const subjectId = Number(route.params.id);
const subject = ref<Subject>();
const loading = ref(true);
const error = ref<string | null>(null);

// 获取条目详情
const getSubject = async () => {
  try {
    loading.value = true;
    error.value = null;
    const res: Subject = await Service.getSubjectById(subjectId);
    subject.value = res as Subject;
    console.log(subject.value);
  } catch (err) {
    console.error("获取条目详情失败:", err);
    error.value = "获取条目详情失败，请稍后重试";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getSubject();
});
</script>

<template>
  <div class="flex flex-col box-border w-full">
    <!-- 加载骨架屏 -->
    <template v-if="loading">
      <!-- 顶部骨架屏 -->
      <div class="w-full bg-white/80 backdrop-blur border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div
              class="flex flex-col sm:flex-row sm:items-end sm:justify-between"
            >
              <div class="flex-1 min-w-0 space-y-3">
                <div
                  class="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3 animate-pulse"
                ></div>
                <div
                  class="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2 animate-pulse"
                ></div>
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-6 flex space-x-3">
                <div
                  class="h-9 w-20 bg-gray-100 rounded-md animate-pulse"
                ></div>
                <div
                  class="h-9 w-20 bg-gray-100 rounded-md animate-pulse"
                ></div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200">
            <div class="flex space-x-6 overflow-x-auto py-4">
              <div
                v-for="i in 9"
                :key="i"
                class="h-7 w-14 bg-gray-100 rounded animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容骨架屏 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex gap-8 mt-6">
          <!-- 左侧骨架屏 -->
          <div class="w-64 flex-shrink-0" style="min-width: 16rem">
            <!-- 封面图片骨架屏 -->
            <div
              class="h-96 rounded-xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse shadow-lg"
            ></div>
            <!-- 基本信息骨架屏 -->
            <div
              class="bg-white/80 backdrop-blur border border-gray-200/40 p-6 mt-4"
            >
              <div
                class="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-24 mb-4 animate-pulse"
              ></div>
              <div class="space-y-3">
                <div
                  v-for="i in 6"
                  :key="i"
                  class="py-2 border-b border-gray-100/50 last:border-0"
                >
                  <div
                    class="h-3.5 bg-gray-100 rounded w-20 mb-2 animate-pulse"
                  ></div>
                  <div
                    class="h-3 bg-gray-100 rounded w-full animate-pulse"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容骨架屏 -->
          <div class="flex-1 min-w-0 space-y-4">
            <!-- 简介骨架屏 -->
            <div
              class="bg-white/80 backdrop-blur border border-gray-200/40 p-6"
            >
              <div
                class="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-16 mb-4 animate-pulse"
              ></div>
              <div class="space-y-2.5">
                <div
                  class="h-3.5 bg-gray-100 rounded w-full animate-pulse"
                ></div>
                <div
                  class="h-3.5 bg-gray-100 rounded w-full animate-pulse"
                ></div>
                <div
                  class="h-3.5 bg-gray-100 rounded w-4/5 animate-pulse"
                ></div>
              </div>
            </div>

            <!-- 标签骨架屏 -->
            <div
              class="bg-white/80 backdrop-blur border border-gray-200/40 p-6"
            >
              <div
                class="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-16 mb-4 animate-pulse"
              ></div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="i in 8"
                  :key="i"
                  class="h-7 bg-gray-100 rounded-full animate-pulse"
                  :class="[
                    i === 1 ? 'w-20' : '',
                    i === 2 ? 'w-16' : '',
                    i === 3 ? 'w-24' : '',
                    i === 4 ? 'w-18' : '',
                    i === 5 ? 'w-22' : '',
                    i === 6 ? 'w-16' : '',
                    i === 7 ? 'w-20' : '',
                    i === 8 ? 'w-24' : '',
                  ]"
                ></div>
              </div>
            </div>

            <!-- 角色骨架屏 -->
            <div
              class="bg-white/80 backdrop-blur border border-gray-200/40 p-6"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-16 animate-pulse"
                ></div>
                <div class="h-4 bg-gray-100 rounded w-28 animate-pulse"></div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="i in 6"
                  :key="i"
                  class="flex gap-3 p-3 rounded-lg bg-gray-50/50"
                >
                  <div
                    class="w-14 h-14 bg-gray-100 rounded-md flex-shrink-0 animate-pulse"
                  ></div>
                  <div class="flex-1 space-y-2 pt-0.5">
                    <div
                      class="h-3.5 bg-gray-100 rounded w-3/4 animate-pulse"
                    ></div>
                    <div
                      class="h-3 bg-gray-100 rounded w-1/2 animate-pulse"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 实际内容 -->
    <template v-else>
      <!-- 顶部导航标题 -->
      <Top :subject="subject" />
      <!-- 内容 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex gap-8 mt-6">
          <!-- 左侧 -->
          <Left :subject="subject" />
          <!-- 右侧内容区域 -->
          <div class="flex-1 min-w-0">
            <!-- 简介 -->
            <Introduction :subject="subject" />
            <!-- 标签 -->
            <Tags :subject="subject" />
            <!-- 角色 -->
            <Characters :subject="subject" />
            <!-- 关联条目 -->
            <SubjectRelations :subject="subject" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
