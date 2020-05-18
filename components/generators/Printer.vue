<template>
    <div class="Printer">
        <div class="Printer_content p-40">
            <p class="ft-title-xl">Super !</p>
        </div>

        <div class="Printer_actions">
            <div></div>
            <div>
                <button-base :modifiers="['secondary', 's']" @click="onPrint({ test: true })">
                    Page de test
                </button-base>
                <button-base @click="onPrint" :loading="isLoading">
                    Exporter le projet
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Printer',
    props: {
        isLoading: { type: Boolean, default: false }
    },
    methods: {
        onPrint (e) {
            this.$emit('print', {
                ...e
            })
        }
    }
}
</script>