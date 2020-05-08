<template>
    <div class="NavBar">
        <div class="NavBar_item" v-for="item in items" :key="item.id">
            <i class="fa" :class="{ ['fa-' + item.fa ]: true }"></i>
            <p class="NavBar_label">{{ item.label }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavBar',
    props: {
        items: { type: Array }
    }
}
</script>