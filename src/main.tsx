import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global.scss";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
