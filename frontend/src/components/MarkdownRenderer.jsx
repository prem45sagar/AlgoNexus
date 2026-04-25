import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";


const MarkdownRenderer = ({ content, className }) => {
  // Extend default schema to allow classes and specific tags used by our scraper
  const schema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), 'sup', 'sub', 'span'],
    attributes: {
      ...defaultSchema.attributes,
      div: [...(defaultSchema.attributes?.div || []), 'className', 'class'],
      span: [...(defaultSchema.attributes?.span || []), 'className', 'class'],
      code: [...(defaultSchema.attributes?.code || []), 'className', 'class'],
    }
  };

  return (/*#__PURE__*/
    _jsx("div", { className: cn("prose prose-invert prose-blue max-w-none", className), children: /*#__PURE__*/
      _jsx(ReactMarkdown, {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeRaw, [rehypeSanitize, schema], rehypeHighlight, rehypeKatex],
        components: {
          img({ node, ...props }) {
            if (!props.src) return null;

            return (/*#__PURE__*/
              _jsx("img", { ...
                props,
                className: "rounded-lg border border-slate-700 max-w-full h-auto my-4 shadow-lg",
                referrerPolicy: "no-referrer",
                loading: "lazy",
                onError: (e) => {
                  const target = e.target;
                  if (target.src.includes('picsum.photos')) return;
                  target.src = `https://picsum.photos/seed/${encodeURIComponent(props.alt || 'broken')}/800/400?blur=5`;
                  target.className = target.className + " opacity-50 grayscale";
                } }
              ));

          },
          a({ node, children, ...props }) {
            return (/*#__PURE__*/
              _jsx("a", { ...
                props,
                target: "_blank",
                rel: "noopener noreferrer", children:

                children }
              ));

          },
          blockquote({ node, children, ...props }) {
            return (/*#__PURE__*/
              _jsx("blockquote", { ...props, className: "bg-slate-900/50 border-l-4 border-slate-700/50 rounded-r-lg px-4 py-3 mt-1 mb-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap text-slate-300 [&>p]:m-0", children:
                children }
              ));
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const [copied, setCopied] = useState(false);

            const handleCopy = () => {
              navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            };

            return !inline && match ? /*#__PURE__*/
            _jsxs("div", { className: "relative group", children: [/*#__PURE__*/
              _jsx("div", { className: "absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10", children: /*#__PURE__*/
                _jsx("button", {
                  onClick: handleCopy,
                  className: "p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors flex items-center gap-1",
                  title: "Copy code", children:

                  copied ? /*#__PURE__*/_jsx(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /*#__PURE__*/_jsx(Copy, { className: "h-3.5 w-3.5" }) }
                ) }
              ), /*#__PURE__*/
              _jsx("code", { className: className, ...props, children:
                children }
              )] }
            ) : /*#__PURE__*/

            _jsx("code", { className: className, ...props, children:
              children }
            );

          }
        }, children:

        content || '*No content to display*' }
      ) }
    ));

};

export default MarkdownRenderer;