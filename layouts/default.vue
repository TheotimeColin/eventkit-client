<template>
    <div class="Body">
        <header-main />
        <context-info />
        <nuxt />
        <notifications />

        <popin-login />
        <popin-premium />
        <confirm-popin />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'
import ContextInfo from '@/components/utils/ContextInfo'
import Notifications from '@/components/utils/Notifications'
import ConfirmPopin from '@/components/utils/ConfirmPopin'

import PopinLogin from '@/components/popins/PopinLogin'
import PopinPremium from '@/components/popins/PopinPremium'

export default {
    name: 'LayoutDefault',
    components: { HeaderMain, ContextInfo, Notifications, PopinLogin, ConfirmPopin, PopinPremium },
    watch: {
        ['$route'] () {
            this.$store.commit('context/set', null)
        }
    }
}
</script>