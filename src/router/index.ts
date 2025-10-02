import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home/index.vue";
import Anime from "@/pages/Anime/index.vue";
import Book from "@/pages/Book/index.vue";
import Game from "@/pages/Game/index.vue";
import Music from "@/pages/Music/index.vue";
import Real from "@/pages/Real/index.vue";
import Calendar from "@/pages/Calendar/index.vue";
import Auth from "@/pages/Auth/index.vue";
import User from "@/pages/User/index.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
