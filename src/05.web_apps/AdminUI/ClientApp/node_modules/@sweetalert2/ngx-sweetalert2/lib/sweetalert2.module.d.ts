/// <reference types="sweetalert2" />
import { ModuleWithProviders } from '@angular/core';
import { SwalProvider } from './sweetalert2-loader.service';
import * as i0 from "@angular/core";
import * as i1 from "./swal.directive";
import * as i2 from "./swal.component";
import * as i3 from "./swal-portal.directive";
import * as i4 from "./swal-portal.component";
import * as i5 from "@angular/common";
export interface Sweetalert2ModuleConfig {
    provideSwal?: SwalProvider;
    fireOnInit?: boolean;
    dismissOnDestroy?: boolean;
}
export declare function provideDefaultSwal(): Promise<typeof import("sweetalert2")>;
export declare class SweetAlert2Module {
    static forRoot(options?: Sweetalert2ModuleConfig): ModuleWithProviders<SweetAlert2Module>;
    static forChild(options?: Sweetalert2ModuleConfig): ModuleWithProviders<SweetAlert2Module>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SweetAlert2Module, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<SweetAlert2Module, [typeof i1.SwalDirective, typeof i2.SwalComponent, typeof i3.SwalPortalDirective, typeof i4.SwalPortalComponent], [typeof i5.CommonModule], [typeof i2.SwalComponent, typeof i3.SwalPortalDirective, typeof i1.SwalDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<SweetAlert2Module>;
}
