<template>
    <div class="Page Page--admin Admin">
        <div class="Page_content">
            <div class="Wrapper">
                <button-base :to="{ name: 'admin-kits-id', params: { id: 'new' } }">
                    Nouveau kit
                </button-base>

                <kit-section
                    v-for="kit in kits"
                    class="mv-40"
                    :id="kit._id"
                    :title="kit.title"
                    :tags="['3 variations', 'Tout public']"
                    :editable="true"
                    :excerpt="kit.excerpt"
                    :thumbnail="kit.thumbnail"
                    :to="{ name: 'admin-kits-id', params: { id: kit._id } }"
                    :key="kit._id"
                />
            </div>
        </div>
    </div>
</template>

<script>
import KitSection from '@/components/kits/KitSection'

export default {
    name: 'AdminKitList',
    layout: 'admin',
    components: { KitSection },
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