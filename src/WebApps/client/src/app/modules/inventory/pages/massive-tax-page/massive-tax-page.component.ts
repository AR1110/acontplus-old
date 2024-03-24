
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { isApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import { hideLoader, showLoader } from "@core/utils/loader";
import { isValidField } from "@core/utils/utils";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MassiveTaxService } from "@modules/inventory/services/massive-tax.service";
import { TarifaImpuesto } from "@shared/models/tarifa-impuesto.model";
import Swal from "sweetalert2";


@Component({
  selector: 'app-massive-tax-page',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    BreadcrumbComponent
  ],
  templateUrl: './massive-tax-page.component.html'
})
export class MassiveTaxPageComponent {
  private readonly massiveTaxSvc = inject(MassiveTaxService);
  private readonly tS = inject(ToasterService);


  taxRatesFrom: Array<TarifaImpuesto> = [];
  taxRatesTo: Array<TarifaImpuesto> = [];

  histories: any[] = []

  private taxFromDesc = ''
  private taxToDesc = ''
  joinTaxDesc = ''

  dataForm = {
    title: '0 Productos encontrados.',
    taxIdFrom: 0,
    taxIdTo: 0,
    quantityProducts: 0,
    obs: ''
  }
  private cloneDataForm = structuredClone(this.dataForm)

  getAll() {
    try {
      showLoader()
      this.massiveTaxSvc.getAll({}).subscribe({
        next: (response) => {
          hideLoader();
          this.histories = response;
        },
        error(err) {
          console.log(err)
          hideLoader();
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  getDataForm() {
    showLoader();
    this.massiveTaxSvc.getDataForm().subscribe({
      next: (response) => {
        hideLoader();
        this.taxRatesFrom = response.taxRates;
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }


  ngOnInit() {
    this.getDataForm();
    this.getAll();

  }

  onChangeTaxFrom() {
    try {
      this.taxRatesTo = this.taxRatesFrom.filter(t => t.idTarifaImpuesto !== this.dataForm.taxIdFrom);
      this.taxFromDesc = this.taxRatesFrom.find(t => t.idTarifaImpuesto === this.dataForm.taxIdFrom)?.descripcion || ''
      showLoader()
      this.massiveTaxSvc.getQuantityProductByTaxId(this.dataForm.taxIdFrom).subscribe({
        next: (response) => {
          hideLoader();
          this.dataForm.quantityProducts = response;
          this.dataForm.title = `${this.dataForm.quantityProducts} Productos encontrados.`;
          this.setTaxDesc()

          if (!(this.dataForm.quantityProducts > 0)) {
            this.tS.toastr({
              type: 'info',
              message: 'No se encontraron productos con impuesto inicial.'
            })
            return
          }
        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })
    } catch (error) {
      hideLoader()
      console.log(error)
    }
  }

  onChangeTaxTo() {
    this.taxToDesc = this.taxRatesTo.find(t => t.idTarifaImpuesto === this.dataForm.taxIdTo)?.descripcion || ''
    console.log(this.taxToDesc)
    this.setTaxDesc();
  }
  private setTaxDesc() {

    this.joinTaxDesc = `Impuesto Inicial ${this.taxFromDesc} - Impuesto Destino ${this.taxToDesc}: `

    //this.dataForm.obs = joinTaxDesc;
  }

  private resetForm() {
    this.taxFromDesc = '';
    this.taxToDesc = '';
    this.joinTaxDesc = '';
    this.dataForm = structuredClone(this.cloneDataForm)
  }
  async askToSave() {
    try {

      if (!(this.dataForm.taxIdFrom > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Impuesto Inicial'
        })
        return
      }

      if (!(this.dataForm.quantityProducts > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'No se encontraron productos con impuesto inicial.'
        })
        return
      }

      if (!(this.dataForm.taxIdTo > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Impuesto Destino'
        })
        return
      }

      if (!isValidField(this.dataForm.obs.trim())) {
        this.tS.toastr({
          type: 'warning',
          message: 'La observacion es obligatorio.'
        })
        return
      }

      let obs = `${this.joinTaxDesc}${this.dataForm.obs}`;

      let { isConfirmed } = await Swal.fire({
        title: "Actualizar el Impuesto",
        html: `¿Esta seguro de actualizar el impuesto de los ${this.dataForm.quantityProducts} articulos  masivamente? </br>
              <span>
               <strong>Observación: </strong> <h4 class="card-title text-info">${obs}</h4>
              </span>
            `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: 'No'
      })

      if (!isConfirmed) return


      let params = {
        taxIdFrom: this.dataForm.taxIdFrom,
        taxIdTo: this.dataForm.taxIdTo,
        quantity: this.dataForm.quantityProducts,
        obs
      }
      this.massiveTaxSvc.put(params).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            if (response.code === "0") {
              this.tS.toastr({
                type: 'warning',
                message: response.message
              })
            }
            if (response.code === "1") {
              this.tS.toastr({
                type: 'success',
                message: response.message
              })
              this.getAll();
              this.resetForm();
            }
          }
        },
      })

    } catch (error) {
      console.log(error)
    }
  }
}
