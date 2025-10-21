import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslatorPipe} from "@app/shared/pipes/translate";

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, TranslatorPipe],
  template: `
    <div class="search-input input-group input-group-sm w-auto">
      <input
        type="text"
        class="form-control"
        [placeholder]="placeholder | translate"
        [(ngModel)]="value"
        (ngModelChange)="valueChange.emit($event)"
      >
      <span class="input-group-text">
        <i class="fas fa-search"></i>
      </span>
    </div>
  `
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Search';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
