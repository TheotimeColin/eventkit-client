<template>
    <div class="Sharer" :class="{ }">
        <div class="p-10">
            <share-template
                :modifiers="['falling-down']"
                class="d-inline-block m-10"
                :init-theme="initTheme"
                :theme="project.theme"
                :items="project.ideas"
            />

            <share-template
                :modifiers="['simple-stack']"
                class="d-inline-block m-10"
                :init-theme="initTheme"
                :theme="project.theme"
                :items="project.ideas"
            />

            <share-template
                :modifiers="['messy']"
                class="d-inline-block m-10"
                :init-theme="initTheme"
                :theme="project.theme"
                :items="project.ideas"
            />

            <share-template
                :modifiers="['ordered']"
                class="d-inline-block m-10"
                :init-theme="initTheme"
                :theme="project.theme"
                :items="project.ideas"
            />
        </div>
    </div>
</template>

<script>
import { throttle } from 'throttle-debounce';

import ShareTemplate from '@/components/generators/ShareTemplate'

export default {
    name: 'Sharer',
    components: { ShareTemplate },
    props: {
        initTheme: { type: Object },
        project: { type: Object }
    },
    data: () => ({
        state: {
            export: false
        }
    }),
    mounted () {

    },
    computed: {

    },
    watch: {

    },
    methods: {

    }
}
</script>