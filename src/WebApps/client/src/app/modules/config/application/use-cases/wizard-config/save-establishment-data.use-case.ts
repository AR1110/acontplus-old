import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { WizardConfigRepository, WIZARD_CONFIG_REPOSITORY } from '@modules/config/domain/repositories/wizard-config.repository';
import { EstablishmentData } from '@modules/config/domain/models/wizard-config/value-objects/establishment-data.vo';

export interface SaveEstablishmentDataRequest {
  establishmentData: EstablishmentData;
  validateOnly?: boolean;
}

export interface SaveEstablishmentDataResponse {
  establishmentData: EstablishmentData;
  success: boolean;
  message?: string;
  validationErrors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SaveEstablishmentDataUseCase {
  private readonly _repository = inject(WIZARD_CONFIG_REPOSITORY);

  execute(request: SaveEstablishmentDataRequest): Observable<SaveEstablishmentDataResponse> {
    try {
      // Validate establishment data using domain logic
      const validationErrors = this.validateEstablishmentData(request.establishmentData);

      if (validationErrors.length > 0) {
        return throwError(() => new Error('Validation failed'));
      }

      if (request.validateOnly) {
        return new Observable(observer => {
          observer.next({
            establishmentData: request.establishmentData,
            success: true,
            validationErrors: []
          });
          observer.complete();
        });
      }

      // Check for establishment code uniqueness
      return this._repository.validateEstablishmentCode(request.establishmentData.establishmentCode).pipe(
        switchMap(isUnique => {
          if (!isUnique) {
            return throwError(() => new Error('Establishment code already exists'));
          }

          return this._repository.saveEstablishmentData(request.establishmentData).pipe(
            map(establishmentData => ({
              establishmentData,
              success: true,
              message: 'Establishment data saved successfully'
            })),
            catchError(error => {
              console.error('Error saving establishment data:', error);
              return throwError(() => new Error(error.message || 'Error saving establishment data'));
            })
          );
        }),
        catchError(error => {
          console.error('Error validating establishment code:', error);
          return throwError(() => new Error(error.message || 'Error validating establishment code'));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  private validateEstablishmentData(establishmentData: EstablishmentData): string[] {
    const errors: string[] = [];

    // Additional business validation beyond domain model validation
    if (establishmentData.establishmentCode && establishmentData.establishmentCode.length !== 3) {
      errors.push('Código de establecimiento debe tener exactamente 3 caracteres');
    }

    if (establishmentData.commercialName && establishmentData.commercialName.length < 2) {
      errors.push('Nombre comercial debe tener al menos 2 caracteres');
    }

    if (establishmentData.address && establishmentData.address.length < 5) {
      errors.push('Dirección debe tener al menos 5 caracteres');
    }

    // Email validation if provided
    if (establishmentData.correo) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(establishmentData.correo)) {
        errors.push('Formato de email inválido');
      }
    }

    // Phone validation if provided
    if (establishmentData.telefono) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      const digitsOnly = establishmentData.telefono.replace(/\D/g, '');
      if (!phoneRegex.test(establishmentData.telefono) || digitsOnly.length < 7) {
        errors.push('Formato de teléfono inválido');
      }
    }

    return errors;
  }
}
