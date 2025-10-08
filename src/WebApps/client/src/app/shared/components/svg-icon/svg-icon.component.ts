import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  imports: [],
  templateUrl: './svg-icon.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent {
  id = input('');
  width = input('40px');
  height = input('40px');
  color = input('#414141');
}
