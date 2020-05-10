<template>
    <popin-generic :is-active="true">
        <div class="p-40">
            <form @submit="onSubmit">
                <div ref="cardInput"></div>

                <button-base>Payer</button-base>
            </form>
        </div>
    </popin-generic>
</template>

<script>
import PopinGeneric from '@/components/popins/PopinGeneric'

export default {
    name: 'PopinPremium',
    components: { PopinGeneric },
    data: () => ({
        stripe: null,
        form: {
            cardInput: null
        }
    }),
    mounted () {
        setTimeout(() => {
            this.$data.stripe = this.$stripe.import()

            const elements = this.$data.stripe.elements()
            this.$data.form.cardInput = elements.create('card')

            this.$data.form.cardInput.mount(this.$refs.cardInput)
        }, 1000)
    },
    methods: {
        async onSubmit (e) {
            e.preventDefault()

            try {
                const payment = await this.$data.stripe.createPaymentMethod({
                    type: 'card',
                    card: this.$data.form.cardInput,
                    billing_details: {
                        email: 'test@test.fr'
                    }
                })

                const response = await this.$store.dispatch('premium/createCustomer', {
                    data: {
                        email: 'test@test.fr',
                        paymentMethod: payment.paymentMethod.id
                    }
                })

                if (response.subscription.latest_invoice.payment_intent.status === 'requires_action') {
                    this.$data.stripe.confirmCardPayment(response.subscription.latest_invoice.payment_intent.client_secret)
                } else {
                    console.log('CONGRATS !')
                }
            } catch (e) {
                console.error(e)
            }
        }
    }
}
</script>