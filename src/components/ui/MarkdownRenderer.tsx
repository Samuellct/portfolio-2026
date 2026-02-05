'use client'

import 'katex/dist/katex.min.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// Supprime l'indentation commune des template literals
function cleanIndentation(content: string): string {
  const lines = content.split('\n')
  const nonEmptyLines = lines.filter(line => line.trim().length > 0)
  
  if (nonEmptyLines.length === 0) return content
  
  const minIndent = nonEmptyLines.reduce((min, line) => {
    const match = line.match(/^(\s*)/)
    const indent = match ? match[1].length : 0
    return Math.min(min, indent)
  }, Infinity)
  
  if (minIndent > 0 && minIndent !== Infinity) {
    return lines.map(line => line.slice(minIndent)).join('\n').trim()
  }
  
  return content.trim()
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-display text-4xl text-white mt-10 mb-6 tracking-wide">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-3xl text-white mt-10 mb-4 tracking-wide">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-2xl text-white/90 mt-8 mb-3 tracking-wide">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-display text-xl text-white/80 mt-6 mb-2 tracking-wide">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-white/70 leading-relaxed mb-4 text-justify">{children}</p>
  ),
  a: ({ href, children }) => (
    <a 
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-accent-cyan hover:underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-white/70">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-white/70">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="pl-1">{children}</li>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="bg-white/5 px-1.5 py-0.5 rounded text-accent-cyan text-sm font-mono" {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className={`${className} font-mono text-sm`} {...props}>{children}</code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-white/[0.03] border border-white/10 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent-purple bg-accent-purple/5 pl-4 py-2 my-4 italic text-white/60">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-white/80 italic">{children}</em>
  ),
  hr: () => <hr className="border-white/10 my-8" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-white/20">{children}</thead>,
  th: ({ children }) => <th className="text-left p-2 text-white font-medium">{children}</th>,
  td: ({ children }) => <td className="p-2 text-white/70 border-b border-white/10">{children}</td>,
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {cleanIndentation(content)}
      </ReactMarkdown>
    </div>
  )
}
