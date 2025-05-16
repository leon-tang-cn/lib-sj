import { createRouter, createWebHashHistory } from 'vue-router';
import { getMenus } from '@/config/menu.js';

const routes = [];
const menuData = getMenus();
menuData.forEach(menu => {
    if (menu.children) {
        menu.children.forEach(child => {
            routes.push({
                path: child.path,
                name: child.name,
                component: () => import(`../views/${child.name}.vue`)
            });
        });
    }
});

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
