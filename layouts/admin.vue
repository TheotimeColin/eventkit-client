<template>
    <div class="Body Admin">
        <header-main />
        <context-info />
        <nuxt />
        <confirm-popin />
        <notifications />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'

import ContextInfo from '@/components/utils/ContextInfo'
import ConfirmPopin from '@/components/utils/ConfirmPopin'
import Notifications from '@/components/utils/Notifications'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.locale('fr')

export default {
    name: 'LayoutAdmin',
    middleware: 'admin',
    components: { ContextInfo, ConfirmPopin, Notifications, HeaderMain },
    watch: {
        ['$route'] () {
            this.$store.commit('context/set', null)
        }
    }
}
</script>