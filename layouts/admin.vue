<template>
    <div>
        <context-info />
        <nuxt />
    </div>
</template>

<script>
import ContextInfo from '@/components/utils/ContextInfo'

export default {
    name: 'LayoutAdmin',
    components: { ContextInfo },
    watch: {
        ['$route'] () {
            this.$store.commit('modules/context/set', null)
        }
    }
}
</script>