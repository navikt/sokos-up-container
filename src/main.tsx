import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./main.css";

const startMsw = async () => {
  if (import.meta.env.MODE === "mock") {
    try {
      const { worker } = await import("../mock/browser");
      await worker.start({
        onUnhandledRequest: "bypass", // Bypass all unhandled requests
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to start MSW", error);
    }
  }
};

startMsw().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
});
