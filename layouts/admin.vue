<template>
    <div class="Body Admin">
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