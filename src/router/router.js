import Main from '@/views/Main.vue';

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    // name: 'otherRouter',
    component: Main,
    children: [{
            path: '',
            redirect: {
                name: 'home_index'
            }
        },
        {
            path: 'demo/detail/:id',
            title: '列表详情',
            name: 'demo_datail',
            component: () =>
                import ('@/views/demo/detail.vue')
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/home',
        icon: 'guzhangguanli',
        title: '数据',
        name: 'home',
        component: Main,
        children: [{
            path: 'index',
            title: '实时数据',
            name: 'home_index',
            component: () =>
                import ('@/views/home/index.vue')
        }]
    },
    {
        path: '/demo',
        icon: 'guzhangguanli',
        title: '设备',
        name: 'demo',
        component: Main,
        children: [
            {
                path: 'device',
                title: '设备列表',
                name: 'device_list',
                component: () =>
                    import ('@/views/demo/device.vue')
            },
            {
                path: 'deviceindex',
                title: '指标列表',
                name: 'deviceindex_list',
                component: () =>
                    import ('@/views/demo/deviceindex.vue')
            }
        ]
    },
    {
        path: '/vis',
        icon: 'guzhangguanli',
        title: '可视化',
        name: 'vis',
        component: Main,
        children: [{
            path: 'index',
            title: 'iframe',
            name: 'vis_iframe',
            component: () =>
                import ('@/views/demo/detail.vue')
        }]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404
];