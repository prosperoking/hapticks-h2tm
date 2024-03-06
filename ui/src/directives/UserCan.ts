import { useUserStore } from '../stores/user.store';
import { DirectiveBinding } from 'vue';

const confirmAndUpdate = (el: HTMLElement, bindings: DirectiveBinding) => {
  const { permissions, user } = useUserStore();
  const requiredPermissions =
    bindings.value instanceof Array ? bindings.value : [bindings.value];
  if (
    user &&
    user?.role != 'admin' &&
    (permissions?.length === 0 ||
      !requiredPermissions.reduce(
        (a, b) => a && permissions?.includes(b),
        true
      ))
  ) {
    el.parentNode?.removeChild(el);
  }
};
// vue 3 directive
export default {
  updated(el: HTMLElement, binding: DirectiveBinding) {
    confirmAndUpdate(el, binding);
  },
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    confirmAndUpdate(el, binding);
  },
};