<template>
    <div>
        <header-main />
        <context-info />
        <nuxt />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'
import ContextInfo from '@/components/utils/ContextInfo'

export default {
    name: 'LayoutDefault',
    components: { HeaderMain, ContextInfo },
    watch: {
        ['$route'] () {
            this.$store.commit('modules/context/set', null)
        }
    }
}
</script>

<style lang="scss">
    @import "@/assets/scss/global.scss";
</style>