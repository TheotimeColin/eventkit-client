<template>
    <div class="Page Page--admin Admin">
        <div class="Page_content">
            <div class="Wrapper">
                <button-base @click="state.new = true">
                    Nouveau pack
                </button-base>

                <idea-pack
                    class="idea-pack"
                    v-for="pack in packs"
                    :pack="pack"
                    :key="pack.id"
                    :update-mode="true"
                    :default-value="{ main: 'Nouveau' }"
                    @edit="() => onEdit(pack)"
                    @delete="() => onDelete(pack)"
                />
            </div>
        </div>

        <popin-generic :global="false" @close="onReset" :modifiers="['s']" :is-active="state.edit || state.new">
            <template slot="header">
                <p class="ft-m p-10">
                    <b v-if="state.edit">Modification de "{{ pack.title }}"</b>
                    <b v-if="state.new">Nouvelle catégorie</b>
                </p>
            </template>
            
            <div class="Form p-40">
                <div class="cover" :style="cover">
                    <input type="text" class="Input--unstyled" placeholder="Titre" v-model="pack.title">
                </div>

                <div class="Form_row">
                    <input type="text" placeholder="Description" v-model="pack.description">
                </div>

                <color-picker
                    :value="pack.color2"
                    :options="colorOptions"
                    @input="(v) => pack.color2 = v"
                />

                <color-picker
                    :value="pack.color1"
                    :options="colorOptions"
                    @input="(v) => pack.color1 = v"
                />

                <pattern-picker
                    :value="pack.pattern"
                    :options="patternOptions"
                    @input="(v) => pack.pattern = v"
                />

                <select-search
                    action="kits/fetch"
                    :multiple="true"
                    :params="{ refresh: true }"
                    v-model="pack.kits"
                />

                <div class="Form_row">
                    <input type="checkbox" placeholder="Color 2" v-model="pack.default"> Is default
                </div>
            </div>

            <template slot="footer">
                <div>
                    <button-base class="ml-10" :modifiers="['xs']" @click="$store.commit('utils/confirmPrompt', {
                        active: true,
                        onConfirm: () => onDelete(),
                        confirmText: 'Supprimer'
                    })" v-if="!state.new">
                        Supprimer
                    </button-base>
                </div>

                <div class="d-flex fx-align-center">
                    
                    <p class="mr-10 color-ft-weak" @click="onReset">Annuler</p>
                    <button-base @click="onSubmit">
                        {{ state.new ? 'Créer pack' : 'Modifier pack'}}
                    </button-base>
                </div>
            </template>
        </popin-generic>
    </div>
</template>

<script>
import patternOptions from '@/config/kits/common/patterns'
import colorOptions from '@/config/kits/common/colors'

import patterns from '@/config/patterns'

import IdeaPack from '@/components/interactive/IdeaPack'
import PopinGeneric from '@/components/popins/PopinGeneric'
import SelectSearch from '@/components/utils/SelectSearch'
import PatternPicker from '@/components/generators/components/PatternPicker'
import ColorPicker from '@/components/generators/components/ColorPicker'

export default {
    name: 'HomePage',
    layout: 'admin',
    components: { PopinGeneric, IdeaPack, SelectSearch, PatternPicker, ColorPicker },
    async fetch () {
        await this.$store.dispatch('kits/packs/fetch', {
            query: {}
        })
    },
    data: () => ({
        patternOptions, colorOptions,
        state: {
            new: false,
            edit: false,
            thumbnail: false
        },
        pack: {
            title: '',
            description: '',
            color1: '',
            color2: '',
            default: false,
            kits: [],
            pattern: {
                patternUrl: 'default',
                patternOpacity: 1,
                patternColor: '#ff00ff',
                patternScale: 1
            }
        }
    }),
    computed: {
        packs () {
            return this.$store.state.kits.packs.collection
        },
        cover () {
            if (!this.$data.pack.pattern) return {}

            let patternUrl = ''
            let pattern = patterns[this.$data.pack.pattern.patternUrl]

            if (pattern) {
                patternUrl = pattern(
                    this.$data.pack.pattern.patternColor.replace('#', ''),
                    this.$data.pack.pattern.patternScale,
                    this.$data.pack.pattern.patternOpacity
                )
            }
            
            return {
                color: this.$data.pack.color2,
                backgroundColor: this.$data.pack.color1,
                backgroundImage: `url("${patternUrl}")`
            }
        }
    },
    methods: {
        async onDelete (pack) {
            await this.$store.dispatch('kits/packs/delete', {
                data: { id: pack.id }
            })

            this.onReset()

            await this.$store.dispatch('kits/packs/fetch')
        },
        onEdit (pack) {
            this.$data.state.edit = true
            this.$data.pack = {
                ...this.$data.pack,
                ...JSON.parse(JSON.stringify(pack))
            }
        },
        async onSubmit () {
            const response = await this.$store.dispatch('kits/packs/post', {
                data: this.$data.pack
            })

            this.onReset()

            await this.$store.dispatch('kits/packs/fetch')
        },
        onReset () {
            this.$data.state.edit = false
            this.$data.state.new = false

            this.$data.pack = {
                title: '',
                description: '',
                color1: '',
                color2: '',
                default: false,
                kits: [],
                pattern: {
                    patternUrl: 'default',
                    patternOpacity: 1,
                    patternColor: '#ff00ff',
                    patternScale: 1
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .idea-pack {
        margin-bottom: 20px;
    }
    
    .cover {
        position: sticky;
        top: 0;
        z-index: 10;
        height: 100px;
        background-color: grey;
        display: flex;
        align-items: center;
        justify-content: center;
        

        input {
            text-align: center;
            font-size: 25px;
        }
    }
</style>