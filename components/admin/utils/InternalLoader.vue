<template>
    <div class="InternalLoader">
        <popin-generic :modifiers="['xs', 'overflow']" :is-active="isActive" ref="popin">
            <div class="p-40">
                <form @submit="onSubmit">
                    <div class="Form_row">
                        <select-search
                            action="articles/fetch"
                            :params="{ refresh: false, query: { published: false } }"
                            :value-full="true"
                            :value="selected"
                            @input="onSelect"
                        />
                    </div>
                </form>
            </div>

            <template slot="footer">
                <div></div>
                <div class="d-flex fx-align-center">
                    <p class="mr-20" @click="onDone">Annuler</p>

                    <button-base
                        type="button"
                        @click="onSubmit"
                    >
                        Sélectionner
                    </button-base>
                </div>
            </template>
        </popin-generic>
    </div>
</template>

<script>
import PopinGeneric from '@/components/popins/PopinGeneric'
import SelectSearch from '@/components/utils/SelectSearch'

export default {
    name: 'InternalLoader',
    components: { PopinGeneric, SelectSearch },
    props: {
        id: { type: String },
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        selected: null
    }),
    watch: {

    },
    methods: {
        onSelect (selected) {
            this.$data.selected = selected
        },
        onDone () {
            this.$emit('done')
        },
        onSubmit () {
            this.$emit('input', {
                ...this.$data.selected
            })

            this.onDone()
        }
    }
}
</script>