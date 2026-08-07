import type { ReactNode } from 'react'
import type { LexicalElementNode, LexicalRoot, LexicalTextNode } from '@/lib/lexical'

function renderTextNode(node: LexicalTextNode, key: number) {
  let content: ReactNode = node.text
  if (node.format && node.format & 1) content = <strong key={key}>{content}</strong>
  if (node.format && node.format & 2) content = <em key={key}>{content}</em>
  return <span key={key}>{content}</span>
}

function renderNode(node: LexicalElementNode | LexicalTextNode, key: number): ReactNode {
  if (node.type === 'text') return renderTextNode(node as LexicalTextNode, key)

  const element = node as LexicalElementNode
  const children = element.children?.map((child, index) => renderNode(child, index))

  switch (element.type) {
    case 'paragraph':
      return <p key={key}>{children}</p>
    case 'heading': {
      const tag = element.tag || 'h2'
      if (tag === 'h3') return <h3 key={key}>{children}</h3>
      if (tag === 'h4') return <h4 key={key}>{children}</h4>
      return <h2 key={key}>{children}</h2>
    }
    case 'list': {
      const ListTag = element.listType === 'number' ? 'ol' : 'ul'
      return <ListTag key={key}>{children}</ListTag>
    }
    case 'listitem':
      return <li key={key}>{children}</li>
    case 'link':
      return (
        <a key={key} href={(element as LexicalElementNode & { fields?: { url?: string } }).fields?.url || '#'}>
          {children}
        </a>
      )
    case 'quote':
      return <blockquote key={key}>{children}</blockquote>
    case 'linebreak':
      return <br key={key} />
    default:
      return <div key={key}>{children}</div>
  }
}

export function LexicalContent({ content }: { content?: LexicalRoot | null }) {
  if (!content?.root?.children?.length) return null
  return (
    <div className="lexical-content space-y-4">
      {content.root.children.map((node, index) => renderNode(node as LexicalElementNode, index))}
    </div>
  )
}
