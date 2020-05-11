export default {
    component: {
        static: true,
        value: 'conversation-starter'
    },
    background: {
        id: 'background',
        group: 'main',
        label: `Couleur fond`,
        defaultValue: '#ef476f',
        type: 'color-picker',
        var: 'background-color',
        custom: true,
        options: [
            { value: 'transparent' },
            { value: '#2a9d8f' },
            { value: '#ffcdb2' },
            { value: '#4eb7ff' },
            { value: '#a8dadc' },
            { value: '#f1faee' },
            { value: '#028090' },
            { value: '#ff0054' },
            { value: '#9e0059' },
            { value: '#f0a6ca' },
            { value: '#f0e6ef' },
            { value: '#c6dabf' },
            { value: '#390099' },
            { value: '#1a936f' }
        ]
    },
    color: {
        id: 'color',
        group: 'font',
        label: `Couleur de police`,
        defaultValue: '#000000',
        type: 'color-picker',
        var: 'color',
        custom: true,
        options: [
            { value: '#000000' },
            { value: '#ffffff' },
            { value: '#2a9d8f' },
            { value: '#ffcdb2' },
            { value: '#4eb7ff' },
            { value: '#a8dadc' },
            { value: '#f1faee' },
            { value: '#028090' },
            { value: '#ff0054' },
            { value: '#9e0059' },
            { value: '#f0a6ca' },
            { value: '#f0e6ef' },
            { value: '#c6dabf' },
            { value: '#390099' },
            { value: '#1a936f' }
        ]
    },
    pattern: {
        id: 'pattern',
        group: 'main',
        label: `Motif de fond`,
        defaultValue: '',
        type: 'pattern-picker',
        varGroup: true,
        defining: 'patternUrl',
        options: [
            { value: { patternUrl: '', patternColor: '000000', patternOpacity: 1, patternScale: 1 } },
            { value: { patternUrl: 'stripes', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { value: { patternUrl: 'bubbles', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { value: { patternUrl: 'triangles', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { value: { patternUrl: 'bee', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { value: { patternUrl: 'piano', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { value: { patternUrl: 'anchors', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { value: { patternUrl: 'checkers', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { value: { patternUrl: 'wavy', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'polka', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'glam', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'wiggle', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'stars', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'squares', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'clouds', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'tictactoe', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'autumn', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'hideout', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'charlie', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'sprinkles', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'overlap', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'leaf', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'bathroom', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'bank', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'zigzag', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            { premium: true, value: { patternUrl: 'topography', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
        ]
    },
    font: {
        id: 'font',
        group: 'font',
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
        group: 'font',
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
        group: 'font',
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