<template>
    <div class="ConfirmPopin">
        <popin-generic id="confirm" :modifiers="['confirm']" :is-active="data.active" @close="onCancel">
            <template slot="header">
                <div class="p-10">
                    <p class="ft-l"><b>{{ data.headerText }}</b></p>
                </div>
            </template>
            
            <div class="p-20" v-if="data.description">
                {{ data.description }}
            </div>

            <template slot="footer">
                <p class="ml-10" @click="onCancel">{{ data.cancelText }}</p>
                <button-base :modifiers="['s']" @click.native="onConfirm">{{ data.confirmText }}</button-base>
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
            headerText: this.$t('comp.confirmPopin.title'),
            cancelText: this.$t('comp.confirmPopin.cancel'),
            confirmText: this.$t('comp.confirmPopin.confirm')
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
            if (this.data.onCancel) this.data.onCancel()
            this.$store.commit('utils/confirmPrompt', { active: false })
        },
        onConfirm () {
            if (this.data.onConfirm) this.data.onConfirm()
            this.$store.commit('utils/confirmPrompt', { active: false })
        }
    }
}
</script>