import React from "react";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <div className="main">
        <div className="content">{children}</div>
      </div>
    </div>
  );
}