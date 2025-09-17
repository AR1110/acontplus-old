import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { PageModule, ReactiveDataModule, TabulatorFull as Tabulator } from 'tabulator-tables';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

Tabulator.registerModule([PageModule, ReactiveDataModule]);

@Component({
  selector: 'app-tabulator',
  templateUrl: './tabulator.component.html',
  styleUrls: ['./tabulator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabulatorComponent implements OnChanges, AfterViewInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tableData: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() columnNames: any[] = [];
  @Input() height: string | number | false | undefined = '311px';
  @Input() dataTree = false;
  @Input() dataTreeChildField = 'childRows';
  @Input() dataTreeStartExpanded = false;
  @Input() options: Record<string, unknown> = {};
  /**
   * theme: 'default' | 'semantic-ui' | 'bootstrap5' | ...
   * Controls which Tabulator CSS theme to use.
   */
  @Input() theme: 'default' | 'semantic-ui' = 'default';

  @Output() cellEdited = new EventEmitter<unknown>();
  @Output() cellClick = new EventEmitter<unknown>();

  uniqueIdTabulator: string = generateUuidv4();
  public get refTabulator(): Tabulator {
    return this._refTabulator;
  }
  private _refTabulator!: Tabulator;
  private readonly tabContainer: HTMLDivElement;

  constructor() {
    this.tabContainer = document.createElement('div');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && !changes['tableData'].isFirstChange()) {
      this.updateTableData();
    }
  }

  ngAfterViewInit(): void {
    // Initialize table after view is checked
    setTimeout(() => {
      this.initializeTable();
      this.applyTheme();
      this.registerEvents();
    });
  }

  ngOnDestroy(): void {
    if (this._refTabulator) {
      this._refTabulator.destroy();
    }
  }

  private applyTheme(): void {
    // No need to load CSS dynamically as it's now imported in styles.scss
    // Just set the theme class on the table container
    const container = document.getElementById(this.uniqueIdTabulator);
    if (container) {
      // Remove any existing theme classes
      container.classList.remove('tabulator-default', 'tabulator-sematicui');

      // Add the appropriate theme class
      if (this.theme === 'semantic-ui') {
        container.classList.add('tabulator-sematicui');
      } else {
        container.classList.add('tabulator-default');
      }
    }
  }

  private initializeTable(attempt = 0): void {
    // Safety check - don't try more than 5 times
    if (attempt > 5) {
      console.error('Failed to initialize Tabulator after multiple attempts');
      return;
    }

    const tableElement = document.getElementById(this.uniqueIdTabulator);
    if (!tableElement) {
      console.warn(
        `Table element with id ${this.uniqueIdTabulator} not found, retrying... (attempt ${attempt + 1}/5)`,
      );
      setTimeout(() => this.initializeTable(attempt + 1), 200);
      return;
    }

    try {
      // Clear any existing Tabulator instance
      if (this._refTabulator) {
        this._refTabulator.destroy();
      }

      // Clear the container
      while (this.tabContainer.firstChild) {
        this.tabContainer.removeChild(this.tabContainer.firstChild);
      }

      // Append the tab container to the target element
      tableElement.appendChild(this.tabContainer);

      this._refTabulator = new Tabulator(this.tabContainer, {
        renderVerticalBuffer: 300,
        columns: this.columnNames,
        data: this.tableData,
        dataTree: this.dataTree,
        dataTreeChildField: this.dataTreeChildField,
        renderVertical: 'virtual',
        dataTreeSelectPropagate: this.dataTree,
        dataTreeStartExpanded: this.dataTreeStartExpanded,
        height: this.height,
        layout: 'fitData',
        reactiveData: true,
        autoResize: true,
        placeholder: 'Sin registro',
        selectableRows: true,
        ...this.options,
      });

      this.registerEvents();
      console.log('Tabulator initialized successfully');
    } catch (error) {
      console.error('Error initializing Tabulator:', error);
      // Try to recover by destroying any partial initialization
      if (this._refTabulator) {
        try {
          this._refTabulator.destroy();
        } catch (e) {
          console.error('Error cleaning up failed Tabulator instance:', e);
        }
        this._refTabulator = null as any;
      }

      // Retry after a delay
      if (attempt < 5) {
        console.log(`Retrying Tabulator initialization (attempt ${attempt + 1}/5)...`);
        setTimeout(() => this.initializeTable(attempt + 1), 300);
      }
    }
  }

  private registerEvents(): void {
    this._refTabulator.on('cellEdited', (cell) => {
      this.cellEdited.emit(cell);
    });
    this._refTabulator.on('rowClick', (e, row) => {
      this.cellClick.emit(row);
    });
  }

  private updateTableData(): void {
    if (this._refTabulator) {
      this._refTabulator.replaceData(this.tableData);
    }
  }
}
