import { Injectable } from '@angular/core';
import { Renderer } from 'marked';

interface Link {
  href: string;
  title?: string | null;
  tokens?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class MarkdownRendererService {
  constructor() {}

  getCustomRenderer(): Renderer {
    const customRenderer = new Renderer();

    customRenderer.link = ({ href, title, tokens }: Link): string => {
      let text = ''
      if (tokens && tokens[0] && tokens[0].raw) {
        text = tokens[0].raw;
      }

      // Extract the image Markdown (e.g., ![Alt](src))
      const match = text.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        const alt = match[1]; // Alt text
        const src = match[2]; // Image URL
        return `<a target="_blank" href="${href}"><img src="${src}" alt="${alt}" /></a>`;
      }

      // Fallback to standard link rendering for non-image links
      return `<a target="_blank" href="${href}" ${title ? ` title="${title}"` : ""}>${text}</a>`;
    };

    return customRenderer;
  }
}
