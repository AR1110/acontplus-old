import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardConfigComponent } from './wizard-config.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenRepository } from '@modules/auth/domain/repositories/token.repository';
import { ToastrService } from 'ngx-toastr';
import { TOASTR_NOTIFICATION_CONFIG } from '@core/services/toastr-notification.service';
import { UserCustomerRepository } from '@modules/config/data/repositories/user-customer.repository';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { CompanyDemoStepService } from '@modules/config/services/wizard-config/company-demo-step.service';
import { FirmaElectronicaService } from '@modules/config/services/firma-electronica.service';
import { CreateDocConfigUseCase } from '@modules/config/application/use-cases/doc-config/create-doc-config.use-case';
import { GetDocConfigFormDataUseCase } from '@modules/config/application/use-cases/doc-config/get-doc-config-form-data.use-case';
import { ActivatedRoute } from '@angular/router';
import { jest } from '@jest/globals';
import { of } from 'rxjs';

describe('WizardConfigComponent', () => {
  let component: WizardConfigComponent;
  let fixture: ComponentFixture<WizardConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WizardConfigComponent,
        ReactiveFormsModule,
        MatStepperModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: TokenRepository, useValue: { getUserData: jest.fn().mockReturnValue(null) } },
        {
          provide: ToastrService,
          useValue: { success: jest.fn(), error: jest.fn(), warning: jest.fn(), info: jest.fn() },
        },
        { provide: TOASTR_NOTIFICATION_CONFIG, useValue: {} },
        { provide: UserCustomerRepository, useValue: {} },
        {
          provide: EstablishmentService,
          useValue: {
            getDataForm: jest.fn().mockReturnValue(
              of({
                cantones: [],
                actividadesEconomica: [],
                agentesRetencion: [],
                contribuyentes: [],
              }),
            ),
            post: jest.fn().mockReturnValue(of({ code: '1', message: 'ok' })),
          },
        },
        {
          provide: CompanyDemoStepService,
          useValue: {
            get: jest.fn().mockReturnValue(of({ code: '1', payload: '{"companyDemoSteps":[]}' })),
            post: jest.fn().mockReturnValue(of({ code: '1', message: 'ok' })),
          },
        },
        {
          provide: FirmaElectronicaService,
          useValue: { post: jest.fn().mockReturnValue(of({ code: '1', message: 'ok' })) },
        },
        {
          provide: CreateDocConfigUseCase,
          useValue: { execute: jest.fn().mockReturnValue(of({ code: '1', message: 'ok' })) },
        },
        {
          provide: GetDocConfigFormDataUseCase,
          useValue: {
            execute: jest.fn().mockReturnValue(
              of({
                establecimientos: [{ nombreComercial: '', puntosEmision: [] }],
                tiposDoc: [],
              }),
            ),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: {} }, parent: { snapshot: { data: {} } } },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
