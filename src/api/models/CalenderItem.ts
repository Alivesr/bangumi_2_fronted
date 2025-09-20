export type CalendarItem = {
  weekday?: {
    en: string;
    cn: string;
    ja: string;
    id: number;
  };
  items?: Array<{
    id?: number;
    url?: string;
    type?: number;
    name?: string;
    name_cn?: string;
    summary?: string;
    air_date?: string;
    air_weekday?: number;
    images?: {
      large: string;
      common: string;
      medium: string;
      small: string;
      grid: string;
    };
    eps?: number;
    eps_count?: number;
    rating?: {
      total: number;
      count: {
        "1": number;
        "2": number;
        "3": number;
        "4": number;
        "5": number;
        "6": number;
        "7": number;
        "8": number;
        "9": number;
        "10": number;
      };
      score: number;
    };
    rank?: number;
    collection?: {
      wish: number;
      collect: number;
      doing: number;
      on_hold: number;
      dropped: number;
    };
  }>;
};
