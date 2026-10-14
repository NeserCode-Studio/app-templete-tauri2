import { createRouter, createWebHashHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		meta: {},
		component: () => import("./views/Home.vue"),
	},
	{
		path: "/software",
		name: "Software",
		meta: {},
		component: () => import("./views/Software.vue"),
	},
	{
		path: "/framework",
		name: "Framework",
		meta: {},
		component: () => import("./views/Framework.vue"),
	},
	{
		path: "/tray",
		name: "TrayMenu",
		meta: { tray: true },
		component: () => import("./views/TrayMenu.vue"),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
