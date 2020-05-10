<template>
    <div class="HomePage Page bg-bg">
        <div class="Page_content">

        </div>
    </div>
</template>

<script>
import ArticleBlock from '@/components/articles/ArticleBlock'
import ArticleFeatured from '@/components/articles/ArticleFeatured'
import ArticleLine from '@/components/articles/ArticleLine'
import SimpleSlider from '@/components/interactive/SimpleSlider'

export default {
    name: 'HomePage',
    components: { SimpleSlider, ArticleBlock, ArticleFeatured, ArticleLine },
    async fetch () {

    },
    computed: {
        
    }
}
</script>

<style lang="scss" scoped>
    .article-block {
        margin: 20px 0;
    }
</style>
