<template>
    <div class="Kickstarter" v-if="theme">
        <div class="p-40 text-center">
            <h1 class="ft-title-xl">
                <b>{{ kit.title }}</b>
            </h1>

            <input type="text" v-model="title" placeholder="Nomme ton projet">

            <div class="Kickstarter_container" :class="{ 'is-selected': selectedTheme }">
                <div
                    class="Kickstarter_item"
                    v-for="template in templates"
                    :class="{ 'is-selected': template.theme == selectedTheme }"
                    :key="template._id"
                >
                    <component
                        class="Kickstarter_component p-relative"
                        @click.native="() => onSelectTheme(template.theme)"
                        :is="theme.component.value"
                        :theme="template.theme"
                        :init-theme="theme"
                        :data="template.ideas"
                        :style="{ '--scale': 1 }"
                    />
                </div>
            </div>

            <button-base @click="create" :disabled="selectedTheme ? false : true">
                Créer mon projet
            </button-base>
        </div>
    </div>
</template>

<script>
import KITS from '@/config/kits'

import ConversationStarter from '@/components/generators/ConversationStarter'

export default {
    name: 'Kickstarter',
    components: { ConversationStarter },
    async fetch () {
        this.$data.templates = await this.$store.dispatch('kits/project/fetch', {
            query: { template: true }
        })
    },
    props: {
        kit: { type: Object }
    },
    data: () => ({
        templates: [],
        title: '',
        selectedTheme: null
    }),
    computed: {
        theme () {
            return KITS[this.$props.kit.slug].theme
        }
    },
    methods: {
        onSelectTheme (theme) {
            this.$data.selectedTheme = theme
        },
        async create () {
            await this.$store.dispatch('kits/project/create', {
                title: this.$data.title,
                kit: this.$props.kit._id,
                theme: this.$data.selectedTheme,
                ideas: [],
                user: this.$store.state.auth.user ? this.$store.state.auth.user._id : undefined,
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Kickstarter_container {
        display: flex;
        flex-wrap: wrap;
        
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
        transform: scale(0.94);
        overflow: 1;

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