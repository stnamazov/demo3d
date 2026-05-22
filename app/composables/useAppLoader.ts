import { readonly, ref } from 'vue'

const isLoading = ref(false)
const message = ref('Загрузка модели…')

export function useAppLoader() {
  function start(text = 'Загрузка модели…') {
    message.value = text
    isLoading.value = true
  }

  function finish() {
    isLoading.value = false
  }

  return {
    isLoading: readonly(isLoading),
    message: readonly(message),
    start,
    finish,
  }
}
