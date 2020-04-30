<template>
    <div class="Admin">
        <context-info />
        <nuxt />
    </div>
</template>

<script>
import ContextInfo from '@/components/utils/ContextInfo'

export default {
    name: 'LayoutAdmin',
    middleware: 'admin',
    components: { ContextInfo },
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