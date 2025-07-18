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
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import {
  PageModule,
  ReactiveDataModule,
  TabulatorFull as Tabulator,
} from 'tabulator-tables';

// Register Tabulator modules
Tabulator.registerModule([PageModule, ReactiveDataModule]);

@Component({
  selector: 'app-tabulator-semantic-ui',
  templateUrl: './tabulator-semantic-ui.component.html',
  styleUrls: ['./tabulator-semantic-ui.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabulatorSemanticUiComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() options: Record<string, any> = {}; // Allows more flexibility by accepting a general options object

  @Output() cellEdited = new EventEmitter<any>();
  @Output() cellClick = new EventEmitter<any>();

  uniqueIdTabulator: string = generateUuidv4();
  private refTabulator!: Tabulator;
  private readonly tabContainer: HTMLDivElement;

  constructor() {
    this.tabContainer = document.createElement('div'); // Initialize the table container
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && !changes['tableData'].isFirstChange()) {
      // Efficiently update the data without redrawing the table
      this.updateTableData();
    }
  }

  ngAfterViewInit(): void {
    // Initialize the table after the view has been fully rendered
    this.initializeTable();
  }

  ngOnDestroy(): void {
    // Clean up the Tabulator instance to prevent memory leaks
    if (this.refTabulator) {
      this.refTabulator.destroy();
    }
  }

  private initializeTable(): void {
    const tableElement = document.getElementById(this.uniqueIdTabulator);
    if (!tableElement) {
      console.error(
        `Table element with id ${this.uniqueIdTabulator} not found.`,
      );
      return;
    }

    // Create Tabulator instance with configuration
    this.refTabulator = new Tabulator(this.tabContainer, {
      renderVerticalBuffer: 300,
      columns: this.columnNames,
      data: this.tableData,
      layout: 'fitData',
      placeholder: 'Sin registro',
      autoResize: true,
      ...this.options, // Spread user-defined options for flexibility
    });

    // Append the Tabulator DOM element to the parent container
    tableElement.appendChild(this.tabContainer);

    // Register event listeners
    this.registerEvents();
  }

  private registerEvents(): void {
    // Handle cell edited events
    this.refTabulator.on('cellEdited', (cell) => {
      this.cellEdited.emit(cell);
    });

    // Handle row click events
    this.refTabulator.on('rowClick', (e, row) => {
      this.cellClick.emit(row);
    });
  }

  private updateTableData(): void {
    // Efficiently update table data without redrawing the entire table
    if (this.refTabulator) {
      this.refTabulator.replaceData(this.tableData);
    }
  }
}
