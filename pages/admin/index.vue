<template>
    <div class="Page">
        <div class="Page_content pb-100">
            <nuxt-link :to="{ name: 'admin-articles' }">
                Articles
            </nuxt-link>

            <nuxt-link :to="{ name: 'admin-entities-categories' }">
                Catégories
            </nuxt-link>

            <nuxt-link :to="{ name: 'admin-entities-reactions' }">
                Réactions
            </nuxt-link>

            <nuxt-link :to="{ name: 'admin-generators-ideas' }">
                Packs d'idées
            </nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'admin'
}
</script>