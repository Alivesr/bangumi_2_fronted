import { createMemoryHistory, createRouter } from "vue-router";

import Home from "@/pages/Home/index.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/anime", component: Home },
  { path: "/book", component: Home },
  { path: "/game", component: Home },
  { path: "/music", component: Home },
  { path: "/calendar", component: Home }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
