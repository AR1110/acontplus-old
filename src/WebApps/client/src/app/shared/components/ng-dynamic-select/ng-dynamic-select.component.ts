import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SelectOption } from '@shared/models/select-option';
import { Subject } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-ng-dynamic-select',
  imports: [NgSelectModule, ReactiveFormsModule],
  templateUrl: './ng-dynamic-select.component.html',
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgDynamicSelectComponent implements OnInit, OnDestroy {
  // Inputs configurables
  label = input<string>('Seleccione una opción');
  options = input.required<SelectOption[]>();
  selectedValue = input<any>();
  className = input<string>('w-100');

  // Output para emitir el valor
  selectionChange = output<any>();

  public selectControl = new FormControl<any | null>(null);
  public filteredOptions: SelectOption[] = [];

  private _onDestroy = new Subject<void>();

  constructor() {
    // Sincroniza las opciones
    effect(() => {
      const opts = this.options();
      this.filteredOptions = opts ?? [];
    });

    // Sincroniza el valor seleccionado externamente
    effect(() => {
      const value = this.selectedValue();
      if (value !== undefined && value !== null) {
        const selectedOption = this.options().find(
          (option) =>
            option.value === value ||
            (typeof value === 'object' && option.value === value.value),
        );
        if (
          selectedOption &&
          this.selectControl.value !== selectedOption.value
        ) {
          this.selectControl.setValue(selectedOption.value, {
            emitEvent: false,
          });
        }
      }
    });
  }

  ngOnInit() {
    this.selectControl.valueChanges.subscribe((value) => {
      this.selectionChange.emit(value);
    });
  }

  onSelectionChange(value: any) {
    this.selectionChange.emit(value);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
