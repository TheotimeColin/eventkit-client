<template>
    <div class="Body">
        <header-main :modifiers="['fullpage']" />
        <context-info />
        <nuxt />
        <notifications />

        <popin-premium />
        <popin-login />
        <confirm-popin />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'
import ContextInfo from '@/components/utils/ContextInfo'
import Notifications from '@/components/utils/Notifications'

import PopinLogin from '@/components/popins/PopinLogin'
import PopinPremium from '@/components/popins/PopinPremium'
import ConfirmPopin from '@/components/utils/ConfirmPopin'

export default {
    name: 'LayoutDashboard',
    components: { HeaderMain, ContextInfo, Notifications, PopinLogin, PopinPremium, ConfirmPopin },
    watch: {
        ['$route'] () {
            this.$store.commit('context/set', null)
        }
    }
}
</script>