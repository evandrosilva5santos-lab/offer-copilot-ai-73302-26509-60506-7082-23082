import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logEnvironmentInfo } from "./lib/envManager";

// Log environment info on startup
logEnvironmentInfo();

createRoot(document.getElementById("root")!).render(<App />);
