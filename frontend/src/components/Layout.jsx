import React from 'react';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";





export default function Layout({ children }) {
  return (/*#__PURE__*/
    _jsxs("div", { className: "min-h-screen flex flex-col", children: [/*#__PURE__*/
      _jsx(Navbar, {}), /*#__PURE__*/
      _jsx("main", { className: "flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /*#__PURE__*/
        _jsx(AnimatePresence, { mode: "wait", children: /*#__PURE__*/
          _jsx(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.4, ease: "easeOut" }, children:

            children }
          ) }
        ) }
      ), /*#__PURE__*/
      _jsx("footer", { className: "border-t border-border-main py-12 bg-bg-surface/50", children: /*#__PURE__*/
        _jsx("div", { className: "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8", children: /*#__PURE__*/
          _jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity", children: [/*#__PURE__*/
              _jsx(Terminal, { className: "h-5 w-5 text-brand-primary" }), /*#__PURE__*/
              _jsx("span", { className: "text-sm font-black text-text-main tracking-tighter uppercase", children: "AlgoNexus" })] }
            ), /*#__PURE__*/

            _jsxs("div", { className: "flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]", children: [/*#__PURE__*/
              _jsx(Link, { to: "/problems", className: "hover:text-text-main transition-colors", children: "Problems" }), /*#__PURE__*/
              _jsx(Link, { to: "/notes", className: "hover:text-text-main transition-colors", children: "Notes" }), /*#__PURE__*/
              _jsx(Link, { to: "/roadmaps", className: "hover:text-text-main transition-colors", children: "Roadmaps" }), /*#__PURE__*/
              _jsx(Link, { to: "/dashboard", className: "hover:text-text-main transition-colors", children: "Dashboard" }), /*#__PURE__*/
              _jsx(Link, { to: "/sync", className: "hover:text-text-main transition-colors", children: "Sync" })] }
            ), /*#__PURE__*/

            _jsxs("p", { className: "text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]", children: ["\xA9 ",
              new Date().getFullYear(), " AlgoNexus. Built for the next generation."] }
            )] }
          ) }
        ) }
      )] }
    ));

}