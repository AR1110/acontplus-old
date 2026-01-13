import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { NotificationService } from '@acontplus/ng-notifications';

import { isValidField } from '@core/utils/utils';
import { DocConfigList } from '@modules/config/domain/models/doc-config.model';
import { DocConfigInfoAdicional } from '@modules/config/ui/doc-config/doc-config-info-adicional/doc-config-info-adicional';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  Button,
  DynamicCard,
  DataGrid,
  DataGridColumn,
  AdvancedDialogService,
} from '@acontplus/ng-components';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ListDocConfigUseCase } from '@modules/config/application/use-cases/doc-config/list-doc-config.use-case';
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
    DataGrid,
  ],
  templateUrl: './doc-config-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocConfigPageComponent implements OnInit {
  private $listUseCase = inject(ListDocConfigUseCase);
  private $createUseCase = inject(CreateDocConfigUseCase);
  private $formDataDocConfig = inject(GetDocConfigFormDataUseCase);
  private readonly tS = inject(NotificationService);
  private readonly dialogSvc = inject(AdvancedDialogService);

  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  docs = signal<DocConfigList[]>([]);

  dataSearch = {
    idPuntoEmision: 0,
    codEstab: '',
  };

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#', width: '60px' },
    { field: 'op', header: 'Op.' },
    { field: 'nomDoc', header: 'Descripción' },
    { field: 'estado', header: 'Estado' },
    { field: 'ultimaSecuencia', header: 'Secuencia' },
  ];

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
      this.tS.warning({
        message: 'Seleccione el punto de emisión',
      });
      return;
    }
    if (!isValidField(item.ultimaSecuencia)) {
      this.tS.warning({
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
      if (response.code === '0') {
        this.tS.warning({ message: response.message });
      }
      if (response.code === '1') {
        this.tS.success({ message: response.message });
        this.getDocs();
      }
    });
  }

  async openModalInfoAdicional(data: DocConfigList) {
    const ref = await this.dialogSvc.openInWrapper(
      {
        component: DocConfigInfoAdicional,
        title: 'Información Adicional',
        icon: 'sell',
        showCloseButton: true,
        data: {
          ...structuredClone(data),
          idPuntoEmision: this.dataSearch.idPuntoEmision,
        },
      },
      {
        size: 'lg',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getDocs();
      }
    });
  }
}
