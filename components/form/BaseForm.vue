<template>
    <form class="Form" @submit.prevent="onSubmit">
        <div
            v-for="(input, key) in form"
            class="Form_row"
            :key="key"
        >
            <component
                :id="input.id"
                :is="input.component ? input.component : 'input-text'"
                :label="input.label"
                :type="input.type"
                :required="input.required"
                :validations="input.validations"
                v-model="input.value"
                @error="onError"
            />
        </div>

        <ul class="Form_errors" v-if="errors && errors.length > 0">
        <li v-for="(error, i) in errors" :key="i">{{ $t(`errors.${error}`) }}</li>
        </ul>

        <slot name="submit" v-if="$slots['submit']"></slot>
        
        <div class="Form_row text-center" v-else>
            <button-base type="submit" :disabled="isError">Valider</button-base>
        </div>

        <slot name="footer"></slot>
    </form>
</template>

<script>
import InputText from '@/components/form/InputText'

export default {
    name: 'BaseForm',
    components: { InputText },
    props: {
        form: { type: Object },
        errors: { type: Array }
    },
    data: () => ({
        inputErrors: {}
    }),
    computed: {
        isError () {
            let error = false

            Object.keys(this.$data.inputErrors).forEach(input => {
                if (Object.keys(this.$data.inputErrors[input]).length > 0) error = true
            })

            return error
        }
    },
    methods: {
        onError (v) {
            this.$data.inputErrors = {
                ...this.$data.inputErrors,
                ...v
            }
        },
        onSubmit () {
            this.$emit('submit')
        }
    }
}
</script>