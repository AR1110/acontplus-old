import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { PageModule, ReactiveDataModule, TabulatorFull as Tabulator } from 'tabulator-tables';

Tabulator.registerModule([PageModule, ReactiveDataModule]);

@Component({
    selector: 'app-tabulator',
    imports: [],
    templateUrl: './tabulator.component.html',
    styleUrls: ['./tabulator.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TabulatorComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() height: string = '311px';
  @Input() dataTree: boolean = false;
  @Input() dataTreeChildField: string = 'childRows';
  @Input() dataTreeStartExpanded: boolean = false;

  @Input() options: Record<string, any> = {}; // Allows more flexibility by accepting a general options object

  @Output() cellEdited = new EventEmitter<any>();
  @Output() cellClick = new EventEmitter<any>();

  uniqueIdTabulator: string = generateUuidv4();
  refTabulator!: Tabulator;
  private readonly tabContainer: HTMLDivElement;

  constructor() {
    this.tabContainer = document.createElement('div'); // Initialize the table container
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && !changes['tableData'].isFirstChange()) {
      console.log('ngOnChanges tabulator ')
      // Efficiently update the data without redrawing the table
      this.updateTableData();
    }
  }

  ngAfterViewInit(): void {
      this.initializeTable();
  }




  private initializeTable(): void {
    const tableElement = document.getElementById(this.uniqueIdTabulator);
    if (!tableElement) {
      console.error(
        `Table element with id ${this.uniqueIdTabulator} not found.`,
      );
      return;
    }

    this.refTabulator = new Tabulator(this.tabContainer, {
      renderVerticalBuffer: 300,
      columns: this.columnNames,
      data: this.tableData,
      dataTree: this.dataTree,
      dataTreeSelectPropagate: true,
      dataTreeStartExpanded: this.dataTreeStartExpanded,
      height: this.height,
      layout: 'fitData',
      reactiveData: true,
      autoResize: true, // prevent auto resizing of table
      placeholder: 'Sin registro',
      selectable: true,
      ...this.options,
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


  ngOnDestroy(): void {
    if (this.refTabulator) {
      this.refTabulator.destroy();
    }
  }
}
