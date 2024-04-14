import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { PageModule, ReactiveDataModule, TabulatorFull as Tabulator } from 'tabulator-tables';

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
  @Input() height: string = '311px';
  @Input() dataTree: boolean = false;
  @Input() dataTreeChildField: string = 'childRows';
  @Input() dataTreeStartExpanded: boolean = false;

  @Input() options = {}

  @Output() cellEdited = new EventEmitter();
  @Output() cellClick = new EventEmitter();


  uniqueIdTabulator = generateUuidv4()
  tab = document.createElement('div');


  refTabulator!: Tabulator

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

  private drawTable(): void {
    this.refTabulator = new Tabulator(this.tab, {
      renderVerticalBuffer: 300,
      columns: this.columnNames,
      data: this.tableData,
      dataTree: this.dataTree,
      dataTreeSelectPropagate: true,
      headerSort: false,
      // dataTreeChildField: this.dataTreeChildField,
      dataTreeStartExpanded: this.dataTreeStartExpanded,
      height: this.height,
      layout: 'fitData',
      // reactiveData: true,
      //responsiveLayout: true,
      autoResize: true, // prevent auto resizing of table
      placeholder: "Sin registro",

      selectable: true,
      // selectableRangeMode: "click",
      // selectableRollingSelection: true,
      ...this.options
    });
    let table = document.getElementById(`${this.uniqueIdTabulator}`);
    console.log(table)
    if (table) {
      table.appendChild(this.tab);
      if (this.cellEdited) {
        this.refTabulator.on("cellEdited", (cell) => {
          this.cellEdited.emit(cell)
        })
      }

      if (this.cellClick) {
        this.refTabulator.on("rowClick", (cell, row) => {
          this.cellClick.emit(row)
        })
      }
    }
  }

  updateData() {
    // this.refTabulator.updateData(this.tableData)
  }

}
