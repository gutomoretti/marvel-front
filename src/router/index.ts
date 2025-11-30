import { createRouter, createWebHistory } from 'vue-router';
import HeroListView from '../views/HeroListView.vue';
import HeroFormView from '../views/HeroFormView.vue';
import HeroDetailsView from '../views/HeroDetailsView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'heroes',
      component: HeroListView
    },
    {
      path: '/heroes/new',
      name: 'create-hero',
      component: HeroFormView
    },
    {
      path: '/heroes/:id',
      name: 'hero-details',
      component: HeroDetailsView,
      props: true
    },
    {
      path: '/heroes/:id/edit',
      name: 'edit-hero',
      component: HeroFormView,
      props: true
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
