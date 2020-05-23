<template>
    <div class="Printer">
        <div class="Printer_content p-40">
            <p class="ft-l">
                <b>Configuration de la page</b>
            </p>

            <range
                class="mv-20"
                :options="{ label: 'Marges de la page', min: 0, max: 20, step: 0.5, unit: 'mm', display: true }"
                v-model="theme.page.margins"
                @input="$store.commit('kits/project/updateTheme', theme)"
            />

            <range
                class="mv-20"
                :options="{ label: 'Espacement cartes', min: 0, max: 10, step: 0.1, unit: 'mm', display: true }"
                v-model="theme.page.spacing"
                @input="$store.commit('kits/project/updateTheme', theme)"
            />

            <!-- <div class="mt-40">
                <accordion class="mv-10" :modifiers="['s', 'simple']" title="😥 Les couleurs rendent différemment quand j'imprime, que faire ?">
                    <div class="TextBody TextBody--s p-20">
                        <h3>Vérifie tes niveaux d'encre</h3>
                        <p>Si une seule des couleurs manque dans ton imprimante, il est possible que les couleurs soient altérées.</p>

                        <h3>Tes réservoirs sont pleins ?</h3>
                        <p>Malheureusement, sans entrer dans les détails techniques, les écrans et les imprimantes interprètent différemment les couleurs. Il y aura donc toujours une différence.</p>
                        <p>Le plus simple est de tester différentes configurations avec la fonction <b>Page de test</b>, qui permet de n'imprimer qu'une seule carte et d'économiser de l'encre.</p>
                    </div>
                </accordion>

                <accordion class="mv-10" :modifiers="['s', 'simple']" title="🎀 Comment rendre mes impressions plus jolies ?">
                    <div class="row-xs">
                        <div class="col-shrink pt-20 fx-no-grow">
                            <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-eu.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=FR&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=eventkit-21&language=fr_FR&marketplace=amazon&region=FR&placement=B001ANX32I&asins=B001ANX32I&linkId=e9a0247fc933a0e7e9cd92b571bac3dd&show_border=true&link_opens_in_new_window=true"></iframe>
                        </div>
                        <div class="col-grow fx-grow">
                            <div class="TextBody TextBody--s p-20">
                                <h3>Investis dans du papier plus épais</h3>
                                <p>C'est ce qui va faire toute la différence : plus ton papier est épais, plus il donnera l'impression d'être de qualité !</p>

                                <p>Pour un papier au top, dirige-toi vers une valeur sûre comme ce <link-base href="https://amzn.to/2WL7StR" target="_blank">Bloc de 500 feuilles Clairefontaine (160g)</link-base>. Si tu as un plus petit budget, ces <link-base href="https://amzn.to/36ipgJM" target="_blank">feuilles de la marque Schneidersöhne </link-base> peuvent aussi faire l'affaire !

                                <h3>Ajoute un peu de fantaisie</h3>
                            </div>
                        </div>
                    </div>
                </accordion>

                <accordion class="mv-10" :modifiers="['s', 'simple']" title="💸 Comment économiser de l'encre ?">
                    <div class="TextBody TextBody--s p-20">
                        <h3>Vérifie tes niveaux d'encre</h3>
                        <p>Si une seule des couleurs manque dans ton imprimante, il est possible que les couleurs soient altérées.</p>

                        <h3>Tes réservoirs sont pleins ?</h3>
                        <p>Malheureusement, sans entrer dans les détails techniques, les écrans et les imprimantes interprètent différemment les couleurs. Il y aura donc toujours une différence.</p>
                        <p>Le plus simple est de tester différentes configurations avec la fonction <b>Page de test</b>, qui permet de n'imprimer qu'une seule carte et d'économiser de l'encre.</p>
                    </div>
                </accordion>
            </div> -->
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
import Accordion from '@/components/interactive/Accordion'
import Range from '@/components/generators/components/Range'

export default {
    name: 'Printer',
    components: { Accordion, Range },
    props: {
        project: { type: Object },
        isLoading: { type: Boolean, default: false }
    },
    data: () => ({
        theme: {}
    }),
    watch: {
        project: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.theme = JSON.parse(JSON.stringify(v.theme))
                if (!this.$data.theme.page) this.$data.theme.page = { margins: '0mm', spacing: '0mm' }
            }
        }
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