export default {
    component: 'conversation-starter',
    theme: {
        theme: {
            id: 'theme',
            label: `Disposition`,
            type: 'choice-buttons',
            isClass: true,
            options: [
                { value: 'default', label: `Centré` },
                { value: 'simple', label: `Aligné à gauche` }
            ]
        },
        background: {
            id: 'background',
            label: `Couleur fond`,
            defaultValue: '#ef476f',
            type: 'color-picker',
            var: 'background-color',
            custom: true,
            options: [
                { value: '#ef476f' },
                { value: '#ffffff' },
                { value: '#4eb7ff' },
                { value: 'picker', custom: true, premium: true }
            ]
        },
        pattern: {
            id: 'pattern',
            label: `Motif de fond`,
            defaultValue: '',
            type: 'pattern-picker',
            varGroup: true,
            defining: 'patternUrl',
            options: [
                { value: { patternUrl: '', patternColor: '000000', patternOpacity: 1, patternScale: 1 } },
                { value: { patternUrl: 'stripes', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'clouds', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'triangles', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'autumn', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'hideout', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'charlie', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'sprinkles', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'overlap', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'leaf', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'bee', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'bathroom', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'bank', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'bubbles', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'zigzag', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'wavy', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
                { premium: true, value: { patternUrl: 'topography', patternColor: '00ff00', patternOpacity: 0.5, patternScale: 1 } },
            ]
        },
        font: {
            id: 'font',
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
                        fontFamily: '"Tinos"'
                    },
                    label: `Tinos`,
                    premium: true
                },
                {
                    value: {
                        fontFamily: '"Chewy"',
                        fontSize: '18px'
                    },
                    label: `Chewy`,
                    premium: true
                },
                {
                    value: {
                        fontFamily: '"Bebas Neue"',
                        fontSize: '20px'
                    },
                    label: `Bebas Neue`,
                    premium: true
                },
                {
                    value: {
                        fontFamily: '"Dancing Script"',
                        fontSize: '22px'
                    },
                    label: `Dancing Script`,
                    premium: true
                },
                {
                    value: {
                        fontFamily: '"Press Start 2P"',
                        fontSize: '11px'
                    },
                    label: `Press Start`,
                    premium: true
                },
                {
                    value: {
                        fontFamily: '"Courgette"',
                        fontSize: '20px'
                    },
                    label: `Handlee`,
                    premium: true
                },
                {
                    value: {
                        fontFamily: '"Amatic SC"',
                        fontSize: '22px'
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
                        fontFamily: '"Fira mono"'
                    },
                    label: `Fira mono`,
                    premium: true
                },
                {
                    value: {
                        fontFamily: '"Finger paint"',
                    },
                    label: `Finger Paint`,
                    premium: true
                }
            ]
        },
        color: {
            id: 'color',
            label: `Couleur de police`,
            defaultValue: '#000000',
            type: 'color-picker',
            var: 'color',
            custom: true,
            options: [
                { value: '#000000' },
                { value: '#ffffff' },
                { value: '#ef476f' },
                { value: '#4eb7ff' },
                { value: 'picker', custom: true, premium: true }
            ]
        },
        size: {
            id: 'size',
            label: `Format d'impression`,
            type: 'choice-buttons',
            isSize: true,
            options: [
                { value: { x: 65, y: 65 }, label: 'Carré (6,5cm x 6,5cm)' },
                { value: { x: 84, y: 55 }, label: 'Paysage (8,4cm x 5,5cm)' },
                { value: { x: 55, y: 84 }, label: 'Portrait (5,5cm x 8,4cm)' }
            ]
        },
        title: {
            id: 'title',
            label: 'Texte de titre',
            defaultValue: 'Starter n°',
            type: 'input-text',
            isText: true,
            premium: true
        },
        footer: {
            id: 'footer',
            label: 'Texte de footer',
            defaultValue: 'Créé sur eventkit.social',
            type: 'input-text',
            isText: true,
            premium: true
        }
    }
}