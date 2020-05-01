<template>
    <div class="Admin">
        <context-info />
        <nuxt />
    </div>
</template>

<script>
import ContextInfo from '@/components/utils/ContextInfo'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.locale('fr')

export default {
    name: 'LayoutAdmin',
    middleware: 'admin',
    components: { ContextInfo },
    watch: {
        ['$route'] () {
            this.$store.commit('context/set', null)
        }
    }
}
</script>

<style lang="scss">
    @import "@/assets/scss/global.scss";
    .Admin {
        @import "@/assets/scss/admin/index.scss";
        @import "@/assets/scss/global/atomic.scss";
    }
</style>