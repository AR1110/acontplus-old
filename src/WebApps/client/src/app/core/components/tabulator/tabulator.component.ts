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
    this.applyTheme();
    this.initializeTable();
  }

  ngOnDestroy(): void {
    if (this._refTabulator) {
      this._refTabulator.destroy();
    }
  }

  private applyTheme(): void {
    // Remove any previous Tabulator theme CSS
    const themeLinks = Array.from(document.querySelectorAll('link[data-tabulator-theme]'));
    themeLinks.forEach(link => link.parentNode?.removeChild(link));
    // Add the selected theme
    let themeHref = '';
    switch (this.theme) {
      case 'semantic-ui':
        themeHref = 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
        break;
      case 'default':
      default:
        themeHref = 'tabulator-tables/dist/css/tabulator.min.css';
        break;
    }
    if (themeHref) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = themeHref;
      link.setAttribute('data-tabulator-theme', this.theme);
      document.head.appendChild(link);
    }
  }

  private initializeTable(): void {
    const tableElement = document.getElementById(this.uniqueIdTabulator);
    if (!tableElement) {
      console.error(`Table element with id ${this.uniqueIdTabulator} not found.`);
      return;
    }
    this._refTabulator = new Tabulator(this.tabContainer, {
      renderVerticalBuffer: 300,
      columns: this.columnNames,
      data: this.tableData,
      dataTree: this.dataTree,
      dataTreeChildField: this.dataTreeChildField,
      dataTreeSelectPropagate: true,
      dataTreeStartExpanded: this.dataTreeStartExpanded,
      height: this.height,
      layout: 'fitData',
      reactiveData: true,
      autoResize: true,
      placeholder: 'Sin registro',
      selectableRows: true,
      ...this.options,
    });
    tableElement.appendChild(this.tabContainer);
    this.registerEvents();
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
