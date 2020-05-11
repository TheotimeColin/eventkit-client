<template>
    <div class="Page Page--admin Admin">
        <div class="Page_content">
            <div class="Wrapper">
                <button-base :to="{ name: 'admin-kits-id', params: { id: 'new' } }">
                    Nouveau kit
                </button-base>

                <div class="row fx-wrap">
                    <div class="col-4" v-for="kit in kits" :key="kit.id">
                        <kit-block
                            :title="kit.title"
                            :excerpt="kit.excerpt"
                            :thumbnail="kit.thumbnail"
                            :to="{ name: 'admin-kits-id', params: { id: kit._id } }"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import KitBlock from '@/components/kits/KitBlock'

export default {
    name: 'AdminKitList',
    layout: 'admin',
    components: { KitBlock },
    async fetch () {
        await this.$store.dispatch('kits/fetch', {
            query: { published: false }
        })
    },
    computed: {
        kits () {
            return this.$store.state.kits.collection
        }
    },
    methods: {
        async onDelete (id) {
            await this.$store.dispatch('kits/delete', {
                data: { id }
            })

            this.$store.dispatch('kits/fetch', {
                query: { published: false }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>