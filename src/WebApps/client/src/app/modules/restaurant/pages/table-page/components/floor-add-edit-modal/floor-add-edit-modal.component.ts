import { Component, Input, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToasterService } from "@core/services/toaster.service";
import { hideLoader, showLoader } from "@core/utils/loader";
import { isValidField } from "@core/utils/utils";
import { FloorService } from "@modules/restaurant/services/floor.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-table-add-edit',
  templateUrl: './floor-add-edit-modal.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule]
})
export class FloorAddEditModalComponent {
  @Input() params = {
    id: 0,
    capacity: 1,
    description: '',
    codEstab: ''
  }
  activeModal = inject(NgbActiveModal);
  tS = inject(ToasterService);
  floorSvc = inject(FloorService)

  dataForm = new FormGroup({
    id: new FormControl(0, Validators.required),
    codEstab: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    capacity: new FormControl(1, Validators.required),
  });
  ngOnInit() {
    if (this.params.id > 0) {
      this.dataForm.patchValue(this.params)
    } else {
      this.dataForm.controls["codEstab"].setValue(this.params.codEstab)
    }

  }

  setCode() {
    let description = this.dataForm.value.description;
    console.log(888)
    if (isValidField(description) && description) {
      this.dataForm.controls["code"].setValue(description.slice(0, 3).toUpperCase())
    }
  };

  save() {
    if (this.dataForm.invalid) {
      this.tS.toastr({
        type: 'warning',
        message: 'Complete los campos correctamente'
      })
      return
    }
    const data = this.dataForm.value;

    if (this.params.id > 0) {
      showLoader();
      this.floorSvc.put(this.params.id, data).subscribe({
        next: (response: any) => {
          hideLoader()
          if (response && response?.status == 200) {
            this.tS.toastr({
              type: 'success',
              message: response.data
            })
            this.activeModal.close(response)
          } else {
            this.tS.toastr({
              type: 'warning',
              message: response.data
            })
          }
        },
        error: (err) => {
          hideLoader()
          if (err?.status === 400) {
            this.tS.toastr({
              type: 'warning',
              message: err.error
            })
          }
          if (err?.status === 200) {
            this.tS.toastr({
              type: 'success',
              message: "Registrado Correctamente"
            })
            this.activeModal.close(err)
          }
        },
      })
    }

    if (!(this.params.id > 0)) {
      showLoader();
      this.floorSvc.post(data).subscribe({
        next: (response: any) => {
          hideLoader()
          if (response && response?.status == 200) {
            this.tS.toastr({
              type: 'success',
              message: response.data
            })
            this.activeModal.close(response)
          } else {
            this.tS.toastr({
              type: 'warning',
              message: response.data
            })
          }
        },
        error: (err) => {
          hideLoader()
          if (err?.status === 400) {
            this.tS.toastr({
              type: 'warning',
              message: err.error
            })
          }
          if (err?.status === 200) {
            this.tS.toastr({
              type: 'success',
              message: "Registrado Correctamente"
            })
            this.activeModal.close(err)
          }
        },
      })
    }

  }

  closeModal() {
    this.activeModal.close()
  }
}