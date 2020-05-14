import patterns from '@/config/kits/common/patterns'
import colors from '@/config/kits/common/colors'

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
            color: { fa: 'text', label: 'Police' },
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
        label: `Police d'écriture`,
        defaultValue: { fontFamily: '"Lato"' },
        type: 'choice-buttons',
        varGroup: true,
        options: [
            {
                value: {
                    fontFamily: '"Lato"'
                },
                label: 'Lato'
            },
            {
                value: {
                    fontFamily: '"Tinos"',
                    lineHeight: '1.2'
                },
                label: `Tinos`
            },
            {
                value: {
                    fontFamily: '"Chewy"',
                    fontSize: '18px'
                },
                label: `Chewy`
            },
            {
                value: {
                    fontFamily: '"Bebas Neue"',
                    fontSize: '20px',
                    lineHeight: '1.2'
                },
                label: `Bebas Neue`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Dancing Script"',
                    fontSize: '22px',
                    lineHeight: '1'
                },
                label: `Dancing Script`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Parisienne"',
                    fontSize: '22px',
                    lineHeight: '1'
                },
                label: `Parisienne`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Balsamiq Sans"',
                    fontSize: '18px',
                    lineHeight: '1.2'
                },
                label: `Balsamiq Sans`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Amatic SC"',
                    fontSize: '22px',
                    lineHeight: '1.2'
                },
                label: `Amatic SC`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Playfair display"'
                },
                label: `Playfair display`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Patua One"',
                    fontSize: '15px',
                    lineHeight: '1.35'
                },
                label: `Patua One`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Satisfy"',
                    fontSize: '19px',
                    lineHeight: '1.2'
                },
                label: `Satisfy`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Kalam"',
                    lineHeight: '1.3'
                },
                label: `Kalam`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"Cookie"',
                    fontSize: '22px',
                    lineHeight: '0.95'
                },
                label: `Cookie`,
                premium: true
            },
            {
                value: {
                    fontFamily: '"VT323"',
                    fontSize: '19px',
                    lineHeight: '1'
                },
                label: `VT323`,
                premium: true
            }
        ]
    },
    size: {
        id: 'size',
        group: 'format',
        label: `Format d'impression`,
        type: 'choice-buttons',
        isSize: true,
        options: [
            { value: { x: 65, y: 65, margin: 7.5 }, label: 'Carré' },
            { value: { x: 84, y: 55, margin: 7.5 }, label: 'Paysage' },
            { value: { x: 55, y: 84, margin: 7.5 }, label: 'Portrait' },
            { value: { x: 75, y: 75, margin: 7.5 },
                custom: {
                    x: { label: 'Largeur (mm)', type: 'input' },
                    y: { label: 'Hauteur (mm)', type: 'input'},
                    margin: { label: 'Marges (mm)', type: 'input'}
            } },
        ]
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
    elementScale: {
        id: 'element-scale',
        group: 'text',
        label: `Taille éléments`,
        defaultValue: 1,
        type: 'range',
        var: 'element-scale',
        options: [
            {
                value: 1,
                label: 'Taille'
            }
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
    }
}