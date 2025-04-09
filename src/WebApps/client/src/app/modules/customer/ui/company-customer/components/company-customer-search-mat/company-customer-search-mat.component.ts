import {CdkOverlayOrigin, FlexibleConnectedPositionStrategy, Overlay, OverlayModule} from '@angular/cdk/overlay';
import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input, model, output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogService } from '@core/services/dialog.service';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { ResponsiveService } from '@shared/services/responsive.service';
import {  distinctUntilChanged, finalize,   Observable, switchMap } from 'rxjs';
import {CompanyCustomerUseCase} from "@customer/core/usecases/company-customer.use-case";
import { CompanyCustomerAddEditDirective } from '../../company-customer-add-edit.directive';

@Component({
  selector: 'app-company-customer-search-mat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    AsyncPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCardModule,
    OverlayModule,
    CompanyCustomerAddEditDirective
  ],
  templateUrl: './company-customer-search-mat.component.html',
  styles: ``
})
export class CompanyCustomerSearchMatComponent {
  private responsiveService = inject(ResponsiveService)

  private _companyCustomerUseCase = inject(CompanyCustomerUseCase)

  private tS = inject(ToasterService);
  private dialogSvc = inject(DialogService)

  isSimpleMode = input(false);
  isAdvancedMode = input(false);
  isGetId = input(false);
  id = input(0);


  onSelect = output<any>()
  clearInput = output()

  textName = model<string>('')
  control = new FormControl<null | string>(null);
  filteredCustomers!: Observable<any[]>;

  companyCustomers: any[] = [];

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
    return this._companyCustomerUseCase.search({ textSearch: value }).pipe(
      finalize(() => {
        this.isLoadingResults = false;
      })
    );
  }

  onSelectionChange(item: any) {
    if (this.isGetId()) {
      this._companyCustomerUseCase.getId(item.idCliente || item.id).subscribe(response => {
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
        // this.companyCustomerSvc.searchByNro(inputValue).subscribe(response => {

        //   if (response.customerCompanyId > 0) {
        //     this.onSelect.emit(response);
        //     return
        //   }

        //   //Numero de RUC
        //   if (inputValue.length === 13) {
        //     try {
        //       this.companyCustomerSvc.checkClientSRIByRUC(inputValue).subscribe(response => {

        //         const { numeroRuc, razonSocial, direccion, telefonos, correos, error, nombreComercial } = response;

        //         if (error) {
        //           this.tS.toastr({
        //             type: 'warning',
        //             message: error
        //           })
        //           return
        //         }

        //         let params = {
        //           dataOfSri: true,
        //           numeroRuc,
        //           razonSocial,
        //           nombreComercial: nombreComercial ?? razonSocial,
        //           direccion,
        //           telefonos,
        //           correos,
        //           codigoSri: SRI_IDENTIFICATION_CODE.RUC
        //         }
        //         this.dialogSvc.open(CompanyCustomerAddEditModalComponent, {
        //           size: 'lg',
        //           data: params
        //         })
        //       })

        //     } catch (error) {
        //       console.log(error);
        //     }
        //   }

        //   //Numero de Cedula
        //   if (inputValue.length === 10) {
        //     try {
        //       this.companyCustomerSvc.checkClientSRIByCedula(inputValue).subscribe(response => {
        //         const { direccion, correos, error, nombreCompleto, telefonos } = response;
        //         if (error) {
        //           this.tS.toastr({
        //             type: 'warning',
        //             message: error
        //           })
        //           return
        //         }
        //         let params = {
        //           dataOfSri: true,
        //           numeroRuc: inputValue,
        //           razonSocial: nombreCompleto,
        //           nombreComercial: nombreCompleto,
        //           direccion,
        //           telefonos,
        //           correos,
        //           codigoSri: SRI_IDENTIFICATION_CODE.CEDULA
        //         }
        //         this.dialogSvc.open(CompanyCustomerAddEditModalComponent, {
        //           size: 'lg',
        //           data: params
        //         })

        //       })
        //     } catch (error) {
        //       console.log(error);

        //     }
        //   }

        // })

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
      this._companyCustomerUseCase.getId(this.id(), true).subscribe(response => {
        this.dataDetail = response;
      })

    } else {
      this.dataDetail = {}
    }
  }
}
