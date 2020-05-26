<template>
    <div class="Kickstarter o-hidden" v-if="theme">
        <div class="Kickstarter_content">
            <header class="Kickstarter_header">
                <div class="Wrapper">
                    <div class="row">
                        <div class="col-6 Kickstarter_pattern">
                            <h1 class="ft-title-xl">
                                <b>{{ kit.subtitle }}</b>
                            </h1>
                        </div>
                        <div class="col-6">
                            {{ kit.excerpt }}
                        </div>
                    </div>
                </div>
            </header>
            <div class="Kickstarter_container Wrapper pv-40" :class="{ 'is-selected': selectedTheme }">
                <h2 class="ft-title-2xl"><b>Choisis un design de départ</b></h2>
                <p>Pas d'inquiétude, tout est configurable ensuite</p>

                <simple-slider v-for="(tag, id) in tags" class="mv-40" :modifiers="['s']" :gutter="10" :key="id">
                    <template slot="title">
                        <h2 class="ft-title-l"><b>{{ $t(`kits.conversation.tags.${id}`) }}</b></h2>
                    </template>

                    <div
                        class="Kickstarter_item"
                        v-for="template in tag.templates"
                        :class="{ 'is-selected': template.theme == selectedTheme }"
                        :key="template._id"
                    >
                        <component
                            class="Kickstarter_component p-relative"
                            @click.native="() => onSelectTheme(template.theme)"
                            :is="theme.component.value"
                            :theme="template.theme"
                            :data="template.ideas"
                            :scale="0.85"
                        />
                    </div>
                </simple-slider>
                
            </div>
        </div>
        <div class="Kickstarter_footer">
            <div></div>

            <div class="d-flex fx-align-center">
                <input-text type="text" v-model="title" label="Nomme ton projet" />

                <button-base @click="create" class="ml-10" :modifiers="['blue', 's']" :disabled="selectedTheme ? false : false">
                    Créer mon projet
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import KITS from '@/config/kits'
import shortid from 'shortid'

import ConversationStarter from '@/components/generators/ConversationStarter'
import SimpleSlider from '@/components/interactive/SimpleSlider'
import InputText from '@/components/form/InputText'

export default {
    name: 'Kickstarter',
    components: { ConversationStarter, SimpleSlider, InputText },
    async fetch () {
        try {    
            this.$data.templates = await this.$store.dispatch('kits/project/fetch', {
                query: { template: true, kit: this.$props.kit._id }
            })

            this.$data.ideaPack = await this.$store.dispatch('kits/ideas/fetch', {
                query: { kickstarter: true, kit: this.$props.kit._id }
            })
        } catch (e) { console.warn(e) }
    },
    props: {
        kit: { type: Object }
    },
    data: () => ({
        templates: [],
        ideaPack: {},
        title: '',
        selectedTheme: null
    }),
    computed: {
        theme () {
            return KITS[this.$props.kit.slug].theme
        },
        defaultTheme () {
            return KITS[this.$props.kit.slug].default
        },
        tags () {
            let tags = {}

            this.$data.templates.forEach(template => {
                if (template.templateTags) {
                    template.templateTags.split(',').forEach(tagId => {
                        tags[tagId] = tags[tagId] ? tags[tagId] : { templates: [] }
                        
                        tags[tagId].templates.push(template)
                    })
                }
            })

            return tags
        }
    },
    methods: {
        onSelectTheme (theme) {
            this.$data.selectedTheme = this.$data.selectedTheme && this.$data.selectedTheme == theme ? null : theme
        },
        async create () {
            let randomIdeas = this.$data.ideaPack ? this.$data.ideaPack.slice().sort(v => Math.random() - 0.5).slice(0, 10).map(v => ({
                ...v,
                original: v,
                _id: shortid.generate(),
                new: true
            })) : []
            

            if (!this.$data.selectedTheme) this.$data.selectedTheme = this.defaultTheme

            await this.$store.dispatch('kits/project/create', {
                title: this.$data.title,
                kit: this.$props.kit._id,
                theme: this.$data.selectedTheme,
                ideas: randomIdeas,
                user: this.$store.state.auth.user ? this.$store.state.auth.user._id : undefined,
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Kickstarter {
        height: calc(100vh - var(--height-scrolled));
        display: flex;
        flex-direction: column;
    }

    .Kickstarter_header {
        padding: 40px 0;
        border-bottom: 1px solid var(--color-border);
    }

    .Kickstarter_content {
        flex-grow: 1;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .Kickstarter_footer {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--color-border);
    }

    .Kickstarter_container {

        &.is-selected {

            .Kickstarter_component {
                opacity: 0.5;
                transform: scale(0.94);
            }
        }
    }

    .Kickstarter_item {
        padding: 10px;
        border: 1px solid var(--color-border);
        cursor: pointer;

        &:hover {

            .Kickstarter_component {
                transform: scale(0.98)
            }
        }

        &.is-selected,
        &.is-selected:hover {

            .Kickstarter_component {
                opacity: 1;
                transform: scale(1)
            }
        }
    }

    .Kickstarter_component {
        transition: all 150ms ease-out;
    }
</style>