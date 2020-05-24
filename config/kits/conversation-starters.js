import patterns from '@/config/kits/common/patterns'
import colors from '@/config/kits/common/colors'
import fonts from '@/config/kits/common/fonts'

export default {
    component: {
        static: true,
        value: 'conversation-starter'
    },
    colors: {
        id: 'colors',
        group: 'colors',
        type: 'color-picker',
        valueGroup: true,
        options: {
            color: { fa: 'text', label: 'Texte' },
            backgroundColor: { fa: 'draw-square', label: 'Fond' },
            patternColor: { fa: 'chess-board', label: 'Motif' },
        }
    },
    pattern: {
        id: 'pattern',
        group: 'pattern',
        defaultValue: '',
        type: 'pattern-picker',
        varGroup: true,
        defining: 'patternUrl',
        options: patterns
    },
    font: {
        id: 'font',
        group: 'text',
        defaultValue: { fontFamily: '"Lato"' },
        type: 'font-picker',
        varGroup: true,
        options: fonts
    },
    theme: {
        id: 'theme',
        group: 'text',
        label: `Disposition`,
        type: 'choice-buttons',
        default: 'default',
        isClass: true,
        options: [
            { value: 'default', label: `Centré` },
            { value: 'simple', label: `Aligné à gauche` }
        ]
    },
    title: {
        id: 'title',
        group: 'text',
        label: 'Texte de titre',
        defaultValue: 'Starter n°',
        type: 'input-text',
        isText: true,
        premium: true
    },
    footer: {
        id: 'footer',
        group: 'text',
        label: 'Texte de footer',
        defaultValue: 'Créé sur eventkit.social',
        type: 'input-text',
        isText: true,
        premium: true
    },
    id: {
        id: 'id',
        group: 'text',
        label: 'Afficher le numéro',
        type: 'choice-buttons',
        isClass: true,
        options: [
            { value: 'show', label: `Montrer` },
            { value: 'hide', label: `Cacher` }
        ]
    },
    radius: {
        id: 'radius',
        group: 'format',
        label: `Arrondi bordures`,
        type: 'range',
        defaultValue: 1,
        var: 'border-radius',
        options: { value: 0.1, min: 0, max: 0.5, step: 0.01 }
    },
    padding: {
        id: 'padding',
        group: 'format',
        label: `Marges intérieures`,
        type: 'range',
        defaultValue: 7.5,
        var: 'padding',
        options: { value: 1, min: 0, max: 20, step: 0.1 }
    },
    // size: {
    //     id: 'size',
    //     group: 'format',
    //     label: `Format d'impression`,
    //     type: 'choice-buttons',
    //     isSize: true,
    //     options: [
    //         { value: { x: 65, y: 65, margin: 7.5 }, label: 'Carré' },
    //         { value: { x: 84, y: 55, margin: 7.5 }, label: 'Paysage' },
    //         { value: { x: 55, y: 84, margin: 7.5 }, label: 'Portrait' },
    //         { value: { x: 75, y: 75, margin: 7.5 },
    //             custom: {
    //                 x: { label: 'Largeur (mm)', type: 'input' },
    //                 y: { label: 'Hauteur (mm)', type: 'input'},
    //                 margin: { label: 'Marges (mm)', type: 'input'}
    //         } },
    //     ]
    // },
    page: {
        id: 'page',
        static: true,
        page: true,
        options: {
            margins: {},
            spacing: {}
        }
    }
}