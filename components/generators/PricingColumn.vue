<template>
    <div class="PricingColumn" :class="{ ...$modifiers }">
        <div class="PricingColumn_container premium-secondary">
            <p class="mv-5">❤️ Nos jeux & icebreakers actuels et à venir en illimité</p>
            <p class="mv-5">✨ Toutes les options de personnalisation débloquées</p>
            <p class="mv-5">💡 Accès à des centaines d'idées et thèmes ajoutés tous les mois</p>
        </div>

        <div class="PricingColumn_cols">
            <div
                v-for="(price, i) in prices"
                class="PricingColumn_col"
                :class="{ 'is-highlight' : price.highlight }"
                :key="i"
            >
                <div class="PricingColumn_highlight" v-show="price.highlight">Parfait pour démarrer</div>

                <div class="PricingColumn_length">
                    {{ price.emoji }} {{ price.length }} mois
                </div>

                <div class="PricingColumn_price">
                    <div>
                        <template v-if="price.coupon > 0">
                            <p class="PricingColumn_offer">Offre de lancement -{{ price.coupon * 100 }}%</p>
                            <p class="text-through ft-s mt-30">{{ (price.value / price.length).toFixed(2) }}€ / mois</p>
                        </template>

                        <p>{{ Math.floor((priceAfter(price.value, price.coupon) / price.length) * 100) / 100 }}</p>
                        <p class="ft-xs">€ par mois</p>
                    </div>
                </div>

                <div class="mt-40 mb-10">
                    <div class="PricingColumn_total">
                        <p>À régler :</p>
                        <p>
                            <span class="text-through" v-if="price.coupon > 0">{{ price.value }}€</span>
                            {{ priceAfter(price.value, price.coupon) }}€
                        </p>
                    </div>

                    <button-base
                        :modifiers="['premium', 's', 'secondary']"
                        @click="$emit('select', price)"
                    >
                        Devenir créateur
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