<template>
    <div class="Admin" v-if="!state.loading">
        <file-loader
            id="cover"
            :is-active="state.selectCover"
            @done="state.selectCover = false"
            v-model="article.cover"
        />

        <file-loader
            id="thumbnail"
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
                                <p v-if="article.id">Mis à jour : <b>{{ modifiedDate }}</b></p>
                                
                                <p>Nombre de mots : <b>{{ stats.words }}</b></p>
                                <p>Temps de lecture : <b>{{ article.readTime }} min.</b></p>
                            </div>

                            <p class="mt-20 mb-10">Catégorie :</p>

                            <div class="Form_row d-flex">
                                <select-search
                                    class="fx-grow"
                                    action="article-categories/fetch"
                                    v-model="article.categoryId"
                                />
                            </div>

                            <p class="mt-20 mb-10">Articles liés :</p>
                            
                            <div class="Form_row">
                                <div class="row-none" v-for="link in linked" :key="link._id">
                                    <div class="col-9">
                                        <select-search
                                            action="articles/fetch"
                                            v-model="link.article._id"
                                        />
                                    </div>
                                    <div class="col-3">
                                        <input type="number" placeholder="0" v-model="link.boost">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <article-block
                            class="mt-20"
                            :title="article.title"
                            :id="article.id"
                            :read-time="article.readTime"
                            :excerpt="article.excerpt"
                            :thumbnail="article.thumbnail"
                            :article="article"
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
import dayjs from 'dayjs'

import TextEditor from '@/components/admin/utils/TextEditor'
import FileLoader from '@/components/admin/utils/FileLoader'
import ArticleBlock from '@/components/articles/ArticleBlock'
import SelectSearch from '@/components/utils/SelectSearch'

export default {
    name: 'ArticlePageAdmin',
    layout: 'admin',
    components: { TextEditor, FileLoader, ArticleBlock, SelectSearch },
    async fetch () {
        if (this.$route.params.id && this.$route.params.id !== 'new') {
            const search = await this.$store.dispatch('articles/get', {
                query: { id: this.$route.params.id }
            })

            this.$data.article = {
                ...this.$data.article,
                ...search,
                categoryId: search.category ? search.category._id : ''
            }

            this.$data.linked = this.$data.article.linked.slice()
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
            category: null,
            categoryId: '',
            linked: [],
            cover: null,
            thumbnail: null,
            publishedDate: null,
            modifiedDate: null,
            readTime: 0
        },
        linked: [
            { article: { _id: '' }, boost: 0 }
        ]
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
        linked: {
            deep: true,
            immediate: true,
            handler (v) {
                if (v.length == 0 || v[v.length - 1].article._id != '') this.$data.linked.push({ article: { _id: '' }, boost: 0 })
            }
        }
    },
    methods: {
        async onSubmit (e) {
            e.preventDefault()

            const response = await this.$store.dispatch('articles/post', {
                data: {
                    ...this.$data.article,
                    linked: this.$data.linked.filter(a => a.article._id !== '')
                }
            })

            this.$data.article = {
                ...this.$data.article,
                ...response
            }

            if (this.$route.params.id === 'new') {
                this.$router.push({ name: 'admin-articles-id', params: { id: response.id } })
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
