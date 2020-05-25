<template>
    <div class="Input_container Textarea">
        <textarea class="Input_element" v-model="localValue" @input="onInput" ref="input">

        </textarea>
    </div>
</template>

<script>
export default {
    name: 'BaseTextarea',
    props: {
        value: { type: String, default: '' }
    },
    data: () => ({
        localValue: ''
    }),
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.$data.localValue = v
            }
        }
    },
    ready () {
        this.setHeight()
    },
    methods: {
        onInput () {
            this.setHeight()

            this.$emit('input', this.$data.localValue)
        },
        setHeight () {
            this.$refs.input.style.height = '0px'
            this.$refs.input.style.height = this.$refs.input.scrollHeight + 'px'
        },
    }
}
</script>