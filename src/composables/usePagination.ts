import { ref, computed, type Ref } from "vue";

export interface PaginationOptions {
  limit?: number;
  initialPage?: number;
}

/**
 * 分页逻辑 Composable
 * @param total 总数据量
 * @param options 分页选项
 * @returns 分页相关的状态和方法
 */
export function usePagination(
  total: Ref<number>,
  options: PaginationOptions = {}
) {
  const { limit = 24, initialPage = 1 } = options;

  const currentPage = ref(initialPage);

  // 计算总页数
  const totalPages = computed(() => {
    return Math.ceil(total.value / limit);
  });

  // 计算可见页码
  const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const current = currentPage.value;
    const total = totalPages.value;

    if (total <= 7) {
      // 总页数少于7页，显示所有页码
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // 总页数多于7页，显示省略号
      if (current <= 4) {
        // 当前页在前4页
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(total);
      } else if (current >= total - 3) {
        // 当前页在后4页
        pages.push(1);
        pages.push("...");
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(total);
      }
    }

    return pages;
  });

  // 计算骨架屏数量
  const skeletonCount = computed(() => {
    // 如果是第一页或没有数据，显示默认数量
    if (currentPage.value === 1 || total.value === 0) {
      return 24;
    }
    // 如果是最后一页，显示剩余数量
    if (currentPage.value === totalPages.value) {
      return total.value % limit || limit;
    }
    // 其他情况显示满页数量
    return limit;
  });

  // 跳转到指定页面
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return false;
    currentPage.value = page;
    return true;
  };

  // 重置到第一页
  const resetToFirstPage = () => {
    currentPage.value = 1;
  };

  // 计算偏移量
  const offset = computed(() => {
    return (currentPage.value - 1) * limit;
  });

  return {
    currentPage,
    totalPages,
    visiblePages,
    skeletonCount,
    offset,
    goToPage,
    resetToFirstPage,
  };
}
