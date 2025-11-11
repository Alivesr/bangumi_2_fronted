import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("@/pages/Home/index.vue");
const Anime = () => import("@/pages/Anime/index.vue");
const Book = () => import("@/pages/Book/index.vue");
const Game = () => import("@/pages/Game/index.vue");
const Music = () => import("@/pages/Music/index.vue");
const Real = () => import("@/pages/Real/index.vue");
const Calendar = () => import("@/pages/Calendar/index.vue");
const Auth = () => import("@/pages/Auth/index.vue");
const User = () => import("@/pages/User/index.vue");
const Subject = () => import("@/pages/Subject/index.vue");
const Search = () => import("@/pages/Search/index.vue");
const Ep = () => import("@/pages/Ep/index.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/anime", component: Anime },
  { path: "/book", component: Book },
  { path: "/game", component: Game },
  { path: "/music", component: Music },
  { path: "/real", component: Real },
  { path: "/calendar", component: Calendar },
  { path: "/auth/success", component: Auth },
  { path: "/auth/error", component: Auth },
  { path: "/user/:id", component: User },
  { path: "/subject/:id", component: Subject },
  { path: "/search/:keyword", component: Search },
  { path: "/ep/:id", component: Ep },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 每次路由切换都直接重置到页面顶部
    return { top: 0 };
  },
});

export default router;
