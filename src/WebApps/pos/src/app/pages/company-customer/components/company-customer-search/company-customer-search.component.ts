import {Component, inject, input, model, output, signal} from '@angular/core';
import {debounceTime, distinctUntilChanged, Observable} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {catchError, map, startWith, switchMap, tap} from "rxjs/operators";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AsyncPipe} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {CompanyCustomerSearch} from "@/models/company-customer.model";
import {CompanyCustomerService} from "@/services/company-customer.service";
import {isValidField} from "@core/utils/utils";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActionCompanyCustomerAddEditModalDirective } from '@/directives/action-company-customer-add-edit.directive';

import { OverlayModule } from '@angular/cdk/overlay';
import { MatCardModule } from '@angular/material/card';

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-company-customer-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    AsyncPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    OverlayModule,
    MatCardModule,
    ActionCompanyCustomerAddEditModalDirective,

  ],
  templateUrl: './company-customer-search.component.html',
  styleUrl: './company-customer-search.component.scss'
})
export class CompanyCustomerSearchComponent {
  isSimple = input(false);
  isAdvanced = input(false)
  id =input(0);
  textName = model<string | null | undefined>('')
  isApplyGetId = input(false)
  onSelect = output<any>()
  clearInput = output()
  private companyCustomerSvc = inject(CompanyCustomerService)
  control = new FormControl('');
  filteredCustomers!: Observable<any[]>;

  companyCustomers: CompanyCustomerSearch[] = [];

  isLoadingResults=false;

  isOpenDetail = signal(false)

  dataDetail = {} as any

  ngOnInit() {

    this.filteredCustomers = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((val) => {
        this.isLoadingResults=false;
        if (val && val.length > 2) {
        this.isLoadingResults=true;
          return this._filter(val);
        }
        if(!isValidField(val)){
          this.clearInput.emit()

        }
        return [];
      }),

    );
  }

  private _filter(value: string) {
    return this.companyCustomerSvc.search({ textSearch: value }).pipe(
      map((response) => {

        this.isLoadingResults=false;
        return response;
      }),
      catchError(() => {
        this.isLoadingResults=false;
        return []
      })
    );
  }

  onSelectionChange(item: CompanyCustomerSearch) {
    if(this.isApplyGetId()){
      this.companyCustomerSvc.getId(item.idCliente).subscribe(response=>{
        this.onSelect.emit(response);
      })
    }else{
      this.onSelect.emit(item);
    }
  }

  onClickOpenDetail($event:any){
    $event.stopPropagation();
    this.isOpenDetail.set(!this.isOpenDetail())

    if (this.isOpenDetail()){
      this.companyCustomerSvc.getId(this.id()).subscribe(response=>{
        this.dataDetail = response;
        console.log(response)
      })

    }else{
      this.dataDetail = {}
    }
  }

}
