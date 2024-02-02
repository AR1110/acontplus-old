import { Component, EventEmitter, Output, inject } from '@angular/core';
import { DeviceSearch } from '@modules/technical-support/models/device.model';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  OperatorFunction,
  catchError,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-device-search-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './device-search-modal.component.html',
  styles: ``,
})
export class DeviceSearchModalComponent {
  @Output() onDeviceSelect = new EventEmitter<{ data: any }>();
  @Output() resultEmptyInput = new EventEmitter();
  private deviceService = inject(DeviceService);
  private modalRef = inject(NgbActiveModal);
  device: DeviceSearch = {
    model: '',
    name: '',
    serie: '',
    color: '',
  };
  textSearch: string = '';
  searching: boolean = false;
  searchFailed: boolean = false;

  closeModal() {
    this.modalRef.close();
  }

  onKeyupSearch() {
    if (!this.textSearch) {
      this.resultEmptyInput.emit();
    }
  }

  openModal() {}

  onSelect($event: any) {
    this.device = $event.item;
    this.onDeviceSelect.emit({
      data: {
        ...this.device,
        deviceName: this.device.name,
        model: this.device.model,
      },
    });
    setTimeout(() => {
      this.textSearch = this.device.name;
    });
  }

  search: OperatorFunction<string, Array<DeviceSearch>> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        if (!term || term.length < 3) {
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
}
