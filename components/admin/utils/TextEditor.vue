<template>
    <div class="TextEditor">
        <editor-menu-bar class="TextEditor_menu" :editor="editor" v-slot="{ commands, isActive }">
            <div>
                <file-loader @input="(e) => onInsertImage(commands.image, e)" ref="fileLoader" />
                
                <div class="TextEditor_first">
                    <button class="TextEditor_button" type="button" @click="commands.undo">
                        <i class="fa fa-undo-alt"></i>
                    </button>

                    <button class="TextEditor_button" type="button" @click="commands.redo">
                        <i class="fa fa-redo-alt"></i>
                    </button>

                    <div class="TextEditor_separator"></div>

                    <button class="TextEditor_button" type="button" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                        <i class="fa fa-bold"></i>
                    </button>
                    <button class="TextEditor_button" type="button" :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
                        <i class="fa fa-heading"></i><span class="ft-2xs">2</span>
                    </button>
                    <button class="TextEditor_button" type="button" :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
                        <i class="fa fa-heading"></i><span class="ft-2xs">3</span>
                    </button>
                    <button class="TextEditor_button" type="button" :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote()">
                        <i class="fa fa-quote-right"></i>
                    </button>
                    
                    <div class="TextEditor_separator"></div>

                    <button class="TextEditor_button" type="button" @click="openFileLoader">
                        <i class="fa fa-image"></i>
                    </button>
                    <button class="TextEditor_button" type="button">
                        <i class="fa fa-link"></i>
                    </button>
                </div>
                <div class="TextEditor_second">
                    <div class="d-flex">
                        <input type="text" placeholder="Lien" ref="link">
                        <button type="button" class="Button" @click="onInsertLink(commands.link)">Insérer</button>
                    </div>
                </div>
            </div>
        </editor-menu-bar>

        <editor-content class="TextEditor_content TextBody" :editor="editor" ref="text" />
    </div>
</template>

<script>
import FileLoader from '@/components/admin/utils/FileLoader'

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Heading, Bold, Blockquote, Image, History, Link } from 'tiptap-extensions'

export default {
    name: 'TextEditor',
    components: { EditorContent, EditorMenuBar, FileLoader },
    props: {
        value: { type: String, default: '' }
    },
    data: () => ({
        editor: null,
    }),
    async mounted () {
        this.$data.editor = new Editor({
            extensions: [ new Heading({ levels: [1, 2, 3] }), new Bold(), new Blockquote(), new Image(), new History(), new Link() ],
            content: this.$props.value,
        })

        this.$data.editor.on('update', () => this.onUpdate())
        setTimeout(() => this.onUpdate(), 100)
    },
    methods: {
        onUpdate () {
            this.$emit('input', this.$data.editor.getHTML())
            this.$emit('words', this.$refs.text.$el.innerText.split(' ').length)
        },
        openFileLoader () {
            this.$refs.fileLoader.open()
        },
        onInsertImage (command, image) {
            command({ src: image })
        },
        onInsertLink (command) {
            command({ href: this.$refs.link.value })
        }
    }
}
</script>