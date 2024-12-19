import {Component, inject, Input, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TabulatorComponent} from '@core/components/tabulator/tabulator.component';
import {isApiResponse} from '@core/models/api-response';
import {GroupedEstab, GroupedEstabBodega} from '@core/models/estab.model';
import {ToasterService} from '@core/services/toaster.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {icon} from '@fortawesome/fontawesome-svg-core';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {ProductSale} from '@inventory/domain/models/product.model';
import {
  ProductSearchOverlayComponent
} from '@inventory/ui/product/components/product-search-overlay/product-search-overlay.component';
import {ConsolidacionBodega} from '@inventory/core/domain/consolidacion-bodega.model';
import {MedidaProducto} from '@inventory/core/domain/measure.model';
import {Tarifa} from '@inventory/core/domain/tarifa.model';
import {getCantidadStock, mergeProductStock} from '@modules/inventory/utils/product-stock.util';
import {supportMaintenanceAdapter} from '@modules/mechanical/adapters/support-maintenance.adapter';
import {
  ColSupportMaintenanceDetail,
  SupportMaintenanceDetail
} from '@mechanical/domain/models/support-maintenance.model';
import {SupportDetailService} from '@mechanical/data/support-detail/support-detail.service';
import {DecimalSale} from '@sale/shared/models/decimal-sale.model';
import {NgbActiveModal, NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DrawTaxTotalComponent} from '@shared/components/draw-tax-total/draw-tax-total.component';
import {InputDateComponent} from '@shared/components/input-date/input-date.component';
import {TarifaImpuesto} from '@shared/models/tarifa-impuesto.model';
import {SalesDetailCalculationService} from '@shared/services/sales-detail-calculation.service';
import Swal from 'sweetalert2';
import {ProductUseCase} from "@inventory/domain/usecases/product.use-case";

@Component({
    selector: 'app-support-maintenance-modal',
    imports: [
        FormsModule,
        FontAwesomeModule,
        NgbTooltipModule,
        NgbPopoverModule,
        TabulatorComponent,
        DrawTaxTotalComponent,
        ProductSearchOverlayComponent,
        InputDateComponent
    ],
    templateUrl: './support-maintenance-modal.component.html'
})
export class SupportMaintenanceModalComponent {
    @Input() params = {
        id: 0
    }

    modal = inject(NgbActiveModal)
  private _productUseCase = inject(ProductUseCase)

    private salesDetailCalculationSvc = inject(SalesDetailCalculationService);

    private supportDetailSvc = inject(SupportDetailService)
    private tS = inject(ToasterService)

    @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

    data = {
        id: 0,
        puntoEmisionId: 0,
        ptoEmi: null,
        establecimiento: null,
        establecimientoId: 0,
        vehicleCompanyId: 0,
        customerId: 0,
        fechaEmision: new Date(),
        sequence: "",
        obs: null,
        userAssignedId: 0,
        businessName: "",
        idCard: "",
        address: null,
        telephone: null,
        email: null,
        codEstab: "",
        bodegaId: 0,
        feeId: 0,
        subTotalSinImpuesto: 0,
        discount: 0,
        percentageDiscount: 0,
        total: 0,

    }
    cloneData = {
        bodegaId: 0,
        feeId: 0
    }
    details: SupportMaintenanceDetail[] = [];
    detailsDeleted: SupportMaintenanceDetail[] = [];

    estabs: GroupedEstab[] = []
    bodegas: GroupedEstabBodega[] = []
    taxes: any[] = []
    taxPercents: TarifaImpuesto[] = []

    decimal: DecimalSale = {
        nroPrecio: 0,
        nroCantidad: 0,
        nroIva: 0,
        nroDescuentoDetalle: 0,
        nroTotalDetalle: 0,
        nroTotalSubTotal: 0,
        nroDescuento: 0,
        importeTotal: 0,
        nroIce: 0
    }

    companyCustomer: any = {}
    vehicle: any = {}

    //Draw Totals Tax
    htmlImpuestoTotal = '';
    htmlIvaTotal = '';

    productSearch = {
        textSearch: ''
    }

    feeds: Tarifa[] = [];
    validatorNumber = ["required", "number"]

    comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
        let column: any = cell.getColumn().getField();
        let data: any = cell.getData();
        // let oldValue = cell.getOldValue();
        // let value = cell.getValue();

        let editor: any = document.createElement("select");

        if (column === "medidaId") {
            for (let m of data.medidas) {
                let opt = document.createElement('option');
                opt.value = m.idMedida.toString();
                opt.innerHTML = m.descripcion;
                editor.appendChild(opt);
            }
        }

        if (column === 'taxId') {
            for (let i of editorParams) {
                let opt = document.createElement('option');
                opt.value = i.idImpuesto;
                opt.innerHTML = i.descripcion;
                editor.appendChild(opt);
            }
        }

        if (column === "taxPercentId") {
            let taxPercents = editorParams.filter((ti: any) => ti.idImpuesto === Number(data.taxId));

            for (let ti of taxPercents) {
                let opt = document.createElement('option');
                opt.value = ti.idTarifaImpuesto;
                opt.innerHTML = ti.descripcion;
                editor.appendChild(opt);
            }
        }

        if (column === "feeId") {
            for (let t of data.tarifas) {
                let opt = document.createElement('option');
                opt.value = t.idTarifa.toString();
                opt.innerHTML = t.descripcion + ' - $' + t.precioConIva
                editor.appendChild(opt);
            }
        }

        if (column === "bodegaId") {
            for (let b of this.bodegas) {
                let opt = document.createElement('option');
                opt.value = b.idBodega.toString();
                opt.innerHTML = b.descripcion
                editor.appendChild(opt);
            }
        }


        editor.style.padding = "3px";
        editor.style.width = "100%";
        editor.style.boxSizing = "border-box";

        editor.value = Number(cell.getValue());

        onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
        });

        function successFunc() {
            success(editor.value);
        }

        editor.addEventListener("change", successFunc);
        editor.addEventListener("blur", successFunc);

        return editor;
    };

    askToDelete(data: SupportMaintenanceDetail) {
        try {
            Swal.fire({
                html: `Esta seguro de eliminar este elemento <b>${data.descripcion}</b>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!',
            }).then((result) => {
                if (result.isConfirmed) {
                    let index = this.details.findIndex(
                        (r) => r.rowguid === data.rowguid
                    );
                    this.details.splice(index, 1);

                    if (data.id > 0) {
                        this.detailsDeleted.push({
                            ...data,
                            enabled: false,
                            deleted: true
                        })
                    }

                    this.drawImpuestoTotales();
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    columns = [
        {
            formatter: "rownum",
            headerSort: false,
            hozAlign: "center",
        },
        {
            title: 'Op.',
            formatter: (cell: any) => {
                //let cellEl = cell.getElement();
                let rowDataMain = cell.getRow().getData();


                //create delete button
                let delBtn = document.createElement("button");
                delBtn.type = "button";
                delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
                delBtn.classList.add("btn", "btn-danger", "btn-xs");
                delBtn.addEventListener("click", () => {
                    let rowData = cell.getRow().getData();
                    this.askToDelete(rowData)
                });

                let buttonHolder = document.createElement("span");
                buttonHolder.appendChild(delBtn);

                return buttonHolder;
            },
            width: 100,
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
        },
        {
            title: 'Código',
            field: 'codigo',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "7px",
        },
        {
            title: 'Producto / Servicio',
            field: 'descripcion',
            editor: true,
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "20px",
            // formatter: (cell:any) =>{
            //   return cell.getValue().toUpperCase();
            // },
            editable: function (cell: any) {
                let data = cell.getRow().getData();
                return !data.llevaInventario
            }

        },
        {
            title: 'Cant.',
            field: 'quantity',
            hozAlign: 'center',
            headerSort: false,
            headerHozAlign: "center",
            width: "7px",

            validator: ["required"],
            editor: "number", editorParams: {

                selectContents: true,
                verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
            },

            // editorEmptyValueFunc: (value: any, cl: any) => {
            //   console.log(cl)
            //   if (/\s/.test(value)) {
            //     console.log(value)

            //   }
            // }
        },
        {
            title: 'Medida',
            field: 'medidaId',
            hozAlign: 'center',
            headerSort: false,
            headerHozAlign: "center",
            editor: this.comboEditor,
            formatter: function (cell: any) {
                let data = cell.getData();
                for (let m of data.medidas) {
                    if (m.idMedida == cell.getValue()) {
                        return m.descripcion;
                    }
                }
            },
            validator: "required",
            width: "9px",

        },

        // {
        //   title: 'Imp.',
        //   field: 'taxId',
        //   headerSort: false,
        //   headerHozAlign: "center",
        //   width: "7px",
        //   editor: this.comboEditor,

        //   editorParams: () => this.taxes,
        //   formatter: function (cell: any, formatterParams: any) {
        //     for (var i = 0; i < formatterParams.length; i++) {

        //       if (formatterParams[i].idImpuesto == cell.getValue()) {
        //         return formatterParams[i].descripcion;
        //       }
        //     }
        //   },
        //   formatterParams: () => this.taxes,
        //   validator: "required",
        // },
        {
            title: 'T. Imp.',
            field: 'taxPercentId',
            headerSort: false,
            headerHozAlign: "center",
            width: "8px",
            editor: this.comboEditor,
            editorParams: () => this.taxPercents,
            formatter: function (cell: any, formatterParams: any) {
                for (let ti of formatterParams) {
                    if (ti.idTarifaImpuesto == cell.getValue()) {
                        return ti.descripcion;
                    }
                }
            },
            formatterParams: () => this.taxPercents,
            validator: "required",

        },
        {
            title: 'Tarifa',
            field: 'feeId',
            headerSort: false,
            headerHozAlign: "center",
            width: "8px",
            editor: this.comboEditor,
            formatter: function (cell: any) {
                let data = cell.getData();
                for (let t of data.tarifas) {
                    if (t.idTarifa == cell.getValue()) {
                        return t.descripcion;
                    }
                }
            },
            validator: "required",

        },
        {
            title: 'Precio U.',
            field: 'price',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "9px",
            validator: ["required"],
            editor: "number",
            editorParams: {
                selectContents: true,
                verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
            },
            formatterParams: {precision: false}
        },
        {
            title: 'Precio Iva.',
            field: 'precioConIva',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "9px",
            validator: ["required"],
            editor: "number", editorParams: {
                selectContents: true,
                verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
            },
            formatterParams: {stars: 6}
        },
        {
            title: '%',
            field: 'percentageDiscount',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "6px",
            validator: ["required"],
            editor: "number", editorParams: {
                selectContents: true,
                verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
            },
        },
        {
            title: 'Desc.',
            field: 'discount',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "6px",
            validator: ["required"],
            editor: "number", editorParams: {
                selectContents: true,
                verticalNavigation: "table", //up and down arrow keys navigate away from cell without changing value
            },
        },
        {
            title: 'Subtotal',
            field: 'precioTotalSinImpuesto',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "6px",
        },
        {
            title: 'Iva',
            field: 'taxValue',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "6px",
        },
        {
            title: 'Total',
            field: 'total',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "6px",
        },
        {
            title: 'Nota',
            field: 'obs',
            headerSort: false,
            hozAlign: "center",
            headerHozAlign: "center",
            width: "8px",
            editor: "input"
        },
        {
            title: 'Bodega',
            field: 'bodegaId',
            headerSort: false,
            headerHozAlign: "center",
            width: "9px",
            editor: this.comboEditor,
            editorParams: () => this.bodegas,
            formatter: function (cell: any, formatterParams: any) {
                for (let ti of formatterParams) {
                    if (ti.idBodega == cell.getValue()) {
                        return ti.descripcion;
                    }
                }
            },
            formatterParams: () => this.bodegas,
            validator: "required"
        },

    ];

    tabulatorOptions = {
        // movableRows: true,
        height: "100%",
    }

    ngOnInit(): void {
        this.supportDetailSvc.getId(this.params.id).subscribe({
            next: (response) => {
                this.data = {
                    ...this.data,
                    ...response.data
                };

                console.log("response")
                console.log(response)

                this.estabs = response.estabs;
                this.taxPercents = response.tarifasImpuesto;
                this.feeds = response.feeds;
                this.vehicle = response.vehicle
                this.decimal = response.decimal

                this.details = response.details;
                let dataEstab = this.estabs.find(e => e.idEstablecimiento === this.data.establecimientoId);
                if (dataEstab) {
                    this.bodegas = dataEstab.bodegas;
                    let dataBodega = this.bodegas.find(b => b.defaultBodega);
                    if (dataBodega) {
                        this.data.bodegaId = dataBodega.idBodega;
                    }
                }

                let dataTarifa = this.feeds.find((t) => t.predeterminada);
                if (dataTarifa) {
                    this.data.feeId = dataTarifa.idTarifa;
                    this.cloneData.feeId = dataTarifa.idTarifa;
                }

                this.drawImpuestoTotales()
            },
            error(err) {
                console.log(err)
            },
        });
    }

    getDataRowEmpty() {
        let detailsEmpty = new SupportMaintenanceDetail()
        return detailsEmpty;
    }

    onResultSelectedProduct(response: any) {
        let tempDetails = structuredClone(this.details);


        let product = response.product as ProductSale;
        let medidas = response.medidas as MedidaProducto[];
        let consolidacionesFecha = response.consolidacionesFecha as ConsolidacionBodega[]

        let row = this.getDataRowEmpty();
        let dataTaxPercent = this.taxPercents.find(d => d.codigo === product.codigoPorcentaje);


        let findDataProduct = tempDetails.find(item => item.llevaInventario && item.productId === product.idArticulo);


        row.productId = product.idArticulo;
        row.codigo = product.codigoArticulo;
        row.descripcion = product.descripcion;
        row.bodegaId = this.data.bodegaId;
        row.llevaInventario = product.llevaInventario;
        row.consolidacionesBodega = consolidacionesFecha;

        if (dataTaxPercent) {
            row.taxPercentId = dataTaxPercent.idTarifaImpuesto;
            row.taxId = dataTaxPercent.idImpuesto;
        }

        let dataMedida = medidas.find(m => m.defaultMedida);

        if (dataMedida) {
            row.medidas = medidas;
            row.quantity = 1;
            row.tarifas = dataMedida.tarifas;
            row.medidaId = dataMedida.idMedida;
            row.cost = dataMedida.precioCosto;
            row.costoFraccionado = dataMedida.precioCostoFraccionado;
            row.conversion = dataMedida.conversion;

            let dataTarifa = row.tarifas.find(t => t.defaultTarifa);


            row.feeId = dataTarifa?.idTarifa ?? 0;
            row.price = dataTarifa?.precioVenta ?? 0;
            row.precioConIva = dataTarifa?.precioConIva ?? 0;

        }


        //Producto de tipo Servicio
        if (!product.llevaInventario) {
            tempDetails.push(row)
            this.details = tempDetails;
            this.setCalculoTotales("quantity", row, undefined)
            return
        }

        //Producto que lleva inventario
        if (product.llevaInventario) {
            let oldValue = 1;
            let productsDuplicated = structuredClone(tempDetails).filter(item => (
                item.llevaInventario && item.productId === product.idArticulo
            ))

            productsDuplicated.push({...row})


            // let cloneOrderMaintenances = structuredClone(this.orderMaintenances);
            // let findDataProduct = this.orderMaintenances.find(item => item.llevaInventario && item.productId === product.idArticulo);

            if (findDataProduct) {
                oldValue = findDataProduct.quantity;
                row = findDataProduct;
                row.quantity += 1;
            } else {
                tempDetails.push(row)
                this.details = tempDetails;
            }


            let dataProductMerge = mergeProductStock({
                rows: structuredClone(productsDuplicated),
                row: structuredClone(row)
            });

            console.log(dataProductMerge)


            let cantidadStock = getCantidadStock({
                fechaEmision: this.data.fechaEmision,
                bodegaId: this.data.bodegaId,
                cantidadStock: dataProductMerge.cantidadStock,
                consolidacionesFecha: row.consolidacionesBodega
            });
            this._productUseCase.checkNotificationStock({
                idArticulo: row.productId,
                idBodega: this.data.bodegaId,
                idMedida: row.medidaId,
                cantidad: cantidadStock
            }).subscribe({
                next: async (response) => {
                    if (isApiResponse(response)) {

                        let {code, message, titleSms} = response;

                        if (code === "1") {
                            console.log(row)
                            this.setCalculoTotales("quantity", row, oldValue)
                            return
                        }

                        let {isConfirmed} = await Swal.fire({
                            title: `<small>${titleSms}</small>`,
                            icon: 'warning',
                            html: `<small>${message}</small>`,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        })

                        if (isConfirmed) {
                            if (code === "0") {
                                row.quantity = oldValue;
                                this.setCalculoTotales("quantity", row, oldValue)
                            }
                            if (code === "2") {

                                this.setCalculoTotales("quantity", row, undefined);
                            }
                        }

                    }
                },
                error(error) {
                    console.log(error)
                }
            })

        }
    }

    async onChangeBodega() {
        try {
            let bodega = this.bodegas.find(
                (item) => item.idBodega === this.data.bodegaId
            );
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2',
                },
                buttonsStyling: false,
            });

            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Cambiar Bodega</small>',
                html: `<small>¿Esta seguro de cambiar la Bodega: <b>${bodega?.descripcion}</b>  en el detalle del Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Si, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            if (isConfirmed) {
                this.cloneData.bodegaId = this.data.bodegaId;

                if (this.details.length === 0) return;

                this.setIdBodegaInDetalle();
                this.resetCantidadToZeroAndRecalculateTotals();
            } else {
                this.data.bodegaId = this.cloneData.bodegaId;
            }
        } catch (error) {
            console.log(error);
        }
    }


    setIdBodegaInDetalle() {
        for (let item of this.details) {
            item.bodegaId = this.data.bodegaId;
        }
    }

    resetCantidadToZeroAndRecalculateTotals() {
        try {
            for (let row of this.details) {
                if (!row.llevaInventario) continue;

                row.quantity = 0;

                this.setCalculoTotales('quantity', row, undefined);
            }
        } catch (error) {
            console.log(error);
        }
    }


    async onChangeFee() {
        try {
            // if (!$scope.permisoComprobanteVenta.tarifa) {
            //   $scope.data.idTarifa = $scope.dataClone.idTarifa;
            //   tS.toastr('warning', 'No tienes permiso para realizar esta acción');
            //   return
            // }

            let tarifa = this.feeds.find(
                (item) => item.idTarifa === this.data.feeId
            );
            let {isConfirmed} = await Swal.fire({
                html: `<small>¿Esta seguro de aplicar este tarifa: <b>${tarifa?.descripcion}</b> en los precios de venta en todo el Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Sí, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
            });

            if (isConfirmed) {
                this.cloneData.feeId = this.data.feeId;

                if (this.details.length === 0) return;

                this.salesDetailCalculationSvc.setFeeInDetail({
                    generalFeeId: this.data.feeId,
                    items: this.details,
                    decimal: this.decimal,
                    columnDefs: this.columns,
                    tarifasImpuesto: this.taxPercents,
                });

                this.drawImpuestoTotales();
            } else {
                this.data.feeId = this.cloneData.feeId;
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     *
     * @param {*} column nombre de la columnas
     * @param {*} data  data row
     * @param {*} oldValue valor anterior de la columna
     */
    setCalculoTotales(column: any, data: SupportMaintenanceDetail, oldValue?: string | number) {

        let obj = this.salesDetailCalculationSvc.calculateColDef({
            data: data,
            column,
            oldValue,
            generalFeeId: this.data.feeId,
            decimal: this.decimal,
            columnDefs: this.columns
        });

        let row = this.tabulatorComponent.refTabulator.getRows().find(function (row) {
            return row.getData()['rowguid'] === data.rowguid;
        });
        console.log(obj)

        if (row) {
            row.update({
                data,
                ...obj
            })
        }


        this.drawImpuestoTotales();
    }

    drawImpuestoTotales() {
        try {

            let {
                subTotalSinImpuesto,
                htmlImpuestoTotal,
                htmlIvaTotal,
                irbpnr,
                totalIce,
                importeTotal,
                discount,
                percentageDiscount,
                propina,
            } = this.salesDetailCalculationSvc.getTaxTotals({
                items: this.details,
                decimal: this.decimal,
                tarifasImpuesto: this.taxPercents,
            })

            console.log(this.decimal)

            this.data.subTotalSinImpuesto = subTotalSinImpuesto;
            this.data.total = importeTotal;
            this.data.discount = discount;
            this.data.percentageDiscount = percentageDiscount;
            // this.data.tip = propina;
            this.htmlImpuestoTotal = htmlImpuestoTotal;
            this.htmlIvaTotal = htmlIvaTotal;
        } catch (error) {
            console.log(error);
        }
    }

    cellEdited(cell: any) {

        let row = cell.getRow();
        let column: ColSupportMaintenanceDetail = cell.getColumn().getField();
        let oldValue = parseFloat(cell.getOldValue());
        let value = parseFloat(cell.getValue());

        let data = cell.getData();

        let quantity = parseFloat(data.quantity);
        let medidaId = parseInt(data.medidaId);
        let taxId = parseInt(data.taxId);
        let taxPercentId = parseInt(data.taxPercentId);
        let feeId = parseInt(data.feeId);
        let price = parseFloat(data.price);
        let precioConIva = parseFloat(data.precioConIva);
        let percentageDiscount = parseFloat(data.percentageDiscount);
        let discount = parseFloat(data.discount);

        if (column === "descripcion" || column === "obs") return

        if (value === oldValue) {
            cell.setValue(oldValue);
            return
        }

        if (isNaN(value) || cell.getValue() === "") {
            cell.setValue(oldValue);
            return
        }

        if (value < 0) {
            data[column] = oldValue;
        }

        if (column === "taxId") {
            if (!this.taxPercents.some(t => t.idImpuesto === Number(value))) {
                taxId = oldValue;
            } else {
                let cellInOtherColumn = row.getCell("taxPercentId");
                // Establecer el foco en la celda
                cellInOtherColumn.edit()
                cellInOtherColumn.getElement().focus();
                return
            }
        }

        if (column === 'quantity') {
            if (["", null, 0].includes(value)) {
                cell.getRow().deselect();
                cell.restoreOldValue();
            }
        }

        let cloneData = {
            ...data,
            quantity,
            medidaId,
            taxId,
            taxPercentId,
            feeId,
            price,
            precioConIva,
            percentageDiscount,
            discount,
        }
        this.setCalculoTotales(column, cloneData, oldValue);
    }

    private isValidForm() {
        if (this.details.length === 0) {
            this.tS.toastr({
                type: 'warning',
                message: 'Ingrese al menos un artículo en el detalle'
            })
            return
        }

        if (this.details.some(row => row.llevaInventario && row.quantity === 0)) {
            this.tS.toastr({
                type: 'warning',
                message: 'No es posible vender artículos con inventario cuando la cantidad es igual a 0.'
            })
            return
        }

        if (this.details.some(row => !(row.bodegaId > 0))) {
            this.tS.toastr({
                type: 'warning',
                message: 'Seleccione la bodega en el detalle de los artículos'
            })
            return
        }


        if (this.data.total <= 0) {
            this.tS.toastr({
                type: 'warning',
                message: 'No se puede generar el documento con valor total 0!'
            })
            return
        }

        return true;
    }

    async save() {
        try {
            if (!this.isValidForm()) return

            let {isConfirmed} = await Swal.fire({
                text: "¿Estás seguro de que deseas guardar este documento?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si",
                cancelButtonText: 'No'
            })

            if (!isConfirmed) return


            let obj = {
                data: structuredClone(this.data),
                details: this.details,
                detailsDeleted: this.detailsDeleted
            }
            let params = supportMaintenanceAdapter.to(obj);

            this.supportDetailSvc.post(params).subscribe({
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
                            this.modal.close(response)
                        }
                    }

                },
                error(err) {
                    console.log(err)
                },
            })

        } catch (error) {
            console.log(error)
        }
    }

}
