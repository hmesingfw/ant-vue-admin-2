import { createRouter, createWebHistory } from 'vue-router'
import { formatRoutes } from '@/utils/routerUtil'

/**
 * 初始化路由实例
 * @param isAsync 是否异步路由模式
 * @returns {VueRouter}
 */
function initRouter(isAsync) {
    const options = isAsync ? require('./async/config.async').default : require('./config').default
    formatRoutes(options.routes)
    return createRouter({
        // history: createWebHistory(process.env.BASE_URL),
        history: createWebHistory(),
        routes: options.routes
    })
}
// 不需要登录拦截的路由配置
export const loginIgnore = {
    names: ['404', '403'], // 根据路由名称匹配
    paths: ['/login'], // 根据路由fullPath匹配
    /**
     * 判断路由是否包含在该配置中
     * @param route vue-router 的 route 对象
     * @returns {boolean}
     */
    includes(route) {
        return this.names.includes(route.name) || this.paths.includes(route.path)
    }
}
export default initRouter
