import { ActionCompanyCustomerAddEditModalDirective } from '@ui/directives/action-company-customer-add-edit.directive';
import { SRI_IDENTIFICATION_CODE } from '@domain/enums/main.enum';
import { CompanyCustomerSearch } from "@domain/models/company-customer.model";
import { CompanyCustomerService } from "@data/repositories/company-customer/company-customer.service";
import { DialogService } from '@domain/services/dialog.service';
import { ToasterService } from '@domain/services/toaster.service';
import { CdkOverlayOrigin, FlexibleConnectedPositionStrategy, Overlay, OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe } from "@angular/common";
import { computed, SimpleChanges, ViewChild } from '@angular/core';
import { Component, inject, input, model, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { isValidField } from "@domain/utils/utils";
import { debounceTime, distinctUntilChanged, Observable } from "rxjs";
import { catchError, finalize, map,  switchMap } from "rxjs/operators";

import { CompanyCustomerAddEditModalComponent } from '../company-customer-add-edit-modal/company-customer-add-edit-modal.component';
import { ResponsiveService } from '@domain/services/responsive.service';
import {  MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-company-customer-search',
    imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        AsyncPipe,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatCardModule,
        MatMenuModule,
        OverlayModule,
        ActionCompanyCustomerAddEditModalDirective,
    ],
    templateUrl: './company-customer-search.component.html',
    styles: `
  .loading-option {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px; /* Ajusta esta altura según tus necesidades */
  }

  .overlay-content {
    width: 280px;
    // max-height: 300px;
    border-radius: 5px;
    margin: 0;
    // box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.4);
    // background: #fff;
    padding: 10px;
  }
  `
})
export class CompanyCustomerSearchComponent {

  private responsiveService = inject(ResponsiveService)

  private companyCustomerSvc = inject(CompanyCustomerService)
  private tS = inject(ToasterService);
  private dialogSvc = inject(DialogService)

  isSimple = input(false);
  isAdvanced = input(false)
  isApplyGetId = input(false)
  id = input(0);

  onSelect = output<any>()
  clearInput = output()

  textName = model<string>('')
  control = new FormControl<null | string>(null);
  filteredCustomers!: Observable<any[]>;

  companyCustomers: CompanyCustomerSearch[] = [];

  isLoadingResults = false;


  isTablet = computed(() => this.responsiveService.isTablet());
  isHandset = computed(() => this.responsiveService.isHandset());

  @ViewChild(CdkOverlayOrigin) trigger!: CdkOverlayOrigin;
  isOpenDetail = signal(false)
  positionStrategy!: FlexibleConnectedPositionStrategy;
  private overlay = inject(Overlay)

  dataDetail = {} as any;

  ngOnInit() {
    this.filteredCustomers = this.control.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((val) => {
        this.isLoadingResults = false;
        if (val && val.length > 2) {
          return this._filter(val);
        }
        if (!isValidField(val)) {
          this.clearInput.emit()

        }
        return [];
      }),

    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["textName"]) {
      this.control.setValue(this.textName())
    }

  }

  private _filter(value: string) {
    this.isLoadingResults = true;
    return this.companyCustomerSvc.search({ textSearch: value }).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        return []
      }),
      finalize(() => {
        this.isLoadingResults = false;
      })
    );
  }

  onSelectionChange(item: CompanyCustomerSearch) {
    if (this.isApplyGetId()) {
      this.companyCustomerSvc.getId(item.idCliente).subscribe(response => {
        this.onSelect.emit(response);
      })
    } else {
      this.onSelect.emit(item);
    }
  }

  private verificarNumero(numero: any) {
    numero = numero ? numero.trim() : ""

    if (![10, 13].includes(numero.length)) return;

    if (isNaN(numero)) return

    if (numero.length === 13 && numero.slice(-3) !== "001") return;

    return true;
  }

  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const inputValue = (keyboardEvent.target as HTMLInputElement).value;
    if (keyboardEvent.key === 'Enter') {
      if (!(this.id() > 0) && this.verificarNumero(inputValue)) {
        this.companyCustomerSvc.searchByNro(inputValue).subscribe(response => {

          if (response.customerCompanyId > 0) {
            this.onSelect.emit(response);
            return
          }

          //Numero de RUC
          if (inputValue.length === 13) {
            try {
              this.companyCustomerSvc.checkClientSRIByRUC(inputValue).subscribe(response => {

                const { numeroRuc, razonSocial, direccion, telefonos, correos, error, nombreComercial } = response;

                if (error) {
                  this.tS.toastr({
                    type: 'warning',
                    message: error
                  })
                  return
                }

                let params = {
                  dataOfSri: true,
                  numeroRuc,
                  razonSocial,
                  nombreComercial: nombreComercial ?? razonSocial,
                  direccion,
                  telefonos,
                  correos,
                  codigoSri: SRI_IDENTIFICATION_CODE.RUC
                }
                this.dialogSvc.open(CompanyCustomerAddEditModalComponent, {
                  size: 'lg',
                  data: params
                })
              })

            } catch (error) {
              console.log(error);
            }
          }

          //Numero de Cedula
          if (inputValue.length === 10) {
            try {
              this.companyCustomerSvc.checkClientSRIByCedula(inputValue).subscribe(response => {
                const { direccion, correos, error, nombreCompleto, telefonos } = response;
                if (error) {
                  this.tS.toastr({
                    type: 'warning',
                    message: error
                  })
                  return
                }
                let params = {
                  dataOfSri: true,
                  numeroRuc: inputValue,
                  razonSocial: nombreCompleto,
                  nombreComercial: nombreCompleto,
                  direccion,
                  telefonos,
                  correos,
                  codigoSri: SRI_IDENTIFICATION_CODE.CEDULA
                }
                this.dialogSvc.open(CompanyCustomerAddEditModalComponent, {
                  size: 'lg',
                  data: params
                })

              })
            } catch (error) {
              console.log(error);

            }
          }

        })

      }

    }
  }



  toggleOverlay($event:any){
    $event.stopPropagation();
    this.isOpenDetail.set(!this.isOpenDetail())

    if (this.isOpenDetail()) {
      this.positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.trigger.elementRef) // Usar el elemento de origen
      .withPositions([
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
      ]);
      this.companyCustomerSvc.getId(this.id(), true).subscribe(response => {
        this.dataDetail = response;
      })

    } else {
      this.dataDetail = {}
    }
  }
}
