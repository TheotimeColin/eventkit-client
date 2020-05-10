<template>
    <div class="LoginPage Page">
        <div class="Page_content">
            <div class="LoginPage_container mt-100">
                <form class="Form" v-if="state.current == 'login'">
                    <p class="ft-title-2xl mb-20">
                        J'ai déjà un compte
                    </p>
                    
                    <div class="Form_row">
                        <input type="text" placeholder="Adresse e-mail">
                    </div>
                    <div class="Form_row">
                        <input type="password" placeholder="Mot de passe">
                    </div>

                    <div class="text-center mt-20">
                        <button-base type="submit">Se connecter</button-base>
                    </div>
                </form>

                <form class="Form" @submit="onRegister" v-if="state.current == 'register'">
                    <p class="ft-title-2xl mb-20">
                        Je m'inscris, c'est <span class="underline">gratuit</span>
                    </p>
                    
                    <div class="Form_row">
                        <input type="text" placeholder="Adresse e-mail" v-model="register.email">
                    </div>
                    <div class="Form_row">
                        <input type="password" placeholder="Mot de passe" v-model="register.password">
                    </div>

                    <div class="text-center mt-20">
                        <button-base type="submit">S'inscrire</button-base>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonBase from '@/components/base/ButtonBase'

export default {
    name: 'LoginPage',
    components: { ButtonBase },
    data: () => ({
        state: {
            current: 'login'
        },
        register: {
            email: '',
            password: ''
        }
    }),
    methods: {
        async onRegister (e) {
            e.preventDefault()

            try {
                let response = await this.$auth.loginWith('local', { data: this.$data.register })
                console.log(response)
            } catch (err) {
                console.log(err)
            }
        }
    }
}
</script>