<template>
    <div class="ConversationStarter">
        <div class="ConversationStarter_container">
            <div class="ConversationStarter_footer">
                <p class="ConversationStarter_id">{{ id }}</p>
                <p class="ConversationStarter_name">starter n°</p>
            </div>

            <p class="ConversationStarter_main" :class="{ 'is-empty': main == '' }">
                {{ main ? main : 'Entrez du texte...' }}
            </p>
            
            <p class="ConversationStarter_copyright">Créé sur eventkit.social</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConversationStarter',
    props: {
        main: { type: String, default: '' },
        id: { type: Number, default: 0 }
    }
}
</script>