import type { SubjectType } from "@/api/models/SubjectType";

export const formatType = (type: SubjectType) => {
  switch (type) {
    case (type = 1):
      return "书籍";
    case (type = 2):
      return "动画";
    case (type = 3):
      return "音乐";
    case (type = 4):
      return "游戏";
    case (type = 6):
      return "三次元";
  }
};
