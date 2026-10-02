// Plugin de Vite (solo build): apunta el preload del hero al contenido publicado en Supabase.
import { existsSync, readFileSync } from 'node:fs'
import { buildSiteContent } from '../src/lib/mergeContent.js'
import { heroPreloadFor, rewriteHeroPreload } from '../src/lib/heroPreload.js'

function readGenerated(file) {
  if (!existsSync(file)) return null
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

export default function heroPreloadPlugin({ file }) {
  return {
    name: 'calma-hero-preload',
    apply: 'build',
    transformIndexHtml(html) {
      const generated = readGenerated(file)
      if (!generated) return html
      return rewriteHeroPreload(html, heroPreloadFor(buildSiteContent(generated)))
    },
  }
}
