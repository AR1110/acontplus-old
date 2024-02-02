import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Tabulator } from 'tabulator-tables';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [],
  templateUrl: './order-detail.component.html',
  styles: ``,
})
export class OrderDetailComponent implements OnChanges {
  @Input() tableData: any[] = [];
  // @Input() columnNames: any[] = [];
  @Input() height: string = '311px';

  columnNames: any[] = [
    { title: 'Device', field: 'deviceName', width: 150 },
    { title: 'deviceId', field: 'deviceId', width: 150 },
  ];

  tab = document.createElement('div');

  ngOnChanges(changes: SimpleChanges): void {
    this.drawTable();
  }

  private drawTable(): void {
    console.log(this.columnNames)
    new Tabulator(this.tab, {
      data: this.tableData,
      reactiveData: true, //enable data reactivity
      columns: this.columnNames,
      layout: 'fitColumns',
      height: this.height,
    });
    let table = document.getElementById('order-table');
    if (table) {
      table.appendChild(this.tab);
    }
  }
}
