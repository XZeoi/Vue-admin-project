import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
// 懒加载
const Login = () => import(/* webpackChunkName:"login_home_welcome" */'../components/Login')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */'../components/Home')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */'../components/Welcome')

// import Users from '../components/user/user'
// import Rights from '../components/authorization/Rights'
// import Roles from '../components/authorization/Roles'
const Users = () => import(/* webpackChunkName:"users_rights_roles" */'../components/user/user')
const Rights = () => import(/* webpackChunkName:"users_rights_roles" */'../components/authorization/Rights')
const Roles = () => import(/* webpackChunkName:"users_rights_roles" */'../components/authorization/Roles')

// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
const Cate = () => import(/* webpackChunkName:"cate_params" */'../components/goods/Cate')
const Params = () => import(/* webpackChunkName:"cate_params" */'../components/goods/Params')

// import List from '../components/goods/List'
// import Add from '../components/goods/Add'
const List = () => import(/* webpackChunkName:"list_add" */'../components/goods/List')
const Add = () => import(/* webpackChunkName:"list_add" */'../components/goods/Add')

// import Order from '../components/order/order'
// import Report from '../components/report/Report'
const Order = () => import(/* webpackChunkName:"order_report" */'../components/order/order')
const Report = () => import(/* webpackChunkName:"order_report" */'../components/report/Report')


Vue.use(VueRouter)

const routes = [
  // 设置一个根路径重定向，重定向到‘/login’
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/categories', component: Cate},
      {path: '/params', component: Params},
      {path: '/goods', component: List},
      {path: '/goods/add', component: Add},
      {path: '/orders', component: Order},
      {path: '/reports', component: Report}
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  //  next()直接放行；  next('/login')强制跳转至登录页面

  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
