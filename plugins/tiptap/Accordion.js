import { Node, findWrapping } from 'tiptap'
import { toggleBlockType, setBlockType, textblockTypeInputRule, toggleWrap  } from 'tiptap-commands'

import Accordion from '@/components/interactive/Accordion'

export default class Schema extends Node {

  get name() {
    return 'accordion'
  }

  get defaultOptions() {
    return {
      itemprop: {},
    }
  }

  get schema() {
    return {
        content: 'block*',
        group: 'block',
        defining: true,
        isolating: true,
        draggable: false,
        parseDOM: [{
            tag: '.Accordion'
        }],
        toDOM: node => ['div', {
            class: 'Accordion'
        }, 0]
    }
  }

  commands({ type, schema }) {
    return attrs => toggleWrap(type, schema.nodes.schema)
  }

  get view () {
      return Accordion
  }
}


// export default class Schema extends Node {

//     get name() {
//         return 'schema'
//     }

//     get schema() {
//         return {
//             attrs: {
//                 itemscope: {
//                     default: false
//                 },
//                 itemtype: {
//                     default: ''
//                 },
//                 itemprop: {
//                     default: ''
//                 }
//             },
//             content: 'block*',
//             group: 'block',
//             defining: true,
//             parseDOM: [{
//                 tag: 'div[itemscope]',
//                 getAttrs: dom => {
//                     return {
//                         itemscope: dom.hasAttribute('itemscope'),
//                         itemtype: dom.getAttribute('itemtype')
//                     }
//                 },
//             }],
//             toDOM: node => {
//                 let attrs = {
//                     itemtype: node.attrs.itemtype
//                 }

//                 if (node.attrs.itemscope) attrs['itemscope']  = ''
//                 return ['div', 0]
//             }
//         }
//     }

//     commands({ type, schema }) {
//         return attrs => toggleBlockType(type, schema.nodes.schema)

//         // return attrs => (state, dispatch) => {
//         //     const { selection } = state;
//         //     const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
//         //     const node = type.create(attrs);
//         //     const transaction = state.tr.insert(position, node);
//         //     dispatch(transaction)

//         //     return toggleWrap(type, attrs)

//         //     // return removeMark(type)
//         // }
//     }
// }