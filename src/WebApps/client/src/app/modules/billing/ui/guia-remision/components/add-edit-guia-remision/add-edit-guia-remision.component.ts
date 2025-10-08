import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { DialogService } from '@core/services/dialog.service';
import { DocsGuiaRemisionComponent } from '@billing/ui/guia-remision/components/docs-guia-remision/docs-guia-remision.component';
import { GetGuiaRemisionFormDataUseCase } from '@billing/domain/use-cases/guia-remision/get-guia-remision-form-data.use-case.';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import {
  CompanyCustomerEntity,
  CompanyCustomerSearch,
} from '@company-customer/domain/entities/company-customer.entity';

@Component({
  selector: 'app-add-edit-guia-remision',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatCustomDialogComponent,
    ThemeButtonComponent,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './add-edit-guia-remision.component.html',
  styles: ``,
})
export class AddEditGuiaRemisionComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddEditGuiaRemisionComponent>);
  private _dialogSvc = inject(DialogService);

  private $getGuiaRemisionFormDataUseCase = inject(GetGuiaRemisionFormDataUseCase);
  title = 'Nuevo Guía Remisión';

  estabs = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  tiposDoc = signal<TipoDoc[]>([]);

  //Angular
  private fb = inject(FormBuilder);

  dataForm = this.fb.group({
    codEstab: ['', Validators.required],
    puntoEmisionId: [0, Validators.required],
    fechaInicioTraslado: [new Date(), Validators.required],

    // Remitente (normalmente la empresa emisora)
    remitenteId: ['', Validators.required],
    remitenteRuc: ['', Validators.required],
    remitenteRazonSocial: ['', Validators.required],

    // Destinatario
    destinatario: this.fb.group({
      id: [0, Validators.required],
      name: ['', Validators.required],
      idCard: [{ value: '', disabled: true }],
    }),

    // Direcciones
    direccionPartida: this.fb.group({
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      codigoPostal: [''],
      pais: ['', Validators.required],
    }),

    direccionLlegada: this.fb.group({
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      codigoPostal: [''],
      pais: ['', Validators.required],
    }),

    // Transporte
    transportistaId: ['', Validators.required],
    transportista: this.fb.group({
      ruc: [{ value: '', disabled: true }],
      razonSocial: [{ value: '', disabled: true }],
      licenciaConducir: [''],
      placa: ['', Validators.required],
    }),

    // Items
    items: this.fb.array([]),

    // Otros datos
    motivoTraslado: ['', Validators.required],
    observaciones: [''],
    documentosReferencia: this.fb.array([]),
  });

  dataFormClone = {
    codEstab: '' as string | null | undefined,
  };

  //Footer
  informacionAdicionalDocumento = signal<any[]>([]);
  configuracionesInfoAdicional = signal<any[]>([]);

  protected openDocs() {
    const ref = this._dialogSvc.open(DocsGuiaRemisionComponent, {
      size: 'lg',
    });
    ref.subscribe(() => {});
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.$getGuiaRemisionFormDataUseCase.execute().subscribe(response => {
      this.estabs.set(response.estabs);
      const dataEstab = this.estabs().find(item => item.defaultEstab);

      if (!dataEstab) {
        Swal.fire({
          icon: 'warning',
          text: 'No tienes asignado el Establecimiento',
          timer: 1000,
        });
        return;
      }

      this.puntosEmision.set(dataEstab.puntosEmision);
      const dataPuntoEmision = this.puntosEmision().find(ptoEmi => ptoEmi.defaultPtoEmi);
      if (!dataPuntoEmision) {
        Swal.fire({
          icon: 'warning',
          text: 'No tienes asignado los puntos de emisión',
          timer: 1000,
        });
        return;
      }
      this.dataFormClone.codEstab = dataEstab.codEstab;
      this.dataForm.patchValue({
        codEstab: dataEstab.codEstab,
        puntoEmisionId: dataPuntoEmision.idPuntoEmision,
      });
    });
  }

  async estabChange() {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: 'Cambiar Establecimiento',
      text: '¿Está seguro de cambiar? Se cambiará el Punto de Emisión',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true,
    });

    if (!isConfirmed) {
      this.dataForm.patchValue({
        codEstab: this.dataFormClone.codEstab,
      });
      return;
    }

    this.dataFormClone.codEstab = this.dataForm.value?.codEstab;

    const dataEstab = this.estabs().find(item => item.codEstab === this.dataForm.value.codEstab);
    if (!dataEstab) {
      Swal.fire({
        icon: 'warning',
        text: 'No tienes asignado el Establecimiento',
        timer: 1000,
      });
      return;
    }

    this.puntosEmision.set(dataEstab.puntosEmision);
    const dataPuntoEmision = this.puntosEmision().find(ptoEmi => ptoEmi.defaultPtoEmi);
    if (!dataPuntoEmision) {
      Swal.fire({
        icon: 'warning',
        text: 'No tienes asignado los puntos de emisión',
        timer: 1000,
      });
      return;
    }
    this.dataForm.patchValue({
      puntoEmisionId: dataPuntoEmision.idPuntoEmision,
    });
    this.asignarInfoAdicionalPorPuntoDeEmision();
  }

  private asignarInfoAdicionalPorPuntoDeEmision() {
    // Elimina info adicional existente relacionada a algún punto de emisión
    this.informacionAdicionalDocumento.set(
      this.informacionAdicionalDocumento().filter(info => !(info.idPuntoEmision > 0)),
    );

    // Busca la configuración para el punto de emisión actual
    const configuracionPuntoEmision = this.configuracionesInfoAdicional().find(
      config => config.idPuntoEmision === this.dataForm.value.puntoEmisionId,
    );

    if (!configuracionPuntoEmision) return;

    // Clona los valores y les asigna el punto de emisión actual
    const infoAdicionalGenerada = configuracionPuntoEmision.infoAdicional.map((item: any) => ({
      ...item,
      idPuntoEmision: this.dataForm.value.puntoEmisionId,
    }));

    // Asigna la nueva información adicional combinada con la existente
    this.informacionAdicionalDocumento.set([
      ...infoAdicionalGenerada,
      ...this.informacionAdicionalDocumento(),
    ]);
  }

  customerSelected($event: CompanyCustomerEntity) {
    console.log($event);
    this.dataForm.patchValue({
      destinatario: {
        id: $event.idCliente,
        name: $event.name,
        idCard: $event.numeroIdentificacion,
      },
    });
  }

  onSubmit() {}

  close() {
    this.dialogRef.close();
  }
}
