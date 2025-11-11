import { ChangeDetectionStrategy, Component } from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-promotions',
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './promotions.html',
  styleUrl: './promotions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Promotions {

}
