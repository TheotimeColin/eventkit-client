<template>
    <nuxt-link :to="{ name: id }" class="Tag" :class="{ ...$modifiers }">
        {{ title }}
    </nuxt-link>
</template>

<script>
export default {
    name: 'Tag',
    props: {
        id: { type: Number },
        title: { type: String }
    }
}
</script>