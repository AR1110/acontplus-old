import { Component } from '@angular/core';
import { TechSupportModule } from '@modules/technical-support/tech-support.module';
import { DeviceListComponent } from './device-list/device-list.component';

@Component({
  selector: 'app-device-page',
  standalone: true,
  imports: [TechSupportModule, DeviceListComponent],
  templateUrl: './device-page.component.html',
  styles: ``
})
export class DevicePageComponent {

}
