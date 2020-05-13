<template>
    <div class="PopinLogin">
        <popin-generic id="login" :modifiers="['xs']" :global="true" @open="(v) => state.current = v.type">
            <div class="p-60">
                <form class="Form" @submit="onLogin" v-show="state.current == 'login'">
                    <p class="ft-title-xl mb-20">
                        J'ai déjà un compte
                    </p>
                    
                    <div class="Form_row">
                        <input type="text" name="email" placeholder="Adresse e-mail" v-model="login.email" required autocomplete>
                    </div>
                    <div class="Form_row">
                        <input type="password" name="current-password" placeholder="Mot de passe" v-model="login.password" required autocomplete>
                    </div>

                    <div class="Form_row text-right">
                        <link-base @click.native="state.current = 'reset'">J'ai oublié mon mot de passe</link-base>
                    </div>

                    <ul v-if="login.errors">
                        <li v-for="(error, i) in login.errors" :key="i">{{ error }}</li>
                    </ul>

                    <div class="text-center mt-20">
                        <button-base type="submit">Se connecter</button-base>
                    </div>

                    <hr class="mv-40">

                    <div class="text-center">
                        <link-base @click.native="state.current = 'register'">Pas de compte ? Inscris-toi !</link-base>
                    </div>
                </form>

                <form class="Form" @submit="onRegister" v-show="state.current == 'register'">
                    <p class="ft-title-xl">
                        Je m'inscris
                    </p>

                    <p class="mv-20 ft-l">Crée un compte <b>eventkit</b> pour sauvegarder tous tes projets, c'est gratuit !</p>
                    
                    <div class="Form_row">
                        <input type="text" name="name" placeholder="Ton prénom" v-model="register.name" required>
                    </div>

                    <div class="Form_row">
                        <input type="text" name="email" placeholder="Adresse e-mail" v-model="register.email" required>
                    </div>

                    <div class="Form_row">
                        <input type="password" name="new-password" placeholder="Mot de passe" v-model="register.password" required>
                    </div>

                    <ul v-if="register.errors">
                        <li v-for="(error, i) in register.errors" :key="i">{{ error }}</li>
                    </ul>

                    <div class="text-center mt-20">
                        <button-base type="submit">S'inscrire</button-base>
                    </div>

                    <p class="text-center ft-xs mt-20">En continuant, vous acceptez les Conditions générales et Politique de confidentialité</p>

                    <hr class="mv-40">

                    <div class="text-center">
                        <link-base @click.native="state.current = 'login'">Tu as déjà un compte ?</link-base>
                    </div>
                </form>

                <form class="Form" @submit="onReset" v-show="state.current == 'reset'">
                    <p class="ft-title-xl mb-20">
                        Réinitialiser mon mot de passe
                    </p>
                    
                    <div class="Form_row">
                        <input type="text" name="email" placeholder="Adresse e-mail" v-model="reset.email" required>
                    </div>

                    <ul v-if="reset.errors">
                        <li v-for="(error, i) in reset.errors" :key="i">{{ error }}</li>
                    </ul>

                    <div class="text-center mt-20">
                        <button-base type="submit">Envoyer le lien</button-base>
                    </div>
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
            name: '',
            email: '',
            password: '',
            register: true
        },
        reset: {
            errors: [],
            email: ''
        }
    }),
    methods: {
        async onLogin (e) {
            e.preventDefault()

            let response = await this.$auth.loginWith('local', { data: this.$data.login })
            if (response.data.status != 1) {
                this.$data.login.errors = response.data.errors
            } else {
                this.$store.commit('popins/close', 'login')
                
                this.$store.commit('utils/addNotification', {
                    type: 'success',
                    text: `Bonjour, ${this.$store.state.auth.user.name} ! Ravi de te revoir.`
                })
            }
        },
        async onRegister (e) {
            e.preventDefault()

            let response = await this.$auth.loginWith('local', { data: {
                ...this.$data.register,
                userAnonymous: this.$cookies.get('anonymous-id') ? this.$cookies.get('anonymous-id') : undefined
            } })

            if (response.data.status != 1) {
                this.$data.register.errors = response.data.errors
            }
        },
        async onReset (e) {
            e.preventDefault()

            let response = await this.$store.dispatch('user/reset', {
                query: { email: this.$data.reset.email }
            })

            if (response.status != 1) {
                this.$data.reset.errors = response.errors
            }
        }
    }
}
</script>