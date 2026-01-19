import {
  Component,
  Input,
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
    imports: [],
    templateUrl: './tabulator.component.html',
    styleUrls: ['./tabulator.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TabulatorComponent {
  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() height: string = '311px';
  @Input() dataTree: boolean = false;
  @Input() dataTreeChildField: string = 'childRows';
  @Input() dataTreeStartExpanded: boolean = false;
  @Input() reactiveData: boolean = true;

  tab = document.createElement('div');

  ngOnInit(): void {
    this.drawTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.drawTable();
    }
  }

  private drawTable(): void {
    new Tabulator(this.tab, {
      columns: this.columnNames,
      data: this.tableData,
      dataTree: this.dataTree,
      // dataTreeChildField: this.dataTreeChildField,
      dataTreeStartExpanded: this.dataTreeStartExpanded,
      //height: this.height,
      layout: 'fitColumns',
      reactiveData: this.reactiveData, //enable data reactivity
      //responsiveLayout: true,
    });
    let table = document.getElementById('tabulatorTable');
    if (table) {
      table.appendChild(this.tab);
    }
  }
}
