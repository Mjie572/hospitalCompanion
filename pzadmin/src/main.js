import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from "./store";
import panelHead from "./components/panelHead.vue";
import "element-plus/dist/index.css";
// import ElementPlus from "element-plus";

//刷新后添加动态路由
const localData = localStorage.getItem("pz_persist");
if (localData) {
  store.commit("dynamicMenu", JSON.parse(localData).menu.routerList);
  store.state.menu.routerList.forEach((item) => {
    router.addRoute("main", item);
  });
}

router.beforeEach((to, from) => {
  const token = localStorage.getItem("pz_token");
  //非登录界面的token不存在
  if (!token && to.path !== "/login") {
    return "/login";
  } else if (token && to.path === "/login") {
    //token已存在但还想再登陆
    return "/";
  } else {
    return true;
  }
});
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("panelHead", panelHead);
//路由挂载
app.use(router);
//store挂载
app.use(store);
app.mount("#app");
// app.use(ElementPlus);
