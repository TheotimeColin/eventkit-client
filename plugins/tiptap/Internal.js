import { Mark, Node } from 'tiptap'
import { updateMark, removeMark, toggleBlockType, replaceText } from 'tiptap-commands'
import { getMarkAttrs } from 'tiptap-utils'

import LinkBase from '@/components/base/LinkBase'

export default class Internal extends Mark {

    get name() {
        return 'internal'
    }

    get schema() {
        return {
            attrs: {
                href: { default: null },
                context: { default: null }
            },
            inclusive: false,
            parseDOM: [{
                tag: 'a[data-context]',
                getAttrs: dom => {
                    return {
                        href: dom.getAttribute('href'),
                        context: JSON.parse(dom.getAttribute('data-context')),
                    }
                },
            }],
            toDOM: node => ['a', {
                ['data-context']: JSON.stringify(node.attrs.context).replace('&quot;', `'`),
                href: node.attrs.href
            }, 0]
        }
    }

    commands({ type }) {
        return attrs => {
            if (attrs.href) {
                return updateMark(type, attrs)
            }

            return removeMark(type)
        }
    }

    get view() {
        return LinkBase
    }
}

// export default class Internal extends Node {

//     get name() {
//         return 'internal'
//     }

//     get schema() {
//         return {
//             attrs: {
//                 to: {
//                     default: null,
//                 },
//                 text: {
//                     default: ''
//                 },
//                 ['v-text']: {
//                     default: ''
//                 }
//             },
//             group: 'inline',
//             content: 'inline*',
//             inline: true,
//             atom: true,
//             parseDOM: [{
//                 tag: 'a',
//                 getAttrs: dom => {
//                     return {
//                         to: JSON.parse(dom.getAttribute('to')),
//                         text: dom.getAttribute('text')
//                     }
//                 },
//             }],
//             toDOM: node => ['a', {
//                 to: JSON.stringify(node.attrs.to).replace('&quot;', `'`),
//                 text: node.attrs.text
//             }]
//         }
//     }

//     commands({ type, schema }) {
//         return attrs => replaceText(null, schema.nodes[this.name], attrs)
//     }

//     get view() {
//         return LinkBase
//     }
// }