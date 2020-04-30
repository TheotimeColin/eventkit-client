<template>
    <div class="ConfigRow" :class="{ 'is-disable': isDisable }">
        <div class="CardGenerator_id">{{ id }}</div>

        <input
            type="text"
            @input="onInput"
            :value="value"
            @focus="$emit('focus', id)"
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
    name: 'ConfigRow',
    props: {
        id: { type: Number },
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
    .ConfigRow {
        display: flex;
    }

    .ConfigRow.is-disable {

        input {
            opacity: 0.5;
            pointer-events: none;
        }
    }
</style>