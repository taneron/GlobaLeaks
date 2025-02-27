import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[autoExpand]'
})
export class AutoExpandDirective implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.adjustHeight();
  }

  @HostListener('input') onInput() {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const textarea = this.el.nativeElement as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
