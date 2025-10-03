import { ChangeDetectionStrategy, Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-search',
  imports: [NgClass, MatIcon],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  public isShowInput = false;

  public showInput(): void {
    this.isShowInput = true;
  }
}
