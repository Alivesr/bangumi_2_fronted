import { type SubjectType } from "@/api/models/SubjectType";
import { SubjectAnimeCategory } from "@/api/models/SubjectAnimeCategory";
import { SubjectBookCategory } from "@/api/models/SubjectBookCategory";
import { SubjectGameCategory } from "@/api/models/SubjectGameCategory";
import { SubjectRealCategory } from "@/api/models/SubjectRealCategory";

export interface CategoryOption {
  label: string;
  value: string | number;
}

/**
 * 根据条目类型获取分类选项
 * @param type 条目类型
 * @returns 分类选项数组
 */
export function useSubjectCategories(type: SubjectType): CategoryOption[] {
  switch (type) {
    case 2: // 动画
      return [
        { label: "全部", value: "" },
        { label: "TV", value: SubjectAnimeCategory.TV },
        { label: "OVA", value: SubjectAnimeCategory.OVA },
        { label: "电影", value: SubjectAnimeCategory.Movie },
        { label: "WEB", value: SubjectAnimeCategory.WEB },
        { label: "其他", value: SubjectAnimeCategory.Other },
      ];
    case 1: // 书籍
      return [
        { label: "全部", value: "" },
        { label: "漫画", value: SubjectBookCategory.Comic },
        { label: "小说", value: SubjectBookCategory.Novel },
        { label: "画集", value: SubjectBookCategory.Illustration },
        { label: "其他", value: SubjectBookCategory.Other },
      ];
    case 4: // 游戏
      return [
        { label: "全部", value: "" },
        { label: "游戏", value: SubjectGameCategory.Games },
        { label: "软件", value: SubjectGameCategory.Software },
        { label: "扩展包", value: SubjectGameCategory.DLC },
        { label: "桌游", value: SubjectGameCategory.Tabletop },
        { label: "其他", value: SubjectGameCategory.Other },
      ];
    case 6: // 三次元
      return [
        { label: "全部", value: "" },
        { label: "日剧", value: SubjectRealCategory.JP },
        { label: "欧美剧", value: SubjectRealCategory.EN },
        { label: "华语剧", value: SubjectRealCategory.CN },
        { label: "电视剧", value: SubjectRealCategory.TV },
        { label: "电影", value: SubjectRealCategory.Movie },
        { label: "演出", value: SubjectRealCategory.Live },
        { label: "综艺", value: SubjectRealCategory.Show },
        { label: "其他", value: SubjectRealCategory.Other },
      ];
    default:
      return [];
  }
}
