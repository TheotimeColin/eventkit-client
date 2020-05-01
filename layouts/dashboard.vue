<template>
    <div class="Body">
        <header-main />
        <context-info />
        <nuxt />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'
import ContextInfo from '@/components/utils/ContextInfo'

export default {
    name: 'LayoutDashboard',
    middleware: 'user',
    components: { HeaderMain, ContextInfo },
    watch: {
        ['$route'] () {
            this.$store.commit('context/set', null)
        }
    }
}
</script>