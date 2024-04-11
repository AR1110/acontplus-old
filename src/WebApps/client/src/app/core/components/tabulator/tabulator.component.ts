import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { PageModule, ReactiveDataModule, TabulatorFull as Tabulator } from 'tabulator-tables';

Tabulator.registerModule([PageModule, ReactiveDataModule]);

@Component({
  selector: 'app-tabulator',
  standalone: true,
  imports: [],
  templateUrl: './tabulator.component.html',
  styleUrls: ['./tabulator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabulatorComponent implements OnChanges, OnInit {
  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() height: string = '311px';
  @Input() dataTree: boolean = false;
  @Input() dataTreeChildField: string = 'childRows';
  @Input() dataTreeStartExpanded: boolean = false;

  @Output() cellEdited = new EventEmitter();
  @Output() cellClick = new EventEmitter();


  tab = document.createElement('div');

  refTabulator!: Tabulator

  ngOnInit(): void {
    this.drawTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.drawTable();
    }
  }

  ngOnit() {
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
      placeholder: "No Data Set",

       selectable: true,
      // selectableRangeMode: "click",
      // selectableRollingSelection: true,
    });
    let table = document.getElementById('tabulatorTable');
    if (table) {
      table.appendChild(this.tab);
      if(this.cellEdited){
        this.refTabulator.on("cellEdited", (cell)=>{
          this.cellEdited.emit(cell)
        })
      }

      if (this.cellClick){
        this.refTabulator.on("rowClick",(cell, row)=>{
          this.cellClick.emit(row)
        })
      }
    }
  }

  updateData(){
    // this.refTabulator.updateData(this.tableData)
  }

}
