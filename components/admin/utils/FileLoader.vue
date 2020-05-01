<template>
    <div class="FileLoader">
        <popin-generic :modifiers="['top']" :is-active="isActive" ref="popin">
            <template slot="header">
                <div class="ph-40 pt-20">
                    <tabs
                        :items="{
                            gallery: { title: 'Choisir dans la galerie', isActive: !state.uploadMode },
                            upload: { title: 'Mettre en ligne', isActive: state.uploadMode }
                        }"
                        @update="(e) => state.uploadMode = e == 'upload'"
                    />
                </div>
             </template>

            <file-gallery prefix="articles/" @select="onSelect" v-show="!state.uploadMode" ref="gallery" :max="maxSelect" />
            <simple-uploader @upload="onUpload" v-show="state.uploadMode" />

            <template slot="footer">
                <div class="pl-10" :class="{ 'ft-bold': selected.length == maxSelect }">
                    {{ selected.length }} / {{ maxSelect }}
                </div>
                <div class="d-flex fx-align-center">
                    <p class="mr-20" @click="onDone">Annuler</p>

                    <button-base
                        :class="{ 'is-disable': selected.length == 0 }"
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
import Tabs from '@/components/utils/Tabs'
import FileGallery from '@/components/admin/utils/FileGallery'
import SimpleUploader from '@/components/admin/utils/SimpleUploader'
import PopinGeneric from '@/components/popins/PopinGeneric'

export default {
    name: 'FileLoader',
    components: { PopinGeneric, SimpleUploader, FileGallery, Tabs },
    props: {
        value: { type: String, default: '' },
        maxSelect: { type: Number, default: 1 },
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            uploadMode: false
        },
        selected: []
    }),
    watch: {
        isActive (v) {
            if (v) this.onUpload()
        }
    },
    methods: {
        onSelect (selected) {
            this.$data.selected = selected
        },
        onDone () {
            this.$data.selected = []
            this.$emit('done')
        },
        onSubmit () {
            this.$emit('input', this.$data.selected.length == 1 ? this.$data.selected[0].src : this.$data.selected)
            this.onDone()
        },
        onUpload () {
            this.$data.state.uploadMode = false
            this.$refs.gallery.onFetch()
        }
    }
}
</script>