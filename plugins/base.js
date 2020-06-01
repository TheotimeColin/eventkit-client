import Vue from 'vue'
import translations from '@/config/translations'

import ButtonBase from '@/components/base/ButtonBase'
import ButtonInline from '@/components/base/ButtonInline'
import LinkBase from '@/components/base/LinkBase'

Vue.component('ButtonBase', ButtonBase)
Vue.component('ButtonInline', ButtonInline)
Vue.component('LinkBase', LinkBase)

Vue.mixin({
    data: () => ({
        get LANGS () {
            return translations
        }
    })
})