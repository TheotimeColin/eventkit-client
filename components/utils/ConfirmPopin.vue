<template>
    <div class="ConfirmPopin">
        <popin-generic :modifiers="['confirm']" :is-active="data.active">
            <template slot="header">
                <div class="p-20">
                    <p class="ft-l"><b>{{ data.headerText }}</b></p>
                </div>
            </template>
            <template slot="footer">
                <p @click="data.onCancel">{{ data.cancelText }}</p>
                <button-base @click.native="onConfirm">{{ data.confirmText }}</button-base>
            </template>
        </popin-generic>
    </div>
</template>

<script>
import PopinGeneric from '@/components/popins/PopinGeneric'

export default {
    name: 'ConfirmPopin',
    components: { PopinGeneric },
    data: () => ({
        defaults: {}
    }),
    mounted () {
        this.$data.defaults = {
            headerText: 'Confirmez cette action',
            onCancel: this.onCancel,
            cancelText: 'Annuler',
            confirmText: 'Confirmer'
        }
    },
    computed: {
        data () {
            return {
                ...this.$data.defaults,
                ...this.$store.state.utils.confirm
            }
        }
    },
    methods: {
        onCancel () {
            this.$store.commit('utils/confirmPrompt', { active: false })
        },
        onConfirm () {
            if (this.data.onConfirm) this.data.onConfirm()
            this.$store.commit('utils/confirmPrompt', { active: false })
        }
    }
}
</script>