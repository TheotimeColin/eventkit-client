<template>
    <div class="CardGenerator">
        <div class="CardGenerator_container">
            <div class="CardGenerator_config Form">
                <config-row
                    class="CardGenerator_row" 
                    v-for="(card, i) in cards"
                    :id="i + 1"
                    v-model="card.main"
                    :key="i"
                    :is-disable="card.isDisable"
                    @toggle="(v) => onCardToggle(i, v)"
                    @focus="onCardFocus"
                    @submit="onCardAdd"
                />
                
                <div class="CardGenerator_row" @click="onCardAdd">
                    Ajouter une carte
                </div>
            </div>
            <div class="CardGenerator_result" ref="result">
                <div v-show="!state.preview">
                    <conversation-starter
                        class="CardGenerator_card"
                        :style="{ '--scale': 2 }"
                        :main="selectedCard.main"
                        v-if="selectedCard"
                    />
                </div>

                <div v-show="state.preview">
                    <page-generator :scale="pageScale" v-for="(batch, i) in batches" :key="i" ref="page">
                        <conversation-starter
                            class="CardGenerator_previewItem"
                            v-for="(card, i) in batch"
                            :id="i + 1"
                            :main="card.main"
                            :key="card.id"
                        />
                    </page-generator>
                </div>

            </div>
        </div>
        <div class="CardGenerator_footer">
            <button-base @click.native="state.preview = !state.preview">
                Preview mode
            </button-base>
            <button-base @click.native="onExport">
                Format pdf
            </button-base>
        </div>
    </div>
</template>

<script>
import ConversationStarter from '@/components/generators/ConversationStarter'
import ConfigRow from '@/components/generators/ConfigRow'
import PageGenerator from '@/components/generators/PageGenerator'

export default {
    name: 'CardGenerator',
    components: { ConversationStarter, ConfigRow, PageGenerator },
    data: () => ({
        pageScale: 0.5, 
        state: {
            preview: false
        },
        cards: [
            { main: 'Quelles sont les 5 applis dont tu ne peux pas te passer ?' },
            { main: 'Quel est le meilleur endroit pour un premier date ?' },
            { main: 'Quelles sont les 5 applis dont tu ne peux pas te passer ?', isDisable: true },
            { main: 'Quel est le meilleur endroit pour un premier date ?' },
            { main: 'Quelles sont les 5 applis dont tu ne peux pas te passer ?', isDisable: true },
            { main: 'Quel est le meilleur endroit pour un premier date ?' },
            { main: 'Quelles sont les 5 applis dont tu ne peux pas te passer ?' },
            { main: 'Quel est le meilleur endroit pour un premier date ?' },
            { main: 'Quelles sont les 5 applis dont tu ne peux pas te passer ?' },
            { main: 'Quel est le meilleur endroit pour un premier date ?' },
            { main: 'Quelles sont les 5 applis dont tu ne peux pas te passer ?' },
            { main: 'Quel est le meilleur endroit pour un premier date ?' },
            { main: 'Quelles sont les 5 applis dont tu ne peux pas te passer ?' },
            { main: 'Quel est le meilleur endroit pour un premier date ?' },
            { main: 'Quelles sont les 5 applis dont tu ne peux pas te passer ?' },
        ],
        batches: [],
        export: null
    }),
    computed: {
        activeCards () {
            return this.cards.filter(card => !card.isDisable)
        },
        selectedCard () {
            let selected = this.cards.filter(card => card.isSelect)
            return selected[0] ? selected[0] : false
        }
    },
    watch: {
        activeCards: {
            deep: true,
            immediate: true,
            handler () {
                this.onBatch()
                if (this.$refs.page) this.onResize()
            }
        }
    },
    mounted () {
        this.jsPDF = require('jspdf')
    },
    methods: {
        onResize () {
            this.$data.pageScale = 1
        },
        onBatch () {
            this.$data.batches = []

            let width = 210
            let height = 297
            let padding = (15 * 2)

            let cardWidth = 65
            let cardHeight = 65

            let fitWidth = Math.floor((width - padding) / cardWidth)
            let fitHeight = Math.floor((height - padding) / cardHeight)

            let batchSize = fitWidth * fitHeight

            let batch = []
            let size = batchSize
            let batchId = 0
            this.activeCards.forEach(card => {
                batch.push(card)
                size--

                this.$data.batches[batchId] = batch

                if (size == 0) {
                    batchId++
                    size = batchSize
                    batch = []
                }    
            })
        },
        onCardFocus (id) {
            this.$data.cards = this.$data.cards.map((card, i) => ({
                ...card,
                isSelect: id == (i + 1)
            }))
        },
        onCardToggle (id, value) {
            this.$data.cards = this.$data.cards.map((card, i) => ({
                ...card,
                isDisable: id == i ? value : card.isDisable
            }))
        },
        onCardAdd () {
            this.$data.cards.push({
                main: ''
            })
        },
        async onExport () {
            this.$data.export = new this.jsPDF()

            let pages = await Promise.all(this.$refs.page.map(page => {
                return page.screenshot()
            }))

            let width = this.$data.export.internal.pageSize.getWidth()
            let height = this.$data.export. internal.pageSize.getHeight()

            pages.forEach((page, i) => {
                this.$data.export.addImage(page, 0, 0, width, height)
                if (i < pages.length - 1) this.$data.export.addPage()
            })

            this.$data.export.save('test.pdf')

            console.log(pages)
        }
    }
}
</script>