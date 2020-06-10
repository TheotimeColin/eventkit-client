<template>
    <div class="Input_container InputText" :class="{ ...classes, ...$modifiers }">
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
import base from '@/utils/base'
import { debounce } from 'throttle-debounce'

export default {
    name: 'Input',
    mixins: [ InputMixin, base ],
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
        onInput: debounce(100, function (value) {
            this.$emit('input', value)
        })
    }
}
</script>