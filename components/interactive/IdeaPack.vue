<template>
    <div
        class="IdeaPack"
        :class="{ 'is-active': state.active }"
        :style="{ '--color-1': pack.color1, '--color-2': pack.color2 }"
    >
        <div class="IdeaPack_cover" @click="state.active = !state.active">
            <div class="IdeaPack_coverContainer">
                <p class="IdeaPack_coverTitle">{{ pack.emoji }} {{ pack.title }}</p>

                <div class="IdeaPack_previewLength">
                    <b>{{ pack.content.length * 100 }}</b>
                    <p class="fx-shrink">{{ pack.description }}</p>
                </div>

                <div class="IdeaPack_preview">
                    <div class="IdeaPack_previewRail">
                        <p class="IdeaPack_previewItem" v-for="value in pack.content.slice(0, 5)" :key="value.id">
                            {{ value.main }}
                        </p>
                        <p class="IdeaPack_previewItem" v-for="(value, i) in pack.content.slice(0, 5)" :key="value.id + i">
                            {{ value.main }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="IdeaPack_content">
            <data-row
                v-for="(value, i) in pack.content"
                :value="{ ...value, emoji: pack.emoji }"
                :selectable="true"
                :selected="isSelected(value)"
                @select="(v) => $emit('select', v)"
                @deselect="(v) => $emit('deselect', v)"
                :key="value.id + ' ' + i"
            />
        </div>
    </div>
</template>

<script>
import DataRow from '@/components/generators/DataRow'

export default {
    name: 'IdeaPack',
    components: { DataRow },
    props: {
        pack: { type: Object },
        values: { type: Array }
    },
    data: () => ({
        state: {
            active: false
        }
    }),
    methods: {
        isSelected (option) {
            return this.$props.values.filter(v => v.id == option.id).length > 0
        }
    }
}
</script>