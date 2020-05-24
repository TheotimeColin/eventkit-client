<template>
    <div class="TextEditor" :class="{ 'TextEditor--compact': compact }">
        <editor-menu-bar class="TextEditor_menu" :editor="editor" v-slot="{ commands, isActive }" v-if="editable">
            <div>
                <file-loader
                    id="image-select"
                    :is-active="state.current == 'fileSelect'"
                    @input="(e) => onInsertImage(commands.image, e)"
                    @done="state.current = ''"
                />
                
                <internal-loader
                    :is-active="state.current == 'internalSelect'"
                    @input="(v) => onInsertInternal(commands.internal, v)"
                    @done="state.current = ''"
                />
                
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
                <div class="TextEditor_second">
                    <div class="d-flex" v-show="state.current == 'linkSelect'">
                        <input type="text" placeholder="Lien" v-model="link.href">
                        <label class="fx-no-shrink">
                            <input type="checkbox" v-model="link.blank">Nouvel onglet
                        </label>
                        <button type="button" class="Button" @click="onInsertLink(commands.link)">Insérer</button>
                    </div>

                    <div class="d-flex" v-show="state.current == 'blockSelect'">
                        <select v-model="block">
                            <option value="StyledBlock--pink">Pink</option>
                            <option value="StyledBlock--cyan">Cyan</option>
                            <option value="StyledBlock--blue">Blue</option>
                            <option value="StyledBlock--gold">Gold</option>
                        </select>
                        <button type="button" class="Button" @click="commands.styledBlock({ block: block })">
                            Insérer
                        </button>
                    </div>

                    <div class="d-flex" v-show="state.current == 'styleSelect'">
                        <div class="TextEditor_group">
                            <button
                                v-for="(command, i) in style"
                                class="TextEditor_button"
                                :class="{ 'is-active': isActive[command.id] ? isActive[command.id]() : false }"
                                type="button"
                                @click="command.onClick ? command.onClick() : commands[command.id]()"
                                v-show="compact ? command.compact : true"
                                :key="i"
                            >
                                <i class="fal" :class="{ ['fa-' + command.fa]: true }"></i>
                            </button>
                        </div>
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
import SetClass from '@/plugins/tiptap/SetClass'

export default {
    name: 'TextEditor',
    components: { EditorContent, EditorMenuBar, FileLoader, InternalLoader, StyledBlock, SetClass },
    props: {
        id: { type: String },
        value: { type: String, default: '' },
        compact: { type: Boolean, default: false },
        editable: { type: Boolean, default: true }
    },
    data: () => ({
        state: {
            current: 'styleSelect'
        },
        editor: null,
        link: {
            href: '',
            blank: true
        },
        style: [],
        block: 'StyledBlock--pink',
        groups: []
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
                new Link(), new Accordion(), new StyledBlock(), new SetClass()
            ],
            content: this.$props.value,
        })

        this.$data.groups = [
            [
                { id: 'undo', label: 'Annuler', fa: 'undo-alt', compact: true },
                { id: 'redo', label: 'Rétablir', fa: 'redo-alt', compact: true }
            ], [
                { id: 'style', label: 'Style texte', fa: 'text-size', onClick: () => this.$data.state.current = 'styleSelect', compact: false },
                { id: 'bold', label: 'Gras', fa: 'bold', compact: false },
                { id: 'italic', label: 'Italique', fa: 'italic', compact: false },
            ], [
                { id: 'image', label: 'Image', fa: 'image', onClick: () => this.$data.state.current = 'fileSelect', compact: false },
                { id: 'link', label: 'Lien', fa: 'link', onClick: () => this.$data.state.current = 'linkSelect', compact: false },
                { id: 'internal', label: 'Lien interne', fa: 'comment-alt-lines', onClick: () => this.$data.state.current = 'internalSelect', compact: false },
                { id: 'blockquote', label: 'Citation', fa: 'quote-right', compact: true },
                { id: 'bullet_list', label: 'Liste', fa: 'list-ul', compact: false },
                { id: 'ordered_list', label: 'Liste numérotée', fa: 'list-ol', compact: true },
            ], [
                { id: 'accordion', label: 'Accordéon', fa: 'window-maximize', compact: true },
                { id: 'styledBlock', label: 'Bloc', fa: 'lightbulb-on', onClick: () => this.$data.state.current = 'blockSelect', compact: false },
            ]
        ]

        this.$data.style = [
            { id: 'h1', label: 'H1', fa: 'h1', onClick: () => this.$data.editor.commands.heading({ level: 1 }) },
            { id: 'h2', label: 'H2', fa: 'h2', onClick: () => this.$data.editor.commands.heading({ level: 2 }) },
            { id: 'h3', label: 'H3', fa: 'h3', onClick: () => this.$data.editor.commands.heading({ level: 3 }) },
            { id: 'h4', label: 'H4', fa: 'h4', onClick: () => this.$data.editor.commands.heading({ level: 4 }) },
            { id: 'node', label: 'H4', fa: 'h4', onClick: () => this.$data.editor.commands.set_class({ attrs: { ['class']: 'lol' } }) },
        ]

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