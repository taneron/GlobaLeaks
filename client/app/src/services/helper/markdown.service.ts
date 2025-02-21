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
      // Safely extract text from tokens array (assuming it's available)
      let text = '';
      if (tokens && tokens[0] && tokens[0].text) {
        text = tokens[0].text; // Extract the text from the first token
      }

      // Check if the text contains an image tag (Markdown image syntax is wrapped in `![](...)`)
      const isImage = text.startsWith('![') && text.includes('](');

      if (isImage) {
        // Extract the image Markdown (e.g., ![Alt](src))
        const match = text.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          const alt = match[1]; // Alt text
          const src = match[2]; // Image URL
          // Render clickable image
          return `<a target="_blank" href="${href}"><img src="${src}" alt="${alt}" /></a>`;
        }
      }

      // Fallback to standard link rendering for non-image links
      return `<a target="_blank" href="${href}" ${title ? ` title="${title}"` : ""}>${text}</a>`;
    };

    return customRenderer;
  }
}
