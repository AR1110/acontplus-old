import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WizardConfigRepository } from '@modules/config/domain/repositories/wizard-config.repository';
import { WizardConfiguration } from '@modules/config/domain/models/wizard-config/wizard-configuration.model';
import { WizardStep } from '@modules/config/domain/models/wizard-config/wizard-step.model';
import { UserData } from '@modules/config/domain/models/wizard-config/value-objects/user-data.vo';
import { EstablishmentData } from '@modules/config/domain/models/wizard-config/value-objects/establishment-data.vo';
import { PATHS_API } from '@core/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class WizardConfigRepositoryImpl implements WizardConfigRepository {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = `${PATHS_API.CONFIG}${CONFIG_PATHS.COMPANY_DEMO_STEP}`;

  // In-memory storage for demo purposes
  private readonly _wizardConfigSubject =
    new BehaviorSubject<WizardConfiguration | null>(null);
  private readonly _userDataSubject = new BehaviorSubject<UserData | null>(
    null
  );
  private readonly _establishmentDataSubject =
    new BehaviorSubject<EstablishmentData | null>(null);

  // Wizard Configuration Management
  getWizardConfiguration(): Observable<WizardConfiguration> {
    const currentConfig = this._wizardConfigSubject.value;
    if (currentConfig) {
      return of(currentConfig);
    }

    // Load from API or create default
    return this._http.get<any>(`${this._baseUrl}`).pipe(
      map((response) => this.mapToWizardConfiguration(response)),
      catchError(() => {
        // Return default configuration if API fails
        return this.createDefaultConfiguration();
      })
    );
  }

  saveWizardConfiguration(
    config: WizardConfiguration
  ): Observable<WizardConfiguration> {
    this._wizardConfigSubject.next(config);

    return this._http
      .post<any>(`${this._baseUrl}/configuration`, config.toJSON())
      .pipe(
        map((response) => this.mapToWizardConfiguration(response)),
        catchError((error) => {
          console.error('Error saving wizard configuration:', error);
          return throwError(
            () => new Error('Error saving wizard configuration')
          );
        })
      );
  }

  resetWizardConfiguration(): Observable<void> {
    this._wizardConfigSubject.next(null);
    this._userDataSubject.next(null);
    this._establishmentDataSubject.next(null);

    return this._http.delete(`${this._baseUrl}/configuration`).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error('Error resetting wizard configuration:', error);
        return throwError(
          () => new Error('Error resetting wizard configuration')
        );
      })
    );
  }

  // Step Management
  getSteps(): Observable<WizardStep[]> {
    return this.getWizardConfiguration().pipe(map((config) => config.steps));
  }

  updateStep(
    stepId: string,
    updates: Partial<WizardStep>
  ): Observable<WizardStep> {
    return this.getWizardConfiguration().pipe(
      map((config) => {
        const updatedConfig = config.updateStep(stepId, updates);
        this._wizardConfigSubject.next(updatedConfig);
        return updatedConfig.getStepById(stepId)!;
      }),
      catchError((error) => {
        console.error('Error updating step:', error);
        return throwError(() => new Error('Error updating step'));
      })
    );
  }

  completeStep(stepId: string): Observable<WizardStep> {
    return this.getWizardConfiguration().pipe(
      map((config) => {
        const step = config.getStepById(stepId);
        if (!step) {
          throw new Error('Step not found');
        }

        const updatedConfig = config.updateStep(stepId, { isCompleted: true });
        this._wizardConfigSubject.next(updatedConfig);
        return updatedConfig.getStepById(stepId)!;
      }),
      catchError((error) => {
        console.error('Error completing step:', error);
        return throwError(() => new Error('Error completing step'));
      })
    );
  }

  resetStep(stepId: string): Observable<WizardStep> {
    return this.getWizardConfiguration().pipe(
      map((config) => {
        const step = config.getStepById(stepId);
        if (!step) {
          throw new Error('Step not found');
        }

        const updatedConfig = config.updateStep(stepId, { isCompleted: false });
        this._wizardConfigSubject.next(updatedConfig);
        return updatedConfig.getStepById(stepId)!;
      }),
      catchError((error) => {
        console.error('Error resetting step:', error);
        return throwError(() => new Error('Error resetting step'));
      })
    );
  }

  // User Data Management
  getUserData(): Observable<UserData | null> {
    const currentUserData = this._userDataSubject.value;
    if (currentUserData) {
      return of(currentUserData);
    }

    return this._http.get<any>(`${this._baseUrl}/user-data`).pipe(
      map((response) => (response ? new UserData(response) : null)),
      catchError(() => of(null))
    );
  }

  saveUserData(userData: UserData): Observable<UserData> {
    this._userDataSubject.next(userData);

    return this._http
      .post<any>(`${this._baseUrl}/user-data`, userData.toJSON())
      .pipe(
        map((response) => new UserData(response)),
        catchError((error) => {
          console.error('Error saving user data:', error);
          return throwError(() => new Error('Error saving user data'));
        })
      );
  }

  updateUserData(updates: Partial<UserData>): Observable<UserData> {
    const currentUserData = this._userDataSubject.value;
    if (!currentUserData) {
      return throwError(() => new Error('No user data to update'));
    }

    const updatedUserData = currentUserData.update(updates);
    this._userDataSubject.next(updatedUserData);

    return this._http
      .put<any>(`${this._baseUrl}/user-data`, updatedUserData.toJSON())
      .pipe(
        map((response) => new UserData(response)),
        catchError((error) => {
          console.error('Error updating user data:', error);
          return throwError(() => new Error('Error updating user data'));
        })
      );
  }

  // Establishment Data Management
  getEstablishmentData(): Observable<EstablishmentData | null> {
    const currentEstablishmentData = this._establishmentDataSubject.value;
    if (currentEstablishmentData) {
      return of(currentEstablishmentData);
    }

    return this._http.get<any>(`${this._baseUrl}/establishment-data`).pipe(
      map((response) => (response ? new EstablishmentData(response) : null)),
      catchError(() => of(null))
    );
  }

  saveEstablishmentData(
    establishmentData: EstablishmentData
  ): Observable<EstablishmentData> {
    this._establishmentDataSubject.next(establishmentData);

    return this._http
      .post<any>(
        `${this._baseUrl}/establishment-data`,
        establishmentData.toJSON()
      )
      .pipe(
        map((response) => new EstablishmentData(response)),
        catchError((error) => {
          console.error('Error saving establishment data:', error);
          return throwError(() => new Error('Error saving establishment data'));
        })
      );
  }

  updateEstablishmentData(
    updates: Partial<EstablishmentData>
  ): Observable<EstablishmentData> {
    const currentEstablishmentData = this._establishmentDataSubject.value;
    if (!currentEstablishmentData) {
      return throwError(() => new Error('No establishment data to update'));
    }

    const updatedEstablishmentData = currentEstablishmentData.update(updates);
    this._establishmentDataSubject.next(updatedEstablishmentData);

    return this._http
      .put<any>(
        `${this._baseUrl}/establishment-data`,
        updatedEstablishmentData.toJSON()
      )
      .pipe(
        map((response) => new EstablishmentData(response)),
        catchError((error) => {
          console.error('Error updating establishment data:', error);
          return throwError(
            () => new Error('Error updating establishment data')
          );
        })
      );
  }

  validateEstablishmentCode(code: string): Observable<boolean> {
    return this._http
      .get<boolean>(`${this._baseUrl}/validate-establishment/${code}`)
      .pipe(
        catchError(() => of(true)) // Assume valid if API fails
      );
  }

  // Progress Management
  getProgress(): Observable<{
    completedSteps: number;
    totalSteps: number;
    percentage: number;
    currentStepIndex: number;
  }> {
    return this.getWizardConfiguration().pipe(
      map((config) => ({
        completedSteps: config.completedStepsCount,
        totalSteps: config.totalStepsCount,
        percentage: config.progressPercentage,
        currentStepIndex: config.currentStepIndex,
      }))
    );
  }

  saveProgress(progress: {
    currentStepIndex: number;
    completedSteps: string[];
  }): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}/progress`, progress).pipe(
      catchError((error) => {
        console.error('Error saving progress:', error);
        return throwError(() => new Error('Error saving progress'));
      })
    );
  }

  // Validation
  validateStep(
    stepId: string,
    data: any
  ): Observable<{
    isValid: boolean;
    errors: string[];
  }> {
    return this._http
      .post<{
        isValid: boolean;
        errors: string[];
      }>(`${this._baseUrl}/validate-step/${stepId}`, data)
      .pipe(catchError(() => of({ isValid: true, errors: [] })));
  }

  // Data Loading
  loadStepData(stepId: string): Observable<any> {
    return this._http
      .get<any>(`${this._baseUrl}/step-data/${stepId}`)
      .pipe(catchError(() => of(null)));
  }

  loadReferenceData(): Observable<{
    cantones: any[];
    actividadesEconomica: any[];
    agentesRetencion: any[];
    contribuyentes: any[];
    ambientes: any[];
  }> {
    return this._http.get<any>(`${this._baseUrl}/reference-data`).pipe(
      catchError(() =>
        of({
          cantones: [],
          actividadesEconomica: [],
          agentesRetencion: [],
          contribuyentes: [],
          ambientes: [],
        })
      )
    );
  }

  // Private helper methods
  private createDefaultConfiguration(): Observable<WizardConfiguration> {
    const defaultSteps: WizardStep[] = [
      new WizardStep({
        id: 'welcome',
        code: 'I',
        name: 'Bienvenida',
        description: 'Paso de bienvenida al asistente de configuración',
        order: 1,
        isRequired: false,
        isCompleted: false,
        isEnabled: true,
        validationRules: [],
        dependencies: [],
        metadata: {},
      }),
      new WizardStep({
        id: 'user',
        code: 'II',
        name: 'Usuario',
        description: 'Configuración de datos del usuario',
        order: 2,
        isRequired: true,
        isCompleted: false,
        isEnabled: true,
        validationRules: [],
        dependencies: [],
        metadata: {},
      }),
      new WizardStep({
        id: 'establishment',
        code: 'III',
        name: 'Establecimiento',
        description: 'Configuración del establecimiento',
        order: 3,
        isRequired: true,
        isCompleted: false,
        isEnabled: true,
        validationRules: [],
        dependencies: ['user'],
        metadata: {},
      }),
      new WizardStep({
        id: 'contribuyente',
        code: 'IV',
        name: 'Contribuyente',
        description: 'Configuración de tipo de contribuyente',
        order: 4,
        isRequired: true,
        isCompleted: false,
        isEnabled: true,
        validationRules: [],
        dependencies: ['establishment'],
        metadata: {},
      }),
      new WizardStep({
        id: 'documents',
        code: 'V',
        name: 'Documentos',
        description: 'Configuración de documentos electrónicos',
        order: 5,
        isRequired: true,
        isCompleted: false,
        isEnabled: true,
        validationRules: [],
        dependencies: ['contribuyente'],
        metadata: {},
      }),
      new WizardStep({
        id: 'certificate',
        code: 'VI',
        name: 'Certificado',
        description: 'Configuración de firma electrónica',
        order: 6,
        isRequired: true,
        isCompleted: false,
        isEnabled: true,
        validationRules: [],
        dependencies: ['documents'],
        metadata: {},
      }),
    ];

    const defaultConfig = new WizardConfiguration({
      id: 'default-wizard-config',
      steps: defaultSteps,
      currentStepIndex: 0,
      isLinear: true,
      allowSkip: false,
      autoSave: true,
      metadata: {},
    });

    this._wizardConfigSubject.next(defaultConfig);
    return of(defaultConfig);
  }

  private mapToWizardConfiguration(data: any): WizardConfiguration {
    const steps =
      data.steps?.map((stepData: any) => new WizardStep(stepData)) || [];

    return new WizardConfiguration({
      id: data.id || 'wizard-config',
      steps,
      currentStepIndex: data.currentStepIndex || 0,
      isLinear: data.isLinear ?? true,
      allowSkip: data.allowSkip ?? false,
      autoSave: data.autoSave ?? true,
      metadata: data.metadata || {},
    });
  }
}
