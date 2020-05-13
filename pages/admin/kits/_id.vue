<template>
    <div class="Page Page--admin Admin AdminArticleEdit">
        <div class="Page_content" v-if="!state.loading">
            <file-loader
                id="kit-cover"
                :is-active="state.selectCover"
                @done="state.selectCover = false"
                :value="kit.cover ? kit.cover._id : undefined"
                @input="(v) => kit.cover = v"
            />

            <file-loader
                id="kit-thumbnail"
                :is-active="state.selectThumbnail"
                @done="state.selectThumbnail = false"
                :value="kit.thumbnail ? kit.thumbnail._id : undefined"
                @input="(v) => kit.thumbnail = v"
            />

            <div class="Wrapper">
                <form id="mainForm" class="Form row-s" @submit="onSubmit" ref="form">
                    <div class="col-8 mt-20">
                        <div class="Form_row cover" :style="{ 'backgroundImage': `url(${kit.cover.src})` }">
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
                            <textarea class="ft-title-2xl ft-bold" placeholder="Titre" v-model="kit.title"></textarea>
                        </div>

                        <div class="Form_row">
                            <textarea placeholder="Excerpt" v-model="kit.excerpt"></textarea>
                        </div>
                        
                        <div class="Form_row">
                            <text-editor v-model="kit.content" />
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="form-sticky">
                            <div class="form-secondary">
                                <div class="Form_row">
                                    <p v-if="kit.id">Publication : <b>{{ publishedDate }}</b></p>
                                    <p v-if="kit.id">Mis à jour : <b>{{ modifiedDate }}</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="bottom-bar">
                <input type="checkbox" v-model="kit.published">
                <button-base type="submit" form="mainForm">
                    {{ kit.id ? 'Sauvegarder' : 'Créer' }}
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

import TextEditor from '@/components/admin/utils/TextEditor'
import FileLoader from '@/components/admin/utils/FileLoader'
import SelectSearch from '@/components/utils/SelectSearch'

export default {
    name: 'ArticlePageAdmin',
    layout: 'admin',
    components: { TextEditor, FileLoader, SelectSearch },
    async fetch () {
        if (this.$route.params.id && this.$route.params.id !== 'new') {
            const search = await this.$store.dispatch('kits/get', {
                refetch: true,
                query: { _id: this.$route.params.id, published: false }
            })
            
            this.$data.kit = {
                ...this.$data.kit,
                ...search
            }
        }
        
        this.$data.state.loading = false
    },
    
    head () {
        return {
            title: 'Admin - ' + (this.$data.kit.title ? this.$data.kit.title : 'Nouveau kit') 
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
        kit: {
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            cover: { _id: '', src: '' },
            thumbnail: { _id: '', src: '' },
            publishedDate: null,
            modifiedDate: null
        }
    }),
    computed: {
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
        async onSubmit (e) {
            e.preventDefault()

            const response = await this.$store.dispatch('kits/post', {
                data: {
                    ...this.$data.kit,
                    cover: this.$data.kit.cover._id,
                    thumbnail: this.$data.kit.thumbnail._id
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
