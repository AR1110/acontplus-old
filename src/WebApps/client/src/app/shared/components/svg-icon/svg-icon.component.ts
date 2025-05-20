import {Component, input} from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  imports: [],
  templateUrl: './svg-icon.component.html',
  styles: ``
})
export class SvgIconComponent {
    id =  input('')
    width = input('40px')
   height = input( '40px')
   color = input('#414141')
}
