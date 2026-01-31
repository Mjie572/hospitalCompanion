import { createStore } from "vuex";
import menu from "./menu.js";
import createPersistedstate from "vuex-persistedstate";
export default createStore({
  plugins: [
    new createPersistedstate({
      key: "pz_persist",
    }),
  ],
  modules: {
    menu,
  },
});
