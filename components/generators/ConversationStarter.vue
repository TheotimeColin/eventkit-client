<template>
    <div class="ConversationStarter" :class="{ ...classes }" :style="style">
        <div class="ConversationStarter_container">
            <div class="ConversationStarter_footer">
                <p class="ConversationStarter_name">{{ config.theme.title.value }}</p>
                <p class="ConversationStarter_id">{{ data.id }}</p>
            </div>

            <p class="ConversationStarter_main" :class="{ 'is-empty': data.main == '' }">
                {{ data.main ? data.main : 'Voyez ce koala fou qui mange des journaux et des photos dans un bungalow' }}
            </p>
            
            <p class="ConversationStarter_copyright">
                {{ config.theme.footer.value }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConversationStarter',
    props: {
        config: {},
        data: {}
    },
    computed: {
        classes () {
            let classes = {}

            Object.keys(this.$props.config.theme).forEach(key => {
                let choice = this.$props.config.theme[key]
                if (choice.isClass) classes[`${choice.id}-${choice.value}`] = true
            })

            return classes
        },
        style () {
            let style = {}

            Object.keys(this.$props.config.theme).forEach(key => {
                let choice = this.$props.config.theme[key]
                if (choice.var) style[`--${choice.var}`] = choice.value
            })

            style['--width'] = this.$props.config.theme.size.value.x + 'mm'
            style['--height'] = this.$props.config.theme.size.value.y + 'mm'
            

            return style 
        }
    }
}
</script>