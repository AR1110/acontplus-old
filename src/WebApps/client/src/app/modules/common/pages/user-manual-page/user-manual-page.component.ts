import { Component, inject } from '@angular/core';
import { UserManualService } from '@modules/common/services/user-manual.service';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-user-manual-page',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './user-manual-page.component.html',
  styles: ``,
})
export class UserManualPageComponent {
  manuals: any[] = [];
  private readonly _userManualService = inject(UserManualService);

  ngOnInit() {
    this._userManualService.get().subscribe((response) => {
      // const { manuals } = JSON.parse(response.payload as string);
      this.manuals = response.payload as [];
      console.log(response);
    });
  }
}
