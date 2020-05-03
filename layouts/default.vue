<template>
    <div class="Body">
        <header-main />
        <context-info />
        <nuxt />
        <notifications />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'
import ContextInfo from '@/components/utils/ContextInfo'
import Notifications from '@/components/utils/Notifications'

export default {
    name: 'LayoutDefault',
    components: { HeaderMain, ContextInfo, Notifications },
    watch: {
        ['$route'] () {
            this.$store.commit('context/set', null)
        }
    }
}
</script>