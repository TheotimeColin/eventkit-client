<template>
    <div class="InputText" :class="{ 'is-modified': value != defaultValue, 'is-premium': premium }">
        <input type="text" :value="value" @keyup="onSelect">

        <div class="InputText_undo" v-show="value != defaultValue" @click="reset">
            <i class="fa fa-undo"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputText',
    props: {
        value: {},
        defaultValue: { default: false },
        premium: { type: Boolean, default: false }
    },
    methods: {
        onSelect (e) {
            this.$emit('input', e.target.value)
        },
        reset () {
            this.$emit('input', this.$props.defaultValue)
        }
    }
}
</script>

<style lang="scss" scoped>
    .InputText {
        border: 1px solid var(--color-border);
        
        display: flex;
        align-items: center;

        &.is-premium.is-modified {
            color: var(--color-premium-strong);
            
            input {
                color: var(--color-premium-strong);
            }
        }

        input {
            font: var(--ft-m);
            border: none;
            background: transparent;
            padding: 0;
            padding: 10px;
            outline: none;
            flex-grow: 1;
        }
        
        &.is-premium {
            background-color: var(--color-premium-weak);

            input {
                color: var(--color-premium);
            }
        }
    }

    .InputText_undo {
        font-size: 12px;
        flex-shrink: 0;
        padding: 0 10px;
        cursor: pointer;
        transition: all 150ms ease;

        &:hover {
            transform: scale(0.9);
            opacity: 0.75;
        }
    }
</style>