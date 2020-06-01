<template>
    <div class="PricingColumn" :class="{ ...$modifiers }">
        <div class="PricingColumn_container StyledBlock StyledBlock--pink ft-s">
            <p class="mv-5" v-html="$t('premium.perks.unlimited.title')"></p>
            <p class="mv-5" v-html="$t('premium.perks.new.title')"></p>
            <p class="mv-5" v-html="$t('premium.perks.ideas.title')"></p>
        </div>

        <div class="PricingColumn_cols">
            <div
                v-for="(price, i) in prices"
                class="PricingColumn_col"
                :class="{ 'is-highlight' : price.highlight }"
                :key="i"
            >
                <div class="PricingColumn_highlight" v-show="price.highlight">
                    {{ $t('pages.premium.highlightedPlan') }}
                </div>

                <div class="PricingColumn_length">
                    {{ price.emoji }} {{ $tc(`common.months`, price.length)}}
                </div>

                <div class="PricingColumn_price StyledBlock StyledBlock--no-border" :class="{ 'StyledBlock--gold ': price.highlight, 'StyledBlock--blue': !price.highlight }">
                    <div>
                        <template v-if="price.coupon > 0">
                            <p class="PricingColumn_offer">{{ $t('premium.offers.earlyBird.shortTitle') }} -{{ price.coupon * 100 }}%</p>
                            <p class="text-through ft-s mt-30">{{ (price.value / price.length).toFixed(2) }}€ / mois</p>
                        </template>

                        <p class="ft-3xl">
                            <b>{{ Math.floor((priceAfter(price.value, price.coupon) / price.length) * 100) / 100 }}</b>
                        </p>
                        <p class="ft-xs">{{ $t('common.perMonth') }}</p>
                    </div>
                </div>

                <div class="mt-30 mb-10">
                    <div class="PricingColumn_total">
                        <p class="ft-2xs">{{ $t('pages.premium.toPay') }}</p>
                        <p class="ft-xs">
                            <span class="text-through" v-if="price.coupon > 0">{{ price.value }}€</span>
                            {{ priceAfter(price.value, price.coupon) }}€
                        </p>
                    </div>

                    <button-base
                        :modifiers="price.highlight ? ['s', 'round', 'gold'] : ['s', 'round', 'blue']"
                        @click="$emit('select', price)"
                    >
                        {{ $t('pages.premium.cta.buy') }}
                    </button-base>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'PricingColumn',
    mixins: [ base ],
    props: {
        premium: { type: Boolean, default: false },
        prices: { type: Array, default: () => [] }
    },
    methods: {
        priceAfter (price, coupon) {
            let reducedPrice = price * (1 - coupon)
            return Math.floor(reducedPrice * 100) / 100
        }
    }
}
</script>