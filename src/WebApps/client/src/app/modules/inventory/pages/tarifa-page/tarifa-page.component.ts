import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { ModalService } from '@core/services/modal.service';
import { TarifaService } from '@modules/inventory/services/tarifa.service';
import { MatPagination } from '@shared/models/pagination.model';
import { PrimaryStatusPipe } from '@shared/pipe/primary-status.pipe';
import { TarifaEditModalComponent } from './tarifa-edit-modal/tarifa-edit-modal.component';

@Component({
  selector: 'app-tarifa-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    PrimaryStatusPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    CustomTableContainerComponent,
  ],
  templateUrl: './tarifa-page.component.html',
  styles: ``
})
export class TarifaPageComponent {
  tarifaSvc = inject(TarifaService);
  private modalSvc = inject(ModalService)


  displayedColumns: string[] = ['index', 'op', 'code', 'description','default','ventaPorMayor', 'estado'];

  dataSource = signal<any[]>([])

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;




  pageEvent!: PageEvent;




  getTarifas() {
    let params = {

    }
    this.isLoadingResults = true;
    this.tarifaSvc.getAll(params).subscribe({
      next: response => {
        this.isLoadingResults = false;
        this.dataSource.set(response.tarifas)

      },
      error: () => this.isLoadingResults = false
    })

  }

  ngOnInit() {
    this.getTarifas();
  }


  refresh() {
    this.getTarifas();
  }

  onEdit(data: any){
    let modalRef = this.modalSvc.open(TarifaEditModalComponent, {
      size: 'sm'
    })
    modalRef.componentInstance.params = data || {};

    modalRef.result.then(result=>{
      if(result && typeof result==='object'){
        this.getTarifas()
      }
    })
  }

}
