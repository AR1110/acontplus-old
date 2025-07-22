import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { WizardConfigRepository, WIZARD_CONFIG_REPOSITORY } from '@modules/config/domain/repositories/wizard-config.repository';
import { WizardConfiguration } from '@modules/config/domain/models/wizard-config/wizard-configuration.model';
import { WizardStep } from '@modules/config/domain/models/wizard-config/wizard-step.model';

export interface GetWizardConfigurationRequest {
  readonly forceRefresh?: boolean;
}

export interface GetWizardConfigurationResponse {
  readonly configuration: WizardConfiguration;
  readonly isLoaded: boolean;
  readonly error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetWizardConfigurationUseCase {
  private readonly _repository = inject(WIZARD_CONFIG_REPOSITORY);

  execute(request: GetWizardConfigurationRequest = {}): Observable<GetWizardConfigurationResponse> {
    return this._repository.getWizardConfiguration().pipe(
      map(configuration => ({
        configuration,
        isLoaded: true
      })),
      catchError(error => {
        console.error('Error loading wizard configuration:', error);
        return of({
          configuration: WizardConfiguration.createDefault(),
          isLoaded: false,
          error: error.message || 'Error loading configuration'
        });
      })
    );
  }

  private createDefaultConfiguration(): WizardConfiguration {
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
        metadata: {}
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
        validationRules: [
          {
            field: 'firstName',
            type: 'required',
            message: 'Nombres son requeridos'
          },
          {
            field: 'lastName',
            type: 'required',
            message: 'Apellidos son requeridos'
          }
        ],
        dependencies: [],
        metadata: {}
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
        validationRules: [
          {
            field: 'canton',
            type: 'required',
            message: 'Cantón es requerido'
          },
          {
            field: 'estab',
            type: 'required',
            message: 'Establecimiento es requerido'
          }
        ],
        dependencies: ['user'],
        metadata: {}
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
        validationRules: [
          {
            field: 'actividad',
            type: 'required',
            message: 'Actividad económica es requerida'
          },
          {
            field: 'contribuyente',
            type: 'required',
            message: 'Tipo de contribuyente es requerido'
          }
        ],
        dependencies: ['establishment'],
        metadata: {}
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
        metadata: {}
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
        validationRules: [
          {
            field: 'contrasenia',
            type: 'required',
            message: 'Contraseña del certificado es requerida'
          }
        ],
        dependencies: ['documents'],
        metadata: {}
      })
    ];

    return new WizardConfiguration({
      id: 'default-wizard-config',
      steps: defaultSteps,
      currentStepIndex: 0,
      isLinear: true,
      allowSkip: false,
      autoSave: true,
      metadata: {}
    });
  }
}
