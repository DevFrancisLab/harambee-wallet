// bring in global polyfills before anything else
import "./polyfills";

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Unregister any existing service workers in development to avoid stale cached assets
if (import.meta.env.DEV && typeof navigator !== "undefined" && "serviceWorker" in navigator) {
	navigator.serviceWorker
		.getRegistrations()
		.then((regs) => {
			regs.forEach((r) => {
				try {
					r.unregister();
				} catch (e) {
					// ignore
				}
			});
		})
		.catch(() => {});
}

createRoot(document.getElementById("root")!).render(<App />);
