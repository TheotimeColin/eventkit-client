<template>
    <div class="ConversationStarter" :class="{ ...classes }" :style="style">
        <div
            class="ConversationStarter_pattern"
            :style="{ backgroundImage: patternUrl }">
        </div>
        
        <div class="ConversationStarter_container">
            <div class="ConversationStarter_footer">
                <p class="ConversationStarter_name">
                    {{ mergeTheme.title }}
                    <span class="ConversationStarter_id">{{ data && data.position ? data.position : '0' }}</span>
                </p>
            </div>

            <p class="ConversationStarter_main" :class="{ 'is-empty': !data || !data.content }">
                {{ data && data.content ? unwrapPunctuation(data.content.main) : 'Voyez ce koala fou qui mange des journaux et des photos dans un bungalow' }}
            </p>
            
            <p class="ConversationStarter_copyright">
                {{ mergeTheme.footer }}
            </p>
        </div>
    </div>
</template>

<script>
import patterns from '@/config/patterns'
import initTheme from '@/config/kits/conversation-starters'
import defaultTheme from '@/config/kits/defaults/conversation-starters-default'

export default {
    name: 'ConversationStarter',
    props: {
        theme: { default: () => ({}) },
        data: {},
        scale: { type: Number, default: 1 }
    },
    computed: {
        mergeTheme () {
            return {
                ...defaultTheme,
                ...this.$props.theme,
            }
        },
        classes () {
            let classes = {}

            Object.keys(initTheme).forEach(key => {
                let choice = initTheme[key]
                let value = this.mergeTheme[key]
                
                if (choice.isClass) classes[`${choice.id}-${value}`] = true
            })

            return classes
        },
        style () {
            let style = {}

            Object.keys(initTheme).forEach(key => {
                let choice = initTheme[key]
                let value = this.mergeTheme[key]

                if (!value) return

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

            style['--width'] = this.mergeTheme.size.x + 'mm'
            style['--height'] = this.mergeTheme.size.y + 'mm'
            style['--margin'] = this.mergeTheme.size.margin + 'mm'
            style['--scale'] = this.$props.scale

            return style 
        },
        patternUrl () {
            let value = ''
            let pattern = patterns[this.mergeTheme.pattern.patternUrl]

            if (pattern) value = pattern(
                this.mergeTheme.colors.patternColor.replace('#', ''),
                (this.mergeTheme.pattern.patternScale) * this.$props.scale,
                this.mergeTheme.pattern.patternOpacity
            )

            return `url("${value}")`
        }
    },
    methods: {
        unwrapPunctuation (string) {
            string = string.replace(' ?', ' ?')
            string = string.replace(' !', ' !')
            string = string.replace(' :', ' :')

            return string
        }
    }
}
</script>