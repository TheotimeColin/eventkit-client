<template>
    <div class="ExquisiteCorpse BasicSquare" :class="{ ...classes }" :style="{ ...style, '--scale': scale }">
        <div
            class="BasicSquare_pattern"
            :style="{ backgroundImage: patternUrl }">
        </div>
        
        <div class="BasicSquare_container">
            <div class="BasicSquare_footer">
                <p class="BasicSquare_name">
                    {{ mergeTheme.headerText }}
                    <span class="BasicSquare_id" v-show="mergeTheme.id">{{ data && data.position ? data.position : '0' }}</span>
                </p>
            </div>

            <div class="BasicSquare_main"
                :class="{ 'is-empty': !data || !data.content }"
                v-html="unwrapPunctuation(data.content.main)"
                v-if="data && data.content"
            ></div>
            
            <p class="BasicSquare_copyright">
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
    name: 'ExquisiteCorpse',
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
            string = string.replace(/_/g, '<nobr><span class="ExquisiteCorpse_replace"></span></nobr>')
            string = string.replace(' ?', ' ?')
            string = string.replace(' !', ' !')
            string = string.replace(' :', ' :')

            return string
        }
    }
}
</script>