import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  model,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { isValidField } from '@core/utils/utils';
import { DocConfigList } from '@modules/config/domain/models/doc-config.model';
import { DocConfigInfoAdicionalComponent } from '@modules/config/ui/doc-config/doc-config-info-adicional/doc-config-info-adicional.component';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ListDocConfigUseCase } from '@modules/config/application/use-cases/doc-config/list-doc-config.use-case';

import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { DialogService } from '@core/services/dialog.service';
import { CreateDocConfigUseCase } from '@modules/config/application/use-cases/doc-config/create-doc-config.use-case';
import { GetDocConfigFormDataUseCase } from '@modules/config/application/use-cases/doc-config/get-doc-config-form-data.use-case';

@Component({
  selector: 'app-doc-config-page',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    Button,
    MatSelectModule,
    DynamicCard,
    MatDynamicTableComponent,
  ],
  templateUrl: './doc-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocConfigPageComponent implements OnInit, AfterViewInit {
  private $listUseCase = inject(ListDocConfigUseCase);
  private $createUseCase = inject(CreateDocConfigUseCase);
  private $formDataDocConfig = inject(GetDocConfigFormDataUseCase);
  private readonly _tS = inject(ToastrNotificationService);
  private readonly _modalService = inject(DialogService);
  private readonly _cdr = inject(ChangeDetectorRef);

  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  docs = signal<DocConfigList[]>([]);

  dataSearch = {
    idPuntoEmision: 0,
    codEstab: '',
  };

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: '#', type: 'string' },
    { key: 'nomDoc', label: 'Descripción', type: 'string' },
    { key: 'templateSelect', label: '', type: 'template' },
    { key: 'templateSecuencia', label: 'Secuencia', type: 'template' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  @ViewChild('templateSecuencia') templateSecuencia!: TemplateRef<any>;
  @ViewChild('templateSelect') templateSelect!: TemplateRef<any>;
  getDocs() {
    this.docs.set([]);
    this.$listUseCase.execute(this.dataSearch.idPuntoEmision).subscribe((response) => {
      this.docs.set(response.data);
    });
  }

  ngOnInit() {
    this.$formDataDocConfig.execute().subscribe((response) => {
      this.establecimientos.set(response.establecimientos);
      const dataEstab = this.establecimientos().find((e) => e.defaultEstab);
      if (dataEstab) {
        this.puntosEmision.set(dataEstab.puntosEmision);
        const dataPuntoEmision = this.puntosEmision().find((p) => p.defaultPtoEmi);
        if (dataPuntoEmision) {
          this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;

          this.getDocs();
        }
        this.dataSearch.codEstab = dataEstab.codEstab;
      }
      this._cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template' && col.key === 'templateSecuencia') {
        col.templateOutlet = this.templateSecuencia;
      }
      if (col.type === 'template' && col.key === 'templateSelect') {
        col.templateOutlet = this.templateSelect;
      }
    });
  }

  onChangeEstab() {
    const dataEstab = this.establecimientos().find((e) => e.codEstab === this.dataSearch.codEstab);
    if (dataEstab) {
      this.puntosEmision.set(dataEstab.puntosEmision);
      const dataPuntoEmision = this.puntosEmision().find((e) => e.defaultPtoEmi);
      if (dataPuntoEmision) {
        this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;

        this.getDocs();
      } else {
        this.dataSearch.idPuntoEmision = 0;
      }
    }
  }

  saveConfig(item: DocConfigList) {
    if (!(this.dataSearch.idPuntoEmision > 0)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el punto de emisión',
      });
      return;
    }
    if (!isValidField(item.ultimaSecuencia)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el punto de emisión',
      });
      return;
    }

    const data = {
      id: item.idConfiguracionDocumento,
      idPuntoEmision: this.dataSearch.idPuntoEmision,
      idTipoDocumento: item.idTipoDocumento,
      estado: item.estado,
      ultimaSecuencia: item.ultimaSecuencia,
    };

    this.$createUseCase.execute(data).subscribe((response) => {
      this._tS.show({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code === '1') {
        this.getDocs();
      }
    });
  }

  openModalInfoAdicional(data: DocConfigList) {
    const modalRef = this._modalService.open(DocConfigInfoAdicionalComponent, {
      size: 'lg',
      data: {
        ...structuredClone(data),
        idPuntoEmision: this.dataSearch.idPuntoEmision,
      },
    });

    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getDocs();
      }
    });
  }
}
