<template>
    <div class="Page Page--admin Admin">
        <div class="Page_content">
            <div class="Wrapper">
                <button-base @click="state.new = true">
                    Nouveau pack
                </button-base>

                <idea-pack
                    class="idea-pack"
                    v-for="pack in packs"
                    :pack="pack"
                    :key="pack.id"
                    :update-mode="true"
                    :default-value="{ main: 'Nouveau' }"
                />
            </div>
        </div>

        <popin-generic :modifiers="['xs']" :is-active="state.edit || state.new">
            <template slot="header">
                <p class="ft-m p-10">
                    <b v-if="state.edit">Modification de "{{ pack.title }}"</b>
                    <b v-if="state.new">Nouvelle catégorie</b>
                </p>
            </template>
            
            <div class="Form p-40">
                <div class="Form_row">
                    <input type="text" placeholder="Titre" v-model="pack.title">
                </div>

                <div class="Form_row">
                    <input type="text" placeholder="Description" v-model="pack.description">
                </div>

                <div class="Form_row">
                    <input type="text" placeholder="Color 1" v-model="pack.color1">
                </div>

                <div class="Form_row">
                    <input type="text" placeholder="Color 2" v-model="pack.color2">
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
                        {{ state.new ? 'Créer pack' : 'Modifier pack'}}
                    </button-base>
                </div>
            </template>
        </popin-generic>
    </div>
</template>

<script>
import IdeaPack from '@/components/interactive/IdeaPack'
import PopinGeneric from '@/components/popins/PopinGeneric'

export default {
    name: 'HomePage',
    layout: 'admin',
    components: { PopinGeneric, IdeaPack },
    async fetch () {
        await this.$store.dispatch('generators/packs/fetch', {
            query: {}
        })
    },
    data: () => ({
        state: {
            new: false,
            edit: false,
            thumbnail: false
        },
        pack: {
            title: '',
            description: '',
            color1: '',
            color2: ''
        }
    }),
    computed: {
        packs () {
            return this.$store.state.generators.packs.collection
        }
    },
    methods: {
        async onDelete () {
            await this.$store.dispatch('generators/packs/delete', {
                data: { id: this.$data.pack.id }
            })

            this.onReset()

            await this.$store.dispatch('generators/packs/fetch')
        },
        onEdit (pack) {
            this.$data.state.edit = true

            this.$data.pack = pack
        },
        async onSubmit () {
            const response = await this.$store.dispatch('generators/packs/post', {
                data: this.$data.pack
            })

            this.onReset()

            await this.$store.dispatch('generators/packs/fetch')
        },
        onReset () {
            this.$data.state.edit = false
            this.$data.state.new = false

            this.$data.pack = {
                 title: '',
                description: '',
                color1: '',
                color2: ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .idea-pack {
        margin-bottom: 20px;
    }
</style>