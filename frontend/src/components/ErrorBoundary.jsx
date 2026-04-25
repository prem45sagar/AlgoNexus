import React, { Component } from 'react';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";










class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (/*#__PURE__*/
        _jsx("div", { className: "min-h-[400px] flex items-center justify-center p-6 text-center", children: /*#__PURE__*/
          _jsxs("div", { className: "max-w-md space-y-4", children: [/*#__PURE__*/
            _jsx("h2", { className: "text-2xl font-bold text-rose-500", children: "Something went wrong" }), /*#__PURE__*/
            _jsxs("p", { className: "text-slate-400", children: ["The application encountered an unexpected error.",

              this.state.error?.message && /*#__PURE__*/
              _jsx("code", { className: "block mt-2 p-2 bg-rose-500/10 rounded text-sm text-rose-400", children:
                this.state.error.message }
              )] }

            ), /*#__PURE__*/
            _jsx("button", {
              onClick: () => window.location.reload(),
              className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children:
              "Reload Page" }

            )] }
          ) }
        ));

    }

    return this.props.children;
  }
}

export default ErrorBoundary;