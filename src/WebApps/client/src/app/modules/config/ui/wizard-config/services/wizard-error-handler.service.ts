import { Injectable, inject } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface ErrorContext {
  operation: string;
  component: string;
  additionalInfo?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class WizardErrorHandlerService {
  private readonly _toasterService = inject(ToastrNotificationService);

  handleApiError(error: unknown, context: ErrorContext): void {
    console.error(`Error in ${context.component} during ${context.operation}:`, error);

    let message = 'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.';

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (this.isApiResponse(error)) {
      message = error.message || message;
    }

    this._toasterService.show({
      type: 'error',
      message,
      title: `Error en ${context.operation}`,
    });
  }

  handleValidationError(errors: string[], context: ErrorContext): void {
    console.warn(`Validation errors in ${context.component}:`, errors);

    const message =
      errors.length === 1 ? errors[0] : `Se encontraron ${errors.length} errores de validación.`;

    this._toasterService.show({
      type: 'warning',
      message,
      title: 'Errores de Validación',
    });
  }

  handleSuccess(message: string, title?: string): void {
    this._toasterService.show({
      type: 'success',
      message,
      title: title || 'Éxito',
    });
  }

  handleWarning(message: string, title?: string): void {
    this._toasterService.show({
      type: 'warning',
      message,
      title: title || 'Advertencia',
    });
  }

  private isApiResponse(obj: unknown): obj is ApiResponseLegacy {
    return obj !== null && typeof obj === 'object' && 'code' in obj && 'message' in obj;
  }
}
