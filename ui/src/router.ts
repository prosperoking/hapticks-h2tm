import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Dashboard from "./views/Dashboard.vue";
import Forms from "./views/Forms.vue";
import Tables from "./views/Tables.vue";
import UIElements from "./views/UIElements.vue";
import Transactions from "./views/Transactions.vue";
import Profiles from "./views/profiles/Profiles.vue";
import Terminals from "./views/terminal/Terminals.vue";
import UploadTerminal from "./views/terminal/UploadTerminals.vue";
import Login from "./views/Login.vue";
import Modal from "./views/Modal.vue";
import Card from "./views/Card.vue";
import Blank from "./views/Blank.vue";
import NotFound from "./views/NotFound.vue";
import { useUserStore } from "./stores/user.store";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { layout: "empty" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/forms",
    name: "Forms",
    component: Forms,
  },
  {
    path: "/transactions",
    name: "transactions",
    component: Transactions,
  },
  {
    path: "/profiles",
    name: "profiles",
    component: Profiles,
  },
  {
    path: "/terminals",
    name: "terminals",
    component: Terminals,
  },
  { 
    path: "/bulk-upload", 
    name: "bulk-upload", 
    component: UploadTerminal 
  },
  {
    path: "/cards",
    name: "Cards",
    component: Card,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/ui-elements",
    name: "UIElements",
    component: UIElements,
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal,
  },
  {
    path: "/blank",
    name: "Blank",
    component: Blank,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: NotFound,
    meta: { layout: "empty" },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from,next)=>{
  const userStore = useUserStore();
  const decideNavigation = ()=>{
    if(to.name === 'Login' && !userStore.isLoggedIn){

      next();
    }
    
    if(to.name !== 'Login' && !userStore.isLoggedIn){
      router.push({ name: 'Login' })
    }
    if(userStore.isLoggedIn && to.name === 'Login') {
      router.replace({name: from.name?? 'Dashboard'});
    }
    next();
  }

  userStore.getUser().then(()=>{
    decideNavigation();
  }).catch(err=>{
    console.log(err);
    router.push({ name: 'Login' })
  });

});

export default router;
