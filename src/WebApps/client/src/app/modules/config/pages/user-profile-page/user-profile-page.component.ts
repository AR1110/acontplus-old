import { Component, inject } from '@angular/core';
import { PurchaseModule } from "../../../purchase/purchase.module";
import { UserProfileService } from '@modules/config/services/user-profile.service';
import { ModalService } from '@core/services/modal.service';
import { hideLoader, showLoader } from '@core/utils/loader';

@Component({
    selector: 'app-user-profile-page',
    standalone: true,
    templateUrl: './user-profile-page.component.html',
    styles: ``,
    imports: [
        PurchaseModule,
    ]
})
export class UserProfilePageComponent {
    private readonly userProfileService = inject(UserProfileService);
    private readonly modalSvc = inject(ModalService)

    user: any = {}
    roles: any = []

    ngOnInit() {
        this.getAll()
    }

    getAll() {
        showLoader();
        this.userProfileService.getAll({ tipo: 1 }).subscribe({
            next: (response: any) => {
                hideLoader();
                const { user, roles } = JSON.parse(response.payload);
                this.user = user[0];
                this.roles = roles;

                console.log(this.user)
                console.log(this.roles)
            },
            error(err) {
                console.log(err)
            },
            complete() {
                hideLoader();
            },
        })
    }
}