import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxs("div", { style: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f8f9fa"
      }, children: [
        /* @__PURE__ */ jsx("h1", { style: { color: "#800000", fontSize: "24px", fontWeight: "800" }, children: "Something went wrong." }),
        /* @__PURE__ */ jsx("p", { style: { margin: "16px 0", color: "#666", fontSize: "14px" }, children: "We encountered a rendering error. Please try refreshing the page." }),
        /* @__PURE__ */ jsx("pre", { style: {
          padding: "16px",
          backgroundColor: "#eee",
          borderRadius: "6px",
          fontSize: "11px",
          color: "#333",
          textAlign: "left",
          maxWidth: "100%",
          overflow: "auto"
        }, children: this.state.error?.toString() }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            style: {
              marginTop: "24px",
              padding: "10px 24px",
              backgroundColor: "#800000",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: "600",
              cursor: "pointer"
            },
            children: "Refresh Page"
          }
        )
      ] });
    }
    return this.props.children;
  }
}
var ErrorBoundary_default = ErrorBoundary;
export {
  ErrorBoundary_default as default
};
