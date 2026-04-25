import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { cn } from '../lib/utils';

// Import styles for the editor
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';import { jsx as _jsx } from "react/jsx-runtime";










const MarkdownEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className,
  minHeight = "500px",
  showTemplateButton = true
}) => {
  return (/*#__PURE__*/
    _jsx("div", { className: cn("w-full", className), "data-color-mode": "dark", children: /*#__PURE__*/
      _jsx(MDEditor, {
        value: value,
        onChange: (val) => onChange(val || ''),
        preview: "live",
        height: parseInt(minHeight),
        textareaProps: {
          placeholder: placeholder
        },
        style: { fontSize: '16px' },
        className: "rounded-xl border border-slate-700 overflow-hidden" }
      ) }
    ));

};

export default MarkdownEditor;