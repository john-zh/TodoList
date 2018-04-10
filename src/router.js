const routers = [{
    path: '/',
    meta: {
        title: ''
    },
    component: (resolve) => require(['./views/example/Index.vue'], resolve)
}];
export default routers;