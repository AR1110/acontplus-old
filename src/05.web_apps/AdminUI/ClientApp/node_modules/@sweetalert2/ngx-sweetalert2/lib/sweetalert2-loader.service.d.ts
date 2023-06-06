import SwalDefault, * as Swal from 'sweetalert2';
import * as i0 from "@angular/core";
export declare type SwalModule = typeof SwalDefault | typeof Swal;
export declare type SwalProvider = SwalModuleLoader | SwalModule;
export declare type SwalModuleLoader = () => Promise<SwalModule>;
export declare class SweetAlert2LoaderService {
    private readonly swalProvider;
    private swalPromiseCache?;
    constructor(swalProvider: any);
    get swal(): Promise<typeof SwalDefault>;
    preloadSweetAlertLibrary(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SweetAlert2LoaderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SweetAlert2LoaderService>;
}
