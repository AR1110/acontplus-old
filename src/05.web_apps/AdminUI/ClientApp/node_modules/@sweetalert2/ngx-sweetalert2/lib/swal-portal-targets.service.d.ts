import Swal, { SweetAlertOptions } from 'sweetalert2';
import * as i0 from "@angular/core";
export interface SwalPortalTarget {
    options?: SweetAlertOptions;
    element(swal: typeof Swal): HTMLElement | null;
}
/**
 * Represents an object of targets for <swal> portals (use with *swalPortal directive).
 * We must use thunks to access the Swal.* functions listed below, because they get created after the first modal is
 * shown, so this object lets us reference those functions safely and in a statically-typed manner.
 */
export declare class SwalPortalTargets {
    /**
     * Targets the modal close button block contents.
     */
    readonly closeButton: SwalPortalTarget;
    /**
     * Targets the modal title block contents.
     */
    readonly title: SwalPortalTarget;
    /**
     * Targets the modal text block contents (that is another block inside the first content block, so you can still
     * use other modal features like Swal inputs, that are situated inside that parent content block).
     */
    readonly content: SwalPortalTarget;
    /**
     * Targets the actions block contents, where are the confirm and cancel buttons in a normal time.
     * /!\ WARNING: using this target destroys some of the native SweetAlert2 modal's DOM, therefore, if you use this
     *     target, do not update the modal via <swal> @Inputs while the modal is open, or you'll get an error.
     *     We could workaround that inconvenient inside this integration, but that'd be detrimental to memory and
     *     performance of everyone, for a relatively rare use case.
     */
    readonly actions: SwalPortalTarget;
    /**
     * Targets the confirm button contents, replacing the text inside it (not the button itself)
     */
    readonly confirmButton: SwalPortalTarget;
    /**
     * Targets the deny button contents, replacing the text inside it (not the button itself)
     */
    readonly denyButton: SwalPortalTarget;
    /**
     * Targets the cancel button contents, replacing the text inside it (not the button itself)
     */
    readonly cancelButton: SwalPortalTarget;
    /**
     * Targets the modal footer contents.
     */
    readonly footer: SwalPortalTarget;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwalPortalTargets, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SwalPortalTargets>;
}
