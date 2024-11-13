import { defineConfig } from "vite"
import path from "path"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      formats: ["cjs", "es"],
      fileName: (format) => `colors.${format}.js`,
      entry: path.resolve(__dirname, "src/colors.ts"),
    },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
    }),
  ],
})
