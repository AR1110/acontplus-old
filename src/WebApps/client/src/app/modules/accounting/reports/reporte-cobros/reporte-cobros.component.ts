import { Component, OnInit, inject } from '@angular/core';
import { AccountingModule } from "../../accounting.module";
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '@core/services/toaster.service';
import { DOC_TYPE, PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@modules/accounting/enums/accounting.constants';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { AppModule } from 'src/app/app.module';
import { isValidField } from '@core/utils/utils';

@Component({
    selector: 'app-reporte-cobros',
    standalone: true,
    templateUrl: './reporte-cobros.component.html',
    styles: ``,
    imports: [AccountingModule, AppModule]
})
export class ReporteCobrosComponent implements OnInit {
    [x: string]: any;
    http = inject(HttpClient);

    // Services
    private tS = inject(ToasterService)
    private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`

    // VARIABLES Y CONSTANTES
    establecimientos: Array<GroupedEstab> = [];
    puntosEmision: Array<GroupedEstabPuntoEmision> = [];
    tiposDoc: Array<Pick<TipoDoc, 'descripcion'> & { codDoc: string }> = [];
    estadosDoc: Array<{ codigo: string, descripcion: string }> = [];

    dataSearch = {
        codEstab: '',
        idPuntoEmision: 0,
        codDoc: '',
        idProveedor: 0,
        codEstado: '',
        fromDate: formatDateMoment(new Date()),
        toDate: formatDateMoment(new Date()),
        supplierChecked: false,
        supplierName: '',
        pxCuotas: false,
        pxDocumento: false,
    }

    ngOnInit(): void {
        this.getInitialLoad();
    }

    getInitialLoad() {
        showLoader();

        const PARAMS = {
            params: { json: JSON.stringify({ tipo: 6 }) }
        }

        this.http.get(this.url, PARAMS).subscribe({
            next: (response) => {
                hideLoader();

                if (isApiResponse(response)) {
                    if (response.code === "0") {
                        return console.log(response);
                    }

                    const [estabs, estadosDoc, tiposDoc] = JSON.parse(response.payload as string);

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
                    this.dataSearch.codDoc = this.tiposDoc.find(tipoDoc => tipoDoc.codDoc === DOC_TYPE.FC)?.codDoc || '';
                    this.estadosDoc = estadosDoc;
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
}
