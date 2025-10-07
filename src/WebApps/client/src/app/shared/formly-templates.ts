import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';
import { AsyncPipe } from '@angular/common';

/**
 * This is just an example.
 */
@Component({
  selector: 'formly-field-combobox',
  template: `
    <mtx-select
      #select
      [formControl]="formControl"
      [items]="props.options | toObservable | async"
      [bindLabel]="bindLabel"
      [bindValue]="bindValue!"
      [multiple]="props.multiple"
      [placeholder]="props.placeholder!"
      [required]="props.required!"
      [closeOnSelect]="!props.multiple"
      [compareWith]="props.compareWith"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ReactiveFormsModule],
})
export class FormlyFieldCombobox extends FieldType<FieldTypeConfig> {
  @ViewChild('select', { static: true }) select!: MtxSelect;

  get bindLabel() {
    return typeof this.props.labelProp === 'string' ? this.props.labelProp : '';
  }

  get bindValue() {
    return typeof this.props.valueProp === 'string' ? this.props.valueProp : undefined;
  }
}
