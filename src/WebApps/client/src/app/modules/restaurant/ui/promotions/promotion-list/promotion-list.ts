import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatIconButton } from '@angular/material/button';
import { PromotionListUseCase } from '@restaurant/application/use-cases/promotion-use-case';
import { PaginationParams } from '@acontplus/core';
import { ValidatorUtils } from '@core/utils/utils';
import { Button, Pagination } from '@acontplus/ng-components';
import { LookupService } from '@restaurant/application/services/lookup-service';
import { LookupItem } from '@core/models/lookup-type';
import { PromotionListDto } from '@restaurant/domain/models/promotion';
import { FormsModule } from '@angular/forms';
import { DialogService } from '@core/services/dialog.service';
import { PromotionForm } from '@restaurant/ui/promotions/promotion-form/promotion-form';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { MatSelectModule } from '@angular/material/select';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-promotion-list',
  imports: [
    MatIcon,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconButton,
    Button,
    DataGrid,
  ],
  templateUrl: './promotion-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionList implements OnInit {
  private lookupSvc = inject(LookupService);
  #listUseCase = inject(PromotionListUseCase);

  dgSvc = inject(DialogService);

  dataFilter = {
    establishmentId: 0,
    searchTerm: '',
  };
  // Signals
  establishments = signal<LookupItem[]>([]);
  list = signal<PromotionListDto[]>([]);
  isLoading = signal(false);
  pagination = signal(new Pagination());

  columns: DataGridColumn[] = [
    { header: '#', field: 'index' },
    { header: 'Op.', field: 'op' },
    { header: 'Imagen', field: 'imageUrl', type: 'image' },
    { header: 'Nombre Promoción', field: 'name' },
    { header: 'Desc. Promoción', field: 'description' },
    { header: 'Vigencia', field: 'validityPeriod' },
    { header: 'Horario(Días y Horas)', field: 'schedule' },
    {
      header: 'Estado',
      field: 'isActive',
      type: 'tag',
      tag: {
        true: { text: 'Activo', color: 'bg-green' },
        false: { text: 'Inactivo', color: 'green-100' },
      },
    },
  ];

  refresh() {
    this.getList();
  }

  openPromotionForm(id = 0) {
    const ref = this.dgSvc.open(PromotionForm, {
      size: 'xxl',
      data: { id },
    });

    ref.subscribe((result) => {
      if (result) this.getList();
    });
  }
  newPromotion() {
    this.openPromotionForm();
  }

  editPromotion(row: PromotionListDto) {
    this.openPromotionForm(row.id);
  }

  private getList() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    const params = new PaginationParams({
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      searchTerm: ValidatorUtils.isValidField(this.dataFilter.searchTerm) ?? undefined,
    });
    this.#listUseCase.execute(params).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        this.list.set(response.items);
        this.pagination.update((pag) => {
          pag.totalRecords = response.totalCount;
          return pag;
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.list.set([]);
      },
    });
  }
  ngOnInit() {
    this.lookupSvc.getLookupList('establishments').subscribe((x) => {
      this.establishments.set(x.establishments);

      const defaultEstablishment = this.establishments()[0];
      if (defaultEstablishment) {
        this.dataFilter.establishmentId = defaultEstablishment.id;
        this.getList();
      }
    });
  }

  getNextPage(e: PageEvent) {
    this.getList();
  }
}
