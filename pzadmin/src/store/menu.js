const localData = localStorage.getItem("pz_persist");

const state = localData
  ? localData.menu
  : {
      isCollapse: false,
      selectMenu: [],
      routerList: [],
      menuActive: "1-1",
    };
const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
  },
  addMenu(state, payload) {
    if (
      state.selectMenu.findIndex((item) => item.path === payload.path) === -1
    ) {
      state.selectMenu.push(payload);
    }
  },
  closeMenu(state, payload) {
    const index = state.selectMenu.findIndex(
      (val) => val.name === payload.name
    );
    state.selectMenu.splice(index, 1);
  },
  dynamicMenu(state, payload) {
    const modules = import.meta.glob("../views/**/**/*.vue");
    console.log(modules);
    function routerSet(router) {
      //拼接路由数据
      router.forEach((route) => {
        //判断有无子菜单
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`;
          //获得vue组件
          route.component = modules[url];
        } else {
          routerSet(route.children);
        }
      });
    }
    routerSet(payload);
    //获得完整路由数据
    state.routerList = payload;
  },
  //更新选中菜单状态
  updateMenuActive(state, payload) {
    state.menuActive = payload;
  },
};

export default {
  state,
  mutations,
};
