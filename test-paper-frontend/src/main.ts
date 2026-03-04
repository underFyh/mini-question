import { createSSRApp } from "vue";
import App from "./App.vue";
import "./lib/front.css";

// import 'uno.css'

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
