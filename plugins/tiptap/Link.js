import { Mark, Plugin } from 'tiptap'
import { updateMark, removeMark, pasteRule } from 'tiptap-commands'
import { getMarkAttrs } from 'tiptap-utils'

export default class Link extends Mark {

  get name() {
    return 'link'
  }

  get defaultOptions() {
    return {
      openOnClick: true,
    }
  }

  get schema() {
    return {
      attrs: {
        href: {
          default: null,
        },
        blank: {
            default: true
        }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: dom => ({
            href: dom.getAttribute('href'),
            blank: dom.getAttribute('target') == "_blank"
          }),
        },
      ],
      toDOM: node => {
          let attrs = {
            href: node.attrs.href,
            rel: 'noopener noreferrer nofollow',
          }

          if (node.attrs.blank) attrs['target'] = '_blank'

          return ['a', attrs, 0]
      },
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

  pasteRules({ type }) {
    return [
      pasteRule(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
        type,
        url => ({ href: url }),
      ),
    ]
  }

  get plugins() {
    if (!this.options.openOnClick) {
      return []
    }

    return [
      new Plugin({
        props: {
          handleClick: (view, pos, event) => {
            const { schema } = view.state
            const attrs = getMarkAttrs(view.state, schema.marks.link)

            if (attrs.href && event.target instanceof HTMLAnchorElement) {
              event.stopPropagation()
              window.open(attrs.href)
            }
          },
        },
      }),
    ]
  }

}