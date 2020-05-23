
import patterns from '@/config/patterns'

export default {
    methods: {
        $pattern ({ patternUrl = 'polka', patternOpacity = 1, patternScale = 1, color }) {
            let value = ''
            let pattern = patterns[patternUrl]

            if (pattern) value = pattern(color.replace('#', ''), patternScale, patternOpacity)

            return `url("${value}")`
        }
    }
}