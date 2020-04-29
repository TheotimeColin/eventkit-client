<template>
    <div class="FileLoader">
        <popin-generic ref="popin" :is-active="isActive">
            <tabs class="mb-20" :items="{
                gallery: { title: 'Choisir dans la galerie', isActive: true },
                upload: { title: 'Mettre en ligne' }
            }" @update="(e) => state.uploadMode = e == 'upload'" ref="tabs" />

            <file-gallery prefix="articles/" @select="onSelect" v-show="!state.uploadMode" ref="gallery" />
            <simple-uploader @upload="onUpload" v-show="state.uploadMode" />

            <template slot="footer">
                <p class="mr-20" @click="onDone">Annuler</p>

                <button
                    class="Button"
                    :class="{ 'is-disable': selected == null }"
                    type="button"
                    @click="onSubmit"
                >
                    Sélectionner
                </button>
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
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            uploadMode: false
        },
        selected: null
    }),
    watch: {
        isActive (v) {
            if (v) this.onUpload()
        }
    },
    methods: {
        onSelect (selected) {
            this.$data.selected = selected[0] ? selected[0] : null
        },
        onDone () {
            this.$data.selected = null
            this.$emit('done')
        },
        onSubmit () {
            this.$emit('input', this.$data.selected.src)
            this.onDone()
        },
        onUpload () {
            this.$data.state.uploadMode = false
            this.$refs.gallery.onFetch()
        }
    }
}
</script>