<template>
    <div class="Page">
        <div class="Page_content">
            <base-form class="width-s m-auto mv-100" :form="form" :errors="errors" @submit="onSubmit" />
        </div>
    </div>
</template>

<script>
import BaseForm from '@/components/form/BaseForm'

export default {
    name: 'Test',
    components: { BaseForm },
    data: () => ({
        form: {
            name: {
                id: 'name',
                component: 'input-text',
                label: 'Test',
                value: 'This is my value',
                validations: {
                    minLength: { value: 5, error: 'Cette valeur doit faire au moins 5 caractères' },
                    maxLength: { value: 15, error: 'Cette valeur ne devrait pas dépasser 15 caractères' },
                    password: { error: 'Votre mot de passe doit contenir au moins une majuscule et 1 chiffre ou caractère spécial' }
                }
            }
        },
        errors: []
    }),
    methods: {
        onSubmit () {
            console.log(this.form)

            setTimeout(() => {
                let errors = ['test']
                this.$data.errors = errors
            }, 5000)
        }
    }
}
</script>