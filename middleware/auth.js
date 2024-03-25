import { useAuthStore  } from "~~/stores/authStore";

export default defineNuxtRouteMiddleware( (from, to) => {
  const authStore = useAuthStore();
  if (!authStore.auth.authenticated) {
      return navigateTo('/login') 
  }
}
)