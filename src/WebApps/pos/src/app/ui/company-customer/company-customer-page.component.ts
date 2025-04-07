import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Pagination } from '@domain/models/pagination.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CompanyCustomerRead } from '@domain/models/company-customer.model';
import { PrimaryStatusPipe } from '@core/pipes/primary-status.pipe';
import { ActionCompanyCustomerAddEditModalDirective } from '@ui/directives/action-company-customer-add-edit.directive';
import { ColumnDefinition } from '../models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '../components/mat-dynamic-table/mat-dynamic-table.component';
import {CompanyCustomerGetAllUseCase} from "@domain/use-cases/company-customer/company-customer-get-all.use-case";
import {MatDynamicCardComponent} from "@ui/components/mat-dynamic-card/mat-dynamic-card.component";
import {PermissionStore} from "@ui/store/permission.store";

@Component({
  selector: 'app-company-customer',
  imports: [
    MatIconModule,
    MatButtonModule,
    PrimaryStatusPipe,
    ActionCompanyCustomerAddEditModalDirective,
    MatDynamicTableComponent,
    MatDynamicCardComponent
  ],
  templateUrl: './company-customer-page.component.html',
})
export class CompanyCustomerPageComponent {
  private $companyCustomerGetAllUseCase = inject(CompanyCustomerGetAllUseCase)
    $permissionStore = inject(PermissionStore);


  data: CompanyCustomerRead[] = [];

  isLoadingResults = false;

  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pagination = signal(new Pagination());

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'numeroIdentificacion', label: 'Ruc/Cédula', type: 'string' },
    { key: 'razonSocial', label: 'Razón Social', type: 'string' },
    { key: 'nombreComercial', label: 'Nombre Comercial', type: 'string' },
    { key: 'direccion', label: 'Dirección', type: 'string' },
    { key: 'correo', label: 'Correo', type: 'string' },
    { key: 'telefono', label: 'Teléfono', type: 'string' },
    {
      key: 'estado',
      label: 'Estado',
      type: 'template',
      templateOutlet: null,
    },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  getCompanyCustomers() {
    let params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    this.isLoadingResults = true;
    this.$companyCustomerGetAllUseCase.execute(params).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.data = response.data;
        this.pagination().totalRecords =
          this.data.length > 0 ? this.data[0].totalRecords : 0;
      },
      error: () => (this.isLoadingResults = false),
    });
  }

  ngOnInit() {
    this.getCompanyCustomers();
    this.$permissionStore.loadActions("order")
  }

  ngAfterViewInit(): void {
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });
  }

  refresh() {
    this.getCompanyCustomers();
  }

  handlePageEvent(e: PageEvent) {
    this.pagination().totalRecords = e.length;
    this.pagination().pageSize = e.pageSize;
    this.pagination().pageIndex = e.pageIndex;
    this.getCompanyCustomers();
  }
}
