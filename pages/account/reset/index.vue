<template>
    <div class="Page">
        <div class="Page_content">
            <form class="Form max-width-xs m-auto mv-40 text-center" @submit="onSubmit">
                <p class="ft-s">Remplis le champ ci-dessous pour réinitialiser ton mot de passe :</p>

                <div class="Form_row mv-20">
                    <input type="password" v-model="reset.password" placeholder="Nouveau mot de passe">
                </div>

                <ul v-if="reset.errors">
                    <li v-for="(error, i) in reset.errors" :key="i">{{ error }}</li>
                </ul>

                <div class="Form_row">
                    <button-base>Réinitialiser mon mot de passe</button-base>
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