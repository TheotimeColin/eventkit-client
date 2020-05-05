export default {
    component: 'conversation-starter',
    theme: {
        colors: {
            id: 'colors',
            label: 'Choisir un mode de couleurs',
            value: 'colored',
            type: 'choice-buttons',
            isClass: true,
            options: [
                { value: 'colored', label: 'Couleurs' },
                { value: 'monochrome', label: 'Monochrome' }
            ]
        },
        theme: {
            id: 'theme',
            label: `Choisir un style`,
            value: 'default',
            type: 'choice-buttons',
            isClass: true,
            options: [
                { value: 'default', label: `Centré` },
                { value: 'simple', label: `Aligné à gauche` }
            ]
        },
        background: {
            id: 'background',
            label: `Choisir un fond`,
            value: '#ef476f',
            defaultValue: '#ffffff',
            type: 'color-picker',
            var: 'background-color',
            conditions: {
                ['theme.colors.value']: 'colored'
            },
            options: [
                { value: '#ef476f' },
                { value: '#ffffff' },
                { value: '#4eb7ff' },
                { value: 'picker', custom: true, premium: true }
            ]
        },
        pattern: {
            id: 'pattern',
            label: `Choisir un motif de fond`,
            value: {},
            defaultValue: 'none',
            type: 'pattern-picker',
            varGroup: true,
            conditions: {
                ['theme.colors.value']: 'colored'
            },
            options: [
                {
                    value: {}
                },
                {
                    premium: true,
                    value: {
                        patternUrl: 'hideout',
                        patternOpacity: 0.5,
                        patternScale: 1
                    }
                },
                {
                    premium: true,
                    value: {
                        patternUrl: 'autumn',
                        patternOpacity: 0.5,
                        patternScale: 1
                    }
                },
                {
                    premium: true,
                    value: {
                        patternUrl: 'overlap',
                        patternOpacity: 0.5,
                        patternScale: 1
                    }
                }
            ]
        },
        color: {
            id: 'color',
            label: `Choisir une couleur de police`,
            value: '#000000',
            defaultValue: '#000000',
            type: 'color-picker',
            var: 'color',
            conditions: {
                ['theme.colors.value']: 'colored'
            },
            options: [
                { value: '#000000' },
                { value: '#ffffff' },
                { value: '#ef476f' },
                { value: '#4eb7ff' },
                { value: 'picker', custom: true, premium: true }
            ]
        },
        font: {
            id: 'font',
            label: `Choisir une police d'écriture`,
            defaultValue: 'Roboto',
            value: 'Roboto',
            type: 'choice-buttons',
            var: 'font',
            options: [
                { value: 'Roboto', label: 'Moderne' },
                { value: 'Merriweather', label: `Élégant`, premium: true },
                { value: 'Comic Sans MS', label: `Fun`, premium: true  }
            ]
        },
        size: {
            id: 'size',
            label: `Choisir un format`,
            value: { x: 65, y: 65 },
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
            value: 'Starter n°',
            type: 'input-text',
            isText: true,
            premium: true
        },
        footer: {
            id: 'footer',
            label: 'Texte de footer',
            defaultValue: 'Créé sur eventkit.social',
            value: 'Créé sur eventkit.social',
            type: 'input-text',
            isText: true,
            premium: true
        }
    },
    data: [
        { id: 0, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 1, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 2, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 3, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 4, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 5, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 6, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 7, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 8, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 9, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 10, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 11, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 12, main: 'Quel est le pire film que tu aies jamais vu ?' },
    ]
}