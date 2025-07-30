import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
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

    /* Main select styling */
    .custom-select {
      border: 1px solid #d1d5db;
      border-radius: 4px;
      min-height: 38px;
      font-size: 14px;
      background: white;
      transition: all 0.2s ease;
    }

    .custom-select:hover {
      border-color: #9ca3af;
    }

    .custom-select.ng-select-focused {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
      outline: none;
    }

    .custom-select.ng-select-disabled {
      background-color: #f9fafb;
      border-color: #e5e7eb;
      opacity: 0.6;
    }

    /* Container styling */
    .custom-select .ng-select-container {
      padding: 6px 12px;
      min-height: 36px;
    }

    .custom-select .ng-placeholder {
      color: #9ca3af;
      font-size: 14px;
    }

    .custom-select .ng-value-container {
      padding: 0;
      font-size: 14px;
      color: #374151;
    }

    /* Arrow and clear button styling */
    .custom-select .ng-arrow-wrapper {
      width: 20px;
      padding-right: 4px;
    }

    .custom-select .ng-arrow-wrapper .ng-arrow {
      border-color: #6b7280 transparent transparent;
      border-width: 5px 5px 0;
    }

    .custom-select .ng-clear-wrapper {
      padding-right: 4px;
    }

    .custom-select .ng-clear-wrapper .ng-clear {
      font-size: 16px;
      color: #9ca3af;
    }

    .custom-select .ng-clear-wrapper .ng-clear:hover {
      color: #6b7280;
    }

    /* Dropdown panel styling */
    .custom-select .ng-dropdown-panel {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
      background: white;
      margin-top: 4px;
      z-index: 1050;
    }

    .custom-select .ng-dropdown-panel .ng-dropdown-panel-items {
      max-height: 240px;
    }

    /* Option styling - this is the key part that was broken */
    .custom-select .ng-option {
      padding: 10px 12px !important;
      font-size: 14px !important;
      color: #374151 !important;
      cursor: pointer !important;
      transition: background-color 0.15s ease !important;
      background: white !important;
      border: none !important;
      line-height: 1.4 !important;
    }

    .custom-select .ng-option:hover {
      background-color: #f3f4f6 !important;
    }

    .custom-select .ng-option.ng-option-selected {
      background-color: #eff6ff !important;
      color: #1d4ed8 !important;
      font-weight: 500 !important;
    }

    .custom-select .ng-option.ng-option-highlighted {
      background-color: #f3f4f6 !important;
    }

    .custom-select .ng-option.ng-option-disabled {
      color: #9ca3af !important;
      cursor: not-allowed !important;
    }

    /* Input styling */
    .custom-select .ng-input input {
      font-size: 14px;
      color: #374151;
    }

    .custom-select .ng-input input::placeholder {
      color: #9ca3af;
    }

    /* Additional styling for .custom class compatibility */
    .ng-select.custom {
      border: 1px solid #d1d5db !important;
      min-height: 38px !important;
      border-radius: 4px !important;
    }

    .ng-select.custom .ng-select-container {
      min-height: 36px !important;
      border-radius: 4px !important;
    }

    .ng-select.custom:hover {
      border-color: #9ca3af !important;
    }

    .ng-select.custom.ng-select-focused {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
