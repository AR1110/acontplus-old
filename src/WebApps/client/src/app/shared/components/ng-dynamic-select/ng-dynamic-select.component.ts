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

    .select-wrapper {
      width: 100%;
    }

    .custom-select ::ng-deep .ng-select {
      border: 2px solid #6b7280;
      border-radius: 6px;
      min-height: 42px;
      font-size: 14px;
      background: white;
      transition: all 0.2s ease;
    }

    .custom-select ::ng-deep .ng-select:hover {
      border-color: #374151;
    }

    .custom-select ::ng-deep .ng-select.ng-select-focused {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      outline: none;
    }

    .custom-select ::ng-deep .ng-select.ng-select-disabled {
      background-color: #f9fafb;
      border-color: #e5e7eb;
      opacity: 0.6;
    }

    .custom-select ::ng-deep .ng-select-container {
      padding: 8px 12px;
      min-height: 40px;
    }

    .custom-select ::ng-deep .ng-placeholder {
      color: #9ca3af;
      font-size: 14px;
    }

    .custom-select ::ng-deep .ng-value-container {
      padding: 0;
      font-size: 14px;
      color: #374151;
    }

    .custom-select ::ng-deep .ng-arrow-wrapper {
      width: 20px;
      padding-right: 4px;
    }

    .custom-select ::ng-deep .ng-arrow-wrapper .ng-arrow {
      border-color: #6b7280 transparent transparent;
      border-width: 5px 5px 0;
    }

    .custom-select ::ng-deep .ng-clear-wrapper {
      padding-right: 4px;
    }

    .custom-select ::ng-deep .ng-clear-wrapper .ng-clear {
      font-size: 16px;
      color: #9ca3af;
    }

    .custom-select ::ng-deep .ng-clear-wrapper .ng-clear:hover {
      color: #6b7280;
    }

    .custom-select ::ng-deep .ng-dropdown-panel {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
      background: white;
      margin-top: 4px;
    }

    .custom-select ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items {
      max-height: 240px;
    }

    .custom-select ::ng-deep .ng-option {
      padding: 10px 12px;
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .custom-select ::ng-deep .ng-option:hover {
      background-color: #f3f4f6;
    }

    .custom-select ::ng-deep .ng-option.ng-option-selected {
      background-color: #eff6ff;
      color: #1d4ed8;
      font-weight: 500;
    }

    .custom-select ::ng-deep .ng-option.ng-option-highlighted {
      background-color: #f3f4f6;
    }

    .custom-select ::ng-deep .ng-option.ng-option-disabled {
      color: #9ca3af;
      cursor: not-allowed;
    }

    .custom-select ::ng-deep .ng-input input {
      font-size: 14px;
      color: #374151;
    }

    .custom-select ::ng-deep .ng-input input::placeholder {
      color: #9ca3af;
    }
  `,
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
