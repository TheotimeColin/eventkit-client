<template>
    <div class="Page">
        <div class="Page_content pb-100">
            <button-base :to="{ name: 'admin-articles' }">
                Articles
            </button-base>

            <button-base :to="{ name: 'admin-entities-categories' }">
                Catégories
            </button-base>

            <button-base :to="{ name: 'admin-kits' }">
                Kits
            </button-base>

            <button-base :to="{ name: 'admin-entities-reactions' }">
                Réactions
            </button-base>

            <button-base :to="{ name: 'admin-generators-ideas' }">
                Packs d'idées
            </button-base>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'admin'
}
</script>