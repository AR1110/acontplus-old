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
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgDynamicSelectComponent implements OnInit, OnDestroy {
  // Basic inputs
  label = input<string>('Seleccione una opción');
  options = input.required<SelectOption[]>();
  selectedValue = input<string | number | null>();
  className = input<string>('w-100');
  placeholder = input<string>();
  disabled = input<boolean>(false);
  clearable = input<boolean>(true);
  searchable = input<boolean>(true);

  // Advanced ng-select inputs
  virtualScroll = input<boolean>(false);
  dropdownPosition = input<'bottom' | 'top' | 'auto'>('auto');
  closeOnSelect = input<boolean>(true);
  hideSelected = input<boolean>(false);
  multiple = input<boolean>(false);
  selectOnTab = input<boolean>(false);
  openOnEnter = input<boolean>(true);
  selectableGroup = input<boolean>(false);
  selectableGroupAsModel = input<boolean>(true);
  clearOnBackspace = input<boolean>(true);
  readonly = input<boolean>(false);
  searchWhileComposing = input<boolean>(true);
  minTermLength = input<number>(0);
  editableSearchTerm = input<boolean>(false);
  typeToSearchText = input<string>('Type to search');
  addTagText = input<string>('Add item');
  loadingText = input<string>('Loading...');
  clearAllText = input<string>('Clear all');
  notFoundText = input<string>('No items found');

  // Output
  selectionChange = output<string | number | null>();

  public selectControl = new FormControl<string | number | null>(null);
  public filteredOptions: SelectOption[] = [];
  public loading = false;

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
    // Handle initial value if provided
    if (this.selectedValue() !== undefined && this.selectedValue() !== null) {
      const selectedOption = this.options().find(opt => opt.value === this.selectedValue());
      if (selectedOption) {
        this.selectControl.setValue(selectedOption.value, { emitEvent: false });
      }
    }
  }

  onSelectionChange(value: string | number | null) {
    // Only emit if the value actually changed to prevent duplicate events
    if (this.selectControl.value !== value) {
      this.selectionChange.emit(value);
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
