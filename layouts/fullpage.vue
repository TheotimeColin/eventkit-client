<template>
    <div class="Body">
        <header-main :modifiers="['fullpage']" />
        <context-info />
        <nuxt />
        <notifications />

        <popin-premium />
        <popin-login />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'
import ContextInfo from '@/components/utils/ContextInfo'
import Notifications from '@/components/utils/Notifications'

import PopinLogin from '@/components/popins/PopinLogin'
import PopinPremium from '@/components/popins/PopinPremium'

export default {
    name: 'LayoutDashboard',
    components: { HeaderMain, ContextInfo, Notifications, PopinLogin, PopinPremium },
    watch: {
        ['$route'] () {
            this.$store.commit('context/set', null)
        }
    }
}
</script>