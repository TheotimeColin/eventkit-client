<template>
    <div class="PopinLogin">
        <popin-generic id="login" :modifiers="['xs']" :global="true" @open="(v) => state.current = v.type" @close="onClose">
            <div class="ph-60 pv-40 text-center">
                <div v-show="state.current == 'login'">
                    <p class="ft-title-xl mb-40"><b>Connexion</b></p>
                    <base-form :form="login" :errors="loginErrors" @submit="onLogin">
                         <template slot="footer">
                            <div class="Form_row">
                                <link-base @click.native="state.current = 'reset'">
                                    J'ai oublié mon mot de passe
                                </link-base>
                            </div>
                        </template>
                    </base-form>
                    
                    <hr class="mv-20">

                    <div class="text-center">
                        <button-base :modifiers="['secondary']" @click.native="state.current = 'register'">
                            Pas de compte ? Inscris-toi !
                        </button-base>
                    </div>
                </div>

                <div v-show="state.current == 'register'">
                    <p class="ft-title-xl mb-40"><b>Inscription</b></p>

                    <base-form :form="register" :errors="registerErrors" @submit="onRegister" />

                    <p class="text-center ft-xs mt-20">En continuant, vous acceptez les Conditions générales et Politique de confidentialité</p>

                    <hr class="mv-20">

                    <div class="text-center">
                        <button-base :modifiers="['secondary']" @click.native="state.current = 'login'">
                            Tu as déjà un compte ?
                        </button-base>
                    </div>
                </div>

                <div v-show="state.current == 'reset'">
                    <p class="ft-title-xl mb-40"><b>Réinitialisation du mot de passe</b></p>

                    <p class="mb-20">Un e-mail avec un lien pour réinitialiser ton mot de passe va t'être envoyé.</p>

                    <base-form :form="reset" :errors="resetErrors" @submit="onReset" />
                </div>
            </div>
        </popin-generic>
    </div>
</template>

<script>
import PopinGeneric from '@/components/popins/PopinGeneric'
import BaseForm from '@/components/form/BaseForm'

export default {
    name: 'PopinLogin',
    components: { PopinGeneric, BaseForm },
    data: () => ({
        state: {
            current: 'login'
        },
        login: {
            email: {
                id: 'email',
                type: 'email',
                label: 'Ton adresse e-mail',
                required: true,
                value: '',
            },
            password: {
                id: 'password',
                label: 'Ton mot de passe',
                type: 'password',
                required: true,
                value: ''
            }
        },
        loginErrors: [],
        register: {
            name: {
                id: 'name',
                label: 'Ton prénom',
                required: true,
                value: '',
                validations: {
                    minLength: { value: 1 }
                }
            },
            email: {
                id: 'email',
                type: 'email',
                label: 'Ton adresse e-mail',
                required: true,
                value: '',
            },
            password: {
                id: 'password',
                component: 'input-text',
                label: 'Ton mot de passe',
                type: 'password',
                required: true,
                value: '',
                validations: {
                    minLength: { value: 6, error: 'Cette valeur doit faire au moins 5 caractères' },
                    maxLength: { value: 20, error: 'Cette valeur ne devrait pas dépasser 20 caractères' },
                    password: { error: 'Ton  mot de passe doit contenir au moins une majuscule et 1 chiffre ou caractère spécial' }
                }
            }
        },
        registerErrors: [],
        reset: {
            email: {
                id: 'email',
                type: 'email',
                label: 'Ton adresse e-mail',
                required: true,
                value: '',
            }
        },
        resetErrors: []
    }),
    methods: {
        async onLogin () {
            let data = {}
            Object.keys(this.$data.login).forEach(k => data[k] = this.$data.login[k].value)
            const response = await this.$auth.loginWith('local', { 
                data: { ...data, login: true }
            })
        
            if (response.data.status != 1) {
                this.$data.loginErrors = response.data.errors
            } else {
                this.$store.commit('popins/close', 'login')
                this.$store.commit('utils/addNotification', {
                    type: 'success',
                    text: `Bonjour, ${this.$store.state.auth.user.name} ! Ravi de te revoir.`
                })
            }
        },
        async onRegister () {
            let data = {}
            Object.keys(this.$data.register).forEach(k => data[k] = this.$data.register[k].value)
            const response = await this.$auth.loginWith('local', { data: {
                ...data,
                register: true,
                userAnonymous: this.$cookies.get('anonymous-id') ? this.$cookies.get('anonymous-id') : undefined
            } })

            if (response.data.status != 1) {
                this.$data.registerErrors = response.data.errors
            } else {
                this.$store.commit('popins/close', 'login')
                this.$store.commit('utils/addNotification', {
                    type: 'success',
                    text: `Bienvenue, ${data.name} !`
                })
            }
        },
        async onReset () {
            let data = {}
            Object.keys(this.$data.reset).forEach(k => data[k] = this.$data.reset[k].value)

            let response = await this.$store.dispatch('user/reset', {
                query: { email: data.email }
            })

            if (response.status != 1) {
                this.$data.resetErrors = response.errors
            } else {
                this.$store.commit('popins/close', 'login')
                this.$store.commit('utils/addNotification', {
                    type: 'success',
                    text: `Un e-mail vient de t'être envoyé. À tout de suite !`
                })
            }
        },
        onClose () {
            this.$data.loginErrors = []
            this.$data.registerErrors = []
            this.$data.resetErrors = []
        }
    }
}
</script>