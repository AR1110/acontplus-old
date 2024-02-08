import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  TabulatorFull as Tabulator,
  PageModule,
  ReactiveDataModule,
} from 'tabulator-tables';
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

  tab = document.createElement('div');

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
    new Tabulator(this.tab, {
      data: this.tableData,
      reactiveData: true, //enable data reactivity
      columns: this.columnNames,
      layout: 'fitColumns',
      height: this.height,
    });
    let table = document.getElementById('tabulatorTable');
    if (table) {
      table.appendChild(this.tab);
    }
  }
}
