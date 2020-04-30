<template>
    <div>
        <header-main />
        <nuxt />
    </div>
</template>

<script>
import HeaderMain from '@/components/HeaderMain'

export default {
    name: 'LayoutDefault',
    components: { HeaderMain }
}
</script>