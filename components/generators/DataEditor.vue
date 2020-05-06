<template>
    <div class="DataEditor" :class="{ 'is-dragging': state.drag }" v-if="localData">
        <draggable handle=".handle" @start="state.drag = true" @end="state.drag = false">
            <transition-group type="transition" name="appear-simple">
                <data-row
                    class="DataEditor_row"
                    v-for="value in localData"
                    v-model="value.main"
                    :id="value.id"
                    :key="value.id"
                    @select="(v) => $emit('select', v)"
                    @input="$store.commit('generators/updateData', localData)"
                    @submit="onAddRow"
                />
            </transition-group>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import shortid from 'shortid'

import DataRow from '@/components/generators/DataRow'

export default {
    name: 'DataEditor',
    components: { DataRow, draggable },
    props: {
        project: { type: Object }
    },
    data: () => ({
        state: {
            drag: false
        },
        localData: null
    }),
    watch: {
        project: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.localData = JSON.parse(JSON.stringify(v.values.data))
            }
        }
    },
    methods: {
        onAddRow () {
            this.$data.localData.push({
                id: shortid.generate(),
                main: 'Hello'
            })

            this.$store.commit('generators/updateData', this.$data.localData)
        }
    }
}
</script>

<style lang="scss" scoped>
    .DataEditor {
        padding: 20px;
    }

    .DataEditor.is-dragging {

        .DataEditor_row:not(.sortable-chosen) {
            opacity: 0.5;
        }
    }
</style>