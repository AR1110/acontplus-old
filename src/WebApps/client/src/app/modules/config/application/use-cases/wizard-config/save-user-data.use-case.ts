import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { WIZARD_CONFIG_REPOSITORY } from '@modules/config/domain/repositories/wizard-config.repository';
import { UserData } from '@modules/config/domain/models/wizard-config/value-objects/user-data.vo';

export interface SaveUserDataRequest {
  userData: UserData;
}

export interface SaveUserDataResponse {
  userData: UserData;
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SaveUserDataUseCase {
  private readonly _repository = inject(WIZARD_CONFIG_REPOSITORY);

  execute(request: SaveUserDataRequest): Observable<SaveUserDataResponse> {
    // Validate user data before saving
    try {
      request.userData.validate();
    } catch (error) {
      return new Observable<SaveUserDataResponse>(observer => {
        observer.error(new Error(`Validation failed: ${error}`));
      });
    }

    return this._repository.saveUserData(request.userData).pipe(
      map(savedUserData => ({
        userData: savedUserData,
        success: true,
        message: 'User data saved successfully'
      })),
      catchError(error => {
        console.error('Error saving user data:', error);
        return new Observable<SaveUserDataResponse>(observer => {
          observer.error(new Error(`Failed to save user data: ${error.message}`));
        });
      })
    );
  }
}
