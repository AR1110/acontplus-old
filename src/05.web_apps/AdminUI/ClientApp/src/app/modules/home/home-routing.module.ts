import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('@modules/administration').then(admin => admin.AdministrationModule)
    },
    {
        path: 'config',
        loadChildren: () => import('@modules/configuration').then(admin => admin.ConfigurationModule)
    },
    {
        path: '',
        component: HomePageComponent         
    },  
    {
        path: 'home',
        component: HomePageComponent         
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
