export interface ConfigurationStep {
  id: number;
  code: string;
  name: string;
  description: string;
  mandatory: boolean;
  isCompleted: boolean;
  isCurrent?: boolean;
  route: string;
  icon: string;
  estimatedTime?: string;
}

export interface SetupStatus {
  isCompleted: boolean;
  nextIncompleteStep?: number;
  completionPercentage: number;
  mandatoryStepsCompleted: number;
  totalMandatorySteps: number;
  canSkip: boolean;
}

export interface TourStep {
  element: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
}

// constants/setup-steps.constant.ts
export const SETUP_STEPS: ConfigurationStep[] = [
  {
    id: 1,
    code: 'I',
    name: 'Primer Paso',
    description: 'Registrar Empresa',
    mandatory: true,
    isCompleted: true, // Always completed
    route: '/config/company-page-registration',
    icon: 'fas fa-building',
    estimatedTime: 'Completado ✓',
  },
  {
    id: 2,
    code: 'II',
    name: 'Segundo Paso',
    description: 'Actualizar Usuario',
    mandatory: true,
    isCompleted: false,
    route: '/config/user-profile-page',
    icon: 'fas fa-user-edit',
    estimatedTime: '3-5 min',
  },
  {
    id: 3,
    code: 'III',
    name: 'Tercer Paso',
    description: 'Registrar Establecimiento',
    mandatory: true,
    isCompleted: false,
    route: '/config/establishment',
    icon: 'fas fa-store',
    estimatedTime: '5-7 min',
  },
  {
    id: 4,
    code: 'IV',
    name: 'Cuarto Paso',
    description: 'Registrar Secuencial de Documentos',
    mandatory: true,
    isCompleted: false,
    route: '/config/doc-config-page',
    icon: 'fas fa-file-contract',
    estimatedTime: '4-6 min',
  },
  {
    id: 5,
    code: 'V',
    name: 'Quinto Paso',
    description: 'Subir Firma Electrónica',
    mandatory: false,
    isCompleted: false,
    route: '/config/electronic-signature-page',
    icon: 'fas fa-signature',
    estimatedTime: '2-3 min',
  },
];

// Tour steps for guided experience
export const TOUR_STEPS: TourStep[] = [
  {
    element: '.setup-progress',
    title: '¡Bienvenido a tu configuración inicial!',
    content: 'Te guiaremos paso a paso para configurar tu empresa. Puedes ver tu progreso aquí.',
    position: 'bottom',
  },
  {
    element: '.mandatory-steps',
    title: 'Pasos Obligatorios',
    content:
      'Estos pasos son necesarios para que puedas usar todas las funcionalidades del sistema.',
    position: 'right',
  },
  {
    element: '.optional-steps',
    title: 'Pasos Opcionales',
    content: 'Estos pasos son opcionales pero recomendados para una mejor experiencia.',
    position: 'right',
    showSkip: true,
  },
];
