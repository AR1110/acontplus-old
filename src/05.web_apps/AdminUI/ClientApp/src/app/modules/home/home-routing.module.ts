import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
    {
        path: 'home',
        pathMatch:'full',
        component: HomePageComponent
    },
    {
        path: 'admin',
        loadChildren: () => import('@modules/admin').then(admin => admin.AdminModule)
    },
    {
        path: 'config',
        loadChildren: () => import('@app/modules/config').then(admin => admin.ConfigModule)
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
