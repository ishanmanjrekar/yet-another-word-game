import type { Plugin } from 'vite';

export function stripCrossoriginPlugin(): Plugin {
  return {
    name: 'strip-crossorigin',
    transformIndexHtml(html: string) {
      // Itch.io sandbox blocks modules with crossorigin attributes.
      // This strips crossorigin from all <script type="module"> tags.
      return html.replace(/<script(.*?)crossorigin(.*?)>/g, '<script$1$2>');
    }
  };
}
