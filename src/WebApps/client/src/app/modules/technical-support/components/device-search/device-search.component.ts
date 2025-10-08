import { Component, inject, model, output, signal, OnInit } from '@angular/core';
import { DeviceSearch } from '@modules/technical-support/models/device.model';
import { DeviceModalComponent } from '@modules/technical-support/pages/device-page/device-modal/device-modal.component';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { Observable, switchMap } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@core/services/dialog.service';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { finalize } from 'rxjs/operators';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-device-search',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    ThemeButtonComponent,
  ],
  templateUrl: './device-search.component.html',
  styles: ``,
})
export class DeviceSearchComponent implements OnInit {
  textSearch = model('');
  deviceSelected = output<{ data: any }>();
  clearSearch = output();
  private modalService = inject(DialogService);
  private deviceService = inject(DeviceService);

  control = new FormControl('');
  filteredItems!: Observable<any[]>;

  device: DeviceSearch = {
    model: '',
    name: '',
    serie: '',
    color: '',
    id: 0,
  };
  searching = false;
  searchFailed = false;
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.filteredItems = this.control.valueChanges.pipe(
      switchMap(val => {
        if (val && val.length > 2) {
          return this._filter(val);
          // return this.products as any[]
        }
        this.clearSearch.emit();
        return [];
      }),
    );
  }

  private _filter(value: string) {
    return this.deviceService
      .search({ textSearch: value })
      .pipe(finalize(() => this.isLoading.set(false)));
  }

  onDeviceSelect($event: any) {
    this.device = $event.item;
    this.setDeviceData(this.device);
    $event.preventDefault();
  }

  openModal() {
    const modalRef = this.modalService.open(DeviceModalComponent, {
      size: 'xl',
      data: structuredClone(this.device),
    });

    modalRef.subscribe(response => {
      this.setDeviceData(response);
    });
  }

  setDeviceData(item: any) {
    this.deviceSelected.emit({
      data: {
        ...item,
        deviceName: item.name,
        model: item.model,
      },
    });
    setTimeout(() => {
      if (!this.clearSearch) {
        this.textSearch.set(this.device.name);
      } else {
        this.textSearch.set('');
      }
    });
  }
}
