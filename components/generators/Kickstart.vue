<template>
    <div class="Kickstart">
        <div class="p-40 text-center">
            <h1 class="ft-title-xl">
                <b>Générateur de conversation starters</b>
            </h1>

            <div class="row mv-40 text-left">
                <div class="col-4">
                    <img :src="assets.step1" class="width-100">

                    <h2 class="ft-m">
                        <b>Personnalisable à volonté, pour toutes les occasions</b>
                    </h2>
                </div>

                <div class="col-4">
                    <img :src="assets.step2" class="width-100">

                    <h2 class="ft-m">
                        <b>Écris ou pioche dans nos idées de questions</b>
                    </h2>
                </div>

                <div class="col-4">
                    <img :src="assets.step3" class="width-100">

                    <h2 class="ft-m">
                        <b>Imprime et découpe de chez toi, c'est gratuit</b>
                    </h2>
                </div>
            </div>

            <button-base @click="$emit('create')">
                Créer mon projet
            </button-base>
        </div>
    </div>
</template>

<script>
import step1 from '@/assets/img/examples-1.gif'
import step2 from '@/assets/img/examples-2.gif'
import step3 from '@/assets/img/examples-3.gif'

export default {
    name: "Kickstart",
    data: () => ({
        assets: { step1, step2, step3 }
    })
}
</script>