import { ref, customRef, UnwrapRef, Ref } from 'vue'

const debounce = (fn: Function, delay = 0, immediate = false) => {
  let timeout: number;
  // @ts-ignore
  return (...args) => {
    if (immediate && !timeout) fn(...args)
    clearTimeout(timeout)
    // @ts-ignore
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const useDebouncedRef = <T>(initialValue: T, delay: number, immediate: boolean = false): Ref<UnwrapRef<T>> => {
  const state = ref<T>(initialValue)
  const debouncedRef = customRef<UnwrapRef<T>>((track, trigger) => ({
    get() {
      track()
      return state.value
    },
    set: debounce(
      (value: UnwrapRef<T> )=> {
        state.value = value
        trigger()
      },
      delay,
      immediate
    ),
  }))
  return debouncedRef
}

export default useDebouncedRef