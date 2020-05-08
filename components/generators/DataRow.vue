<template>
    <div
        class="DataRow"
        :class="{
            'DataRow--new': newRow,
            'is-disabled': localData ? localData.disabled : false
        }"
        :style="{
            '--color-1': localData && localData.pack ? localData.pack.color1 : undefined,
            '--color-2': localData && localData.pack ? localData.pack.color2 : undefined,   
        }"
    >
        <template v-if="newRow">
            <i class="pl-10 color-ft-xweak fa fa-plus fa-xs"></i>
            <p class="DataRow_input color-ft-xweak">Ajouter</p>
        </template>

        <template v-else-if="localData">
            <i class="fa fa-align-justify handle DataRow_handle" v-if="!selectable"></i>
            
            <p class="color-ft-xweak">{{ value.disabled ? ' ' : value.position }}</p>

            <label class="DataRow_label" v-if="selectable">
                <input class="DataRow_checkbox" type="checkbox" @change="(e) => onCheck(e, value)" :checked="selected">
                <p class="DataRow_check">✔️</p>
                <div class="DataRow_text">{{ value.content.main }}</div>
            </label>

            <input
                class="DataRow_input"
                type="text"
                @input="onInput"
                @focus="select"
                @keydown.enter="$emit('submit')"
                :value="value.content ? value.content.main : ''"
                ref="input"
                v-if="!selectable"
            >
        
            <div @click="onDelete" class="DataRow_delete" v-show="value.disabled">
                <i class="fa fa-trash"></i>
            </div>

            <div @click="onDisable" class="DataRow_disable" v-if="!selectable">
                <i class="fa fa-eye" v-show="!value.disabled"></i>
                <i class="fa fa-eye-slash" v-show="value.disabled"></i>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'DataRow',
    props: {
        value: { type: Object },
        selectable: { type: Boolean, default: false },
        selected: { type: Boolean, default: false },
        newRow: { type: Boolean, default: false },
        isDisable: { type: Boolean, default: false }
    },
    data: () => ({
        localData: null
    }),
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.localData = v
            }
        }
    },
    mounted () {
        // if (!this.$props.newRow && this.$refs.input) this.$refs.input.focus()
    },
    methods: {
        onInput () {
            this.$data.localData.content = {
                main: this.$refs.input.value
            }
            
            this.update()
            this.select()
        },
        onDelete () {
            this.$emit('delete', this.$data.localData._id)
        },
        onDisable () {
            this.$data.localData.disabled = !this.$data.localData.disabled
            this.update()
        },
        onCheck (e, value) {
            if (e.target.checked) {
                this.$emit('select', value)
            } else {
                this.$emit('deselect', value)
            }
        },
        update (e) {
            this.$emit('input', this.$data.localData)
        },
        select () {
            this.$emit('select', this.$data.localData._id)
        }
    },
}
</script>