<template>
    <div class="CopyText" @click="copy">
        <input type="text" class="CopyText_text" :value="text" ref="copy">
        <div class="CopyText_action">
            <i class="fal fa-copy"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CopyText',
    props: {
        text: { type: String }
    },
    methods: {
        copy () {
            this.$refs.copy.select()
            document.execCommand('copy')

            this.$store.commit('utils/addNotification', {
                type: 'success',
                text: this.$t('comp.copyText.success')
            })
        }
    }
}
</script>