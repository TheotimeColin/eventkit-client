import Vue from 'vue'
import ButtonBase from '@/components/base/ButtonBase'
import ButtonInline from '@/components/base/ButtonInline'
import LinkBase from '@/components/base/LinkBase'

import BaseMixins from '@/mixins/base'
import UtilsMixins from '@/mixins/utils'

Vue.component('ButtonBase', ButtonBase)
Vue.component('ButtonInline', ButtonInline)
Vue.component('LinkBase', LinkBase)

Vue.mixin(UtilsMixins)
Vue.mixin(BaseMixins)
