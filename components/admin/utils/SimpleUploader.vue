<template>
    <div class="SimpleUploader" :class="{ 'is-loaded': queue.length > 0 }">
        <label :for="id" class="SimpleUploader_area" v-show="queue.length <= 0">
            <i class="SimpleUploader_icon fa fa-cloud"></i>
            <p class="SimpleUploader_title">Choisissez les fichiers à uploader.</p>
        </label>

        <input type="file" :id="id" class="d-none" @change="onAdd" multiple>

        <div class="SimpleUploader_galleryContainer" v-show="queue.length > 0">
            <div class="SimpleUploader_gallery">
                <div class="SimpleUploader_item" v-for="item in queue" :key="item.id">
                    <i class="SimpleUploader_remove fa fa-times" @click="onRemove(item.id)"></i>
                    <img :src="item.src" />
                </div>
            </div>
        </div>

        <div class="text-center" v-if="queue.length > 0">
            <button-base :modifiers="['xs']" type="button">
                <label :for="id">
                    <i class="fa fa-plus"></i>
                </label>
            </button-base>
            <button-base type="button" @click="onUpload">
                Uploader
            </button-base>
        </div>
    </div>
</template>

<script>
import shortid from 'shortid'

export default {
    name: 'SimpleUploader',
    props: {
        id: { type: String, default: shortid.generate() }
    },
    data: () => ({
        queue: []
    }),
    methods: {
        onAdd (e) {
            let input = e.target
            let files = Object.keys(input.files).map(key => input.files[key])
            
            files.forEach(file => {
                let reader = new FileReader()

                reader.onload = async (e) => {
                    this.$data.queue.unshift({
                        id: Math.random(),
                        data: file,
                        src: e.target.result
                    })

                    input.value = ''
                }

                reader.readAsDataURL(file)
            })
        },
        onRemove (id) {
            this.$data.queue = this.$data.queue.filter(file => file.id !== id)
        },
        async onUpload () {
            await this.$store.dispatch('modules/files/post', {
                folder: 'articles',
                files: this.$data.queue
            })

            this.$data.queue = []

            this.$emit('upload')
        }
    }
}
</script>