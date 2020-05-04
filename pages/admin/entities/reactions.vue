<template>
    <div class="Page Page--admin Admin">
        <div class="Page_content">
            <div class="Wrapper">
                <button-base @click="state.new = true">
                    Nouvelle réaction
                </button-base>

                <div class="row fx-wrap mt-40">
                    <div class="col-3" v-for="reaction in reactions" :key="reaction._id" @click="() => onEdit(reaction)">
                        {{ reaction.emoji }}
                        {{ reaction.title }}
                        {{ reaction.description }}
                    </div>
                </div>

                <popin-generic :modifiers="['xs']" :is-active="state.edit || state.new">
                    <template slot="header">
                        <p class="ft-m p-10">
                            <b v-if="state.edit">Modification de "{{ reaction.title }}"</b>
                            <b v-if="state.new">Nouvelle réaction</b>
                        </p>
                    </template>
                    
                    <div class="Form p-40">
                        <div class="Form_row">
                            <input type="text" placeholder="Emoji" v-model="reaction.emoji">
                        </div>

                        <div class="Form_row">
                            <input type="text" placeholder="Titre" v-model="reaction.title">
                        </div>

                        <div class="Form_row">
                            <textarea type="text" placeholder="Sous-titre" v-model="reaction.description"></textarea>
                        </div>
                    </div>

                    <template slot="footer">
                        <div>
                            <button-base class="ml-10" :modifiers="['xs']" @click="$store.commit('utils/confirmPrompt', {
                                active: true,
                                onConfirm: () => onDelete(),
                                confirmText: 'Supprimer'
                            })" v-if="!state.new">
                                Supprimer
                            </button-base>
                        </div>

                        <div class="d-flex fx-align-center">
                            
                            <p class="mr-10 color-ft-weak" @click="onReset">Annuler</p>
                            <button-base @click="onSubmit">
                                {{ state.new ? 'Créer réaction' : 'Modifier réaction'}}
                            </button-base>
                        </div>
                    </template>
                </popin-generic>
            </div>
        </div>
    </div>
</template>

<script>
import PopinGeneric from '@/components/popins/PopinGeneric'

export default {
    name: 'EntityReactionsEdit',
    layout: 'admin',
    components: { PopinGeneric },
    async fetch () {
        await this.$store.dispatch('reactions/fetch')
    },
    computed: {
        reactions () {
            return this.$store.state['reactions'].collection
        }
    },
    data: () => ({
        state: {
            new: false,
            edit: false,
            thumbnail: false
        },
        reaction: {
            type: '',
            title: '',
            emoji: '',
            description: ''
        }
    }),
    methods: {
        async onDelete () {
            await this.$store.dispatch('reactions/delete', {
                data: { _id: this.$data.reaction._id }
            })

            this.onReset()

            await this.$store.dispatch('reactions/fetch')
        },
        onEdit (reaction) {
            this.$data.state.edit = true

            this.$data.reaction = {
                ...this.$data.reaction,
                ...reaction
            }
        },
        async onSubmit () {
            const response = await this.$store.dispatch('reactions/post', {
                data: this.$data.reaction
            })

            this.onReset()

            await this.$store.dispatch('reactions/fetch')
        },
        onReset () {
            this.$data.state.edit = false
            this.$data.state.new = false

            this.$data.reaction = {
                type: '',
                title: '',
                emoji: '',
                description: ''
            }
        }
    }
}
</script>