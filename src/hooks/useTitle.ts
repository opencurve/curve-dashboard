import { useTitle as usePageTitle } from '@vueuse/core'
import { unref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { SITE_TITLE } from '@/constants/site'

// 这里最好也有中英文切换
const useTitle = () => {
  const { currentRoute } = useRouter()

  const pageTitle = usePageTitle()

  watch(
    () => currentRoute.value.path,
    () => {
      const route = unref(currentRoute)

      const { title } = route?.meta || {}
      pageTitle.value = title ? ` ${title} - ${SITE_TITLE} ` : `${SITE_TITLE}`
    },
    { immediate: true },
  )
}
export default useTitle
