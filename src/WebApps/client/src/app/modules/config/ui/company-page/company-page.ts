import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CompanyAddEditModal } from '@modules/config/ui/company-page/company-add-edit-modal/company-add-edit-modal';

import { Button, DataGrid, DataGridColumn, AdvancedDialogService } from '@acontplus/ng-components';

import { ListCompanyUseCase } from '@modules/config/application/use-cases/company/list-company.use-case';
import { CompanyList } from '@modules/config/data/models/company.model';

@Component({
  selector: 'app-company-page',
  imports: [BreadcrumbComponent, Button, DataGrid],
  templateUrl: './company-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyPage implements OnInit {
  private $listUseCase = inject(ListCompanyUseCase);
  private dialogSvc = inject(AdvancedDialogService);

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'ruc', header: 'Ruc' },
    { field: 'razonSocial', header: 'Razón Social' },
    { field: 'nombreComercial', header: 'Nombre Comercial' },
    { field: 'telefono', header: 'Teléfono' },
    { field: 'email', header: 'Correo' },
    { field: 'direccion', header: 'Dirección' },
    { field: 'nomEstado', header: 'Estado' },
  ];

  dataSource = signal<CompanyList[]>([]);

  getList() {
    this.$listUseCase.execute().subscribe((response) => {
      this.dataSource.set(response.data);
    });
  }

  ngOnInit() {
    this.getList();
  }

  async openModalEdit(item: CompanyList) {
    const ref = await this.dialogSvc.openInWrapper(
      {
        component: CompanyAddEditModal,
        title: 'Editar Empresa',
        icon: 'edit',
        showCloseButton: true,
        data: structuredClone(item) ?? {},
      },
      {
        size: 'md',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getList();
      }
    });
  }
}
