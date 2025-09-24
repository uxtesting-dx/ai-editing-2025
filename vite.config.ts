import { defineConfig } from "vite";

// See https://vitejs.dev/config/.
export default defineConfig(({ mode }) => {
  let base = "";
  if (mode === "production") {
    base = "/experiments/stardust-labs-demo/";
  }
  return {
    base,
  };
});
