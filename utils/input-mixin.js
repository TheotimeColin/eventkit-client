export default {
    data: () => ({
        $state: {
            focused: false
        },
        $errors: {}
    }),
    computed: {
        classes () {
            let classes = {}

            if (this.$props.value !== '') classes['is-value'] = true
            if (this.$data.$state.focused) classes['is-focus'] = true

            if (this.$props.validations) {
                if (Object.keys(this.$data.$errors).length > 0) classes['is-error'] = true
                if (Object.keys(this.$data.$errors).length <= 0 && classes['is-value']) classes['is-valid'] = true
            }
            
            return classes
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler () {
                this.$isValid()
            }
        }
    },
    methods: {
        $onFocus () {
            this.$data.$state.focused = true
        },
        $onBlur () {
            this.$data.$state.focused = false
        },
        $isValid () {
            let errors = {}

            if (this.$props.validations) {
                Object.keys(this.$props.validations).forEach(key => {
                    let data = this.$props.validations[key]

                    switch (key) {
                        case 'minLength':
                            if (this.$props.value.length < data.value) errors['minLength'] = data
                            break;
                        case 'maxLength':
                            if (this.$props.value.length >= data.value) errors['maxLength'] = data
                            break;
                        case 'password':
                            if (!this.$checkPassword(this.$props.value)) errors['password'] = data
                            break;
                    }
                })
            }

            this.$data.$errors = errors

            this.$emit('error', {
                [this.$props.id]: this.$data.$errors
            })
            
            return errors
        },
        $checkPassword (password) {
            let errors = {}

            let uppercase = /[A-Z]/
            if (!uppercase.test(password)) errors['uppercase'] = false
        
            let specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':'\\|,.<>\/?~]/
            let digits = /\d/
            if (!(specialChars.test(password) || digits.test(password))) errors['special'] = false

            return Object.keys(errors).length <= 0
        }
    }
}