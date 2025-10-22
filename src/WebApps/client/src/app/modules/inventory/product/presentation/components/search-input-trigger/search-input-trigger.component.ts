import { Component } from '@angular/core';
import { SearchDialogService } from '../search-dialog';
import {MatIcon} from "@angular/material/icon";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AddEditProductDirective} from "@inventory/product/presentation/directives/add-edit-product.directive";

@Component({
  selector: 'app-search-input-trigger',
  templateUrl: './search-input-trigger.component.html',
  styleUrls: ['./search-input-trigger.component.scss'],
  imports: [MatIcon, MatFormFieldModule, MatInputModule, MatIconButton, AddEditProductDirective]
})
export class SearchInputTrigger {
  constructor(private searchService: SearchDialogService) {}

  openSearch() {
    this.searchService.open();
  }
}
