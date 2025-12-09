import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CompanyAddEditModalComponent } from '@modules/config/ui/company/company-add-edit-modal/company-add-edit-modal.component';

import { Button, DynamicCard } from '@acontplus/ng-components';

import { ListCompanyUseCase } from '@modules/config/application/use-cases/company/list-company.use-case';
import { CompanyList } from '@modules/config/domain/models/company.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-company',
  imports: [BreadcrumbComponent, Button, DynamicCard, MatDynamicTableComponent],
  templateUrl: './company.component.html',
})
export class CompanyComponent implements OnInit {
  private $listUseCase = inject(ListCompanyUseCase);
  dialogSvc = inject(DialogService);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'ruc', label: 'Ruc', type: 'string' },
    { key: 'razonSocial', label: 'Razón Social', type: 'string' },
    { key: 'nombreComercial', label: 'Nombre Comercial', type: 'string' },
    { key: 'telefono', label: 'Teléfono', type: 'string' },
    { key: 'email', label: 'Correo', type: 'string' },
    { key: 'direccion', label: 'Dirección', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = signal<CompanyList[]>([]);

  getList() {
    this.$listUseCase.execute().subscribe((response) => {
      this.dataSource.set(response.data);
    });
  }

  ngOnInit() {
    this.getList();
  }

  openModalEdit(item: any) {
    const modalRef = this.dialogSvc.open(CompanyAddEditModalComponent, {
      data: structuredClone(item) || {},
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getList();
      }
    });
  }
}
