<template> 
    <div class="SelectSearch" :class="{ 'is-show-list': state.showList }">
        <div class="SelectSearch_input">
            <input 
                class="SelectSearch_search"
                type="text"
                :placeholder="current ? current.label : 'Sélectionnez'"
                @keyup="onChange"
                @focus="showList(true)"
                @blur="showList(false)"
                ref="search"
            >

            <i class="SelectSearch_chevron fa fa-chevron-down fa-xs"></i>
        </div>

        <div class="SelectSearch_results" ref="list">
            <div
                class="SelectSearch_result"
                @click="onSelectValue({ value: '', full: null })"
                v-if="unset"
            >
                Supprimer la sélection
            </div>
            <div
                class="SelectSearch_result"
                v-for="option in Object.keys(searchOptions)"
                :class="{ 'is-selected': current && searchOptions[option].value == current.value }"
                :value="searchOptions[option].value"
                @click="onSelectValue(searchOptions[option])"
                :key="searchOptions[option].value"
            >{{ searchOptions[option].label }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SelectSearch',
    props: {
        value: {},
        valueFull: { type: Boolean, default: false },
        unset: { type: Boolean, default: false },
        action: { type: String, default: '' },
        params: { default: null },
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
            
            if (this.$props.value) {
                Object.keys(this.$data.activeOptions).forEach(key => {
                    if (this.$props.valueFull) {
                        if (this.$data.activeOptions[key].full.id == this.$props.value.id) result = this.$data.activeOptions[key]
                    } else {
                        if (key == this.$props.value) result = this.$data.activeOptions[key]
                    }
                })
            }
            
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
            let results = await this.$store.dispatch(this.$props.action, this.$props.params)

            let options = {}
            results.forEach(result => {
                options[result._id] = {
                    value: result._id,
                    label: result.title,
                    full: result
                }
            })

            this.$data.activeOptions = options
        },
        onChange () {
            this.$data.search = this.$refs.search.value
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
            
            this.$emit('input', this.$props.valueFull ? option.full : option.value)
        }
    }
}
</script>