<template>
    <div class="ConversationStarter" :class="{ ...classes }" :style="{ ...style, '--scale': scale }">
        <div
            class="ConversationStarter_pattern"
            :style="{ backgroundImage: patternUrl }">
        </div>
        
        <div class="ConversationStarter_container">
            <div class="ConversationStarter_footer">
                <p class="ConversationStarter_name">
                    {{ mergeTheme.headerText }}
                    <span class="ConversationStarter_id" v-show="mergeTheme.id">{{ data && data.position ? data.position : '0' }}</span>
                </p>
            </div>

            <p class="ConversationStarter_main" :class="{ 'is-empty': !data || !data.content }">
                {{ data && data.content ? unwrapPunctuation(data.content.main) : 'Voyez ce koala fou qui mange des journaux et des photos dans un bungalow' }}
            </p>
            
            <p class="ConversationStarter_copyright">
                {{ mergeTheme.footerText }}
            </p>
        </div>
    </div>
</template>

<script>
import initTheme from '@/config/kits/conversation-starters'
import kitMixin from '@/utils/kit-mixin'
import patternMixin from '@/utils/pattern-mixin'

export default {
    name: 'ConversationStarter',
    mixins: [ kitMixin, patternMixin ],
    props: {
        theme: { default: () => ({}) },
        data: {},
        scale: { type: Number, default: 1 }
    },
    computed: {
        mergeTheme () {
            return {
                ...this.$getDefaultTheme(initTheme),
                ...this.$props.theme,
            }
        },
        classes () {        
            return this.$themeToClass(this.mergeTheme, initTheme)
        },
        style () {
            return this.$themeToStyle(this.mergeTheme, initTheme)
        },
        patternUrl () {
            return this.$pattern({
                ...this.mergeTheme.pattern,
                patternScale: (this.mergeTheme.pattern.patternScale) * this.$props.scale,
                color: this.mergeTheme.colors.patternColor
            })
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