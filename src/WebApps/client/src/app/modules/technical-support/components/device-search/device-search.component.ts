import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { DeviceSearch } from '@modules/technical-support/models/device.model';
import { DeviceModalComponent } from '@modules/technical-support/pages/device-page/device-modal/device-modal.component';
import { DeviceService } from '@modules/technical-support/services/device.service';
import {
  Observable,
  OperatorFunction,
  catchError,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-device-search',
    imports: [
        FontAwesomeModule,
        FormsModule,
        NgbTypeaheadModule
    ],
    templateUrl: './device-search.component.html',
    styles: ``
})
export class DeviceSearchComponent {
  @Input() clearInput: boolean = false;
  @Input() textSearch = '';
  @Output() deviceSelected = new EventEmitter<{ data: any }>();
  @Output() resultEmptyInput = new EventEmitter();
  private modalService = inject(ModalService);
  private deviceService = inject(DeviceService);

  device: DeviceSearch = {
    model: '',
    name: '',
    serie: '',
    color: '',
    id: 0,
  };
  searching: boolean = false;
  searchFailed: boolean = false;

  onDeviceSelect($event: any) {
    this.device = $event.item;
    this.setDeviceData(this.device);
    $event.preventDefault();
  }
  onKeyupSearch() {
    if (!this.textSearch) {
      this.resultEmptyInput.emit();
    }
  }
  openModal() {
    const modalRef = this.modalService.openModalCustom(DeviceModalComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.data = this.device;
    modalRef.result.then((response) => {
      this.setDeviceData(response);
    });
  }
  search: OperatorFunction<string, Array<DeviceSearch>> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this.deviceService.search({ textSearch: term }).pipe(
          tap(() => (this.searchFailed = false)),
          catchError((error) => {
            console.log(error);
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => (this.searching = false))
    );
  setDeviceData(item: any) {
    this.deviceSelected.emit({
      data: {
        ...item,
        deviceName: item.name,
        model: item.model,
      },
    });
    setTimeout(() => {
      if (!this.clearInput) {
        this.textSearch = this.device.name;
      } else {
        this.textSearch = '';
      }
    });
  }
}
