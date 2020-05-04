export default {
    component: 'conversation-starter',
    theme: {
        choices: {
            colors: {
                id: 'colors',
                label: 'Choisir un mode de couleurs',
                value: 'colored',
                type: 'choice-buttons',
                isClass: true,
                options: [
                    { value: 'colored', label: '🔵 Couleurs' },
                    { value: 'monochrome', label: '⚪️ Monochrome' }
                ]
            },
            theme: {
                id: 'theme',
                label: `Choisir un style`,
                value: 'default',
                type: 'choice-buttons',
                isClass: true,
                options: [
                    { value: 'default', label: `🎉 Par défaut` },
                    { value: 'simple', label: `💎 Simple` }
                ]
            },
            background :{
                id: 'background',
                label: `Choisir un fond`,
                value: 'default',
                type: 'color-picker',
                isClass: true,
                conditions: {
                    ['theme.choices.colors.value']: 'colored'
                },
                options: [
                    { value: 'default', class: 'pink' },
                    { value: 'simple', class: 'blue' }
                ]
            },
            font: {
                id: 'font',
                label: `Choisir une police d'écriture`,
                value: 'Merriweather',
                type: 'choice-buttons',
                var: 'font',
                options: [
                    { value: 'Roboto', label: '🚀 Moderne' },
                    { value: 'Merriweather', label: `💎 Élégant`},
                    { value: 'Comic Sans MS', label: `🎈 Fun` }
                ]
            },
            size: {
                id: 'size',
                label: `Choisir un format`,
                value: 'square',
                type: 'choice-buttons',
                isClass: true,
                options: [
                    { value: 'square', label: 'Carré (6,5cm x 6,5cm)' },
                    { value: 'rectangle', label: 'Rectangle (8,4cm x 5,5cm)' }
                ]
            }
        }
    }
}