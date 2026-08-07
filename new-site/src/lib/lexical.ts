import type { Article } from '@/payload-types'

type LexicalTextNode = {
  type: 'text'
  text: string
  format?: number
  version: number
  mode?: 'normal'
  style?: string
  detail?: number
}

type LexicalElementNode = {
  type: string
  format?: string
  indent?: number
  version: number
  direction?: 'ltr' | 'rtl' | null
  children: Array<LexicalTextNode | LexicalElementNode>
  tag?: string
  listType?: 'number' | 'bullet'
}

export type LexicalRoot = NonNullable<Article['content']>

export function textToLexical(text: string): LexicalRoot {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  if (!paragraphs.length) {
    paragraphs.push(text.trim() || ' ')
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((paragraph) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'text',
            text: paragraph,
            format: 0,
            version: 1,
            mode: 'normal',
            style: '',
            detail: 0,
          },
        ],
      })),
    },
  }
}

export type { LexicalElementNode, LexicalTextNode }
