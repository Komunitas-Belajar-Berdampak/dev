import type { JSONContent } from '@tiptap/react';
import { Fragment, type ReactNode } from 'react';

export const extractDiscussionText = (node: JSONContent | undefined): string => {
  if (!node) return '';

  const text = typeof node.text === 'string' ? node.text : '';
  const children = (node.content ?? [])
    .map((child) => extractDiscussionText(child))
    .filter(Boolean)
    .join(' ');

  return `${text} ${children}`.trim();
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const renderHighlightedText = (text: string, keyword: string): ReactNode => {
  const term = keyword.trim();
  if (!term) return text;

  const regex = new RegExp(`(${escapeRegExp(term)})`, 'ig');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() !== term.toLowerCase()) return <Fragment key={`${part}-${index}`}>{part}</Fragment>;

    return (
      <mark key={`${part}-${index}`} className='rounded bg-yellow-200 px-0.5 text-primary'>
        {part}
      </mark>
    );
  });
};

export const getContentSnippet = (content: string, keyword: string, radius: number = 40): string => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return '';

  const normalizedContent = content.toLowerCase();
  const index = normalizedContent.indexOf(normalizedKeyword);
  if (index === -1) return '';

  const start = Math.max(0, index - radius);
  const end = Math.min(content.length, index + normalizedKeyword.length + radius);
  const snippet = content.slice(start, end).replace(/\s+/g, ' ').trim();

  return `${start > 0 ? '... ' : ''}${snippet}${end < content.length ? ' ...' : ''}`;
};
