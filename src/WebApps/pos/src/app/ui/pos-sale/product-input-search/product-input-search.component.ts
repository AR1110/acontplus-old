import { SUB_CATEGORY_CODE } from '@/domain/enums/main.enum';
import { MainStoreService } from '@/domain/services/main-store.service';
import { ConfigUseCase } from '@/domain/use-cases/config.use-case';
import { isValidField } from '@/domain/utils/utils';
import { PosStoreService } from '@/ui/store/pos-store.service';
import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-input-search',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-input-search.component.html',
  styleUrl: './product-input-search.component.scss',
})
export class ProductInputSearchComponent {
  private posStoreSvc = inject(PosStoreService);
  private mainStore = inject(MainStoreService);
  private _configUseCase = inject(ConfigUseCase);

  dataItemSearch = input({
    idSubFamilia: 0,
    textSearch: null,
  });

  private hasReloadedForNullSearch = false;

  loading = computed(() => {
    return (
      this.posStoreSvc.state().isLoading ||
      this.posStoreSvc.state().isSelectedItem
    );
  });

  refresh() {
    if (this.loading()) return;
  }

  onEnterInputSearch($event: any) {
    // this.dataItemSearch.update(e => {
    //   return {
    //     ...e,
    //     textSearch: $event.target.value
    //   };
    // });

    let textSearch = isValidField(this.dataItemSearch().textSearch);

    // Si textSearch es válido
    if (textSearch) {
      this.refresh();
      this.hasReloadedForNullSearch = false;
    } else if (!textSearch && !this.hasReloadedForNullSearch) {
      this.refresh(); // Recarga la búsqueda
      this.hasReloadedForNullSearch = true; // Marca como recargado para evitar recargas adicionales
    }
  }

  onBlurTextSearch($event: any) {}
}
