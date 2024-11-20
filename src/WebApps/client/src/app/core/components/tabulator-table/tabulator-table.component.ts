import { Component, ElementRef,  effect, signal, ViewChild, Input, WritableSignal, runInInjectionContext, EnvironmentInjector } from '@angular/core';
// Importa Tabulator desde la librería principal
import { ColumnDefinition, Options } from 'tabulator-tables';  // Importa los tipos correctos
import {
  TabulatorFull as Tabulator,
} from 'tabulator-tables';

@Component({
    selector: 'app-tabulator-table',
    imports: [],
    templateUrl: './tabulator-table.component.html',
    styles: ``
})
export class TabulatorTableComponent {
  @ViewChild('tabulatorTable', { static: false }) tabulatorTable!: ElementRef;

  columns: WritableSignal<ColumnDefinition[]> = signal([]);
  data: WritableSignal<any[]> = signal([]);
  options: WritableSignal<Options> = signal({});

  private table!: Tabulator;

  constructor(private injector: EnvironmentInjector) { }

  ngAfterViewInit(): void {
    console.log('TabulatorTable component view initialized');
    console.log('Tabulator table element:', this.tabulatorTable);

    // Asegúrate de que el elemento no sea nulo antes de inicializar Tabulator
    if (this.tabulatorTable && this.tabulatorTable.nativeElement) {
      this.initializeTabulator();

      runInInjectionContext(this.injector, () => {
        // Efecto que se ejecuta cada vez que las columnas cambian
        effect(() => {
          if (this.table) {
            this.table.setColumns(this.columns());
          }
        });

        // Efecto que se ejecuta cada vez que los datos cambian
        effect(() => {
          if (this.table) {
            this.table.replaceData(this.data());
          }
        });

        // Efecto que se ejecuta cuando las opciones cambian
        effect(() => {
          if (this.table) {
            this.updateOptions();
          }
        });
      });
    } else {
      console.error('Tabulator table element is not available.');
    }
  }

  ngOnDestroy(): void {
    if (this.table) {
      this.table.destroy();
    }
  }

  initializeTabulator(): void {
    if (this.tabulatorTable && this.tabulatorTable.nativeElement) {
      this.table = new Tabulator(this.tabulatorTable.nativeElement, {
        data: this.data(),
        columns: this.columns(),
        ...this.options(),
      });
    }
  }

  updateOptions(): void {
    const options = this.options();
    if (options.paginationSize) {
      this.table.setPageSize(options.paginationSize);
    }
  }

}
