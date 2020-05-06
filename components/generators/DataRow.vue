<template>
    <div class="DataRow" :class="{ 'is-disable': isDisable }">
        <i class="fa fa-align-justify handle"></i>

        <input
            class="DataRow_input"
            type="text"
            @input="onInput"
            :value="value"
            @focus="$emit('select', id)"
            @keyup.enter="$emit('submit')"
            ref="input"
        >

        <div @click="$emit('toggle', !isDisable)">
            <i class="fa fa-eye" v-show="!isDisable"></i>
            <i class="fa fa-eye-slash" v-show="isDisable"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DataRow',
    props: {
        id: { type: String },
        value: { type: String },
        isDisable: { type: Boolean, default: false }
    },
    methods: {
        onInput (e) {
            this.$emit('input', e.target.value)
        }
    },
    mounted () {
        this.$refs.input.focus()
    }
}
</script>

<style lang="scss" scoped>
    .DataRow {
        display: flex;
    }

    .DataRow.is-disable {

        input {
            opacity: 0.5;
            pointer-events: none;
        }
    }
</style>