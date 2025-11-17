import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {PromotionAddEdit} from "@restaurant/ui/promotions/promotion-add-edit/promotion-add-edit";
import {PromotionList} from "@restaurant/ui/promotions/promotion-list/promotion-list";
@Component({
  selector: 'app-promotions',
  imports: [
    BreadcrumbComponent,
    MatIcon,
    ReactiveFormsModule,
    MatTabsModule,
    PromotionAddEdit,
    PromotionList
  ],
  templateUrl: './promotions.html',
  styleUrl: './promotions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Promotions {
}
