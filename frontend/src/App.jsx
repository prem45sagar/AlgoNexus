/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Problems from './pages/Problems';
import Notes from './pages/Notes';
import Roadmaps from './pages/Roadmaps';
import Dashboard from './pages/Dashboard';
import Sync from './pages/Sync';
import ErrorBoundary from './components/ErrorBoundary';
import { useThemeStore } from './lib/store';
import { Toaster } from 'sonner';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (/*#__PURE__*/
    _jsxs(ErrorBoundary, { children: [/*#__PURE__*/
      _jsx(Toaster, { position: "top-right", richColors: true }), /*#__PURE__*/
      _jsx(Router, { children: /*#__PURE__*/
        _jsx(Layout, { children: /*#__PURE__*/
          _jsxs(Routes, { children: [/*#__PURE__*/
            _jsx(Route, { path: "/", element: /*#__PURE__*/_jsx(Home, {}) }), /*#__PURE__*/
            _jsx(Route, { path: "/dashboard", element: /*#__PURE__*/_jsx(Dashboard, {}) }), /*#__PURE__*/
            _jsx(Route, { path: "/problems", element: /*#__PURE__*/_jsx(Problems, {}) }), /*#__PURE__*/
            _jsx(Route, { path: "/notes", element: /*#__PURE__*/_jsx(Notes, {}) }), /*#__PURE__*/
            _jsx(Route, { path: "/roadmaps", element: /*#__PURE__*/_jsx(Roadmaps, {}) }), /*#__PURE__*/
            _jsx(Route, { path: "/sync", element: /*#__PURE__*/_jsx(Sync, {}) }), /*#__PURE__*/


            _jsx(Route, { path: "*", element: /*#__PURE__*/_jsx(Navigate, { to: "/", replace: true }) })] }
          ) }
        ) }
      )] }
    ));

}