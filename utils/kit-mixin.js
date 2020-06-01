export default {
    methods: {
        $getDefaultTheme (theme) {
            let result = { ...theme }

            Object.keys(theme.options).forEach(optionId => {
                const option = theme.options[optionId]
                let value = {}
                
                if (option.values) {
                    Object.keys(option.values).forEach(valueId => {
                        const v = option.values[valueId]
                        value[valueId] = v.default
                    })
                } else if (option.value) {
                    value = option.value
                }

                result[optionId] = value
            })

            delete result.options

            return result
        },
        $themeToStyle (theme, initTheme) {
            theme = JSON.parse(JSON.stringify(theme))
            let style = {}
            
            Object.keys(theme).forEach(groupId => {
                const initOption = initTheme.options[groupId]
                const group = theme[groupId]
                
                if (!initOption || !initOption.isStyle) return 

                if (typeof group === 'object' && group !== null) {
                    Object.keys(group).forEach(valueId => {
                        const value = group[valueId]
                        style[`--${this.$camelToDash(valueId)}`] = value
                    })
                } else {
                    style[`--${this.$camelToDash(groupId)}`] = group
                }
            })

            return style
        },
        $themeToClass (theme, initTheme) {
            let classes = {}

            Object.keys(theme).forEach(optionId => {
                const initOption = initTheme.options[optionId]
                const value = theme[optionId]

                if (!initOption || !initOption.isClass) return 
                classes[`${optionId}-${value}`] = true
            })

            return classes
        },
        $camelToDash (string) {
            return string.replace(/[A-Z]/g, string => "-" + string.toLowerCase())
        }
    }
}