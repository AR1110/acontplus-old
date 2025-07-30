import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '@shared/models/select-option';
import { NgSelectModule } from '@ng-select/ng-select';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  selectedValue = input<string | number | null>();
  className = input<string>('w-100');
  placeholder = input<string>();
  disabled = input<boolean>(false);
  clearable = input<boolean>(true);
  searchable = input<boolean>(true);

  // Output para emitir el valor
  selectionChange = output<string | number | null>();

  public selectControl = new FormControl<string | number | null>(null);
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
        const selectedOption = this.options().find((option) => option.value === value);
        if (selectedOption && this.selectControl.value !== selectedOption.value) {
          this.selectControl.setValue(selectedOption.value, {
            emitEvent: false,
          });
        }
      }
    });
  }

  ngOnInit() {
    this.selectControl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe((value) => {
      this.selectionChange.emit(value);
    });
  }

  onSelectionChange(value: string | number | null) {
    this.selectionChange.emit(value);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
