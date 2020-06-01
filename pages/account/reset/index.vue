<template>
    <div class="Page">
        <div class="Page_content">
            <form class="Form max-width-xs m-auto mv-40 text-center" @submit="onSubmit">
                <p class="ft-s">{{ $t('pages.reset.new') }}</p>

                <div class="Form_row Input_container mv-20">
                    <input class="Input_element" type="password" v-model="reset.password" :placeholder="$t('forms.input.newPassword')">
                </div>

                <ul v-if="reset.errors">
                    <li v-for="(error, i) in reset.errors" :key="i">{{ error }}</li>
                </ul>

                <div class="Form_row">
                    <button-base>{{ $t('pages.reset.cta.reset') }}</button-base>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResetPassword',
    data: () => ({
        reset: {
            errors: [],
            password: ''
        }
    }),
    methods: {
        async onSubmit (e) {
            e.preventDefault()

            let response = await this.$store.dispatch('user/setPassword', {
                data: { password: this.$data.reset.password, token: this.$route.query.token }
            })

            if (response.status != 1) {
                this.$data.reset.errors = response.errors
            }
        }
    }
}
</script>