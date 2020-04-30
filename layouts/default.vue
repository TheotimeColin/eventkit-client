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
    components: { HeaderMain, ContextInfo }
}
</script>