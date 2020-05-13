<template>
    <div class="Input_container InputText" :class="{ ...classes }">
        <label class="Input_label" v-if="label">{{ label }}</label>
        <input
            class="Input_element" type="text"
            :value="value"
            :type="type"
            :required="required"
            @input="onInput($event.target.value)"
            @focus="$onFocus"
            @blur="$onBlur"
        >

        <form-helpers :value="value" :errors="validations ? $data.$errors : undefined" />
    </div>
</template>

<script>
import FormHelpers from '@/components/form/FormHelpers'
import InputMixin from '@/utils/input-mixin'

export default {
    name: 'InputText',
    mixins: [ InputMixin ],
    components: { FormHelpers },
    props: {
        id: { type: String },
        value: { type: String },
        type: { type: String, default: 'text' },
        label: { type: String },
        required: { type: Boolean, default: false },
        validations: { type: Object }
    },
    methods: {
        onInput (value) {
            this.$emit('input', value)
        }
    }
}
</script>