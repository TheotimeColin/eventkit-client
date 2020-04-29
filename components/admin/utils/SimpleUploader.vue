<template>
    <div class="SimpleUploader">
        <label for="uploader" class="SimpleUploader_area">
            <i class="SimpleUploader_icon fa fa-cloud"></i>
            <p class="SimpleUploader_title">Choisissez les fichiers à uploader.</p>

            <input type="file" id="uploader" class="d-none" @change="onAdd" multiple>
        </label>

        <div class="SimpleUploader_galleryContainer" v-show="queue.length > 0">
            <div class="SimpleUploader_gallery">
                <div class="SimpleUploader_item" v-for="item in queue" :key="item.id">
                    <i class="SimpleUploader_remove fa fa-times" @click="onRemove(item.id)"></i>
                    <img :src="item.src" />
                </div>
            </div>
        </div>

        <div class="text-center">
            <button type="button" class="Button" :class="{ 'is-disable': queue.length <= 0 }" @click="onUpload">
                Uploader
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SimpleUploader',
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