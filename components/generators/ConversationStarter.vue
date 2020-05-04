<template>
    <div class="ConversationStarter" :class="{ ...classes }" :style="style">
        <div class="ConversationStarter_container">
            <div class="ConversationStarter_footer">
                <p class="ConversationStarter_name">starter n°</p>
                <p class="ConversationStarter_id">{{ id }}</p>
            </div>

            <p class="ConversationStarter_main" :class="{ 'is-empty': main == '' }">
                {{ main ? main : 'Voyez ce koala fou qui mange des journaux et des photos dans un bungalow' }}
            </p>
            
            <p class="ConversationStarter_copyright">Créé sur eventkit.social</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConversationStarter',
    props: {
        config: {},
        main: { type: String, default: '' },
        id: { type: Number, default: 0 }
    },
    computed: {
        classes () {
            let classes = {}

            Object.keys(this.$props.config.theme.choices).forEach(key => {
                let choice = this.$props.config.theme.choices[key]
                if (choice.isClass) classes[`${choice.id}-${choice.value}`] = true
            })

            return classes
        },
        style () {
            let style = {}

            Object.keys(this.$props.config.theme.choices).forEach(key => {
                let choice = this.$props.config.theme.choices[key]
                if (choice.var) style[`--${choice.var}`] = choice.value
            })

            return style 
        }
    }
}
</script>