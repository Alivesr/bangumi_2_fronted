<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { Service } from "@/api/services/Service";
import type { Subject } from "@/api/models/Subject";
import Top from "@/pages/Subject/components/Top.vue";

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
  <div class="flex flex-col items-center justify-center box-border w-full">
    <!-- 顶部导航标题 -->
    <Top :subject="subject" />
  </div>
</template>
