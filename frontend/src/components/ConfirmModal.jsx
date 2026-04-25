import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";











export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel"
}) {
  return (/*#__PURE__*/
    _jsx(AnimatePresence, { children:
      isOpen && /*#__PURE__*/
      _jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [/*#__PURE__*/
        _jsx(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
          onClick: onCancel }
        ), /*#__PURE__*/
        _jsx(motion.div, {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 },
          className: "relative w-full max-w-md overflow-hidden rounded-2xl bg-bg-surface border border-border-main shadow-2xl", children: /*#__PURE__*/

          _jsxs("div", { className: "p-6", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex items-start gap-4", children: [/*#__PURE__*/
              _jsx("div", { className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10", children: /*#__PURE__*/
                _jsx(AlertTriangle, { className: "h-5 w-5 text-red-500" }) }
              ), /*#__PURE__*/
              _jsxs("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsx("h3", { className: "text-lg font-semibold text-text-main", children: title }), /*#__PURE__*/
                _jsx("p", { className: "mt-2 text-sm text-text-muted", children: message })] }
              )] }
            ), /*#__PURE__*/
            _jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [/*#__PURE__*/
              _jsx("button", {
                onClick: onCancel,
                className: "rounded-lg px-4 py-2 text-sm font-medium text-text-muted hover:bg-bg-main hover:text-text-main transition-colors", children:

                cancelText }
              ), /*#__PURE__*/
              _jsx("button", {
                onClick: () => {
                  onConfirm();
                  onCancel();
                },
                className: "rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors", children:

                confirmText }
              )] }
            )] }
          ) }
        )] }
      ) }

    ));

}