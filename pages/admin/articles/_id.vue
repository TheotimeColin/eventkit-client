<template>
    <div class="Page Page--admin Admin AdminArticleEdit">
        <div class="Page_content" v-if="!state.loading">
            <file-loader
                id="cover"
                :is-active="state.selectCover"
                @done="state.selectCover = false"
                :value="article.cover ? article.cover._id : undefined"
                @input="(v) => article.cover = v"
            />

            <file-loader
                id="thumbnail"
                :is-active="state.selectThumbnail"
                @done="state.selectThumbnail = false"
                :value="article.thumbnail ? article.thumbnail._id : undefined"
                @input="(v) => article.thumbnail = v"
            />

            <div class="Wrapper">
                <form id="mainForm" class="Form row-s" @submit="onSubmit" ref="form">
                    <div class="col-8 mt-20">
                        <div class="Form_row cover" :style="{ 'backgroundImage': `url(${article.cover.src})` }">
                            <div class="text-right">
                                <button-base type="button" @click="state.selectCover = true">
                                    Sélectionner image de couverture
                                </button-base><br>
                                <button-base class="mt-5" type="button" @click="state.selectThumbnail = true">
                                    Sélectionner miniature
                                </button-base>
                            </div>
                        </div>

                        <div class="Form_row row" v-if="article.notes">
                            <textarea
                                v-for="note in article.notes"
                                rows="1"
                                type="text"
                                :value="note.text"
                                @input="(e) => onNoteMutate(e, note)"
                                :key="note.id"
                            ></textarea>
                        </div>
                        
                        <div class="Form_row">
                            <textarea class="ft-title-2xl ft-bold" placeholder="Titre" v-model="article.title"></textarea>
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

                                <p class="mt-20 mb-10"><b>Catégorie</b></p>

                                <div class="Form_row d-flex">
                                    <select-search
                                        class="fx-grow"
                                        action="article-categories/fetch"
                                        v-model="article.categoryId"
                                    />
                                </div>
                                
                                <div class="Form_row">
                                    <div class="row-none mb-10">
                                        <div class="col-9">
                                            <b>Articles liés</b>
                                        </div>
                                        <div class="col-3">
                                            <b>Boost</b>
                                        </div>
                                    </div>
                                    <div class="row-none" v-for="link in linked" :key="link._id">
                                        <div class="col-9">
                                            <select-search
                                                action="articles/fetch"
                                                :unset="true"
                                                :params="{ refresh: false, query: { published: false }}"
                                                v-model="link.article._id"
                                            />
                                        </div>
                                        <div class="col-3">
                                            <input type="number" placeholder="0" v-model="link.boost">
                                        </div>
                                    </div>
                                </div>

                                <div class="Form_row">
                                    <div class="row-none mb-10">
                                        <div class="col-9">
                                            <b>Réactions</b>
                                        </div>
                                    </div>
                                    <div class="row-none" v-for="reaction in reactions" :key="reaction.type._id">
                                        <div class="col-9">
                                            <select-search
                                                action="reactions/fetch"
                                                :unset="true"
                                                :params="{ refresh: false, query: { _id: reaction.type._id } }"
                                                v-model="reaction.type._id"
                                            />
                                        </div>
                                        <div class="col-3">
                                            <input class="text-center" type="text" placeholder="0" v-model="reaction.uniqueCount" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <article-block
                                class="mt-20"
                                :title="article.title"
                                :slug="article.slug"
                                :read-time="article.readTime"
                                :excerpt="article.excerpt"
                                :thumbnail="article.thumbnail"
                                :article="article"
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div class="bottom-bar">
                <input type="checkbox" v-model="article.published">
                <button-base type="submit" form="mainForm">
                    {{ article.id ? 'Sauvegarder' : 'Créer' }}
                </button-base>
            </div>
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
                refetch: true,
                query: { id: this.$route.params.id, published: false, notes: true }
            })

            this.$data.article = {
                ...this.$data.article,
                ...search,
                categoryId: search.category ? search.category._id : '',
                notes: search.notes.length >= 2 ? search.notes : [
                    { id: 0, text: '' },
                    { id: 1, text: '' },
                ]
            }

            this.$data.linked = this.$data.article.linked.slice()
            if (this.$data.article.reactions) this.$data.reactions = this.$data.article.reactions.slice()
        }
        
        this.$data.state.loading = false
    },
    
    head () {
        return {
            title: 'Admin - ' + (this.$data.article.title ? this.$data.article.title : 'Nouvel article') 
        }
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
            cover: { _id: '', src: '' },
            thumbnail: { _id: '', src: '' },
            publishedDate: null,
            modifiedDate: null,
            readTime: 0,
            notes: []
        },
        linked: [
            { article: { _id: '' }, boost: 0 }
        ],
        reactions: [
            { type: { _id: '' } , count: 0 }
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
        },
        reactions: {
            deep: true,
            immediate: true,
            handler (v) {
                if (v.length == 0 || v[v.length - 1].type._id != '') this.$data.reactions.push({ type: { _id: '' } , count: 0 })
            }
        }
    },
    methods: {
        onNoteMutate (e, note) {
            this.$data.article.notes = this.$data.article.notes.map(n => ({
                ...n,
                text: n.id == note.id ? e.target.value : n.text
            }))
        },
        async onSubmit (e) {
            e.preventDefault()

            const response = await this.$store.dispatch('articles/post', {
                data: {
                    ...this.$data.article,
                    cover: this.$data.article.cover._id,
                    thumbnail: this.$data.article.thumbnail._id,
                    linked: this.$data.linked.filter(a => a.article._id !== ''),
                    reactions: this.$data.reactions.filter(r => r.type._id !== '')
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

<style lang="scss">
    :root {
        --bottom-bar: 80px;
    }

    .AdminArticleEdit {
        .form-sticky {
            margin: 20px 0 0 10px;
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
    }
</style>
