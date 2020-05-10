<template>
    <div class="Body">
        <header-main />
        <context-info />
        <nuxt />
        <notifications />

        <popin-login />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'
import ContextInfo from '@/components/utils/ContextInfo'
import Notifications from '@/components/utils/Notifications'
import PopinLogin from '@/components/popins/PopinLogin'

export default {
    name: 'LayoutDefault',
    components: { HeaderMain, ContextInfo, Notifications, PopinLogin },
    watch: {
        ['$route'] () {
            this.$store.commit('context/set', null)
        }
    }
}
</script>