<template>
    <div class="Generator">
        <div class="Generator_container">
            <div class="Generator_configurator">
                <configurator :config="config" @update="onUpdate" v-if="config" />
            </div>
            <div class="Generator_previewer">
                <previewer :config="config" v-if="config" />
            </div>
        </div>
        <div class="Generator_footer">
            <!-- <button-base @click.native="state.preview = !state.preview">
                Preview mode
            </button-base>
            <button-base @click.native="onExport">
                Format pdf
            </button-base> -->
        </div>
    </div>
</template>

<script>
import Configurator from '@/components/generators/configurator'
import Previewer from '@/components/generators/previewer'

export default {
    name: 'Generator',
    components: { Configurator, Previewer },
    props: {
        initConfig: { type: Object }
    },
    data: () => ({
        config: null
    }),
    computed: {

    },
    watch: {

    },
    mounted () {
        this.$data.config = { ...this.$props.initConfig }
    },
    methods: {
       onUpdate (config) {
           this.$data.config = config 
       }
    }
}
</script>