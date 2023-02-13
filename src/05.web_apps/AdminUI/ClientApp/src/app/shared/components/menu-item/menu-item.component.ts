import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Menu } from '@app/modules/home/menu.model';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemComponent {
  @Input() menu: Menu = [];
}
