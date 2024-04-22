import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
    meta: {
      layout: 'Default',
    },
  },
];

export default routes;