import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
  selector: 'app-tabulator-semantic-ui',
  standalone: true,
  imports: [],
  templateUrl: './tabulator-semantic-ui.component.html',
  styleUrls: ['./tabulator-semantic-ui.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabulatorSemanticUiComponent implements OnChanges {
  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];

  @Input() options = {};

  @Output() cellEdited = new EventEmitter();
  @Output() cellClick = new EventEmitter();

  uniqueIdTabulator = generateUuidv4();
  tab = document.createElement('div');

  refTabulator!: Tabulator;

  // ngOnInit(): void {
  //   this.drawTable();
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.drawTable();
    }
  }

  ngAfterViewInit() {
    this.drawTable();
  }

  updateData() {
    // this.refTabulator.updateData(this.tableData)
  }

  private drawTable(): void {
    this.refTabulator = new Tabulator(this.tab, {
      renderVerticalBuffer: 300,
      columns: this.columnNames,
      data: this.tableData,
      headerSort: false,
      layout: 'fitData',
      autoResize: true, // prevent auto resizing of table
      placeholder: 'Sin registro',

      ...this.options,
    });
    let table = document.getElementById(`${this.uniqueIdTabulator}`);

    if (table) {
      table.appendChild(this.tab);
      if (this.cellEdited) {
        this.refTabulator.on('cellEdited', (cell) => {
          this.cellEdited.emit(cell);
        });
      }

      if (this.cellClick) {
        this.refTabulator.on('rowClick', (cell, row) => {
          this.cellClick.emit(row);
        });
      }
    }
  }
}
