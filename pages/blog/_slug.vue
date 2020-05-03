<template>
    <div class="ArticlePage Page">
        <div class="Page_content" v-if="article">
            <article class="pb-150">
                <header class="ArticlePage_header">
                    <div class="ArticlePage_cover" v-if="article.cover">
                        <img :src="article.cover.src" :alt="article.cover.alt">
                    </div>
                    
                    <div class="ArticlePage_titles">
                        <div class="ArticlePage_titlesContainer">
                            

                            <h1 class="ArticlePage_title">{{ article.title }}</h1>

                            <legend class="ArticlePage_excerpt mt-10">
                                {{ article.excerpt }}
                            </legend>

                            <div>
                                <Tag
                                    class="mt-40"
                                    :title="article.category.title"
                                    :id="article.category.id"
                                    v-if="article.category"
                                />
                            </div>

                            <article-author
                                class="mt-20"
                                name="Théotime Colin"
                                :published="publishedDate"
                                description="Théotime a organisé plus de 50 Meetups dans la région Parisienne"
                            />
                        </div>
                    </div>
                </header>

                <div class="ArticlePage_body TextBody" v-html="article.content" v-if="!editor"></div>
                <editor-content class="ArticlePage_body TextBody" :editor="editor" ref="text" v-if="editor" />
            </article>

            <div class="pv-100 bg-bg-weak" v-if="linkedArticles.length > 0">
                <div class="Wrapper">
                    <p class="ft-title-2xl mb-60">
                        <b>Encore un peu de lecture ?</b>
                    </p>

                    <div class="row">
                        <div class="col-4" v-for="link in linkedArticles" :key="link._id">
                            <article-block
                                :title="link.article.title"
                                :excerpt="link.article.excerpt"
                                :slug="link.article.slug"
                                :read-time="link.article.readTime"
                                :thumbnail="link.article.thumbnail"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleAuthor from '@/components/articles/ArticleAuthor'
import ArticleBlock from '@/components/articles/ArticleBlock'
import LinkBase from '@/components/base/LinkBase'
import Tag from '@/components/utils/Tag'
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Blockquote, Image, History, Link } from 'tiptap-extensions'
import Internal from '@/plugins/tiptap/Internal'

import dayjs from 'dayjs'

export default {
    name: 'ArticlePage',
    components: { EditorContent, ArticleAuthor, ArticleBlock, LinkBase, Tag },
    async fetch () {
        const search = await this.$store.dispatch('articles/get', {
            query: { slug: this.$route.params.slug, hitCount: true }
        })

        this.$data.article = search
        this.$data.state.loaded = true
    },
    data: () => ({
        state: {
            loaded: false
        },
        article: null,
        editor: null,
        linkedArticles: []
    }),
    head () {
        return this.article ? {
            htmlAttrs: {
                prefix: 'og: http://ogp.me/ns#'
            },
            title: this.article.title,
            meta: [
                { hid: 'description', name: 'description', content: this.article.excerpt },
                { property: 'og:description', content: this.article.excerpt },
                { property: 'og:image', content: this.article.cover.src },
                { property: 'og:image:width', content: this.article.cover.width },
                { property: 'og:image:height', content: this.article.cover.height },
                { property: 'og:type', content: 'article' },
                { property: 'og:article:published_time', content: this.article.publishedDate },
                { property: 'og:article:modified_time', content: this.article.modifiedDate },
                { property: 'og:article:author', content: 'Théotime Colin' },
                { property: 'og:article:section', content: this.article.category ? this.article.category.title : undefined }
            ]
        } : false
    },
    watch: {
        article: {
            deep: true,
            handler () {
                const metaDescription = document.querySelector('meta[name="description"]')
                if (this.$data.article.title) document.title = this.$data.article.title
                if (this.$data.article.excerpt) metaDescription.setAttribute('content', this.$data.article.excerpt)
            }
        },
        ['article.content']: {
            deep: true,
            immediate: true,
            handler (v) {
                if (this.$data.editor) this.$data.editor.setContent(v)
            }
        },
        ['article.linked']: {
            deep: true,
            immediate: true,
            handler (v) { this.onGenerateSimilar(v) }
        }
    },
    mounted () {
        this.$data.editor = new Editor({
            editable: false,
            extensions: [ new Heading({ levels: [1, 2, 3] }), new Bold(), new Internal(), new Blockquote(), new Image(), new History(), new Link() ],
        })
    },
    computed: {
        publishedDate () {
            let date = dayjs(this.$data.article.publishedDate)
            return `${date.format('D MMM YYYY')} (mis à jour ${date.fromNow()})`
        }
    },
    methods: {
        
        async onGenerateSimilar (links) {
            if (!links) return 

            let results = []

            links = await Promise.all(links.map(async link => {
                let article = await this.$store.dispatch('articles/get', {
                    query: { id: link.article.id }
                })

                return {
                    ...link,
                    article: article
                }
            }))

            let pool = []
            links.forEach(link => {
                for (let i = 0; i < link.boost + 1; i++) {
                    pool.push(link)
                }
            })

            while (pool.length > 0 && results.length < 3) {
                let selected = pool[Math.floor(Math.random() * pool.length)]
                pool = pool.filter(link => link._id != selected._id)
                
                results.push(selected)
            }

            this.$data.linkedArticles = results
        } 
    }
    
}
</script>
