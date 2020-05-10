<template>
    <div class="PopinLogin">
        <popin-generic id="login" :modifiers="['xs']">
            <div class="p-60">
                <form class="Form" @submit="onLogin" v-show="state.current == 'login'">
                    <p class="ft-title-2xl mb-20">
                        J'ai déjà un compte
                    </p>
                    
                    <div class="Form_row">
                        <input type="text" name="email" placeholder="Adresse e-mail" v-model="login.email" autocomplete>
                    </div>
                    <div class="Form_row">
                        <input type="password" name="current-password" placeholder="Mot de passe" v-model="login.password" autocomplete>
                    </div>

                    <ul v-if="login.errors">
                        <li v-for="(error, i) in login.errors" :key="i">{{ error }}</li>
                    </ul>

                    <div class="text-center mt-20">
                        <button-base type="submit">Se connecter</button-base>
                    </div>

                    <link-base @click.native="state.current = 'register'">Pas de compte ? Inscris-toi !</link-base>
                </form>

                <form class="Form" @submit="onRegister" v-show="state.current == 'register'">
                    <p class="ft-title-2xl mb-20">
                        Je m'inscris, c'est <span class="underline">gratuit</span>
                    </p>
                    
                    <div class="Form_row">
                        <input type="text" name="email" placeholder="Adresse e-mail" v-model="register.email">
                    </div>
                    <div class="Form_row">
                        <input type="password" name="new-password" placeholder="Mot de passe" v-model="register.password">
                    </div>

                    <ul v-if="login.errors">
                        <li v-for="(error, i) in login.errors" :key="i">{{ error }}</li>
                    </ul>

                    <div class="text-center mt-20">
                        <button-base type="submit">S'inscrire</button-base>
                    </div>

                    <link-base @click.native="state.current = 'login'">Tu as déjà un compte ?</link-base>
                </form>
            </div>
        </popin-generic>
    </div>
</template>

<script>
import PopinGeneric from '@/components/popins/PopinGeneric'

export default {
    name: 'PopinLogin',
    components: { PopinGeneric },
    data: () => ({
        state: {
            current: 'login'
        },
        login: {
            errors: [],
            email: '',
            password: '',
            login: true
        },
        register: {
            errors: [],
            email: '',
            password: '',
            register: true
        }
    }),
    methods: {
        async onLogin (e) {
            e.preventDefault()

            try {
                let response = await this.$auth.loginWith('local', { data: this.$data.login })
                if (response.data.status != 1) this.$data.login.errors = response.data.errors
            } catch (err) {
                console.log(err)
            }
        },
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