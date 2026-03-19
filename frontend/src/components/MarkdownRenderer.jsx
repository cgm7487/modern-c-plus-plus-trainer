import React, { useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const categoryNames = {
  'cpp11-syntax': 'C++11 語法',
  'cpp14-17-20': 'C++14/17/20',
  'best-practices': 'Best Practices',
  'design-patterns': 'Design Patterns',
  'system-programming': '系統程式設計',
};

export { categoryNames };

function MarkdownRenderer({ content }) {
  if (!content) return null;

  const rendered = useMemo(() => parseMarkdown(content), [content]);

  return <div className="markdown-content">{rendered}</div>;
}

function parseMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'text';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <SyntaxHighlighter
          key={key++}
          language={lang === 'cpp' ? 'cpp' : lang}
          style={vscDarkPlus}
          customStyle={{
            background: '#1a1d27',
            borderRadius: '10px',
            padding: '1.2rem',
            margin: '1rem 0',
            border: '1px solid #2a2e3d',
            fontSize: '0.88rem',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        >
          {codeLines.join('\n')}
        </SyntaxHighlighter>
      );
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++}>{inlineFormat(line.slice(4))}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++}>{inlineFormat(line.slice(3))}</h2>);
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++}>{inlineFormat(line.slice(2))}</h1>);
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        listItems.push(
          <li key={key++}>{inlineFormat(lines[i].trim().slice(2))}</li>
        );
        i++;
      }
      elements.push(<ul key={key++}>{listItems}</ul>);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const text = lines[i].trim().replace(/^\d+\.\s/, '');
        listItems.push(<li key={key++}>{inlineFormat(text)}</li>);
        i++;
      }
      elements.push(<ol key={key++}>{listItems}</ol>);
      continue;
    }

    // Table
    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\|[\s-:|]+\|$/.test(lines[i + 1].trim())) {
      const tableRows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i].trim());
        i++;
      }
      if (tableRows.length >= 2) {
        const parseRow = (row) =>
          row.split('|').slice(1, -1).map(cell => cell.trim());
        const headers = parseRow(tableRows[0]);
        const bodyRows = tableRows.slice(2).map(parseRow);
        elements.push(
          <div key={key++} className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {headers.map((h, ci) => (
                    <th key={ci}>{inlineFormat(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>{inlineFormat(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].trim().startsWith('```') && !/^[-*]\s/.test(lines[i].trim()) && !/^\d+\.\s/.test(lines[i].trim()) && !lines[i].trim().startsWith('|')) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(<p key={key++}>{inlineFormat(paraLines.join(' '))}</p>);
    }
  }

  return elements;
}

function inlineFormat(text) {
  // Handle inline code, bold, italic
  const parts = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    // Inline code
    const codeMatch = remaining.match(/^(.*?)`([^`]+)`(.*)$/s);
    if (codeMatch) {
      if (codeMatch[1]) parts.push(formatBoldItalic(codeMatch[1], k++));
      parts.push(
        <code key={`code-${k++}`} className="inline-code">
          {codeMatch[2]}
        </code>
      );
      remaining = codeMatch[3];
      continue;
    }
    parts.push(formatBoldItalic(remaining, k++));
    break;
  }

  return parts;
}

function formatBoldItalic(text, baseKey) {
  // Bold
  const boldParts = text.split(/\*\*(.+?)\*\*/g);
  if (boldParts.length > 1) {
    return boldParts.map((part, i) =>
      i % 2 === 1 ? <strong key={`b-${baseKey}-${i}`}>{part}</strong> : part
    );
  }
  return text;
}

export default MarkdownRenderer;
