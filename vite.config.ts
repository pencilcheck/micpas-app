import path from 'path'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import WindiCSS from 'vite-plugin-windicss'
import { telefunc } from 'telefunc/vite'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react(), vike(), telefunc(), WindiCSS({
    scan: {
      // By default only `src/` is scanned
      dirs: ["components", "pages", "orm"],
      // We only have to specify the file extensions we actually use.
      fileExtensions: ["vue", "js", "ts", "jsx", "tsx"]
    }
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  }
}

export default config
