import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslatorPipe} from "@app/shared/pipes/translate";

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, TranslatorPipe],
  template: `
    <div class="search-input input-group input-group-sm w-auto">
      <label for="search-input-field" class="visually-hidden">{{ placeholder | translate }}</label>
      <input
        id="search-input-field"
        type="search"
        class="form-control"
        [placeholder]="placeholder | translate"
        [attr.aria-label]="placeholder | translate"
        [(ngModel)]="value"
        (ngModelChange)="valueChange.emit($event)"
      >
      <span class="input-group-text">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </div>
  `
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Search';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
