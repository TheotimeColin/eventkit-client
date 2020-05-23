<template>
    <div class="TextEditor" :class="{ 'TextEditor--compact': compact }">
        <editor-menu-bar class="TextEditor_menu" :editor="editor" v-slot="{ commands }" v-if="editable">
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
                    <button class="TextEditor_button" type="button" @click="commands.undo" v-if="!compact">
                        <i class="fal fa-undo-alt"></i>
                    </button>

                    <button class="TextEditor_button" type="button" @click="commands.redo" v-if="!compact">
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
                    <button class="TextEditor_button" type="button" @click="commands.blockquote()" v-if="!compact">
                        <i class="fal fa-quote-right"></i>
                    </button>
                    <button class="TextEditor_button" type="button" @click="commands.bullet_list()">
                        <i class="fal fa-list-ul"></i>
                    </button>
                    <button class="TextEditor_button" type="button" @click="commands.ordered_list()">
                        <i class="fal fa-list-ol"></i>
                    </button>

                    <div class="TextEditor_separator"></div>

                    <button class="TextEditor_button" type="button" @click="commands.accordion()" v-if="!compact">
                        <i class="fal fa-window-maximize"></i>
                    </button>

                    <button class="TextEditor_button" type="button" @click="state.styleSelect = true">
                        <i class="fal fa-lightbulb-on"></i>
                    </button>
                    
                    <div class="TextEditor_separator"></div>

                    <button class="TextEditor_button" type="button" @click="state.fileSelect = true" v-if="!compact">
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

                    <div class="d-flex" v-show="state.styleSelect">
                        <select v-model="style.block">
                            <option value="StyledBlock--pink">Pink</option>
                            <option value="StyledBlock--cyan">Cyan</option>
                            <option value="StyledBlock--blue">Blue</option>
                            <option value="StyledBlock--gold">Gold</option>
                        </select>
                        <button type="button" class="Button" @click="commands.styledBlock({ block: style.block })">
                            Insérer
                        </button>
                    </div>
                </div>
            </div>
        </editor-menu-bar>

        <div class="TextBody" v-html="value" v-if="!editor"></div>
        <editor-content class="TextEditor_content TextBody" :editor="editor" ref="text" v-if="editor" />
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
import StyledBlock from '@/plugins/tiptap/StyledBlock'

export default {
    name: 'TextEditor',
    components: { EditorContent, EditorMenuBar, FileLoader, InternalLoader, StyledBlock },
    props: {
        id: { type: String },
        value: { type: String, default: '' },
        compact: { type: Boolean, default: false },
        editable: { type: Boolean, default: true }
    },
    data: () => ({
        state: {
            fileSelect: false,
            internalSelect: false,
            linkSelect: false,
            styleSelect: false
        },
        editor: null,
        link: {
            href: '',
            blank: true
        },
        style: {
            block: 'StyledBlock--pink'
        }
    }),
    async mounted () {
        this.$data.editor = new Editor({
            editable: this.$props.editable,
            extensions: [
                new Heading({ levels: [2, 3] }),
                new Bold(), new Italic(),
                new OrderedList(), new BulletList(), new ListItem(),
                new Internal(),
                new Blockquote(),
                new Image(),
                new History(),
                new Link(), new Accordion(), new StyledBlock()
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