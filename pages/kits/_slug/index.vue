<template>
    <div class="KitPage Page">
        <article class="Page_content" v-if="kit">

            <header class="KitPage_header">
                <div class="KitPage_cover" :style="{
                    backgroundColor: kit.theme.colors.backgroundColor,
                    backgroundImage: $pattern({ ...kit.theme.pattern, color: kit.theme.colors.patternColor
                })}">  
                    <div class="KitPage_rail">
                        <component
                            v-for="template in templates"
                            class="KitPage_railItem p-relative"
                            :is="template.theme.component"
                            :theme="template.theme"
                            :data="template.ideas[0]"
                            :scale="0.75"
                            :key="template._id"
                        />
                    </div>
                </div>
                
                <div class="KitPage_titles">
                    <div class="KitPage_titlesContainer">
                        <h1 class="KitPage_title">{{ kit.subtitle }}</h1>

                        <legend class="KitPage_excerpt mt-10">
                            {{ kit.excerpt }}
                        </legend>

                        <div>
                            <!-- <Tag
                                class="mt-40"
                                :title="article.category.title"
                                :id="article.category.id"
                                v-if="article.category"
                            /> -->
                        </div>
                    </div>
                </div>
            </header>

            <section class="Wrapper max-width-m mb-60">
                <div class="row-l">
                    <div class="col-grow">
                        <div class="mt-60">
                            <text-editor :value="kit.content" :editable="false" />
                        </div>
                    </div>
                    <div class="col-s">
                        <div class="width-2xs bg-bg">
                            
                        </div>
                    </div>
                </div>
            </section>

            <section class="pv-60 bg-cyan-xweak o-hidden">
                <div class="Wrapper">
                    <simple-slider>
                        <template slot="title">
                            <h2 class="ft-title-xl line-1"><b>💡 Inspiration</b></h2>
                        </template>
                        <component
                            v-for="template in templates"
                            class="p-relative"
                            :is="template.theme.component"
                            :theme="template.theme"
                            :data="template.ideas[0]"
                            :scale="1"
                            :key="template._id"
                        />
                    </simple-slider>
                </div>
            </section>

            <section class="Wrapper max-width-m">
                <div class="row pv-60">
                    <div class="col-grow fx-grow">
                        <h2 class="KitPage_subtitle">⚙️ Variantes</h2>

                        <div class="KitPage_variant row" v-for="variant in kit.variants" :key="variant.id">
                            <div class="col-shrink">
                                <component
                                    class="p-relative"
                                    :is="variant.theme.component"
                                    :theme="variant.theme"
                                    :scale="0.75"
                                />
                            </div>
                            <div class="col-grow fx-grow">
                                <p class="ft-xl ft-bold mb-10">{{ variant.title }}</p>
                                <text-editor :value="variant.content" :editable="false" />
                            </div>
                        </div>
                    </div>
                    <div class="col-s">
                        <div class="width-2xs bg-bg">
                            oh hi
                        </div>
                    </div>
                </div>
            </section>
        </article>
    </div>
</template>

<script>
import pattern from '@/utils/pattern-mixin'

import LinkBase from '@/components/base/LinkBase'
import Tag from '@/components/utils/Tag'
import TextEditor from '@/components/admin/utils/TextEditor'
import SimpleSlider from '@/components/interactive/SimpleSlider'
import ConversationStarter from '@/components/generators/ConversationStarter'

import dayjs from 'dayjs'

export default {
    name: 'KitPage',
    mixins: [ pattern ],
    components: { TextEditor, LinkBase, Tag, SimpleSlider, ConversationStarter },
    async fetch () {
        const search = await this.$store.dispatch('kits/get', {
            query: { slug: this.$route.params.slug }
        })

        this.$data.kit = search
        this.$data.templates = await this.$store.dispatch('kits/project/fetch', {
            query: { template: true, kit: this.$data.kit._id }
        })
    },
    data: () => ({
        state: {
            loaded: false
        },
        kit: null,
        templates: []
    }),
    head () {
        return this.$data.kit ? {
            htmlAttrs: {
                prefix: 'og: http://ogp.me/ns#'
            },
            title: this.$data.kit.subtitle,
            meta: [
                { hid: 'description', name: 'description', content: this.$data.kit.excerpt },
                { property: 'og:description', content: this.$data.kit.excerpt },
                { property: 'og:image', content: this.$data.kit.thumbnail.src },
                { property: 'og:image:width', content: this.$data.kit.thumbnail.width },
                { property: 'og:image:height', content: this.$data.kit.thumbnail.height },
                { property: 'og:type', content: 'article' },
                { property: 'og:article:published_time', content: this.$data.kit.publishedDate },
                { property: 'og:article:modified_time', content: this.$data.kit.modifiedDate },
                { property: 'og:article:author', content: 'Théotime Colin' },
                { property: 'og:article:section', content: this.$data.kit.category ? this.$data.kit.category.title : undefined }
            ]
        } : false
    }
}
</script>
