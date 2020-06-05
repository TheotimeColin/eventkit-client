<template>
    <div
        class="DataRow"
        :class="{
            'is-disabled': localData ? localData.disabled : false
        }"
    >
        <i class="fal fa-grip-lines handle DataRow_handle" v-if="!selectable"></i>
        
        <p class="color-ft-xweak">{{ value.disabled ? ' ' : value.position }}</p>

        <label class="DataRow_label" v-if="selectable && value.content">
            <input class="DataRow_checkbox" type="checkbox" @change="(e) => onCheck(e, value)" :checked="selected">
            <p class="DataRow_check">✔️</p>
            <div class="DataRow_text">{{ value.content.main }}</div>
        </label>

        <!-- <textarea
            class="DataRow_input"
            rows="1"
            :value="localData.content ? localData.content.main : ''"
            @focus="select"
            @blur="$emit('blur')"
            @input="onInput"
            @keydown.enter="(e) => { e.preventDefault(); $emit('submit') }"
            ref="input"
            v-if="!selectable"
        ></textarea> -->

        <quick-edit
            class="DataRow_input"
            :value="localData.content.main"
            :text-only="true"
            @focus="select"
            @input="onInput"
            @blur="$emit('blur')"
            @keydown.prevent.enter="$emit('submit')"
            v-if="!selectable && localData && localData.content"
        />

        <slot name="tags"></slot>

        <action-menu
            class="DataRow_actions"
            :items="[
                { label: value.disabled ? $t('comp.dataRow.cta.enable') : $t('comp.dataRow.cta.disable'), onClick: this.onDisable, disabled: selectable },
                { label: $t('comp.dataRow.cta.reset'), onClick: this.reset, disabled: !canReset },
                { label: $t('comp.dataRow.cta.delete'), onClick: this.onDelete },
            ]"
            v-if="editable"
        />

        <div class="DataRow_footer" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
import ActionMenu from '@/components/interactive/ActionMenu'
import QuickEdit from '@/components/utils/QuickEdit'

export default {
    name: 'DataRow',
    components: { ActionMenu, QuickEdit },
    props: {
        value: { type: Object },
        editable: { type: Boolean, default: false },
        selectable: { type: Boolean, default: false },
        selected: { type: Boolean, default: false },
        isDisable: { type: Boolean, default: false }
    },
    data: () => ({
        localData: null
    }),
    computed: {
        canReset () {
            if (!this.$data.localData.content) return 

            let original = this.$data.localData.original
            return original && this.$data.localData.content.main !== original.content.main
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.localData = JSON.parse(JSON.stringify(v))
            }
        }
    },
    ready () {
        this.setHeight()
    },
    methods: {
        setHeight () {
            if (!this.$refs.input) return 
            
            this.$refs.input.style.height = '0px'
            this.$refs.input.style.height = this.$refs.input.scrollHeight + 'px'
        },
        onInput (v) {
            this.setHeight()

            this.$data.localData.content.main = v

            this.update()
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
        reset () {
            this.$data.localData.content = this.$data.localData.original.content
            this.update()
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