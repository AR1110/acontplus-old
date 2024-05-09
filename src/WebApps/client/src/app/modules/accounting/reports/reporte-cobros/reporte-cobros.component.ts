import { Component, OnInit, inject } from '@angular/core';
import { AccountingModule } from "../../accounting.module";
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '@core/services/toaster.service';
import { CODE_REPORT, DOC_TYPE, PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@modules/accounting/enums/accounting.constants';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { AppModule } from 'src/app/app.module';
import { isValidField } from '@core/utils/utils';
import { SubEntidadFinancieraSelectHtmlOnly } from '@modules/accounting/models/subentidad-financiera.model';
import { SharedService } from '@core/services/shared.service';

@Component({
    selector: 'app-reporte-cobros',
    standalone: true,
    templateUrl: './reporte-cobros.component.html',
    styles: ``,
    imports: [AccountingModule, AppModule]
})
export class ReporteCobrosComponent implements OnInit {
    http = inject(HttpClient);

    // Services
    private tS = inject(ToasterService)
    private sharedSvc = inject(SharedService);
    private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_INGRESO}`

    // VARIABLES Y CONSTANTES
    establecimientos: Array<GroupedEstab> = [];
    puntosEmision: Array<GroupedEstabPuntoEmision> = [];
    tiposDoc: Array<Pick<TipoDoc, 'descripcion'> & { codDoc: string }> = [];
    subEntidadFinanciera: Array<SubEntidadFinancieraSelectHtmlOnly> = [];
    isCustomerSearchSimple = true;

    dataSearch = {
        codEstab: '',
        idPuntoEmision: 0,
        codDoc: '',
        customerId: 0,
        idSubEntidadFinanciera: 0,
        fromDate: formatDateMoment(new Date()),
        toDate: formatDateMoment(new Date()),
        supplierChecked: false,
        pxDocumento: true,
        dateChecked: true,
    }

    ngOnInit(): void {
        this.getInitialLoad();
    }

    getInitialLoad() {
        showLoader();

        const PARAMS = {
            params: { json: JSON.stringify({ tipo: 4 }) }
        }

        this.http.get(this.url, PARAMS).subscribe({
            next: (response) => {
                hideLoader();

                if (isApiResponse(response)) {
                    if (response.code === "0") {
                        return console.log(response);
                    }

                    const [estabs, tiposDoc, subEntidadFinanciera] = JSON.parse(response.payload as string);
                    this.establecimientos = groupEstabUtil({ estabs, isGroupPuntoEmision: true })

                    const dataEstab = this.establecimientos.find(estab => estab.defaultEstab);
                    if (dataEstab) {

                        this.dataSearch.codEstab = dataEstab.codEstab;
                        this.puntosEmision = dataEstab.puntosEmision;

                        const dataPuntoEmision = this.puntosEmision.find(ptoEmi => ptoEmi.defaultPtoEmi);
                        if (dataPuntoEmision) {
                            this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                        }
                    }
                    this.tiposDoc = tiposDoc;
                    this.subEntidadFinanciera = subEntidadFinanciera;
                    this.dataSearch.codDoc = this.tiposDoc.find(tipoDoc => tipoDoc.codDoc === DOC_TYPE.FV)?.codDoc || '';


                    console.log(this.subEntidadFinanciera);
                }
            }, error(err) {
                hideLoader()
                console.log(err)
            },
        })
    }

    onChangeEstab() {
        if (isValidField(this.dataSearch.codEstab)) {
            let dataEstab = this.establecimientos.find(estab => estab.codEstab === this.dataSearch.codEstab);
            if (dataEstab) {
                this.puntosEmision = dataEstab.puntosEmision;

                this.dataSearch.idPuntoEmision = this.puntosEmision.find(ptoEmi => ptoEmi.defaultPtoEmi)?.idPuntoEmision || 0;
                return
            }
        }
        this.dataSearch.idPuntoEmision = 0;
    }

    onDateRangeSelection(range: { from: string, to: string }) {
        this.dataSearch.fromDate = range.from;
        this.dataSearch.toDate = range.to;
    }

    onCustomerSelected<T extends { data: any }>($event: T) {
        let { data } = $event;
        this.dataSearch.customerId = data.idCliente;
    }

    resultCustomerEmptyInput($event: any) {
        this.dataSearch.customerId = 0;
    }

    getReport(format: 'pdf' | 'excel') {

        if (!isValidField(this.dataSearch.fromDate)) {
            this.tS.toastr({
                type: 'warning',
                message: 'Ingrese fecha inicio'
            })
            return
        }

        if (!isValidField(this.dataSearch.toDate)) {
            this.tS.toastr({
                type: 'warning',
                message: 'Ingrese fecha fin'
            })
            return
        }

        if (this.dataSearch.supplierChecked) {
            if (!isValidField(this.dataSearch.customerId)) {
                this.tS.toastr({
                    type: 'warning',
                    message: 'Seleccione el cliente'
                })
                return
            }
        }


        const dataParms = {
            tipo: this.dataSearch.pxDocumento ? 1 : 2,
            format,
            codEstab: isValidField(this.dataSearch.codEstab),
            codDoc: isValidField(this.dataSearch.codDoc),
            idSubEntidadFinanciera: this.dataSearch.idSubEntidadFinanciera,
            idCustomer: this.dataSearch.supplierChecked && isValidField(this.dataSearch.customerId) || null,
            idPuntoEmision: this.dataSearch.idPuntoEmision,
            fechaInicio: this.dataSearch.fromDate,
            fechaFin: this.dataSearch.toDate,
            dateChecked: this.dataSearch.dateChecked,
        }

        const parameters = {
            reportParams: JSON.stringify({
                codEstab: this.dataSearch.codEstab,
                codigo: this.dataSearch.pxDocumento ? CODE_REPORT.RCXD : CODE_REPORT.RCXC,
                format,
            }),
            dataParams: JSON.stringify(dataParms)
        }
        this.sharedSvc.getReport(parameters, format)
    }
}
