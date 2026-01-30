import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig(({ command }) => {
  return {
    base: "./",

    plugins: [
      command === 'build' ? viteSingleFile() : null
    ].filter(Boolean), // remove null
  }
})

