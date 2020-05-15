<template>
    <div class="ConversationStarter" :class="{ ...classes }" :style="style">
        <div
            class="ConversationStarter_pattern"
            :style="{ backgroundImage: patternUrl }">
        </div>
        
        <div class="ConversationStarter_container">
            <div class="ConversationStarter_footer">
                <p class="ConversationStarter_name">{{ theme.title }}{{ data.position ? data.position : '0' }}</p>
                <!-- <p class="ConversationStarter_id" style="opacity: 0.45"></p> -->
            </div>

            <p class="ConversationStarter_main" :class="{ 'is-empty': !data.content }">
                {{ data.content ? data.content.main : 'Voyez ce koala fou qui mange des journaux et des photos dans un bungalow' }}
            </p>
            
            <p class="ConversationStarter_copyright">
                {{ theme.footer }}
            </p>
        </div>
    </div>
</template>

<script>
import patterns from '@/config/patterns'

export default {
    name: 'ConversationStarter',
    props: {
        initTheme: {},
        theme: {},
        data: {},
        scale: { type: Number, default: 1 }
    },
    computed: {
        classes () {
            let classes = {}

            Object.keys(this.$props.initTheme).forEach(key => {
                let choice = this.$props.initTheme[key]
                let value = this.$props.theme[key]
                
                if (choice.isClass) classes[`${choice.id}-${value}`] = true
            })

            return classes
        },
        style () {
            let style = {}

            Object.keys(this.$props.initTheme).forEach(key => {
                let choice = this.$props.initTheme[key]
                let value = this.$props.theme[key]

                console.log(value)

                if (choice.var) style[`--${choice.var}`] = value
                if (choice.varGroup) {
                    let group = {}

                    Object.keys(value).forEach(key => {
                        let groupValue = value[key]
                        group[`--${key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}`] = groupValue
                    })

                    style = {
                        ...style,
                        ...group
                    }
                }
                if (choice.valueGroup) {
                    let group = {}

                    Object.keys(choice.options).forEach(key => {
                        group[`--${key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}`] = value[key]
                    })

                    style = {
                        ...style,
                        ...group
                    }
                }
            })

            style['--width'] = this.$props.theme.size.x + 'mm'
            style['--height'] = this.$props.theme.size.y + 'mm'
            style['--margin'] = this.$props.theme.size.margin + 'mm'

            return style 
        },
        patternUrl () {
            let value = ''
            let pattern = patterns[this.$props.theme.pattern.patternUrl]

            if (pattern) value = pattern(
                this.$props.theme.colors.patternColor.replace('#', ''),
                (this.$props.theme.pattern.patternScale) * this.$props.scale,
                this.$props.theme.pattern.patternOpacity
            )

            return `url("${value}")`
        }
    }
}
</script>