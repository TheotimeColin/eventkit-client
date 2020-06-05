<template>
    <div class="p-20 StyledBlock StyledBlock--no-border StyledBlock--blue text-center p-relative">
        <p class="ft-xs"><b>{{ $t(`premium.offers.${offer}.title`) }}</b></p>
        <p class="ft-s" v-html="$t(`premium.offers.${offer}.subtitle`, { times: redeemed })"></p>
        <p class="ft-l mt-10" v-html="$t(`premium.offers.${offer}.highlight`)"></p>

        <button-base class="mt-20" :modifiers="['blue', 's', 'round']" @click="$store.commit('popins/open', { id: 'premium' })" v-if="cta">
            {{ $t(`premium.offers.${offer}.cta`) }}
        </button-base>

        <loading-bar :modifiers="['absolute', 'premium']" :max="max" :value="redeemed" ref="loadingBar" />
    </div>
</template>

<script>
import LoadingBar from '@/components/interactive/LoadingBar'

export default {
    name: 'Offer',
    components: { LoadingBar },
    props: {
        offer: { type: String },
        cta: { type: Boolean, default: true },
        max: { type: Number },
        redeemed: { type: Number }
    }
}
</script>