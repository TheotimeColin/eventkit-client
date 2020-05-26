<template>
    <div class="TemplateCreator">
        <label>
            Est un template ? <input type="checkbox" @change="(e) => $store.commit('kits/project/updateProject', {
                template: e.target.checked
            })" :checked="project.template">
        </label>

        <input type="text" placeholder="Tags" @change="(e) => $store.commit('kits/project/updateProject', {
            templateTags: e.target.value
        })" :value="project.templateTags">
    </div>
</template>

<script>
export default {
    name: 'TemplateCreator',
    components: {},
    props: {
        project: { type: Object },
    },
    data: () => ({
        state: {
            active: ''
        },
        localTheme: null
    }),
    computed: {

    },
    watch: {
        theme: {
            immediate: true,
            deep: true,
            handler (v) {
                if (v) this.$data.localTheme = JSON.parse(JSON.stringify(v))
            }
        }
    }
}
</script>