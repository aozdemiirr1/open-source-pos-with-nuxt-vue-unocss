import { defineConfig } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  transformers: [
    transformerDirectives(),
  ],
  // ...UnoCSS options
})