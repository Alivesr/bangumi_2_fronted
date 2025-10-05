import { ref } from "vue";
import { Service } from "@/api/services/Service";
import { type Subject } from "@/api/models/Subject";
import { type SubjectType } from "@/api/models/SubjectType";
import { type SubjectCategory } from "@/api/models/SubjectCategory";

export interface SubjectDataOptions {
  type: SubjectType;
  limit?: number;
}

/**
 * 条目数据获取 Composable
 * @param options 配置选项
 * @returns 数据相关的状态和方法
 */
export function useSubjectData(options: SubjectDataOptions) {
  const { type, limit = 24 } = options;

  const subjects = ref<Subject[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const filterValues = ref<Record<string, string | number | undefined>>({});

  // 获取条目列表
  const fetchSubjects = async (offset: number = 0) => {
    if (loading.value) return;

    try {
      loading.value = true;

      // 处理排序参数
      const sortParam = filterValues.value.sort
        ? String(filterValues.value.sort)
        : undefined;

      // 处理年份参数
      const yearParam = filterValues.value.year
        ? Number(filterValues.value.year)
        : undefined;

      // 处理分类参数
      const categoryParam = filterValues.value.category
        ? (Number(filterValues.value.category) as SubjectCategory)
        : undefined;

      const res = await Service.getSubjects(
        type,
        categoryParam,
        undefined,
        undefined,
        sortParam,
        yearParam,
        undefined,
        limit,
        offset
      );

      subjects.value = res.data || [];
      total.value = res.total || 0;
    } catch (err) {
      console.error("获取条目列表失败:", err);
      subjects.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  };

  // 更新筛选条件
  const updateFilters = (
    newFilters: Record<string, string | number | undefined>
  ) => {
    filterValues.value = { ...newFilters };
  };

  // 清空筛选条件
  const clearFilters = () => {
    filterValues.value = {};
  };

  return {
    subjects,
    loading,
    total,
    filterValues,
    fetchSubjects,
    updateFilters,
    clearFilters,
  };
}
