import {Pipe, PipeTransform} from "@angular/core";
import DOMPurify from 'dompurify';

@Pipe({
    name: "stripHtml",
    standalone: true
})
export class StripHtmlPipe implements PipeTransform {

  transform(input: string): string {
    return (DOMPurify.sanitize(input, {ALLOWED_TAGS: [], ALLOWED_ATTR: []}) as unknown) as string;
  }
}
