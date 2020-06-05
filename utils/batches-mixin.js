export default {
    methods: {
        $batches ({ theme }) {
            if (!theme) return []
            
            let pageWidth = 210
            let pageHeight = 297
            let spacing = parseFloat(theme.page.spacing)
            let margins = parseFloat(theme.page.margins)
            let pageMargins = margins * 2

            let componentWidth = (parseFloat(theme.size.width) * theme.page.componentScale) + (spacing * 2)
            let componentHeight = (parseFloat(theme.size.height) * theme.page.componentScale) + (spacing * 2)

            let fitWidth = Math.floor((pageWidth - pageMargins) / componentWidth)
            let fitHeight = Math.floor((pageHeight - pageMargins) / componentHeight)

            let batchSize = fitWidth * fitHeight

            let batches = []
            let batch = []
            let size = batchSize
            let batchId = 0

            this.activeItems.forEach(component => {
                batch.push(component)
                size--

                batches[batchId] = batch

                if (size == 0) {
                    batchId++
                    size = batchSize
                    batch = []
                }    
            })

            return batches
        }
    }
}