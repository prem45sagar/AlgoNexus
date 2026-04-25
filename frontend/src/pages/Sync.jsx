import React, { useState } from 'react';
import { localStore } from '../lib/api';
import { Copy, Check, Download, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export default function Sync() {
  const [syncCode, setSyncCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = async () => {
    const code = await localStore.exportData();
    setSyncCode(code);
  };

  const handleCopy = () => {
    if (!syncCode) return;
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Sync code copied to clipboard');
  };

  const handleImport = async () => {
    if (!importCode.trim()) {
      toast.error('Please paste a sync code first');
      return;
    }

    const success = await localStore.importData(importCode.trim());
    if (success) {
      toast.success('Data imported successfully! Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error('Invalid sync code. Please check and try again.');
    }
  };

  return (/*#__PURE__*/
    _jsxs("div", { className: "max-w-6xl mx-auto space-y-8", children: [/*#__PURE__*/
      _jsxs("header", { children: [/*#__PURE__*/
        _jsx("h1", { className: "text-3xl font-bold text-text-main", children: "Sync & Backup" }), /*#__PURE__*/
        _jsx("p", { className: "text-text-muted mt-2", children: "Your data is stored locally in this browser. Use these tools to move your data between systems or keep a backup." }

        )] }
      ), /*#__PURE__*/

      _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [/*#__PURE__*/

        _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-xl space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { className: "flex items-center gap-3 text-blue-400", children: [/*#__PURE__*/
            _jsx(Download, { className: "h-6 w-6" }), /*#__PURE__*/
            _jsx("h2", { className: "text-xl font-semibold text-text-main", children: "Export Data" })] }
          ), /*#__PURE__*/
          _jsx("p", { className: "text-sm text-text-muted", children: "Generate a unique sync code that contains all your problems, notes, and roadmaps." }

          ), /*#__PURE__*/

          _jsxs("button", {
            onClick: handleGenerateCode,
            className: "w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2", children: [/*#__PURE__*/

            _jsx(RefreshCw, { className: "h-4 w-4" }), "Generate Sync Code"] }

          ),

          syncCode && /*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-xs font-medium text-text-muted uppercase tracking-wider", children: "Your Sync Code" }), /*#__PURE__*/
            _jsxs("div", { className: "relative", children: [/*#__PURE__*/
              _jsx("textarea", {
                readOnly: true,
                value: syncCode,
                className: "w-full h-32 bg-bg-main border border-border-main rounded-lg p-3 text-xs font-mono text-text-main resize-none focus:outline-none" }
              ), /*#__PURE__*/
              _jsx("button", {
                onClick: handleCopy,
                className: "absolute top-2 right-2 p-2 bg-bg-surface border border-border-main rounded-md hover:bg-bg-main transition-colors", children:

                copied ? /*#__PURE__*/_jsx(Check, { className: "h-4 w-4 text-emerald-400" }) : /*#__PURE__*/_jsx(Copy, { className: "h-4 w-4 text-text-muted" }) }
              )] }
            )] }
          )] }

        ), /*#__PURE__*/


        _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-xl space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { className: "flex items-center gap-3 text-emerald-400", children: [/*#__PURE__*/
            _jsx(Upload, { className: "h-6 w-6" }), /*#__PURE__*/
            _jsx("h2", { className: "text-xl font-semibold text-text-main", children: "Import Data" })] }
          ), /*#__PURE__*/
          _jsxs("p", { className: "text-sm text-text-muted", children: ["Paste a sync code from another system to restore your data. ", /*#__PURE__*/
            _jsx("span", { className: "text-rose-400 font-medium", children: "Warning: This will overwrite your current local data." })] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-xs font-medium text-text-muted uppercase tracking-wider", children: "Paste Sync Code Here" }), /*#__PURE__*/
            _jsx("textarea", {
              value: importCode,
              onChange: (e) => setImportCode(e.target.value),
              placeholder: "Paste your code here...",
              className: "w-full h-32 bg-bg-main border border-border-main rounded-lg p-3 text-xs font-mono text-text-main resize-none focus:outline-none focus:border-emerald-500 transition-colors" }
            )] }
          ), /*#__PURE__*/

          _jsxs("button", {
            onClick: handleImport,
            disabled: !importCode.trim(),
            className: "w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2", children: [/*#__PURE__*/

            _jsx(Upload, { className: "h-4 w-4" }), "Import & Restore"] }

          )] }
        )] }
      ), /*#__PURE__*/

      _jsxs("div", { className: "bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex gap-4", children: [/*#__PURE__*/
        _jsx(AlertCircle, { className: "h-6 w-6 text-blue-400 shrink-0" }), /*#__PURE__*/
        _jsxs("div", { className: "space-y-1", children: [/*#__PURE__*/
          _jsx("h3", { className: "font-medium text-blue-400", children: "How it works" }), /*#__PURE__*/
          _jsx("p", { className: "text-sm text-text-muted leading-relaxed", children: "Since AlgoNexus runs entirely in your browser, your data stays on your device. The \"Sync Code\" is a portable version of your database. To move to a new computer, just export the code here, copy it, and import it on the other device." }

          )] }
        )] }
      )] }
    ));

}