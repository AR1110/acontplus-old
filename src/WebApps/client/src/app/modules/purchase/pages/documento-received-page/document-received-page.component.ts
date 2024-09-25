import { Component, inject } from '@angular/core';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { SupplierSearchComponent } from '@customer/supplier/components/supplier-search/supplier-search.component';
import { FormsModule } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MatTooltip } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subcategory } from '@accounting/models/subcategory';
import { InputNumberDirective } from '@shared/directives/ui/input-number.directive';
import { MatButton } from '@angular/material/button';
import { ToasterService } from '@core/services/toaster.service';
import Swal from 'sweetalert2';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { DocManualUploadComponent } from '@purchase/components/document-received/doc-manual-upload/doc-manual-upload.component';
import { SharedService } from '@core/services/shared.service';

@Component({
  selector: 'app-documento-received-page',
  standalone: true,
  imports: [
    MatDynamicTableComponent,
    BreadcrumbComponent,
    MatCard,
    MatCardContent,
    DateRangeSelectionComponent,
    SupplierSearchComponent,
    FormsModule,
    MatTooltip,
    FaIconComponent,
    InputNumberDirective,
    MatButton,
  ],
  templateUrl: './document-received-page.component.html',
  styles: ``,
})
export class DocumentReceivedPageComponent {
  documentos: any[] = [];
  columnsDefs: ColumnDefinition[] = [];
  columns: string[] = ['serie'];
  dateChecked: boolean = true;
  dataSearch = {
    codDoc: '',
    codEstab: '',
    serieComprobante: '',
    subcategoryId: 0,
  };
  tipoComprobantes: any[] = [];
  extraOptionsIcon: IconProp = 'eye';
  extraOptionsTooltip: string = 'Ver más filtros';
  moreOptionsFilter: boolean = false;
  subcategories: Subcategory[] = [];
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  private readonly _modalService = inject(ModalService);
  private readonly _sharedService = inject(SharedService);
  private readonly _tS = inject(ToasterService);

  async alertEstabSelected() {
    if (this.establecimientos.length === 0) {
      return this._tS.toastr({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
        positionClass: 'toast-top-center',
      });
    }
    let dataEstab = this.establecimientos.find(
      (estab) => estab.codEstab === this.dataSearch.codEstab,
    );
    if (dataEstab) {
      let { isConfirmed } = await Swal.fire({
        title: 'Estab.: ' + dataEstab.nombreComercial,
        text: 'Esta seguro de realizar una nueva importación de comprobantes en este establecimiento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Proceder',
        cancelButtonText: 'No, cancelar',
      });
      return isConfirmed;
    }
    return false;
  }

  getEstabs() {
    this._sharedService.getEstabAsign().subscribe((response) => {
      this.establecimientos = response;
      let codEstabFound = this.establecimientos.find(
        (x) => x.predeterminado,
      )?.codEstab;
      if (codEstabFound) {
        this.dataSearch.codEstab = codEstabFound;
      }
    });
  }

  ngOnInit() {
    this.documentos = [
      {
        serie: '001-001-000000009',
      },
    ];
    this.columnsDefs = [{ key: 'serie', label: 'Serie', type: 'string' }];
    this.getEstabs();
  }

  onDateRangeSelection($event: { from: string; to: string }) {}

  onSupplierSelected($event: { data: any }) {}

  onChangeTipoDoc() {}

  onClickBtnMore() {
    this.moreOptionsFilter = !this.moreOptionsFilter;
    if (this.moreOptionsFilter) {
      this.extraOptionsIcon = 'eye-slash';
      this.extraOptionsTooltip = 'Ocultar filtros';
    } else {
      this.extraOptionsIcon = 'eye';
      this.extraOptionsTooltip = 'Ver más filtros';
    }
  }

  refresh() {}

  onChangeSerieComprobante() {}

  getComprobantes() {}

  openModalAutomaticUpload() {}

  async openModalManualUpload() {
    if (!(await this.alertEstabSelected())) return;
    let subcategoriesFound = this.subcategories || [];

    if (subcategoriesFound.length == 0) {
      return this._tS.toastr({
        type: 'warning',
        message:
          'Debe de registrar subcategorías de compra en el módulo de contabilidad',
      });
    }
    const modalRef = this._modalService.openModalCustom(
      DocManualUploadComponent,
      {
        size: 'xl',
        centered: true,
      },
    );
  }

  openModalChangeEstab() {}

  editSubcategory() {}

  onChangeEstab() {}
}
