<template>
    <div class="DataEditor" :class="{ 'is-dragging': state.drag }" v-if="localData">
        <nav-bar class="mb-20" :items="[
            { id: 'current', label: 'Cartes', fa: 'times', onClick: () => {} },
            { id: 'idea', label: 'Packs idées', fa: 'lightbulb', onClick: () => {} }
        ]" />

        <draggable v-model="localData" handle=".handle" @start="state.drag = true" @end="() => { update(); state.drag = false; }">
            <transition-group type="transition" name="appear-simple">
                <data-row
                    class="DataEditor_row"
                    v-for="value in localData"
                    :value="value"
                    @input="onUpdateValue"
                    @select="(v) => $emit('select', v)"
                    @delete="onDeleteValue"
                    @submit="onAddRow"
                    :key="value.id"
                />
            </transition-group>
        </draggable>

        <data-row
            :new-row="true"
            @click.native="onAddRow"
            v-if="canAdd"
        />
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import shortid from 'shortid'

import DataRow from '@/components/generators/DataRow'
import NavBar from '@/components/generators/NavBar'

export default {
    name: 'DataEditor',
    components: { DataRow, draggable, NavBar },
    props: {
        project: { type: Object }
    },
    data: () => ({
        state: {
            drag: false
        },
        localData: null
    }),
    computed: {
        canAdd () {
            let last = this.$data.localData[this.$data.localData.length - 1]
            return last ? last.main != '' || last.disabled : true
        }
    },
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
                main: ''
            })
            
            this.update()
        },
        onUpdateValue (value) {
            this.$data.localData = this.$data.localData.map(data => {
                return data.id == value.id ? value : data
            })

            this.update()
        },
        onDeleteValue (id) {
            this.$data.localData = this.$data.localData.filter(data => data.id != id)

            this.update()
        },
        update () {
            let position = 0
            this.$store.commit('generators/updateData', this.$data.localData.map((d) => {
                if (!d.disabled) position++

                return {
                    ...d,
                    position
                }
            }))
        }
    }
}
</script>

<style lang="scss" scoped>
    .DataEditor {
        padding: 20px;
    }

    .DataEditor_row {
        margin-bottom: 5px;
    }

    .DataEditor.is-dragging {

        .DataEditor_row:not(.sortable-chosen) {
            opacity: 0.5;
        }
    }
</style>