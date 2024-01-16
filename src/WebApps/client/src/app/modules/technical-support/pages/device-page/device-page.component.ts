import { Component } from '@angular/core';
import { TechSupportModule } from '@modules/technical-support/tech-support.module';

@Component({
  selector: 'app-device-page',
  standalone: true,
  imports: [TechSupportModule],
  templateUrl: './device-page.component.html',
  styles: ``
})
export class DevicePageComponent {
  
}
