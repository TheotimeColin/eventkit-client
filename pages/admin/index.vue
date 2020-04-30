<template>
    <div class="Page">
        <div class="Page_content pb-100">
            <nuxt-link :to="{ name: 'admin-articles' }">
                Articles
            </nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'admin'
}
</script>