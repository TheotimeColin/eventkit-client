export default {
    methods: {
        $onFilter (query) {
            Object.keys(query).forEach(key => {
                let value = query[key].value

                if (query[key].push) {
                    let exists = this.$data.filters[key] ? this.$data.filters[key].indexOf(value) : null

                    if (this.$data.filters[key]) {
                        if (exists >= 0) {
                            this.$data.filters[key].splice(exists, 1)
                        } else {
                            this.$data.filters[key].push(value)
                        }
                    } else {
                        this.$data.filters[key] = [ value ]
                    }
                } else {
                    this.$data.filters[key] = [ value ]
                }
            })
        },
        $filter (items, valueName) {
            let result = items

            Object.keys(this.$data.filters).forEach(filterName => {
                let filter = this.$data.filters[filterName]

                result = result.filter(i => filter.length <= 0 || filter.indexOf(i[valueName]) >= 0)
            })

            return result
        }
    }
}