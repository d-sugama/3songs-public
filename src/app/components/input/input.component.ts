import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() control: FormControl = new FormControl();

  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  /**
   * バリデーションチェック
   */
  isInvalid() {
    return this.control.invalid && this.control.touched;
  }
}
