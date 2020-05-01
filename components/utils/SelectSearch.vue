<template> 
    <div class="SelectSearch" :class="{ 'is-show-list': state.showList }">
        <div class="SelectSearch_input">
            <input 
                class="SelectSearch_search Input"
                type="text"
                :placeholder="current ? current.label : 'Sélectionnez'"
                @keyup="onChange"
                @focus="showList(true)"
                @blur="showList(false)"
                ref="search"
            >
        </div>

        <div class="SelectSearch_results" ref="list">
            <div
                class="SelectSearch_result"
                v-for="option in Object.keys(searchOptions)"
                :class="{ 'is-selected': current && searchOptions[option].value == current.value }"
                :value="searchOptions[option].value"
                v-html="searchOptions[option].html ? searchOptions[option].html : searchOptions[option].label"
                @click="onSelectValue(searchOptions[option])"
                :key="searchOptions[option].value"
            ></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SelectSearch',
    props: {
        value: { type: String },
        action: { type: String, default: '' },
        placeholder: { type: String, default: '' },
        valueKey: { type: String, default: 'value' },
        labelKey: { type: String, default: 'label' },
        noResults: { default: null },
        noResultsSubmit: { default: true }
    },
    data: () => ({
        search: null,
        activeOptions: {},
        state: {
            showList: false,
            loading: false,
        },
    }),
    watch: {
        value: {
            immediate: true,
            handler () {
                this.fetchOptions()
            }
        }
    },
    computed: {
        current () {
            let result = null
            
            Object.keys(this.$data.activeOptions).forEach(key => {
                if (key == this.$props.value) result = this.$data.activeOptions[key]
            })
            
            return result
        },
        searchOptions () {
            let options = Object.keys(this.$data.activeOptions).map(key => this.$data.activeOptions[key])

            if (this.$data.search) {
                options = options.filter(option => {
                    return option.label.toLowerCase().includes(this.$data.search.toLowerCase())
                })
            }
            
            return options
        }
    },
    methods: {
        async fetchOptions () {
            let results = await this.$store.dispatch(this.$props.action)

            let options = {}
            results.forEach(result => {
                options[result._id] = {
                    value: result._id,
                    label: result.title
                }
            })

            this.$data.activeOptions = options
        },
        onChange () {
            this.$data.search = this.$refs.search.value
        },
        boldResult (text) {
            let result = text
            let position = text.toLowerCase().search(this.$data.search.toLowerCase())
            let toBold = result.slice(position, position + this.$data.search.length)
            return result.replace(toBold, '<b>' + toBold + '</b>')
        },
        showList (action) {
            if (action) {
                this.fetchOptions()

                this.$refs.search.value = ''
                this.$data.state.showList = true
            } else {
                setTimeout(() => {
                    this.$data.state.showList = false
                }, 200)
            }
        },
        onSelectValue (option) {
            this.showList(false)
            this.$refs.search.value = ''
            this.$emit('input', option.value)
        }
    }
}
</script>