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
  </div>
</template>
