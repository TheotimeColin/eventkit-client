<template>
    <div class="Page Page--admin Admin">
        <div class="Page_content">
            <div class="Wrapper">
                <button-base @click="state.new = true">
                    Nouvelle catégorie
                </button-base>

                <div class="row fx-wrap mt-40">
                    <div class="col-3" v-for="category in categories" :key="category.id">
                        <category-block
                            :title="category.title"
                            :subtitle="category.subtitle"
                            :thumbnail="category.thumbnail"
                            @click.native="() => onEdit(category)"
                        />
                    </div>
                </div>

                <popin-generic :modifiers="['xs']" :is-active="state.edit || state.new">
                    <template slot="header">
                        <p class="ft-m p-10">
                            <b v-if="state.edit">Modification de "{{ category.title }}"</b>
                            <b v-if="state.new">Nouvelle catégorie</b>
                        </p>
                    </template>
                    
                    <div class="cover" :style="{ backgroundImage: `url(${category.thumbnail.src})` }">
                        
                        <button-base :modifiers="['xs']" @click="state.thumbnail = true">
                            Sélectionner image
                        </button-base>
                    </div>

                    <div class="Form p-40">
                        <div class="Form_row">
                            <input type="text" placeholder="Titre" v-model="category.title">
                        </div>

                        <div class="Form_row">
                            <textarea type="text" placeholder="Sous-titre" v-model="category.subtitle"></textarea>
                        </div>

                        <div class="Form_row">
                            <textarea type="text" placeholder="Description" v-model="category.description"></textarea>
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
                                {{ state.new ? 'Créer catégorie' : 'Modifier catégorie'}}
                            </button-base>
                        </div>
                    </template>
                </popin-generic>

                <file-loader :is-active="state.thumbnail" v-model="category.thumbnail" @done="state.thumbnail = false" />
            </div>
        </div>
    </div>
</template>

<script>
import CategoryBlock from '@/components/utils/CategoryBlock'
import PopinGeneric from '@/components/popins/PopinGeneric'
import FileLoader from '@/components/admin/utils/FileLoader'

export default {
    name: 'HomePage',
    layout: 'admin',
    components: { CategoryBlock, PopinGeneric, FileLoader },
    async fetch () {
        await this.$store.dispatch('article-categories/fetch')
    },
    computed: {
        categories () {
            return this.$store.state['article-categories'].collection
        }
    },
    data: () => ({
        state: {
            new: false,
            edit: false,
            thumbnail: false
        },
        category: {
            title: '',
            subtitle: '',
            description: '',
            thumbnail: ''
        }
    }),
    methods: {
        async onDelete () {
            await this.$store.dispatch('article-categories/delete', {
                data: { id: this.$data.category.id }
            })

            this.onReset()

            await this.$store.dispatch('article-categories/fetch')
        },
        onEdit (category) {
            this.$data.state.edit = true

            this.$data.category = {
                ...this.$data.category,
                ...category
            }
        },
        async onSubmit () {
            const response = await this.$store.dispatch('article-categories/post', {
                data: this.$data.category
            })

            this.onReset()

            await this.$store.dispatch('article-categories/fetch')
        },
        onReset () {
            this.$data.state.edit = false
            this.$data.state.new = false

            this.$data.category = {
                title: '',
                subtitle: '',
                thumbnail: ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .article-block {
        margin: 20px 0;
    }

    .cover {
        height: 150px;
        padding: 20px;
        text-align: right;
        background-size: cover;
        background-position: center;
        background-color: var(--color-bg-weak);
    }
</style>