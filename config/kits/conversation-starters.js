export default {
    component: 'conversation-starter',
    options: {
        colors: {
            group: 'colors',
            type: 'color-picker',
            isStyle: true,
            values: {
                color: { default: '#000000' },
                backgroundColor: { default: '#ffffff' },
                patternColor: { default: '#dddddd' },
            },
            options: ['color', 'backgroundColor', 'patternColor']
        },
        pattern: {
            group: 'pattern',
            type: 'pattern-picker',
            isStyle: true,
            values: {
                patternUrl: { default: 'polka' },
                patternOpacity: { default: '1' },
                patternScale: { default: '1' }
            }
        },
        font: {
            group: 'text',
            type: 'font-picker',
            isStyle: true,
            values: {
                fontFamily: { default: `"Lato"`}
            }
        },
        theme: {
            group: 'text',
            type: 'choice-buttons',
            isClass: true,
            value: 'default',
            options: {
                centered: 'default',
                right: 'simple' 
            }
        },
        headerText: {
            group: 'text',
            type: 'input-text',
            displayLabel: true,
            isText: true,
            value: 'Starter n°'
        },
        footerText: {
            group: 'text',
            type: 'input-text',
            displayLabel: true,
            isText: true,
            value: 'Créé sur eventkit.social'
        },
        id: {
            group: 'text',
            type: 'choice-buttons',
            displayLabel: true,
            value: true,
            options: {
                show: true,
                hide: false
            }
        },
        borderRadius: {
            group: 'format',
            type: 'range',
            displayLabel: true,
            isStyle: true,
            value: 0.05,
            props: {
                min: 0,
                max: 0.5,
                step: 0.01
            }
        },
        padding: {
            group: 'format',
            type: 'range',
            displayLabel: true,
            isStyle: true,
            value: 7.5,
            props: {
                min: 0,
                max: 20,
                step: 0.1
            }
        },
        size: {
            group: 'format',
            isStyle: true,
            values: {
                width: { default: '65mm' },
                height: { default: '65mm' }
            }
        },
        page: {
            values: {
                margins: { default: '7.5mm' },
                spacing: { default: '0mm' },
                componentScale: { default: 1 },
            }
        }
    },
}