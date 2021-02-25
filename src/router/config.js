import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
    routes: [
        {
            path: '/login',
            name: '登录页',
            component: () => import('@/pages/login')
        },
        {
            path: '*',
            name: '404',
            component: () => import('@/pages/exception/404'),
        },
        {
            path: '/403',
            name: '403',
            component: () => import('@/pages/exception/403'),
        },
        {
            path: '/',
            name: '首页',
            component: TabsView,
            redirect: '/login',
            children: [
                {
                    path: 'dashboard',
                    name: 'Dashboard',
                    meta: {
                        icon: 'dashboard'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'workplace',
                            name: '工作台',
                            meta: {
                                page: {
                                    closable: false
                                }
                            },
                            component: () => import('@/pages/dashboard/workplace'),
                        },
                    ]
                },
                {
                    path: 'list',
                    name: '列表页',
                    meta: {
                        icon: 'table'
                    },
                    component: PageView,
                    children: [

                        {
                            path: 'item',
                            name: 'item',
                            component: () => import('@/pages/list/item'),
                        },
                    ]
                },
                {
                    path: 'exception',
                    name: '异常页',
                    meta: {
                        icon: 'warning',
                    },
                    component: BlankView,
                    children: [
                        {
                            path: '404',
                            name: 'Exp404',
                            component: () => import('@/pages/exception/404')
                        },
                        {
                            path: '403',
                            name: 'Exp403',
                            component: () => import('@/pages/exception/403')
                        },
                        {
                            path: '500',
                            name: 'Exp500',
                            component: () => import('@/pages/exception/500')
                        }
                    ]
                },
                {
                    name: 'Ant Design Vue',
                    path: 'antdv',
                    meta: {
                        icon: 'ant-design',
                        link: 'https://www.antdv.com/docs/vue/introduce-cn/'
                    }
                },
                {
                    name: '使用文档',
                    path: 'document',
                    meta: {
                        icon: 'file-word',
                        link: 'https://iczer.gitee.io/vue-antd-admin-docs/'
                    }
                }
            ]
        },
    ]
}

export default options
