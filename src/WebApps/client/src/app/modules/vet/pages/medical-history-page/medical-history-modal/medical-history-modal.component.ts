import { Component, inject } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Behavior,
  BehaviorStatus,
  BehaviorTest,
  Disease,
  DiseaseStatus,
  HealthCheck,
  MedicalHistory,
} from '@modules/vet/models/medical-history.model';
import { MedicalHistoryService } from '@modules/vet/services/medical-history.service';
import { isApiResponse } from '@core/models/api-response';
import { PetSearchComponent } from '@modules/vet/components/pet-search/pet-search.component';
import { ToasterService } from '@core/services/toaster.service';
import { GroupedEstab } from '@core/models/estab.model';
import { BehaviorTestService } from '@modules/vet/services/behavior-test.service';
import { HealthCheckService } from '@modules/vet/services/health-check.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";

@Component({
  selector: 'app-medical-history-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PetSearchComponent,
    MatCard,
    MatCardContent,
    ThemeButtonComponent,
    MatCustomDialogComponent,
  ],
  templateUrl: './medical-history-modal.component.html',
  styles: ``,
})
export class MedicalHistoryModalComponent {
  behaviors: Behavior[] = [];
  behaviorsStatuses: BehaviorStatus[] = [];
  behaviorTests: BehaviorTest[] = [];
  data = inject<MedicalHistory>(MAT_DIALOG_DATA);
  diseases: Disease[] = [];
  diseasesStatuses: DiseaseStatus[] = [];
  establecimientos: Array<GroupedEstab> = [];
  healthChecks: HealthCheck[] = [];
  modalIcon = 'add';
  modalTitle: string = 'Registrar Nuevo';
  medicalHistoryForm = new FormGroup({
    id: new FormControl(0),
    establecimientoId: new FormControl(0, Validators.required),
    date: new FormControl('', Validators.required),
    petId: new FormControl(0, Validators.required),
    observations: new FormControl(''),
    age: new FormControl(0),
    weight: new FormControl(0),
  });
  petSelected: any = {};

  private readonly behaviorTestService = inject(BehaviorTestService);
  private readonly healthCheckService = inject(HealthCheckService);
  private readonly medicalHistoryService = inject(MedicalHistoryService);
  private readonly modalRef = inject(MatDialogRef<MedicalHistoryModalComponent>);
  private readonly tS = inject(ToasterService);

  addBehavior(behaviorId: number, behaviorStatusId: number) {
    this.behaviorTests.push({
      id: 0,
      medicalHistoryId: this.data.id > 0 ? this.data.id : 0,
      behaviorId,
      behaviorStatusId,
    });
  }

  addBehaviorStatus(
    behaviorId: number,
    behaviorStatusId: number,
    dbUp: boolean,
  ) {
    if (this.behaviorTests.some((test) => test.behaviorId === behaviorId)) {
      const behaviorTest = this.behaviorTests.find(
        (check: BehaviorTest) => check.behaviorId === behaviorId,
      );
      if (behaviorTest) {
        behaviorTest.behaviorStatusId = behaviorStatusId;
      } else {
        console.error(`HealthCheck with diseaseId ${behaviorId} not found.`);
      }
      if (this.data.id > 0 && dbUp) {
        this.updateBehaviorTest(behaviorId, behaviorStatusId);
      }
    } else {
      this.addBehavior(behaviorId, behaviorStatusId);
    }
  }

  addDisease(diseaseId: number, diseaseStatusId: number) {
    this.healthChecks.push({
      id: 0,
      medicalHistoryId: this.data.id > 0 ? this.data.id : 0,
      diseaseId,
      diseaseStatusId,
    });
    console.log(this.healthChecks);
  }

  addDiseaseStatus(diseaseId: number, diseaseStatusId: number, dbUp: boolean) {
    if (
      this.healthChecks.some(
        (check: HealthCheck) => check.diseaseId === diseaseId,
      )
    ) {
      const healthCheck = this.healthChecks.find(
        (check: HealthCheck) => check.diseaseId === diseaseId,
      );
      if (healthCheck) {
        healthCheck.diseaseStatusId = diseaseStatusId;
      } else {
        console.error(`HealthCheck with diseaseId ${diseaseId} not found.`);
      }
      if (this.data.id > 0 && dbUp) {
        this.updateHealthCheck(diseaseId, diseaseStatusId);
      }
    } else {
      this.addDisease(diseaseId, diseaseStatusId);
    }
  }

  getById() {
    this.medicalHistoryService.getById(this.data.id).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { medicalHistory, healthChecks, behaviors } = JSON.parse(
          response.payload as string,
        );
        let objData = medicalHistory[0];
        this.petSelected.customer = objData.businessName;
        this.petSelected.customerIdCard = objData.idCard;
        this.petSelected.id = objData.petId;
        this.petSelected.name = objData.name;
        this.petSelected.email = objData.email;
        this.petSelected.petType = objData.pettype;
        this.petSelected.age = objData.age;
        this.petSelected.color = objData.color;
        this.petSelected.breed = objData.breed;
        this.petSelected.gender = objData.gender;
        this.medicalHistoryForm.patchValue(this.data);
        this.medicalHistoryForm.patchValue({ date: objData.date });

        this.healthChecks = healthChecks;
        healthChecks.forEach((value: any) => {
          this.addDiseaseStatus(value.diseaseId, value.diseaseStatusId, false);
          setTimeout(() => {
            const elementId = `${value.diseaseId}-${value.diseaseStatusId}-chkdds`;
            const checkbox = document.getElementById(
              elementId,
            ) as HTMLInputElement;
            if (checkbox) {
              checkbox.checked = true;
            } else {
              console.warn(`Checkbox with ID "${elementId}" not found.`);
            }
          }, 1000);
        });

        this.behaviorTests = behaviors;
        behaviors.forEach((value: any) => {
          this.addBehaviorStatus(
            value.behaviorId,
            value.behaviorStatusId,
            false,
          );
          setTimeout(() => {
            const elementId = `${value.behaviorId}-${value.behaviorStatusId}-chkbbs`;

            const checkbox = document.getElementById(
              elementId,
            ) as HTMLInputElement;
            if (checkbox) {
              checkbox.checked = true;
            } else {
              console.warn(`Checkbox with ID "${elementId}" not found.`);
            }
          }, 1000);
        });
      }
    });
  }

  initialLoad() {
    this.medicalHistoryService.get({ tipo: 2 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const {
          behaviors,
          behaviorsStatuses,
          diseases,
          diseasesStatuses,
          estabs,
        } = JSON.parse(response.payload as string);
        this.behaviors = behaviors;
        this.behaviorsStatuses = behaviorsStatuses;
        this.diseases = diseases;
        this.diseasesStatuses = diseasesStatuses;
        this.establecimientos = estabs;
        const dataEstab = this.establecimientos.find(
          (estab) => estab.defaultEstab,
        );

        if (dataEstab) {
          this.medicalHistoryForm.patchValue({
            establecimientoId: dataEstab.idEstablecimiento,
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.initialLoad();
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Registro Clinico';
      this.getById();
    }
  }

  onClose() {
    this.modalRef.close();
  }

  onPetSelected($event: any) {
    this.petSelected = { ...$event };
    this.medicalHistoryForm.patchValue({ petId: this.petSelected.id });
  }

  onSave() {
    if (this.behaviorTests.length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Debe seleccionar el rango de comportamientos',
      });
    }
    if (this.healthChecks.length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Debe seleccionar el rango de estados de salud',
      });
    }
    const dataToSave = {
      ...this.medicalHistoryForm.value,
      behaviorTests: this.behaviorTests,
      healthChecks: this.healthChecks,
    };
    if (!(this.data.id > 0)) {
      this.medicalHistoryService.post(dataToSave).subscribe((response) => {
        if (isApiResponse(response)) {
          this.tS.toastr({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code == '1') {
            this.modalRef.close(response);
          }
        }
      });
    } else {
      this.medicalHistoryService
        .put(this.data.id, dataToSave)
        .subscribe((response) => {
          if (isApiResponse(response)) {
            this.tS.toastr({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.modalRef.close(response);
            }
          }
        });
    }
  }

  updateBehaviorTest(behaviorId: number, behaviorStatusId: number) {
    const behaviorTest = this.behaviorTests.find(
      (check: BehaviorTest) => check.behaviorId === behaviorId,
    );
    if (behaviorTest) {
      behaviorTest.behaviorStatusId = behaviorStatusId;
    } else {
      console.error(`HealthCheck with diseaseId ${behaviorId} not found.`);
      return;
    }
    const dataToSave = {
      id: behaviorTest?.id,
      medicalHistoryId: this.medicalHistoryForm.get('id')?.value,
      behaviorId,
      behaviorStatusId,
    };
    this.behaviorTestService
      .put(behaviorTest.id, dataToSave)
      .subscribe((response) => {
        if (isApiResponse(response)) {
          this.tS.toastr({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
        }
      });
  }

  updateHealthCheck(diseaseId: number, diseaseStatusId: number) {
    const healthCheck = this.healthChecks.find(
      (check: HealthCheck) => check.diseaseId === diseaseId,
    );
    if (healthCheck) {
      healthCheck.diseaseStatusId = diseaseStatusId;
    } else {
      console.error(`HealthCheck with diseaseId ${diseaseId} not found.`);
      return;
    }
    const dataToSave = {
      id: healthCheck?.id,
      medicalHistoryId: this.medicalHistoryForm.get('id')?.value,
      diseaseId,
      diseaseStatusId,
    };
    this.healthCheckService
      .put(healthCheck.id, dataToSave)
      .subscribe((response) => {
        if (isApiResponse(response)) {
          this.tS.toastr({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
        }
      });
  }
}
