import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import { MatInputModule} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatFormField} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatChip} from "@angular/material/chips";
import {PromotionListUseCase} from "@restaurant/application/use-cases/promotion-use-case";
import {PaginationParams} from "@acontplus/core";
import {ValidatorUtils} from "@core/utils/utils";
import {Pagination} from "@acontplus/ng-components";

@Component({
  selector: 'app-promotion-list',
  imports: [
    MatIcon,
    MatFormField,
    MatInputModule,
    MatButton,
    MatCard,
    MatChip
  ],
  templateUrl: './promotion-list.html',
  styleUrl: './promotion-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionList {
  #listUseCase = inject(PromotionListUseCase);
// Signals
  searchTerm = signal<string>('');
  filterActive = signal<'all' | 'active' | 'inactive'>('all');

  // Computed signals
  promotions = [{}] as any;
  isLoading = false;

  filteredPromotions = computed<any>(() => {
   return [{id: 1, value: 2, selectedProducts: [], createdBy: '', schedule:[]}]
  });

  promotionCount = computed(() => this.filteredPromotions().length);
  pagination = signal(new Pagination());
  private list(){
    const params = new PaginationParams({
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      searchTerm: ValidatorUtils.isValidField(this.searchTerm()) ?? undefined ,

    });
    this.#listUseCase.execute(params).subscribe(response => {

    })
  }
  ngOnInit() {
    this.list();
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  setFilter(filter: 'all' | 'active' | 'inactive'): void {
    this.filterActive.set(filter);
  }

  async deletePromotion(id: string, name: string): Promise<void> {
    // Confirmar eliminación
    const confirmed = confirm(`¿Estás seguro de eliminar la promoción "${name}"? Esta acción es irreversible.`);

    if (!confirmed) return;

    try {

    } catch (error: any) {

    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getActiveSchedule(promotion: any): string {
    const activeDays = promotion.schedule
      .filter((d:any) => d.isActive)
      .map((d:any) => `${d.day} (${d.startTime} - ${d.endTime})`)
      .join(' | ');

    return activeDays || 'Ningún día configurado';
  }
}
