<template>
    <div class="SimpleUploader" :class="{ 'is-loaded': queue.length > 0 }">
        <label :for="id" class="SimpleUploader_area" v-show="queue.length <= 0">
            <i class="SimpleUploader_icon fa fa-cloud"></i>
            <p class="SimpleUploader_title">Choisissez les fichiers à uploader.</p>
        </label>

        <input type="file" :id="id" class="d-none" @change="onAdd" multiple>

        <div class="SimpleUploader_galleryContainer" v-show="queue.length > 0">
            <div class="SimpleUploader_item Form" v-for="item in queue" :key="item.id">
                <div class="SimpleUploader_image">
                    <img :src="item.src" />
                </div>

                <div class="SimpleUploader_config">
                    <input class="Form_row" type="text" v-model="item.data.name" placeholder="Slug">
                    <input class="Form_row" type="text" v-model="item.data.alt" placeholder="Attribut alt">

                    <div class="Form_row d-flex fx-grow">
                        <label class="d-block mr-10" v-for="size in item.data.sizes" :key="size.type">
                            <input type="checkbox" class="d-inline-block width-auto" v-model="size.enabled">
                            {{ size.name }}
                        </label>
                    </div>
                </div>
                
                <i class="SimpleUploader_remove fa fa-times" @click="onRemove(item.id)"></i>
            </div>
        </div>

        <div class="text-right" v-if="queue.length > 0">
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
import slugify from 'slugify'

const SIZE_CONFIG = [
    { type: 's', name: 'Petit (400px)', enabled: true },
    { type: 'm', name: 'Moyen (1000px)', enabled: true }
]

export default {
    name: 'SimpleUploader',
    props: {
        id: { type: String, default: 'simple-uploader' }
    },
    data: () => ({
        queue: [],
        sizes: SIZE_CONFIG
    }),
    methods: {
        onAdd (e) {
            let input = e.target
            let files = Object.keys(input.files).map(key => input.files[key])
            
            files.forEach(file => {
                let reader = new FileReader()

                reader.onload = async (e) => {
                    this.$data.queue.push({
                        id: slugify(file.name),
                        data: {
                            file,
                            name: '',
                            alt: '',
                            sizes: SIZE_CONFIG
                        },
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
            this.$data.queue = this.$data.queue.map(file => ({
                ...file,
                data: {
                    ...file.data,
                    sizes: file.data.sizes.filter(size => size.enabled)
                }
            }))
            await this.$store.dispatch('files/post', {
                folder: 'articles',
                files: this.$data.queue
            })

            this.$data.queue = []

            this.$emit('upload')
        }
    }
}
</script>