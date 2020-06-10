<template>
    <div class="QuickEdit TextEditor">
        <editor-menu-bar class="TextEditor_menu" :editor="editor" v-slot="{ commands, isActive }" v-if="editable && !textOnly">
            <div>
                <div class="TextEditor_first">
                    <div class="TextEditor_group" v-for="(group, i) in groups" :key="i">
                        <button
                            v-for="(command, i) in group"
                            class="TextEditor_button"
                            :class="{ 'is-active': isActive[command.id] ? isActive[command.id]() : false }"
                            type="button"
                            @click="command.onClick ? command.onClick() : commands[command.id]()"
                            v-show="compact ? command.compact : true"
                            :key="i"
                        >
                            <i class="fal" :class="{ ['fa-' + command.fa]: true }"></i>
                        </button>

                        <div class="TextEditor_separator"></div>
                    </div>
                </div>
            </div>
        </editor-menu-bar>

        <editor-content
            class="TextEditor_content"
            :editor="editor"
            ref="text"
            v-if="editor"
        />
    </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Bold, History, Italic } from 'tiptap-extensions'
import { debounce } from 'throttle-debounce'

import base from '@/utils/base'

export default {
    name: 'QuickEdit',
    mixins: [ base ],
    components: { EditorContent, EditorMenuBar },
    props: {
        value: { type: String, default: '' },
        compact: { type: Boolean, default: false },
        editable: { type: Boolean, default: true },
        textOnly: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            editing: false
        },
        editor: null,
        groups: [],
        style: [],
        localValue: ''
    }),
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.localValue = v
                if (this.$data.editor && !this.$data.state.editing) this.$data.editor.setContent(this.$data.localValue)
            }
        }
    },
    async mounted () {
        this.$data.editor = new Editor({
            editable: this.$props.editable,
            extensions: [
                new Bold(), new Italic()
            ],
            content: this.$data.localValue
        })

        this.$data.groups = [
            [
                { id: 'bold', label: 'Gras', fa: 'bold', compact: false },
                { id: 'italic', label: 'Italique', fa: 'italic', compact: false },
            ]
        ]

        this.$data.editor.on('focus', this.onFocus)
        this.$data.editor.on('blur', this.onBlur)

        this.$data.editor.on('update', () => this.onUpdate())
        setTimeout(() => this.onUpdate(), 100)
    },
    methods: {
        onFocus () {
            this.$data.state.editing = true
            this.$emit('focus')
        },
        onBlur () {
            this.$data.state.editing = false
            this.$emit('blur')
        },
        onUpdate: debounce(500, function (e) {
            this.$data.localValue = this.$data.editor.getHTML()
            this.$emit('input', this.$data.localValue)
        })
    }
}
</script>