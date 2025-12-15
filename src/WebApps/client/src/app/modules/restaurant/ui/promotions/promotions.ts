import { ChangeDetectionStrategy, Component  } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import {PromotionList} from "@restaurant/ui/promotions/promotion-list/promotion-list";
@Component({
  selector: 'app-promotions',
  imports: [
    BreadcrumbComponent,
    ReactiveFormsModule,
    MatTabsModule,
    PromotionList
  ],
  templateUrl: './promotions.html',
  styleUrl: './promotions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Promotions {}
