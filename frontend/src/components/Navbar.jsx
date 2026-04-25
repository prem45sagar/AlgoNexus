import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, ShieldCheck, BookOpen, Map, Menu, X, LayoutDashboard, Sun, Moon, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useThemeStore } from '../lib/store';import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/problems', label: 'Problems', icon: ShieldCheck },
  { to: '/notes', label: 'Notes', icon: BookOpen },
  { to: '/roadmaps', label: 'Roadmaps', icon: Map },
  { to: '/sync', label: 'Sync', icon: RefreshCw }];


  return (/*#__PURE__*/
    _jsxs("nav", { className: "sticky top-0 z-50 w-full border-b border-border-main bg-bg-main/80 backdrop-blur-md", children: [/*#__PURE__*/
      _jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [/*#__PURE__*/
        _jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [/*#__PURE__*/
          _jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 border border-brand-primary/20 group-hover:border-brand-primary/50 transition-colors", children: /*#__PURE__*/
            _jsx(Terminal, { className: "h-6 w-6 text-brand-primary" }) }
          ), /*#__PURE__*/
          _jsxs("span", { className: "text-xl font-bold tracking-tight text-text-main", children: ["Algo", /*#__PURE__*/
            _jsx("span", { className: "text-brand-primary", children: "Nexus" })] }
          )] }
        ), /*#__PURE__*/


        _jsxs("div", { className: "hidden md:flex items-center gap-6", children: [/*#__PURE__*/
          _jsx("div", { className: "flex items-center gap-3", children:
            navLinks.map((link) => /*#__PURE__*/
            _jsxs(Link, {

              to: link.to,
              className: cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all border",
                location.pathname === link.to ?
                "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-sm shadow-brand-primary/10" :
                "bg-bg-surface border-border-main text-text-muted hover:bg-bg-surface/80 hover:text-text-main"
              ), children: [/*#__PURE__*/

              _jsx(link.icon, { className: "h-3.5 w-3.5" }),
              link.label] }, link.to
            )
            ) }
          ), /*#__PURE__*/

          _jsx("div", { className: "h-6 w-px bg-border-main mx-2" }), /*#__PURE__*/

          _jsx("button", {
            onClick: toggleTheme,
            className: "p-2 rounded-full bg-bg-surface border border-border-main text-text-muted hover:text-text-main transition-all",
            "aria-label": "Toggle theme", children:

            theme === 'dark' ? /*#__PURE__*/_jsx(Sun, { className: "h-4 w-4" }) : /*#__PURE__*/_jsx(Moon, { className: "h-4 w-4" }) }
          )] }
        ), /*#__PURE__*/


        _jsx("button", {
          onClick: () => setIsMenuOpen(!isMenuOpen),
          className: "md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all", children:

          isMenuOpen ? /*#__PURE__*/_jsx(X, { className: "h-6 w-6" }) : /*#__PURE__*/_jsx(Menu, { className: "h-6 w-6" }) }
        )] }
      ), /*#__PURE__*/


      _jsx(AnimatePresence, { children:
        isMenuOpen && /*#__PURE__*/
        _jsx(motion.div, {
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: 'auto' },
          exit: { opacity: 0, height: 0 },
          className: "md:hidden border-t border-border-main bg-bg-main/95 backdrop-blur-xl overflow-hidden", children: /*#__PURE__*/

          _jsxs("div", { className: "px-4 py-6 space-y-4", children: [
            navLinks.map((link) => /*#__PURE__*/
            _jsxs(Link, {

              to: link.to,
              onClick: () => setIsMenuOpen(false),
              className: cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                location.pathname === link.to ?
                "bg-brand-primary/10 text-brand-primary" :
                "text-text-muted hover:bg-bg-surface"
              ), children: [/*#__PURE__*/

              _jsx(link.icon, { className: "h-5 w-5" }),
              link.label] }, link.to
            )
            ), /*#__PURE__*/

            _jsx("div", { className: "pt-4 border-t border-border-main space-y-4", children: /*#__PURE__*/
              _jsx("button", {
                onClick: toggleTheme,
                className: "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-bg-surface transition-all", children:

                theme === 'dark' ? /*#__PURE__*/
                _jsxs(_Fragment, { children: [/*#__PURE__*/
                  _jsx(Sun, { className: "h-5 w-5" }), "Light Mode"] }

                ) : /*#__PURE__*/

                _jsxs(_Fragment, { children: [/*#__PURE__*/
                  _jsx(Moon, { className: "h-5 w-5" }), "Dark Mode"] }

                ) }

              ) }
            )] }
          ) }
        ) }

      )] }
    ));

}