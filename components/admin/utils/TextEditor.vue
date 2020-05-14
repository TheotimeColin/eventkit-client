<template>
    <div class="TextEditor">
        <editor-menu-bar class="TextEditor_menu" :editor="editor" v-slot="{ commands }">
            <div>
                <file-loader
                    id="image-select"
                    :is-active="state.fileSelect"
                    @input="(e) => onInsertImage(commands.image, e)"
                    @done="state.fileSelect = false"
                />
                
                <internal-loader
                    :is-active="state.internalSelect"
                    @input="(v) => onInsertInternal(commands.internal, v)"
                    @done="state.internalSelect = false"
                />
                
                <div class="TextEditor_first">
                    <button class="TextEditor_button" type="button" @click="commands.undo">
                        <i class="fal fa-undo-alt"></i>
                    </button>

                    <button class="TextEditor_button" type="button" @click="commands.redo">
                        <i class="fal fa-redo-alt"></i>
                    </button>

                    <div class="TextEditor_separator"></div>

                    <button class="TextEditor_button" type="button" @click="commands.bold">
                        <i class="fal fa-bold"></i>
                    </button>
                    <button class="TextEditor_button" type="button" @click="commands.italic">
                        <i class="fal fa-italic"></i>
                    </button>
                    <button class="TextEditor_button" type="button" @click="commands.heading({ level: 2 })">
                        <i class="fal fa-heading"></i><span class="ft-2xs">2</span>
                    </button>
                    <button class="TextEditor_button" type="button" @click="commands.heading({ level: 3 })">
                        <i class="fal fa-heading"></i><span class="ft-2xs">3</span>
                    </button>
                    <button class="TextEditor_button" type="button" @click="commands.blockquote()">
                        <i class="fal fa-quote-right"></i>
                    </button>
                    <button class="TextEditor_button" type="button" @click="commands.bullet_list()">
                        <i class="fal fa-list-ul"></i>
                    </button>
                    <button class="TextEditor_button" type="button" @click="commands.ordered_list()">
                        <i class="fal fa-list-ol"></i>
                    </button>

                    <div class="TextEditor_separator"></div>

                    <button class="TextEditor_button" type="button" @click="commands.accordion()">
                        <i class="fal fa-times"></i>
                    </button>
                    
                    <div class="TextEditor_separator"></div>

                    <button class="TextEditor_button" type="button" @click="state.fileSelect = true">
                        <i class="fal fa-image"></i>
                    </button>
                    <button class="TextEditor_button" type="button" @click="state.linkSelect = !state.linkSelect">
                        <i class="fal fa-link"></i>
                    </button>
                    <button class="TextEditor_button" type="button" @click="state.internalSelect = true">
                        <i class="fal fa-external-link-alt"></i>
                    </button>
                </div>
                <div class="TextEditor_second">
                    <div class="d-flex" v-show="state.linkSelect">
                        <input type="text" placeholder="Lien" v-model="link.href">
                        <label class="fx-no-shrink">
                            <input type="checkbox" v-model="link.blank">Nouvel onglet
                        </label>
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
import InternalLoader from '@/components/admin/utils/InternalLoader'

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Heading, Bold, Blockquote, Image, History, Italic, OrderedList, BulletList, ListItem } from 'tiptap-extensions'
import Internal from '@/plugins/tiptap/Internal'
import Link from '@/plugins/tiptap/Link'
import Accordion from '@/plugins/tiptap/Accordion'

export default {
    name: 'TextEditor',
    components: { EditorContent, EditorMenuBar, FileLoader, InternalLoader },
    props: {
        id: { type: String },
        value: { type: String, default: '' }
    },
    data: () => ({
        state: {
            fileSelect: false,
            internalSelect: false,
            linkSelect: false
        },
        editor: null,
        link: {
            href: '',
            blank: true
        }
    }),
    async mounted () {
        this.$data.editor = new Editor({
            extensions: [
                new Heading({ levels: [2, 3] }),
                new Bold(), new Italic(),
                new OrderedList(), new BulletList(), new ListItem(),
                new Internal(),
                new Blockquote(),
                new Image(),
                new History(),
                new Link(), new Accordion()
            ],
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
        onInsertImage (command, image) {
            this.$data.state.fileSelect = false
            command({ src: image.src })
        },
        onInsertLink (command) {
            command(this.$data.link)
        },
        onInsertInternal (command, article) {
            command({
                href: '/blog/' + article.slug,
                context: {
                    title: article.title,
                    description: article.excerpt,
                    cover: article.thumbnail.src,
                    href: '/blog/' + article.slug,
                }
            })
        }
    }
}
</script>