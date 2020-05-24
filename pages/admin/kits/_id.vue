<template>
    <div class="Page Page--admin Admin AdminArticleEdit">
        <div class="Page_content" v-if="!state.loading">
            <div class="kit-cover" :style="{
                backgroundColor: kit.theme.colors.backgroundColor,
                backgroundImage: $pattern({ ...kit.theme.pattern, color: kit.theme.colors.patternColor })
            }" @click="editTheme = { ...defaultTheme, ...kit.theme }" v-if="kit.theme"></div>

            <div class="Wrapper">
                <form id="mainForm" class="Form row-s" @submit.prevent="onSubmit" ref="form">
                    <div class="col-8 mt-20">                        
                        <div class="Form_row Input_container">
                            <textarea class="Input_element ft-title-xl ft-bold" rows="1" placeholder="Titre" v-model="kit.title"></textarea>
                        </div>
                        
                        <div class="Form_row Input_container">
                            <textarea class="Input_element ft-title-2xl ft-bold" placeholder="Sous-titre" v-model="kit.subtitle"></textarea>
                        </div>
                        

                        <div class="Form_row Input_container">
                            <textarea class="Input_element" placeholder="Excerpt" v-model="kit.excerpt"></textarea>
                        </div>
                        
                        <div class="Form_row">
                            <text-editor v-model="kit.content" />
                        </div>

                        <div>
                            <div class="d-flex fx-justify-between mt-40">
                                <p class="ft-title-l"><b>Variantes</b></p>

                                <button-base type="button" :modifiers="['s']" fa="plus" @click="addVariant">
                                    Ajouter
                                </button-base>
                            </div>

                            <div class="row-xs mv-20" v-for="(variant, i) in kit.variants" :key="i">
                                <div class="col-4 text-center">
                                    <component
                                        class="p-relative m-auto"
                                        :is="kit.theme.component"
                                        :theme="variant.theme"
                                        :scale="0.75"
                                        @click.native="editTheme = { ...defaultTheme, ...variant.theme, _id: variant._id }"
                                    />

                                    <button-base type="button" class="mt-10" :modifiers="['xs', 'secondary']" @click="() => deleteVariant(variant._id)">
                                        Supprimer
                                    </button-base>
                                </div>
                                <div class="col-8">
                                    <div class="Form_row Input_container mb-20">
                                        <input class="Input_element" type="text" v-model="variant.title">
                                    </div>
                                    <text-editor :compact="true" v-model="variant.content" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="form-sticky">
                            <div class="form-secondary">
                                <div class="Form_row">
                                    <div class="row-xs mb-20">
                                        <div class="col-grow">
                                            <component
                                                class="p-relative m-auto"
                                                :is="kit.theme.component"
                                                :theme="kit.theme"
                                                :scale="0.75"
                                                v-if="kit.theme"
                                            />
                                        </div>
                                        
                                        <div class="col-grow fx-grow">
                                            <rating v-model="kit.complexity" :editable="true" unit="🧠" />
                                            <rating v-model="kit.material" :editable="true" unit="🧶" />
                                            <rating v-model="kit.time" :editable="true" unit="⏱" />
                                        </div>
                                    </div>

                                    <p v-if="kit._id">Publication : <b>{{ publishedDate }}</b></p>
                                    <p v-if="kit._id">Mis à jour : <b>{{ modifiedDate }}</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <popin-generic :is-active="editTheme ? true : false" @close="editTheme = null" v-if="kit.theme">
                <configurator :init-theme="initTheme" :theme="editTheme" @update="onVariantUpdate" />
            </popin-generic>

            <div class="bottom-bar">
                <input type="checkbox" v-model="kit.published">
                <button-base type="submit" form="mainForm">
                    {{ kit._id ? 'Sauvegarder' : 'Créer' }}
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import kits from '@/config/kits'
import pattern from '@/utils/pattern-mixin'

import TextEditor from '@/components/admin/utils/TextEditor'
import SelectSearch from '@/components/utils/SelectSearch'
import ConversationStarter from '@/components/generators/ConversationStarter'
import Configurator from '@/components/generators/Configurator'
import PopinGeneric from '@/components/popins/PopinGeneric'
import Rating from '@/components/interactive/Rating'

export default {
    name: 'ArticlePageAdmin',
    layout: 'admin',
    mixins: [ pattern ],
    components: { TextEditor, SelectSearch, ConversationStarter, Configurator, PopinGeneric, Rating },
    async fetch () {
        try {
            if (this.$route.params.id && this.$route.params.id !== 'new') {
                let search = await this.$store.dispatch('kits/get', {
                    refetch: true,
                    query: { _id: this.$route.params.id, published: false }
                })

                search = JSON.parse(JSON.stringify(search))
                
                this.$data.kit = {
                    ...this.$data.kit,
                    ...search,
                    theme: { ...kits[search.slug].default, ...search.theme }
                }
            }
            
            this.$data.state.loading = false
        } catch (e) { console.warn(e) }
    },
    head () {
        return {
            title: 'Admin - ' + (this.$data.kit.title ? this.$data.kit.title : 'Nouveau kit') 
        }
    },
    data: () => ({
        state: {
            loading: true
        },
        stats: {
            words: 0,
            minutes: 0
        },
        kit: {
            title: '',
            subtitle: '',
            complexity: 1,
            time: 1,
            material: 1,
            slug: '',
            content: '',
            excerpt: '',
            theme: null,
            variants: [],
            publishedDate: null,
            modifiedDate: null
        },
        editTheme: null
    }),
    computed: {
        initTheme () {
            return kits[this.$data.kit.slug].theme
        },
        defaultTheme () {
            return kits[this.$data.kit.slug].default
        },
        publishedDate () {
            let date = dayjs(this.$data.kit.publishedDate)
            return `${date.format('D MMM YYYY')} (${date.fromNow()})`
        },
        modifiedDate () {
            let date = dayjs(this.$data.kit.modifiedDate)
            return `${date.fromNow()}`
        }
    },
    methods: {
        async onSubmit () {
            const response = await this.$store.dispatch('kits/post', {
                data: {
                    ...this.$data.kit
                }
            })

            this.$data.kit = {
                ...this.$data.kit,
                ...response
            }

            if (this.$route.params.id === 'new') {
                this.$router.push(this.localePath({ name: 'admin-kits-id', params: { id: response._id } }))
            }
        },
        addVariant () {
            this.$data.kit.variants.push({
                title: '',
                content: '',
                theme: this.defaultTheme
            })

            this.onSubmit()
        },
        deleteVariant (id) {
            this.$data.kit.variants = this.$data.kit.variants.filter(v => v._id != id)

            this.onSubmit()
        },
        onVariantUpdate (theme) {
            if (theme._id) {
                this.$data.kit.variants = this.$data.kit.variants.map(variant => ({
                    ...variant,
                    theme: theme._id == variant._id ? theme : variant.theme
                }))
            } else {
                this.$data.kit.theme = theme
            }
        }
    }
}
</script>

<style lang="scss">
    :root {
        --bottom-bar: 80px;
    }

    .AdminArticleEdit {
        .form-sticky {
            margin: 20px 0 0 10px;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid var(--color-border-weak);
        }

        .bottom-bar {
            height: var(--bottom-bar);
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 20px;
            background-color: var(--color-bg-light);
            border-top: 1px solid var(--color-border-strong);
        }

        .kit-cover {
            height: 20px;
        }
    }
</style>
