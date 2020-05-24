// import { Node } from 'tiptap'
// import { toggleBlockType } from 'prosemirror-commands'

// export default class SetClass extends Node {

//     get name() {
//         return 'set_class'
//     }

//     get schema() {
//         return {
//             attrs: {
//                 attrs: {},
//             },
//             content: 'inline*',
//             parseDOM: [{
//                 tag: '*[data-class-set]',
//             }],
//             toDOM: node => {
//                 let result = {}
                
//                 // node.attrs.attrs.forEach(attr => result[Object.keys(attr)[0], attr[Object.keys(attr)[0]]])
//                 // console.log(node.attrs.attrs)

//                 return ['div', {
//                     ['data-class-set']: 'true'
//                 }, 0]
//             }
//         }
//     }

//     commands({ type, schema }) {
//         return attrs => toggleBlockType(type, schema.nodes.paragraph, attrs)
//     }
// }