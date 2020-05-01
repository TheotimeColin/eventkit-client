<template>
    <div class="Admin" v-if="!state.loading">
        <file-loader
            :is-active="state.selectCover"
            @done="state.selectCover = false"
            v-model="article.cover"
        />

        <file-loader
            :is-active="state.selectThumbnail"
            @done="state.selectThumbnail = false"
            v-model="article.thumbnail"
        />

        <div class="Wrapper">
            <form class="Form row-s" @submit="onSubmit">
                <div class="col-8 mt-20">
                    <div class="Form_row cover" :style="{ 'backgroundImage': `url(${article.cover})` }">
                        <div class="text-right">
                            <button-base type="button" @click="state.selectCover = true">
                                Sélectionner image de couverture
                            </button-base><br>
                            <button-base class="mt-5" type="button" @click="state.selectThumbnail = true">
                                Sélectionner miniature
                            </button-base>
                        </div>
                    </div>
                    
                    <div class="Form_row">
                        <textarea class="ft-title-2xl ft-bold" type="text" placeholder="Titre" v-model="article.title"></textarea>
                    </div>

                    <div class="Form_row">
                        <textarea placeholder="Excerpt" v-model="article.excerpt"></textarea>
                    </div>
                    
                    <div class="Form_row">
                        <text-editor v-model="article.content" @words="onLengthChange" />
                    </div>
                </div>

                <div class="col-4">
                    <div class="form-sticky">
                        <div class="form-secondary">
                            <div class="Form_row">
                                <p v-if="article.id">Publication : <b>{{ publishedDate }}</b></p>
                                <p v-if="article.id">Mise à jour : <b>{{ modifiedDate }}</b></p>
                                
                                <p>Nombre de mots : <b>{{ stats.words }}</b></p>
                                <p>Temps de lecture : <b>{{ article.readTime }} min.</b></p>
                            </div>
                            
                            <div class="Form_row">
                                <input type="text" placeholder="Slug" v-model="article.slug">
                            </div>
                        </div>

                        <article-block
                            class="mt-20"
                            :title="article.title"
                            :slug="article.slug"
                            :read-time="article.readTime"
                            :excerpt="article.excerpt"
                            :thumbnail="article.thumbnail"
                        />

                        <div class="mt-20 text-center">
                            <button-base type="submit">{{ article.id ? 'Sauvegarder' : 'Créer' }}</button-base>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import slugify from 'slugify'
import dayjs from 'dayjs'

import TextEditor from '@/components/admin/utils/TextEditor'
import FileLoader from '@/components/admin/utils/FileLoader'
import ArticleBlock from '@/components/articles/ArticleBlock'

export default {
    name: 'ArticlePageAdmin',
    layout: 'admin',
    components: { TextEditor, FileLoader, ArticleBlock },
    async fetch () {
        if (this.$route.params.id && this.$route.params.id !== 'new') {
            const search = await this.$store.dispatch('modules/articles/get', {
                query: { id: this.$route.params.id }
            })

            if (search[0]) this.$data.article = {
                ...this.$data.article,
                ...search[0]
            }
        }
        
        this.$data.state.loading = false
    },
    data: () => ({
        state: {
            loading: true,
            selectCover: false,
            selectThumbnail: false
        },
        stats: {
            words: 0,
            minutes: 0
        },
        article: {
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            cover: null,
            thumbnail: null,
            publishedDate: null,
            modifiedDate: null,
            readTime: 0
        }
    }),
    computed: {
        publishedDate () {
            let date = dayjs(this.$data.article.publishedDate)
            return `${date.format('D MMM YYYY')} (${date.fromNow()})`
        },
        modifiedDate () {
            let date = dayjs(this.$data.article.modifiedDate)
            return `${date.fromNow()}`
        }
    },
    watch: {
        ['article.title'] (v) {
            this.$data.article.slug = slugify(v, { lower: true, strict: true })
        }
    },
    methods: {
        async onSubmit (e) {
            e.preventDefault()

            try {
                const response = await this.$store.dispatch('modules/articles/post', {
                    data: this.$data.article
                })

                this.$data.article = {
                    ...this.$data.article,
                    ...response
                }

                if (this.$route.params.id === 'new') {
                    this.$router.push({ name: 'admin-articles-id', params: { id: response.id } })
                }
                
                if (response.status == 1) {
                    // this.$store.commit(`global/${ADD_FLASH}`, {
                    //     text: `L'article a été publié avec succès.`
                    // })
                } else {
                    // this.$store.commit(`global/${ADD_FLASH}`, {
                    //     text: `Erreur lors de l'enregistrement, veuillez réessayer.`
                    // })
                }
            } catch (e) {
                // this.$store.commit(`global/${ADD_FLASH}`, {
                //     text: `Erreur lors de l'enregistrement, veuillez réessayer.`
                // })
            }
        },
        onLengthChange (words) {
            this.$data.stats.words = words
            this.$data.article.readTime = Math.ceil(words / 200)
        },
        onCoverSelect () {
            this.$data.state.selectCover = true
        }
    }
}
</script>

<style lang="scss" scoped>
    .form-sticky {
        position: sticky;
        top: 20px;
        padding: 20px;
        background: var(--color-bg-weak);
        border-radius: 5px;
        border: 1px solid var(--color-border);
    }

    .cover {
        height: 400px;
        display: flex;
        justify-content: flex-end;
        padding: 20px;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        background-color: var(--color-bg-weak);
    }
</style>
