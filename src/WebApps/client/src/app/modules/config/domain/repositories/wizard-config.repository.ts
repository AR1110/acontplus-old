import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { WizardConfiguration } from '../models/wizard-config/wizard-configuration.model';
import { WizardStep } from '../models/wizard-config/wizard-step.model';
import { UserData } from '../models/wizard-config/value-objects/user-data.vo';
import { EstablishmentData } from '../models/wizard-config/value-objects/establishment-data.vo';

export interface WizardConfigRepository {
  // Wizard Configuration Management
  getWizardConfiguration(): Observable<WizardConfiguration>;
  saveWizardConfiguration(config: WizardConfiguration): Observable<WizardConfiguration>;
  resetWizardConfiguration(): Observable<void>;

  // Step Management
  getSteps(): Observable<WizardStep[]>;
  updateStep(stepId: string, updates: Partial<WizardStep>): Observable<WizardStep>;
  completeStep(stepId: string): Observable<WizardStep>;
  resetStep(stepId: string): Observable<WizardStep>;

  // User Data Management
  getUserData(): Observable<UserData | null>;
  saveUserData(userData: UserData): Observable<UserData>;
  updateUserData(updates: Partial<UserData>): Observable<UserData>;

  // Establishment Data Management
  getEstablishmentData(): Observable<EstablishmentData | null>;
  saveEstablishmentData(establishmentData: EstablishmentData): Observable<EstablishmentData>;
  updateEstablishmentData(updates: Partial<EstablishmentData>): Observable<EstablishmentData>;
  validateEstablishmentCode(code: string): Observable<boolean>;

  // Progress Management
  getProgress(): Observable<{
    completedSteps: number;
    totalSteps: number;
    percentage: number;
    currentStepIndex: number;
  }>;

  saveProgress(progress: {
    currentStepIndex: number;
    completedSteps: string[];
  }): Observable<void>;

  // Validation
  validateStep(stepId: string, data: any): Observable<{
    isValid: boolean;
    errors: string[];
  }>;

  // Data Loading
  loadStepData(stepId: string): Observable<any>;
  loadReferenceData(): Observable<{
    cantones: any[];
    actividadesEconomica: any[];
    agentesRetencion: any[];
    contribuyentes: any[];
    ambientes: any[];
  }>;
}

// Injection token for the repository
export const WIZARD_CONFIG_REPOSITORY = new InjectionToken<WizardConfigRepository>('WizardConfigRepository');
