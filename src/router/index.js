import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Main from '../components/Main.vue';
import MovieDetail from '../components/MovieDetail.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Main,
    },
    {
        path: '/movie/:id',
        name: 'movie-detail',
        component: MovieDetail,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;