import {CajaRepository} from "@accounting/data/repositories/caja-repository";
import {InjectionToken} from "@angular/core";


export const CAJA_HTTP_TOKEN = new InjectionToken<CajaRepository>('CAJA_HTTP_TOKEN');


